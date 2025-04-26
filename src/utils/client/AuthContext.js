"use client";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("/images/user/user.png");

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401) {
        // If the user is not authenticated (Unauthorized), set user to null
        setUser(null);
        setIsLoggedIn(false);
        setProfileImage("/images/user/user.png"); // Default profile image
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

      setUser(data.user);
      setIsLoggedIn(true);

      if (data.user.profileImage) {
        setProfileImage(`${data.user.profileImage}?t=${Date.now()}`);
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
      setIsLoggedIn(false);
      setProfileImage("/images/user/user.png"); // Default profile image
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/user/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      setIsLoggedIn(false);
      setProfileImage("/images/user/user.png"); // Default profile image
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      isLoading, 
      profileImage,
      fetchUser, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
