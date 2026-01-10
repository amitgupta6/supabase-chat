"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function AuthListener() {

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event) => {
            if (event == "SIGNED_IN") {
                if (!window.location.href.includes("/chat")) {
                    window.location.href = `/chat`;
                }
            } else if (event == "SIGNED_OUT") {
                if (!window.location.href.includes("/login")) {
                    window.location.href = `/login`;
                }
            }
        })
        return () => data.subscription.unsubscribe();
    }, []);

    return null;
}