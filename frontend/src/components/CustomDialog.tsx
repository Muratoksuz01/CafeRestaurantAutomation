import  { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, } from "@/components/ui/dialog";
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
interface CustomDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: ReactNode
    description?: ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
}
function CustomDialog({open,onOpenChange,title,description,
    confirmText = "Onayla",cancelText = "İptal",onConfirm }: CustomDialogProps) {
     
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {description}
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose>{cancelText}</DialogClose>
                    <Button onClick={onConfirm}>{confirmText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialog