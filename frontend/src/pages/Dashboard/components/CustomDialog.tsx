import { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface CustomDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: ReactNode
    footer?:ReactNode
    isInfo?: boolean
    description?: ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    className?: string
}
function CustomDialog({ 
    open, className, onOpenChange, title , description, footer
    
}: CustomDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className || "sm:max-w-[425px]"}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {description}
                    <DialogFooter >
                        {footer }
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CustomDialog