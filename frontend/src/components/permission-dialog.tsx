"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Save } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/api"
import { User } from "@/models/User"
import { useGetPermissions } from "@/hooks/useGetPermissions"
import { toast } from "sonner"
import { successStyle, warningStyle } from "@/lib/toastStyle"



interface Action {
  _id: string
  code: string
  description: string
}

interface PermissionDialogProps {
  open: boolean,
  setOpen: any
  userId: string,
  // permissions: Action[]
  onClose: () => void
  onSuccess: () => void
}

export function PermissionDialog({ open, userId, onClose, onSuccess }: PermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<String[]>([]); // id -> code
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User>()
  const { permissions: allPermission, getPermissions } = useGetPermissions()

  // Initialize selected permissions from user
  const fetchUser = async (id: string) => {
    let res = await axiosInstance.get(API_PATHS.getUser(id))
    if (res.data.success) {
      setUser(res.data.data)
      setSelectedPermissions(
        res.data.data.permissions.map((p: any) => p.id)
      ); console.log(selectedPermissions)
    }
  }
  useEffect(() => {
    getPermissions()
  }, [])
  useEffect(() => {
    if (userId != "") {
      console.log("userID", userId)
      fetchUser(userId)
    } else {
      console.log("userId bos geldi")
    }

  }, [userId, open])

  const handleTogglePermission = (id: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res= await axiosInstance.put(API_PATHS.updatePermission(userId), {
       ids: selectedPermissions,
      });
      if(res.data.success){
        onSuccess &&  onSuccess()
        toast.success("basarı ile izinler guncellendi",successStyle)
      }else{
        toast.warning(res.data.message || "bir sorun olustu", warningStyle)
      }

    }catch(err){
      console.log(err)
      toast.warning("bir soun olustu",warningStyle)
    } 
    finally {
      setIsSaving(false);
    }
  };


  const handleSelectAll = () => {
    setSelectedPermissions(allPermission.map(a => a._id));
  };
  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  // Group permissions by category (e.g., Order, User, Product)
  const groupedPermissions = allPermission.reduce(
    (acc, permission) => {
      const category = permission.code.split(".")[0] || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(permission)
      return acc
    },
    {} as Record<string, Action[]>,
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            İzin Yönetimi
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-1 mt-2">
              <div className="font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm">{user?.email}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {selectedPermissions.length} / {allPermission.length} izin seçili
                </Badge>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Tümünü Seç
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll}>
            Tümünü Kaldır
          </Button>
        </div>

        <ScrollArea className=" h-[500px] pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category}</h3>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission._id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={permission._id} className="text-sm font-medium cursor-pointer">
                          {permission.code}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                      <Switch
                        id={permission._id}
                        checked={selectedPermissions.includes(permission._id)}
                        onCheckedChange={() =>
                          handleTogglePermission(permission._id)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
