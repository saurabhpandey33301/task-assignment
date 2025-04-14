// "use client"
// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { User } from "@/app/types";
// import { login, getUserById } from "@/app/lib/mock-data";
// import { useToast } from "@/components/ui/use-toast";

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email : string , password : string) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUserId = localStorage.getItem("userId");
    
//     const loadUser = async () => {
//       if (storedUserId) {
//         try {
//           const userData = await getUserById(storedUserId);
//           setUser(userData);
//         } catch (error) {
//           console.error("Failed to load user:", error);
//           localStorage.removeItem("userId");
//         }
//       }
//       setIsLoading(false);
//     };
    
//     loadUser();
//   }, []);

//   const handleLogin = async (email: string, password: string) => {
//     try {
//       const result  = await login(email, password);
      
//       if (result) {
//         setUser(result);
//         localStorage.setItem("userId", result.id);
//         toast({
//           title: "Login successful",
//           description: `Welcome, ${result.name}!`,
//         });
//         return true;
//       } else {
//         toast({
//           title: "Login failed",
//           description: "Invalid email or password",
//           variant: "destructive",
//         });
//         return false;
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast({
//         title: "Login error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       });
//       return false;
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("userId");
//     toast({
//       title: "Logout successful",
//       description: "You have been logged out",
//     });
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         login: handleLogin,
//         logout: handleLogout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/app/types";
import { login, getUserById } from "@/app/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    const loadUser = async () => {
      if (storedUserId) {
        try {
          const userData = await getUserById(storedUserId);
          if (userData) setUser(userData);
          else localStorage.removeItem("userId");
        } catch {
          localStorage.removeItem("userId");
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      if (result) {
        setUser(result);
        localStorage.setItem("userId", result.id);
        toast({
          title: "Login successful",
          description: `Welcome, ${result.name || result.email}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
