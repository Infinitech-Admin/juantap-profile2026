"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, X, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Local type, so this page does not depend on "@/types/user"
interface User {
  id: number;
  name: string;
  email: string;
  username?: string | null;
  avatar_url?: string | null;
  is_admin?: boolean | number;
  is_agent?: boolean | number;
}

interface UserProfile {
  bio: string;
  phone: string;
  website: string;
  location: string;
}

// Agent info for the selected user (from /admin/users/{id}/agent-info)
interface AgentInfo {
  is_agent: boolean;
  current_template: string | null;
  card_code: string | null;
  nfc_url: string | null;
  templates: { slug: string; name: string }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Agent management (inside the profile modal)
  const [agentUserId, setAgentUserId] = useState<number | null>(null);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [chosenSlug, setChosenSlug] = useState("");
  const [savingAgent, setSavingAgent] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      } else {
        toast.error("Error fetching users");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgentInfo = async (userId: number) => {
    setAgentUserId(userId);
    setAgentInfo(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/agent-info`,
        { headers: authHeaders() },
      );
      if (!res.ok) throw new Error("Failed to load agent info");
      const data: AgentInfo = await res.json();
      setAgentInfo(data);
      setChosenSlug(data.current_template ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserProfile = async (userId: number) => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch user profile");

      const data = await res.json();
      setSelectedUser(data);
      fetchAgentInfo(userId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      } else {
        toast.error("Error fetching user profile");
        console.error(error);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAgentInfo(null);
    setAgentUserId(null);
    setChosenSlug("");
  };

  // Change the template of an existing agent
  const saveAgentTemplate = async () => {
    if (!agentUserId || !chosenSlug) {
      toast.error("Please choose a template.");
      return;
    }
    setSavingAgent(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/agents/${agentUserId}/template`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ slug: chosenSlug }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to change template");

      toast.success(data.message || "Template changed.");
      setAgentInfo((prev) =>
        prev ? { ...prev, current_template: chosenSlug } : prev,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change template",
      );
    } finally {
      setSavingAgent(false);
    }
  };

  // Turn a registered user into an agent
  const makeAgent = async () => {
    if (!agentUserId) return;
    const ok = window.confirm(
      "Make this user an agent? They will get an NFC card link and will no longer be able to change their template.",
    );
    if (!ok) return;

    setSavingAgent(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${agentUserId}/make-agent`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ template_slug: chosenSlug || null }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to make agent");

      toast.success(data.message || "User is now an agent.");
      setAgentInfo((prev) =>
        prev
          ? {
              ...prev,
              is_agent: true,
              current_template: data.template ?? prev.current_template,
              card_code: data.card_code ?? null,
              nfc_url: data.nfc_url ?? null,
            }
          : prev,
      );
      setChosenSlug(data.template ?? chosenSlug);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === agentUserId ? ({ ...u, is_agent: true } as User) : u,
        ),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to make agent",
      );
    } finally {
      setSavingAgent(false);
    }
  };

  const copyNfc = async () => {
    if (!agentInfo?.nfc_url) return;
    try {
      await navigator.clipboard.writeText(agentInfo.nfc_url);
      toast.success("NFC link copied!");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  const getImageUrl = (avatarUrl: string | null | undefined) => {
    if (!avatarUrl) return "/defaults/avatar.png";
    // If it's already a full URL, return as-is
    if (avatarUrl.startsWith("http")) return avatarUrl;
    // Otherwise, prepend the API base URL
    return `${process.env.NEXT_PUBLIC_API_URL}/${avatarUrl}`;
  };

  // Role badge: Admin / Agent / User (Agent only shows if the list response includes is_agent)
  const roleBadge = (user: User, extraClass = "") => {
    if (user.is_admin) {
      return (
        <Badge variant="destructive" className={extraClass}>
          Admin
        </Badge>
      );
    }
    if (user.is_agent) {
      return (
        <Badge className={`bg-emerald-600 text-white ${extraClass}`}>
          Agent
        </Badge>
      );
    }
    return <Badge className={extraClass}>User</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        User Management
      </h1>

      <Card className="p-0 gap-0 sm:p-6">
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-sm font-semibold">#</th>
                      <th className="py-3 px-4 text-sm font-semibold">Name</th>
                      <th className="py-3 px-4 text-sm font-semibold">Email</th>
                      <th className="py-3 px-4 text-sm font-semibold">Role</th>
                      <th className="py-3 px-4 text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, idx) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {user.avatar_url ? (
                                <Image
                                  src={getImageUrl(user.avatar_url)}
                                  alt={user.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const fallback =
                                      target.nextElementSibling as HTMLElement;
                                    if (fallback)
                                      fallback.style.display = "flex";
                                  }}
                                />
                              ) : null}

                              {/* Fallback icon */}
                              <div className="hidden w-10 h-10 rounded-full bg-gray-100 text-gray-500 items-center justify-center">
                                <UserIcon size={20} />
                              </div>

                              <span className="text-sm font-medium truncate">
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 max-w-[200px] truncate">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">{roleBadge(user)}</td>

                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fetchUserProfile(user.id)}
                            >
                              <Eye size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 p-3">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden p-0">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          {user.avatar_url ? (
                            <Image
                              src={getImageUrl(user.avatar_url)}
                              alt={user.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}

                          <div className="hidden w-12 h-12 rounded-full bg-gray-100 text-gray-500 items-center justify-center">
                            <UserIcon size={22} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">
                                {user.name}
                              </h3>
                              {roleBadge(user, "flex-shrink-0")}
                            </div>
                            <p className="text-xs text-gray-600 truncate mb-3">
                              {user.email}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fetchUserProfile(user.id)}
                              className="w-full"
                            >
                              <Eye size={14} className="mr-2" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    No users found.
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-2 md:py-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="text-xs md:text-sm h-8 md:h-9"
              >
                Previous
              </Button>
              <span className="px-2 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="text-xs md:text-sm h-8 md:h-9"
              >
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {loadingProfile ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:gap-4 mt-2">
                {selectedUser.avatar_url ? (
                  <Image
                    src={getImageUrl(selectedUser.avatar_url)}
                    alt={selectedUser.name}
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Fallback user icon */}
                <div className="hidden w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 text-gray-500 items-center justify-center">
                  <UserIcon size={32} />
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-center">
                  {selectedUser.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center break-all">
                  {selectedUser.email}
                </p>

                {selectedUser.username ? (
                  <a
                    href={`/${selectedUser.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-4 w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base">
                      View Public Profile
                    </Button>
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4 text-center px-2">
                    This user has not set a username yet.
                  </p>
                )}

                {/* ---------- Agent section ---------- */}
                {agentInfo && !selectedUser.is_admin && (
                  <div className="w-full border-t pt-4 mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Agent</h3>
                      {agentInfo.is_agent ? (
                        <Badge className="bg-emerald-600 text-white">
                          Agent
                        </Badge>
                      ) : (
                        <Badge variant="outline">Regular user</Badge>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        {agentInfo.is_agent
                          ? "Template"
                          : "Template (optional)"}
                      </label>
                      <select
                        value={chosenSlug}
                        onChange={(e) => setChosenSlug(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        {!agentInfo.is_agent && (
                          <option value="">Keep current / default</option>
                        )}
                        {agentInfo.templates.map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {agentInfo.is_agent ? (
                      <Button
                        onClick={saveAgentTemplate}
                        disabled={
                          savingAgent ||
                          !chosenSlug ||
                          chosenSlug === agentInfo.current_template
                        }
                        className="w-full"
                      >
                        {savingAgent && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Change template
                      </Button>
                    ) : (
                      <Button
                        onClick={makeAgent}
                        disabled={savingAgent}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {savingAgent && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Make this user an agent
                      </Button>
                    )}

                    {agentInfo.is_agent && agentInfo.nfc_url && (
                      <div className="rounded-md bg-gray-50 p-3 space-y-2">
                        <p className="text-xs text-gray-500">NFC link</p>
                        <p className="text-xs break-all text-gray-800">
                          {agentInfo.nfc_url}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyNfc}
                          className="w-full"
                        >
                          Copy link
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
