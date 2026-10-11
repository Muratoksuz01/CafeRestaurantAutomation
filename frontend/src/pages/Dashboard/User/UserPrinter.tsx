import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Printer, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useGetPrinter } from '@/hooks/useGetPrinter';
import { successStyle, warningStyle } from '@/lib/toastStyle';
import { Printers } from '@/models/Food';

const LOCAL_STORAGE_KEY = "printer_settings";

function UserPrinter() {
  const { printers, getPrinters, loading, error } = useGetPrinter();
const [selectedPrinter, setSelectedPrinter] = useState<Printers | null>(null);
  const [printBehavior, setPrintBehavior] = useState<string>("print_every_order");

  useEffect(() => {
  getPrinters();

  const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      if (parsed.printer) setSelectedPrinter(parsed.printer);
      if (parsed.behavior) setPrintBehavior(parsed.behavior);
    } catch (e) {
      console.error("Failed to parse printer settings:", e);
    }
  }
}, []);


  useEffect(() => {
    if (error) {
      toast.error(error, warningStyle);
    }
  }, [error]);


 const handleSave = () => {
  if (!selectedPrinter) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.info("Yazıcı tercihi kaldırıldı", successStyle);
    return;
  }

  const settings = {
    printer: selectedPrinter,
    behavior: printBehavior,
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  toast.success("Yazıcı tercihi başarıyla kaydedildi", successStyle);
};

  // Temizleme fonksiyonu
  const clearSelection = () => {
  setSelectedPrinter(null);
};

  return (
    <div className="flex p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-md border-muted">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            <CardTitle>Yazıcı Ayarları</CardTitle>
          </div>
          <CardDescription>
            Çıktı almak için kullanılacak varsayılan yazıcıyı seçin.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="printer-select">Yazıcı Seçin</Label>

            <div className="relative flex items-center">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Yazıcılar yükleniyor...
                </div>
              ) : (
                <>
                  <Select
                    value={selectedPrinter?._id.toString() ?? ""}
                    onValueChange={(id) => {
                      const printer = printers.find((p) => p._id.toString() === id);
                      setSelectedPrinter(printer ?? null);
                    }}
                  >
                    <SelectTrigger id="printer-select" className="w-full pr-10">
                      <SelectValue placeholder="Bir yazıcı seçin" />
                    </SelectTrigger>

                    <SelectContent>
                      {printers.length > 0 ? (
                        printers.map((printer) => (
                          <SelectItem key={printer._id} value={printer._id.toString()}>
                            {printer.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Yazıcı bulunamadı
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {/* X Butonu: Select'in dışında ama absolute ile sağda duruyor */}
                  {selectedPrinter && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors z-10"
                      title="Seçimi temizle"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="print-behavior-select">Yazdırma Davranışı</Label>
            <Select value={printBehavior} onValueChange={setPrintBehavior}>
              <SelectTrigger id="print-behavior-select" className="w-full">
                <SelectValue placeholder="Davranış seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="print_every_order">Her siparişte Yazdır</SelectItem>
                <SelectItem value="ask_every_order">Her siparişte Sor</SelectItem>
                <SelectItem value="never_print">Asla Yazdırma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            Tercihi Kaydet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserPrinter;