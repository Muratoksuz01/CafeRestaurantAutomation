"use client"

import type { AllTable } from "@/models/Tables"
import { Clock, User, Utensils, CalendarCheck, ClipboardList } from "lucide-react"

export default function TableCard({ table, onClick }: { table: AllTable; onClick: any }) {
  const isEmpty = table.status === "bos"
  const isReserved = table.status === "rezerve"
  const isFull = table.status === "dolu"

  const getStatusConfig = () => {
    if (isEmpty) return {
      bg: "bg-card hover:border-primary/50 text-card-foreground border-border",
      accent: "bg-muted text-muted-foreground",
      icon: <Utensils size={18} className="opacity-40" />,
      label: "Masa Boş"
    }
    if (isReserved) return {
      bg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent shadow-lg shadow-amber-500/10",
      accent: "bg-white/20 text-white",
      icon: <CalendarCheck size={18} />,
      label: "Rezerve"
    }
    return {
      bg: "bg-gradient-to-br from-[#E83C91] to-[#FF8FB7] text-white border-transparent shadow-lg shadow-pink-500/20",
      accent: "bg-white/20 text-white",
      icon: <ClipboardList size={18} />,
      label: "Sipariş Var"
    }
  }

  const config = getStatusConfig()

  return (
    <div
      onClick={onClick}
      className={`
        relative group
         w-full
        rounded-[28px] 
        p-5
        cursor-pointer 
        flex flex-col 
        border-2
        transition-all duration-300 ease-out
        hover:scale-[1.03] active:scale-95
        ${config.bg}
      `}
    >
      {/* ÜST BİLGİ SATIRI */}
      <div className="flex justify-between items-start w-full">
        <div className={`p-2.5 rounded-2xl ${config.accent}`}>
          {config.icon}
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Clock size={12} />
            {table.orderCreated}
          </div>
        )}
      </div>

      {/* ORTA KISIM: MASA VE TUTAR */}
      <div className="flex flex-col flex-1 justify-center mt-2">
        <h3 className="font-bold text-2xl tracking-tight leading-none uppercase">
          {table.name}
        </h3>
        
        <div className="mt-1.5">
          {isEmpty ? (
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Müsait</span>
          ) : isReserved ? (
            <span className="text-[10px] font-bold uppercase tracking-widest">Rezerve Edildi</span>
          ) : (
            <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium opacity-80">₺</span>
               <span className="text-2xl font-black leading-none tracking-tighter">{table.orderTotal}</span>
            </div>
          )}
        </div>
      </div>

      {/* ALT KISIM: SİPARİŞİ ALAN KİŞİ (Garson) */}
      {!isEmpty && !isReserved && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <User size={12} strokeWidth={3} />
            </div>
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="text-[9px] opacity-70 font-semibold uppercase tracking-tighter">Personel</span>
              <span className="text-[11px] font-bold truncate">
                {table.waiterName || "Bilinmiyor"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}