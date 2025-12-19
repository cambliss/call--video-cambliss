"use client";
import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import React from "react";
import Peer from "../ui/peer";
import { Icons } from "../ui/icons";

export default function Conference() {
    const peers = useHMSStore(selectPeers);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (peers.length > 0) {
            setLoading(false);
        }
    }, [peers]);

    return (
        <div className="relative h-full w-full">
            {/* Watermark overlay across the entire video area */}
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                <span className="text-8xl font-bold text-white opacity-20 rotate-[-30deg]">
                    CAMBLISS
                </span>
            </div>

            <div className="w-full conference pt-4">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="flex items-center gap-4">
                            <Icons.spinner color="#fff" width={18} height={18} />
                            <p className="text-lg sm:text-xl">Loading...</p>
                        </div>
                    </div>
                ) : (
                    peers.map((peer) => <Peer key={peer.id} peer={peer} />)
                )}
            </div>
        </div>
    );
}
