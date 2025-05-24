import { createContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
} from "../types";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optional: verify token validity with backend
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(
        credentials.email,
        credentials.password
      );
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      toast.success("Login berhasil!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login gagal. Silakan coba lagi.";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const formData = new FormData();

      // Add form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "foto" && value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
            console.log("Appending file:", {
              name: value[0].name,
              type: value[0].type,
              size: value[0].size,
            });
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Log the FormData contents
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0],
          pair[1] instanceof File
            ? {
                name: (pair[1] as File).name,
                type: (pair[1] as File).type,
                size: (pair[1] as File).size,
              }
            : pair[1]
        );
      }

      const response = await authAPI.register(formData);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      toast.success("Registrasi berhasil!");
    } catch (error: any) {
      console.error("Registration error details:", {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
      });

      // Show validation errors if they exist
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            toast.error(`${field}: ${message}`);
          }
        );
      } else {
        const message =
          error.response?.data?.message ||
          "Registrasi gagal. Silakan coba lagi.";
        toast.error(message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logout berhasil!");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still clear local storage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      const formData = new FormData();

      // Add _method=PUT for Laravel to recognize this as a PUT request
      formData.append("_method", "PUT");

      // Add form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await authAPI.updateProfile(formData);
      const updatedUser = response.data.data;

      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update context
      setUser(updatedUser);

      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Gagal memperbarui profil. Silakan coba lagi.";
      toast.error(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
