import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge"
interface TokenPayload {
  userId: string;
  role: string;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getRole(){
  const token=localStorage.getItem("token") || ""
  const decoded = jwtDecode<TokenPayload>(token);
  return decoded.role === "admin" ? "admin" : decoded.role === "user" ? "user" :  "unknown"

}