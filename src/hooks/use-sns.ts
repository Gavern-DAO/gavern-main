import { useState, useEffect } from "react";

export function useSnsId(pubkey: string | undefined) {
    const [snsId, setSnsId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!pubkey) return;

        const fetchSnsId = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://sns-api.bonfida.com/v2/user/fav-domains/${pubkey}`);
                const data = await response.json();

                // The API returns an object with the pubkey as key and the domain as value
                if (data && data[pubkey]) {
                    setSnsId(`${data[pubkey]}.sol`);
                } else {
                    setSnsId(null);
                }
            } catch (error) {
                console.error("Error fetching SNS ID:", error);
                setSnsId(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSnsId();
    }, [pubkey]);

    return { snsId, isLoading };
}
