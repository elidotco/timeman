"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../utils/api";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string; // Example: "Admin" or "Employee"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: response } = await api.post("/auth/login", {
        email,
        password,
      });
      console.log(response);
      const accessToken = response.accessToken;
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const userData = await api.get("/auth/profile"); // Fetch user profile
      setUser(userData.data); // Set user data
      return true;
    } catch (err) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        console.error(
          "Axios error:",
          err.response?.data?.message || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
      } else {
        console.error("Unknown error occurred during login.");
      }
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout"); // Clear backend cookies
      setUser(null); // Clear frontend user state
      router.push("/login"); // Redirect to login page
    } catch (err) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        console.error(
          "Axios error:",
          err.response?.data?.message || err.message
        );
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
      } else {
        console.error("Unknown error occurred during logout.");
      }
    }
  };

  // Fetch user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data);
      } catch (err) {
        // Handle errors
        if (axios.isAxiosError(err)) {
          console.log(
            "User not authenticated:",
            err.response?.data?.message || err.message
          );
        } else if (err instanceof Error) {
          console.log("Error:", err.message);
        } else {
          console.log("Unknown error occurred while fetching user.");
        }
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
