import { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, } from "@/components/ui/dialog";
import { Button } from './ui/button';

interface CustomDialogProps {
    open: boolean
    isInfo?: boolean
    onOpenChange: (open: boolean) => void
    title: ReactNode
    description?: ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    className?: string
}
function CustomDialog({ open, className, onOpenChange, title, description, isInfo = false,
    confirmText = "Onayla", cancelText = "İptal", onConfirm }: CustomDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className || "sm:max-w-[425px]"}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {description}
                {!isInfo &&
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose>{cancelText}</DialogClose>
                        <Button onClick={onConfirm}>{confirmText}</Button>
                    </DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialog