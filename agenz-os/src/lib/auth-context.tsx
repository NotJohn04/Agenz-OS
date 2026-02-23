"use client";

import { createContext, useContext, useState } from "react";
import type { Client } from "@/types";

// ─── App User (who is logged in) ─────────────────────────────────────────────
export interface AppUser {
  id: string;
  name: string;
  initials: string;
  role: "ADMIN" | "CLIENT" | "CLIENT_EMPLOYEE";
  organization: string;
  planLabel: string;
  planColor: string;
  /** Links CLIENT / CLIENT_EMPLOYEE users to a Client record in mock-data */
  clientId?: string;
}

export const MOCK_USERS: AppUser[] = [
  // Agenz team (Admins)
  {
    id: "u1",
    name: "Hakim Aziz",
    initials: "HA",
    role: "ADMIN",
    organization: "Agenz MY",
    planLabel: "ADMIN",
    planColor: "#3b82f6",
  },
  {
    id: "u2",
    name: "Syafiq Rahman",
    initials: "SR",
    role: "ADMIN",
    organization: "Agenz MY",
    planLabel: "ADMIN",
    planColor: "#3b82f6",
  },
  {
    id: "u3",
    name: "Rina Zulaikha",
    initials: "RZ",
    role: "ADMIN",
    organization: "Agenz MY",
    planLabel: "ADMIN",
    planColor: "#3b82f6",
  },
  // Clients
  {
    id: "u4",
    name: "Faizal Azman",
    initials: "FA",
    role: "CLIENT",
    clientId: "c1",
    organization: "Solar Pro Malaysia",
    planLabel: "BEGINNER",
    planColor: "#3b82f6",
  },
  {
    id: "u5",
    name: "Nurul Hana",
    initials: "NH",
    role: "CLIENT",
    clientId: "c2",
    organization: "Bunga House KL",
    planLabel: "INTERMEDIATE",
    planColor: "#06b6d4",
  },
  {
    id: "u6",
    name: "Marcus Tan",
    initials: "MT",
    role: "CLIENT",
    clientId: "c3",
    organization: "TechMart Online",
    planLabel: "ADVANCED",
    planColor: "#8b5cf6",
  },
  // Client employees (sub-users)
  {
    id: "u7",
    name: "Ahmad Zain",
    initials: "AZ",
    role: "CLIENT_EMPLOYEE",
    clientId: "c1",
    organization: "Solar Pro Malaysia",
    planLabel: "EMPLOYEE",
    planColor: "#6b7280",
  },
  {
    id: "u8",
    name: "Syafieq Noor",
    initials: "SN",
    role: "CLIENT_EMPLOYEE",
    clientId: "c1",
    organization: "Solar Pro Malaysia",
    planLabel: "EMPLOYEE",
    planColor: "#6b7280",
  },
  {
    id: "u9",
    name: "Liyana Putri",
    initials: "LP",
    role: "CLIENT_EMPLOYEE",
    clientId: "c3",
    organization: "TechMart Online",
    planLabel: "EMPLOYEE",
    planColor: "#6b7280",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
interface AuthContextValue {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  viewingAs: Client | null;
  setViewingAs: (client: Client | null) => void;
  isViewingAs: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: MOCK_USERS[0],
  setCurrentUser: () => {},
  viewingAs: null,
  setViewingAs: () => {},
  isViewingAs: false,
  isAdmin: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(MOCK_USERS[0]);
  const [viewingAs, setViewingAs] = useState<Client | null>(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        viewingAs,
        setViewingAs,
        isViewingAs: viewingAs !== null,
        isAdmin: currentUser.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
