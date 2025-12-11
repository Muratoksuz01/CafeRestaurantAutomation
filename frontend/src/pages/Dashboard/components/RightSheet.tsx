import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
function RightSheet({ fullTables, openSheet, setOpenSheet, totalAmount }: { fullTables: any, openSheet: boolean, setOpenSheet: any, totalAmount: number }) {
    return (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetContent
                side="right"
                className="w-[340px] p-4 flex flex-col justify-between"
            >
                {/* ÜST KISIM */}
                <div>
                    <SheetHeader>
                        <SheetTitle className="text-pink-600 font-semibold">
                            {fullTables.length} Adisyon
                        </SheetTitle>
                    </SheetHeader>

                    <div className="mt-4 max-h-[65vh] overflow-y-auto space-y-3">
                        {fullTables.map((t: any, index: number) => (
                            <div
                                key={t._id}
                                className="flex items-center justify-between border-b pb-2"
                            >
                                {/* Sol taraf: index + masa adı */}
                                <div className="flex items-center gap-3">
                                    {/* Index numarası */}
                                    <div className="w-7 h-7 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                                        {fullTables.length - index}
                                    </div>

                                    {/* Masa adı */}
                                    <div className="text-sm font-medium">{t.name}</div>
                                </div>

                                {/* Orta: saat */}
                                <div className="text-xs text-gray-400">
                                    {t.orderCreated ?? "--:--"}
                                </div>

                                {/* Sağ: tutar */}
                                <div className="text-lg font-bold">
                                    ₺{t.orderTotal}
                                </div>
                            </div>
                        ))}

                        {fullTables.length === 0 && (
                            <div className="text-gray-400 text-sm mt-4">
                                Hiç dolu masa yok
                            </div>
                        )}
                    </div>
                </div>

                {/* ALT TUTAR */}
                <SheetFooter className="border-t pt-3 text-sm font-semibold flex">
                    <div className='flex justify-between'>
                        <div className="text-gray-600">Toplam</div>
                        <div className="text-purple-700 text-2xl">₺{totalAmount}</div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>


    )
}

export default RightSheet

/**
 *   <SheetTrigger asChild>
        
        </SheetTrigger>
 */