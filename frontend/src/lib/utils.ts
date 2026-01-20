import { UserRole } from "@/models/User";
import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge"
import { DateRange } from 'react-day-picker'
import axios from "axios";
import { API_PATHS } from "./api";

interface TokenPayload {
  userId: string;
  role: UserRole;
}

export function getRole() {
  const token = localStorage.getItem("token")
  if (token) {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role
  } else {
    console.log("getrole token undefind");
    return null
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




