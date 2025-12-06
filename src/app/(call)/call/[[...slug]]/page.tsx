"use client";
import { selectIsConnectedToRoom, useHMSActions, useHMSStore, selectPeers } from "@100mslive/react-sdk";
import Cookies from 'js-cookie';
import React from "react";
import CallFooter from "~/components/call/call-footer";
import Conference from "~/components/call/conference";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { type RoomCodeResponse } from "~/types/types";
import { extractId } from "~/lib/extract-id";
import { useToast } from "~/components/ui/use-toast";


export default function CallPage(){
    
    const params = useParams();
    const router = useRouter()
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const hmsActions = useHMSActions();
    const { toast } = useToast()
    const actions = useHMSActions();
    const roomName = Cookies.get("room-name");
    const roomId = Cookies.get("room-id"); // This is your call UUID
    const unAuthUsername = Cookies.get("username");
    const peers = useHMSStore(selectPeers);
    const [planId, setPlanId] = React.useState<string | null>(null);
    // Fetch the call from backend to get hmsRoomId
    const [hmsRoomId, setHmsRoomId] = React.useState<string | null>(null);

    React.useEffect(() => {
      async function fetchCall() {
        if (!roomId) return;
        const res = await fetch(`/api/call/get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callId: roomId }),
        });
        if (res.ok) {
          const data = await res.json();
          // Debug: log the returned call object
          console.log("fetchCall response:", data);
          setHmsRoomId(data.hmsRoomId);
        } else {
          // Debug: log error if call not found
          console.error("fetchCall failed, call not found for callId:", roomId);
        }
      }
      fetchCall();
    }, [roomId]);

    // Debug: log values before joining
    React.useEffect(() => {
      console.log("CallPage join debug:", {
        roomId,
        hmsRoomId,
        roomName,
        paramsSlug: params.slug,
      });
    }, [roomId, hmsRoomId, roomName, params.slug]);

    const joinCall = React.useCallback(async () => {
      if (!hmsRoomId) {
        console.error("Missing hmsRoomId, cannot join call.");
        return;
      }

      try {
        // Debug: log payload sent to /api/call/code
        console.log("Sending to /api/call/code:", {
          roomId: roomId,
          hmsRoomId: hmsRoomId,
          callName: roomName ?? params.slug,
        });

        const roomCodeResponse = await fetch(`/api/call/code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: roomId,
            hmsRoomId: hmsRoomId,
            callName: roomName ?? params.slug,
          }),
        });

        if (!roomCodeResponse.ok) {
          const errJson = await roomCodeResponse.json().catch(() => null);
          console.error("Error from /api/call/code:", errJson);
          throw new Error("Room code response not OK");
        }

        const codeResponse = (await roomCodeResponse.json()) as {
          success: boolean;
          code?: string;
          error?: string;
        };

        if (!codeResponse.success || !codeResponse.code) {
          console.error("Room code error:", codeResponse);
          throw new Error(codeResponse.error || "Missing room code");
        }

        const roomCode = codeResponse.code;
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

        // Actually join the room!
        await hmsActions.join({
          userName: unAuthUsername || (params.slug?.toString() ?? "Guest"),
          authToken,
        });
        // ... rest of your join logic
      } catch (error) {
        console.error(error);
        toast({
          title: "Something went wrong.",
          description: "This call cannot be joined. Please try again.",
          variant: "destructive",
        });
        router.replace("/calls");
      }
    }, [hmsRoomId, roomId, roomName, params.slug, hmsActions, toast, router]);

    const leaveCall = React.useCallback(async () => {
        
        const response = await fetch(`/api/call/leave`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callName: roomName ? roomName : extractId(params.slug as string),
              roomId: roomId,
            }),
        })
      
        if(!response.ok){
              toast({
                  title: "Something went wrong.",
                  description: "Your call cannot be left. Please try again.",
                  variant: "destructive",
              })
        } 
          
        await actions.leave();
        
    }, [roomName, params.slug, roomId, actions, toast]);

    // Fetch user's subscription plan for this call
    React.useEffect(() => {
        async function fetchPlan() {
            try {
                const res = await fetch(`/api/subscription/plan`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setPlanId(data.planId); // expects { planId: "free" | ... }
                }
            } catch {
                    // fallback: treat as paid if error
            }
        }
        if (roomId) fetchPlan();
    }, [roomId]);

    // Enforce max participants for free plan
    React.useEffect(() => {
        if (planId === "free" && peers.length > 4) {
            toast({
                title: "Limit reached",
                description: "Free plan allows only 4 participants.",
                variant: "destructive",
            });
            void leaveCall();
        }
    }, [planId, peers.length, leaveCall, toast]);

    // Enforce 15 minute duration for free plan
    React.useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (planId === "free") {
            timer = setTimeout(() => {
                toast({
                    title: "Time limit reached",
                    description: "Free plan allows only 15 minutes per call.",
                    variant: "destructive",
                });
                void leaveCall(); // This will disconnect all users and end the call
            }, 15 * 60 * 1000); // 15 minutes
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [planId, leaveCall, toast]);

    React.useEffect(() => {
        if (hmsRoomId) {
            void joinCall();
        }
    }, [joinCall, hmsRoomId]);

    React.useEffect(() => {
        window.onunload = () => {
            if (isConnected) {
                void leaveCall();
            }
        };

    }, [isConnected, leaveCall]);


    return(
        <section className="flex flex-col w-full h-screen overflow-hidden bg-neutral-950 text-gray-200">
            {/* Show Conference only when connected */}
            {isConnected ? <Conference /> : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg text-yellow-400">Connecting to meeting...</p>
                </div>
            )}
            <CallFooter/>
        </section>
    )
}
