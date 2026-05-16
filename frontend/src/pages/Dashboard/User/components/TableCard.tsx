"use client"

import type { AllTable, Rezerve } from "@/models/Tables"
import { Clock, User, Utensils, CalendarCheck, ClipboardList, Phone, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TableCard({ table, onClick, rezerve }: { table: AllTable; onClick: any; rezerve: Rezerve[] }) {
  const isEmpty = table.status === "bos"
  const isReserved = table.status === "rezerve"
  // const isFull = table.status === "dolu"

  // Bu masaya ait rezervasyon bilgisini buluyoruz
  const reservationDetail = rezerve.find((r) => r.masaId === table._id)
  // console.log(reservationDetail)
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

  // Kart İçeriği (Tooltip ile sarmalamak için ayırdık)
  const CardContent = (
    <div
      onClick={onClick}
      className={`relative group w-full rounded-[28px] p-5 cursor-pointer flex flex-col border-2 transition-all 
        duration-300 ease-out hover:scale-[1.03] active:scale-95 ${config.bg}`}
    >
      <div className="flex justify-between items-start w-full">
        <div className={`p-2.5 rounded-2xl ${config.accent}`}>
          {config.icon}
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Clock size={12} />
            {table.orderCreated || (reservationDetail?.endDate ? new Date(reservationDetail.endDate).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit"
            }) : "SAAT YOK")}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center mt-2">
        <h3 className="font-bold text-lg xl:text-xl tracking-tight leading-tight uppercase wrap-break-words line-clamp-2">
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

      {/* REZERVE veya DOLU ise Personel bilgisini gösteriyoruz */}
      {!isEmpty && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="shrink-0 w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <User size={12} strokeWidth={3} />
            </div>
            <div className="flex flex-col leading-none overflow-hidden">
              <span className="text-[9px] opacity-70 font-semibold uppercase tracking-tighter">
                {isReserved ? "Rezerve Sahibi" : "Garson"}
              </span>
              <span className="text-[11px] font-bold truncate">
                {isReserved ? (reservationDetail?.employeeName || "İsim Yok") : (table.waiterName || "Bilinmiyor")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )


  return (
    <TooltipProvider delayDuration={100}>
      {
        isReserved && reservationDetail ? (
          <Tooltip>
            <TooltipTrigger asChild>

              {CardContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="p-4 w-64 bg-slate-900 text-white border-amber-500/50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <CalendarCheck className="text-amber-400" size={16} />
                  <p className="font-bold text-sm uppercase">Rezervasyon Detayı</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="opacity-60 flex items-center gap-1"><User size={12} /> Müşteri:</span>
                    <span className="font-semibold">{reservationDetail.employeeName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-60 flex items-center gap-1"><Phone size={12} /> Telefon:</span>
                    <span className="font-semibold">{reservationDetail.employeePhone}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-300">
                    <span className="opacity-60 flex items-center gap-1"><Clock size={12} /> Saat:</span>
                    <span className="font-bold">
                      {new Date(reservationDetail.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {reservationDetail.description && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="opacity-60 flex items-center gap-1 mb-1"><Info size={12} /> Not:</span>
                      <p className="italic bg-white/5 p-2 rounded leading-tight">{reservationDetail.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

        ) : (
          CardContent
        )
      }


    </TooltipProvider>
  )
}