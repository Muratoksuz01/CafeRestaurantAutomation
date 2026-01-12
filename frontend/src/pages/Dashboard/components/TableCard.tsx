"use client"

import type { AllTable } from "@/models/Tables"
import { Clock, User } from "lucide-react"

export default function TableCard({ table, onClick }: { table: AllTable; onClick: any }) {
  const isEmpty = table.status === "bos"
  const isReserved = table.status === "rezerve"
  const isFull = table.status === "dolu"

  // Dark mod uyumlu dinamik arka planlar
  const bg = isEmpty
    ? "bg-card hover:bg-accent border-border text-card-foreground" 
    : isReserved
      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white border-transparent"
      : "bg-gradient-to-br from-[#E83C91] to-[#FF8FB7] text-white border-transparent shadow-lg shadow-pink-500/20"

  const statusLabel = isEmpty ? "Boş" : isReserved ? "Rezerve" : "Dolu"

  return (
    <div
      onClick={onClick}
      className={`
        relative
        min-w-[140px]
        h-[140px]
        rounded-2xl 
        p-4
        cursor-pointer 
        flex flex-col 
        justify-between 
        border
        transition-all 
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${bg}
      `}
    >
      {/* Üst Çentik - Süsleme */}
      <div
        className={`w-10 h-1.5 rounded-full mx-auto mb-2 opacity-30 ${
          isEmpty ? "bg-muted-foreground" : "bg-white"
        }`}
      />

      {/* ORTA KISIM */}
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="font-bold text-lg tracking-tight">{table.name}</div>
        
        {isEmpty ? (
          <div className="text-muted-foreground text-sm font-medium">{statusLabel}</div>
        ) : (
          <div className="mt-1">
            {isReserved ? (
              <div className="font-medium text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {statusLabel}
              </div>
            ) : (
              <div className="font-black text-lg">
                ₺{table.orderTotal}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ALT KISIM – Bilgi Satırı */}
      {!isEmpty && (
        <div className="flex justify-between items-center text-[10px] mt-2 border-t border-white/20 pt-2">
          <div className="flex items-center gap-1 opacity-90">
            <User size={12} />
            <span className="truncate max-w-[50px]">{table.waiterName}</span>
          </div>

          <div className="flex items-center gap-1 opacity-90">
            <Clock size={12} />
            <span>{table.orderCreated}</span>
          </div>
        </div>
      )}
    </div>
  )
}