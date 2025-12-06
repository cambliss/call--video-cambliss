/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as React from "react";
import { useAVToggle, useHMSActions } from "@100mslive/react-sdk";
import {
  MicOffIcon,
  MicOnIcon,
  VideoOffIcon,
  VideoOnIcon,
  HangUpIcon,
  ShareScreenIcon,
} from "@100mslive/react-icons";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { extractId } from "~/lib/extract-id";
import useClipboard from "~/hooks/use-copy";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import RejoinCall from "./rejoin-call";

export default function CallFooter() {
  const {
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleAudio,
    toggleVideo,
  } = useAVToggle();

  const actions = useHMSActions();
  const { toast } = useToast();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);
  const [showRejoinPopup, setShowRejoinPopup] = React.useState(false);

  const params = useParams();
  const roomId = Cookies.get("room-id");
  const roomName = Cookies.get("room-name");

  const { copyToClipboard } = useClipboard();

  // 🔁 Handle screen share toggle directly on click
  const handleToggleScreenShare = async () => {
    const nextState = !isScreenShareEnabled;

    try {
      await actions.setScreenShareEnabled(nextState);
      setIsScreenShareEnabled(nextState);
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: nextState
          ? "Your screen cannot be shared. Please try again."
          : "There is an issue disabling screen share. Please try again.",
        variant: "destructive",
      });
    }
  };

  // 🔗 Handle invite link copy
  const handleCopyInviteLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      toast({
        title: "Copied to clipboard",
        description: "The invite link has been copied to your clipboard.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="rounded-lg flex items-center mt-auto justify-center sm:justify-start px-5 py-8">
      <div className="grid grid-cols-5 gap-3">
        {/* Mic toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleAudio}
          className="rounded-full flex justify-center items-center bg-neutral-800 py-6 px-4"
        >
          {isLocalAudioEnabled ? (
            <MicOnIcon color="white" width={20} height={20} />
          ) : (
            <MicOffIcon color="white" width={20} height={20} />
          )}
        </Button>

        {/* Video toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleVideo}
          className="rounded-full flex justify-center items-center py-6 px-4 bg-neutral-800"
        >
          {isLocalVideoEnabled ? (
            <VideoOnIcon color="white" width={20} height={20} />
          ) : (
            <VideoOffIcon color="white" width={20} height={20} />
          )}
        </Button>

        {/* Screen share toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleScreenShare}
          className="rounded-full flex justify-center items-center py-6 px-4 bg-neutral-800"
        >
          <ShareScreenIcon color="white" width={20} height={20} />
        </Button>

        {/* Copy invite link */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyInviteLink}
          className="rounded-full flex justify-center items-center py-6 px-4 bg-neutral-800"
        >
          <Icons.invite color="white" width={20} height={20} />
        </Button>

        {/* Hang up / Rejoin popup */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setShowRejoinPopup(true);
          }}
          className="rounded-full flex justify-center py-6 bg-red-500"
        >
          <HangUpIcon color="white" width={25} height={25} />
        </Button>
      </div>

      {showRejoinPopup && (
        <RejoinCall
          roomName={roomName ? roomName : extractId(params.slug as string)}
          stayOnScreenHandler={() => setShowRejoinPopup(false)}
          roomId={roomId as string}
        />
      )}
    </footer>
  );
}
