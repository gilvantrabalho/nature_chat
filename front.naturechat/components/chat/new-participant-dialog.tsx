import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

interface NewParticipantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewParticipantDialog({ open, onOpenChange }: NewParticipantDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {/* <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription> */}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
