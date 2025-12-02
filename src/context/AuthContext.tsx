import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase-client";

type AuthContextType = {
  session: any;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  signUpNewUser: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(undefined);

  // Sign up
  const signUpNewUser = async (email, password, fullName) => {
    console.log("Attempting signup with", { email, password });
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      }
    });
    console.log("signup result", { data, error });
    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      console.log("Sign-in success:", data);
      return { success: true, data }; // Return the user data
    } catch (error: any) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, setSession, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};