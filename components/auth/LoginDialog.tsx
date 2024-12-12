"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useLoginDialog } from "@/context/LoginDialogProvider";
import { getKeyClientSide } from "@/lib/crypto";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const LoginCard = dynamic(() => import("./LoginCard"), { ssr: false })

export default function LoginDialog() {
    const { isOpen, setIsOpen, closeDialog, setIsLoggedIn, isLoggedIn } = useLoginDialog();

    useEffect(() => {
        if(!isLoggedIn) {
            try {
                const key = getKeyClientSide();
                if(key) {
                    setIsLoggedIn(true);
                }
            } catch {
                setIsLoggedIn(false);
            }

        }
    }, [isLoggedIn, setIsLoggedIn])

    return (
        <>
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogContent className="bg-transparent dark:bg-transparent dark:border-none">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <LoginCard callback={() => {
                    closeDialog();
                    setIsLoggedIn(true);
                }} />
            </DialogContent>
        </Dialog>
        </>
    )
}