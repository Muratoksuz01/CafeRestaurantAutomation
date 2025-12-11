import { AllTable } from "@/models/Tables";
import { Clock, User } from "lucide-react";

export default function TableCard({ table, onClick }:{table:AllTable,onClick:any}) {
    const isEmpty = table.status === "bos";
   // const isFull = table.status === "dolu";

    const bg = isEmpty
        ? "bg-white"
        : "bg-gradient-to-b from-pink-400 to-pink-600 text-white";

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
            <div className="w-[40px] h-[6px] bg-gray-300 rounded-full mx-auto opacity-80"></div>

            {/* ORTA KISIM */}
            {isEmpty ? (
                <div className="flex flex-col justify-center items-center flex-1">
                    <div className="font-bold text-xl">{table.name}</div>
                    <div className="text-gray-500 font-semibold">Boş</div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center">
                    <div className="font-bold text-xl">{table.name}</div>
                    <div>
                        <span className="font-semibold">
                            ₺{table.orderTotal}
                        </span>
                    </div>
                </div>
            )}

            {/* ALT KISIM – sadece doluysa */}
            {!isEmpty && (
                <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>murat</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{table.orderCreated}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
