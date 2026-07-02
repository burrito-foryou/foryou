import { useMemo } from "react";
import useAuthStore from "../../auth/store/authStore";

const useMemberId = () => {
    const token = useAuthStore((s) => s.token);
    return useMemo(() => {
        if (!token) return null;
        try {
            const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(
                new TextDecoder().decode(
                    Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
                ),
            );
            return Number(payload.sub);
        } catch {
            return null;
        }
    }, [token]);
};

export default useMemberId;