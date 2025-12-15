"use client"

import type { AllTable } from "@/models/Tables"
import { Clock, User } from "lucide-react"

export default function TableCard({ table, onClick }: { table: AllTable; onClick: any }) {
  const isEmpty = table.status === "bos"
  const isReserved = table.status === "rezerve"
  const isFull = table.status === "dolu"

  const bg = isEmpty
    ? "bg-white"
    : isReserved
      ? "bg-gradient-to-b from-amber-400 to-amber-600 text-white"
      : "bg-gradient-to-b from-pink-400 to-pink-600 text-white"

  const statusLabel = isEmpty ? "Boş" : isReserved ? "Rezerve" : "Dolu"

  return (
    <div
      onClick={onClick}
      className={`
                min-w-[140px]
                h-[140px]
                rounded-xl 
                p-3 
                cursor-pointer 
                flex flex-col 
                justify-between 
                shadow-sm 
                transition 
                hover:scale-105 
                ${bg}
            `}
    >
      {/* Çentik */}
      <div
        className={`w-[40px] h-[6px] rounded-full mx-auto opacity-80 ${isEmpty ? "bg-gray-300" : "bg-white/30"}`}
      ></div>

      {/* ORTA KISIM */}
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="font-bold text-xl">{table.name}</div>
          <div className="text-gray-500 font-semibold">{statusLabel}</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="font-bold text-xl">{table.name}</div>
          {isReserved ? (
            <div className="font-semibold text-sm mt-1">{statusLabel}</div>
          ) : (
            <div>
              <span className="font-semibold">₺{table.orderTotal}</span>
            </div>
          )}
        </div>
      )}

      {/* ALT KISIM – sadece dolu veya rezerve ise */}
      {!isEmpty && (
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{table.waiterName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{table.orderCreated}</span>
          </div>
        </div>
      )}
    </div>
  )
}
