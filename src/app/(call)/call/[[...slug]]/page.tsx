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
        // Ensure callName is always a string, not an array
        let callNameValue = roomName;
        if (Array.isArray(params.slug)) {
          callNameValue = params.slug[0] ?? "";
        } else if (!callNameValue) {
          callNameValue = params.slug?.toString() ?? "";
        }

        console.log("Sending to /api/call/join:", {
          roomId: roomId,
          hmsRoomId: hmsRoomId,
          callName: callNameValue,
          userName: unAuthUsername || callNameValue || "Guest",
        });

        const joinResponse = await fetch(`/api/call/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: roomId,
            hmsRoomId: hmsRoomId,
            callName: callNameValue,
            userName: unAuthUsername || callNameValue || "Guest",
          }),
        });

        // Log status and raw response for debugging
        console.log("joinResponse status:", joinResponse.status);
        const rawText = await joinResponse.text();
        console.log("Raw /api/call/join response:", rawText);

        let codeResponse: { success: boolean; code?: string; error?: string } = { success: false };
        try {
          codeResponse = JSON.parse(rawText);
        } catch (e) {
          console.error("Failed to parse /api/call/join response:", rawText);
        }

        if (!joinResponse.ok) {
          // Show backend error in toast for easier debugging
          toast({
            title: "Server error",
            description: codeResponse.error || rawText || "Internal Server Error",
            variant: "destructive",
          });
          console.error("Error from /api/call/join:", codeResponse);
          router.replace("/calls");
          return;
        }

        // Fix: If /api/call/join returns participant info, you need to call /api/call/code next
        let roomCode = codeResponse.code ?? "";
        if (!roomCode) {
          const roomCodeRes = await fetch(`/api/call/code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomId: roomId,
              hmsRoomId: hmsRoomId,
              callName: roomName ?? params.slug,
            }),
          });
          const roomCodeJson = await roomCodeRes.json();
          console.log("Raw /api/call/code response:", roomCodeJson);

          if (!roomCodeRes.ok || !roomCodeJson.success || !roomCodeJson.code) {
            console.error("Room code error:", roomCodeJson);
            throw new Error(roomCodeJson.error || "Missing room code");
          }
          roomCode = roomCodeJson.code;
        }
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

        // Actually join the room!
        await hmsActions.join({
          userName: unAuthUsername || (params.slug?.toString() ?? "Guest"),
          authToken,
        });
        // ... rest of your join logic
      } catch (error) {
        // Better error messages based on error type
        if (error instanceof Error) {
          if (error.message.includes("PLAN_LIMIT_EXCEEDED")) {
            toast({
              title: "Meeting is full",
              description: "Upgrade the host's plan to add more participants.",
              variant: "destructive",
            });
            router.replace("/calls?upgrade=1");
          } else {
            toast({
              title: "Connection failed",
              description: error.message,
              variant: "destructive",
            });
          }
        }
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

        // Always redirect to pricing/plans section after leaving a call
        router.replace("/calls?upgrade=1");
    }, [roomName, params.slug, roomId, actions, toast, router]);

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
                void leaveCall();
                router.replace("/calls?upgrade=1"); // Redirect to pricing/plans section
            }, 15 * 60 * 1000); // 15 minutes
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [planId, leaveCall, toast, router]);

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
            {isConnected ? (
                <>
                    <Conference />
                    <CallFooter/>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg text-yellow-400">Connecting to meeting...</p>
                </div>
            )}
        </section>
    )
  };