import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToExcel<T>(rows: T[], fileName = "data.xlsx") {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, fileName)
  }


