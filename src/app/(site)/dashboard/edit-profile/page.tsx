"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  User,
  Globe,
  MapPin,
  Phone,
  Mail,
  Upload,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  display_name?: string;
  username?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  profile_image?: string;
  avatar_url?: string;
}

interface SocialLink {
  id: number | null;
  platform: string;
  url: string;
  display_name: string;
  is_visible: boolean;
}

interface User {
  profile: Profile;
  profile_image?: string;
  avatar_url?: string;
  email: string;
  display_name?: string;
  username?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
}

// Helper function to get full image URL
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/avatar.png";
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a relative path, prepend the IMAGE URL from env
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000';
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${imageUrl}/${cleanPath}`;
};

export default function EditProfilePage() {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
  }); 
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: null,
      platform: "Instagram",
      url: "https://instagram.com/username",
      display_name: "@username",
      is_visible: true,
    },
  ]);

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSaving(true);

    const formData = new FormData();
    if (avatarFile) formData.append("avatar", avatarFile);

    formData.append("name", profile.name || "");
    formData.append("firstname", profile.firstname || "");
    formData.append("lastname", profile.lastname || "");
    formData.append("display_name", profile.display_name || "");
    formData.append("username", profile.username || "");
    formData.append("bio", profile.bio || "");
    formData.append("phone", profile.phone || "");
    formData.append("website", profile.website || "");
    formData.append("location", profile.location || "");

    // Only send social links that have at least platform and url filled
    socialLinks
      .map((l) => ({ ...l }))
      .filter((link) => (link.platform || "").trim() !== "" && (link.url || "").trim() !== "")
      .forEach((link, index) => {
        if (link.id !== null && link.id !== undefined) {
          formData.append(`social_links[${index}][id]`, String(link.id));
        }
        formData.append(`social_links[${index}][platform]`, link.platform);
        formData.append(`social_links[${index}][url]`, link.url);
        formData.append(
          `social_links[${index}][display_name]`,
          link.display_name || ""
        );
        formData.append(
          `social_links[${index}][is_visible]`,
          link.is_visible ? "1" : "0"
        );
      });
 
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        // Refresh user data after successful save
        try {
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            const socialLinks =
              userData?.profile?.social_links || userData?.profile?.socialLinks || [];

            setProfile((prev: Profile) => ({
              ...prev,
              ...userData.profile,
              profile_image: userData.profile_image || prev.profile_image,
              avatar_url: userData.avatar_url || prev.avatar_url,
              display_name: userData.display_name ?? prev.display_name,
              email: userData.email ?? prev.email,
              username: userData.username ?? prev.username,
              name: userData.name ?? prev.name,
              firstname: userData.firstname ?? prev.firstname,
              lastname: userData.lastname ?? prev.lastname,
            }));

            setSocialLinks(
              socialLinks.map((link: any) => ({
                id: link.id ?? null,
                platform: link.platform ?? "",
                url: link.url ?? "",
                display_name: link.username ?? link.display_name ?? "",
                is_visible: !!(link.isVisible ?? link.is_visible),
              }))
            );
            
            // Clear the preview URL after successful save
            setPreviewURL(null);
            setAvatarFile(null);
          }
        } catch (e) {
          console.error("Failed to refresh user data", e);
        }

        toast.success("Profile saved!");
      } else if (res.status === 422) {
        // Validation errors
        let err: any = null;
        try {
          err = await res.json();
        } catch (e) {
          console.error("Failed to parse 422 response as JSON", e);
        }

        if (err?.errors?.username) {
          toast.error("Username is already taken. Please choose another.");
        } else {
          const values = Object.values(err?.errors || {});
          let firstError: string | undefined;

          if (values.length > 0) {
            const first = values[0];
            if (Array.isArray(first)) {
              firstError = String(first[0]);
            } else {
              firstError = String(first);
            }
          }

          toast.error(firstError || "Validation error. Please check your input.");
        }
      } else {
        let body: any = null;
        try {
          body = await res.json();
        } catch (e) {
          try {
            body = await res.text();
          } catch (e2) {
            body = null;
          }
        }

        console.error("Profile save failed", { status: res.status, body });
        toast.error(`Error saving profile: ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to save profile. Check console for details.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; 

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();

          const {
            profile,
            profile_image,
            avatar_url,
            email,
            display_name,
            username,
            name,
            firstname,
            lastname,
          } = userData;
          const socialLinks = userData?.profile?.social_links || userData?.profile?.socialLinks || []; 

          setProfile((prev: Profile) => ({
            ...prev,
            ...profile,
            profile_image,
            avatar_url,
            display_name,
            email,
            username,
            name,
            firstname,
            lastname,
          })); 

          setSocialLinks(
            socialLinks.map((link: SocialLink) => ({
              ...link,
              is_visible: !!link.is_visible,
            }))
          );

          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const checkUsername = async () => {
      const username = profile.username?.trim();

      if (!username) {
        setUsernameError(null);
        return;
      }

      if (username === currentUser?.username) {
        setUsernameError(null);
        return;
      }

      setIsCheckingUsername(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`
        );
        if (res.ok) {
          setUsernameError("Username is already taken");
        } else {
          setUsernameError(null);
        }
      } catch {
        setUsernameError(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [profile.username, currentUser?.username]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const user = JSON.parse(userData);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      if (!user.is_admin) {
        router.push(`/dashboard/edit-profile/`);
      } else {
        router.push("/admin/");
      }
    }
  }, [router]);

  if (isAuthenticated === null) return null;
  if (!profile) return <div className="p-8 text-white">Loading profile...</div>; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                <p className="text-white">
                  Update your profile information and customize your digital
                  presence.
                </p> 
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={previewURL || profile.avatar_url || "/avatar.png"}
                      alt="Profile picture"
                      onError={(e) => {
                        console.error("Image failed to load:", e.currentTarget.src);
                        e.currentTarget.src = "/avatar.png";
                      }}
                    />
                    <AvatarFallback className="text-lg">
                      {profile?.name?.[0] || profile?.firstname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          const fileSizeMB = file.size / (1024 * 1024);
                          const validTypes = ["image/jpeg", "image/png"];

                          if (!validTypes.includes(file.type)) {
                            toast.error(
                              "Invalid file type. Only JPG and PNG are allowed."
                            );
                            e.target.value = "";
                            return;
                          }

                          if (fileSizeMB > 5) {
                            toast.error(
                              "File size exceeds 5MB. Please choose a smaller image."
                            );
                            e.target.value = "";
                            return;
                          }

                          setAvatarFile(file);
                          setPreviewURL(URL.createObjectURL(file)); 
                        }
                      }}
                      className="hidden"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => avatarInputRef.current?.click()}
                    > 
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Picture
                    </Button>

                    <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div> 
                    <Label htmlFor="Name">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstname || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, firstname: e.target.value })
                      }
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div> 
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      value={profile.lastname || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, lastname: e.target.value })
                      } 
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div> 
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.display_name || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, display_name: e.target.value })
                    } 
                    placeholder="How your name appears on your profile"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      {(process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(
                        /^https?:\/\//,
                        ""
                      ) ?? "localhost:3000") + "/"} 
                    </span>

                    <div className="flex items-center gap-2">
                      <Input
                        id="username"
                        value={profile.username || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^a-zA-Z0-9_]/g, "")
                            .slice(0, 10);
                          setProfile({ ...profile, username: value });
                        }}
                        placeholder="username"
                        maxLength={15}
                        className={
                          usernameError
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : ""
                        }
                      />

                      {isCheckingUsername && (
                        <span className="text-sm text-gray-400">
                          Checking...
                        </span>
                      )}
                    </div>
                  </div>
                  {usernameError && (
                    <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                  )}
                </div>

                <div> 
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    } 
                    placeholder="Tell people about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div> 
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                  <div> 
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 11);
                        setProfile({ ...profile, phone: digits }); 
                      }}
                      placeholder="09156277266"
                      maxLength={11}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    > 
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={profile.website || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    > 
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={profile.location || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      } 
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Social Media Links
                  <Button
                    size="sm"
                    onClick={() =>
                      setSocialLinks([
                        ...socialLinks,
                        {
                          id: null,
                          platform: "",
                          url: "",
                          display_name: "",
                          is_visible: true,
                        },
                      ])
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="mb-4 border p-4 rounded-md space-y-2 relative"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Platform</Label>
                        <Input
                          value={link.platform}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[index].platform = e.target.value;
                            setSocialLinks(updated);
                          }}
                          placeholder="e.g., Instagram"
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[index].url = e.target.value;
                            setSocialLinks(updated);
                          }}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Display Name</Label>
                        <Input
                          value={link.display_name}
                          onChange={(e) => {
                            const updated = [...socialLinks];
                            updated[index].display_name = e.target.value;
                            setSocialLinks(updated);
                          }}
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={link.is_visible}
                          onChange={() => {
                            const updated = [...socialLinks];
                            updated[index].is_visible =
                              !updated[index].is_visible;
                            setSocialLinks(updated);
                            toast("Please save changes to update visibility.");
                          }}
                        />
                        <span className="text-sm">Visible</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving || !!usernameError}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  ); 
}
