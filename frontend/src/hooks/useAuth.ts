// src/hooks/useAuth.ts
"use client";

import { useAuthContext } from "@/context/AuthContext";

export default function useAuth() {
  return useAuthContext();
}
