import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge"
type UserRole = "Yonetici" | "Kasiyer" |  "Garson";

interface TokenPayload {
  userId: string;
  role: UserRole;
}

export function getRole(){
  const token=localStorage.getItem("token")
  if(token){
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role 
  }else{
    console.log("getrole token undefind");
    return null
  }
}
export const can = (permissions: string[], action: string) =>
  permissions.includes(action);
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



