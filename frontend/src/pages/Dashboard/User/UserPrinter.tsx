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

const LOCAL_STORAGE_KEY = "selected_printer";

function UserPrinter() {
  const { printers, getPrinters, loading,error } = useGetPrinter();
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");

  useEffect(() => {
    getPrinters();
    const savedPrinter = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPrinter) {
      setSelectedPrinterId(savedPrinter);
    }
  }, []);
useEffect(() => {
    if (error) {
      toast.error(error, warningStyle);
    }
  }, [error]);
  const handleSave = () => {
    if (!selectedPrinterId) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.info("Yazıcı tercihi kaldırıldı",successStyle);
      return;
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, selectedPrinterId);
    toast.success("Yazıcı tercihi başarıyla kaydedildi",successStyle);
  };

  // Temizleme fonksiyonu
  const clearSelection = () => {
    setSelectedPrinterId("");
  };

  return (
    <div className="flex  ">
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
                    value={selectedPrinterId} 
                    onValueChange={setSelectedPrinterId}
                  >
                    {/* pr-10 ekleyerek X butonu için yer açtık */}
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
                        <SelectItem value="none" disabled>Yazıcı bulunamadı</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {/* X Butonu: Select'in dışında ama absolute ile sağda duruyor */}
                  {selectedPrinterId && (
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