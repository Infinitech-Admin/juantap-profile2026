// lib/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

console.log("🔍 NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("🔍 API_BASE_URL:", API_BASE_URL);

export async function getAuthenticatedUser() {
  const token = localStorage.getItem("token");
  if (!token) return null; 

  try {
    console.log("🔍 Full URL:", `${API_BASE_URL}/user`);
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    if (axios.isAxiosError(error)) {
      console.error("❌ Status:", error.response?.status);
      console.error("❌ Response:", error.response?.data);
    }
    return null; 
  }
}
