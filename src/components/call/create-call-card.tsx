/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React from "react";
import CardShell from "../layout/card-shell";
import { useRouter } from "next/navigation";
import { useCallId } from "~/context/call-id-context";
import { useToast } from "../ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { Icons } from "../ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useClipboard from "~/hooks/use-copy";

export interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonIcon: React.ReactNode;
  loadingIcon: React.ReactNode;
  selectedPlan?: "free" | "starter" | "professional" | "enterprise";
}

export default function CreateCallCard(card: CardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { callId } = useCallId();
  const [isCallLoading, setIsCallLoading] = React.useState(false);
  const [showCallDropdown, setShowCallDropdown] = React.useState(false);
  const [showCallLinkDialog, setShowCallLinkDialog] = React.useState(false);
  const { copyToClipboard } = useClipboard();

  // Use public env var safely on client
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const inviteLink = appUrl ? `${appUrl}/call/${callId}` : "";

  async function createCall(): Promise<boolean> {
    try {
      setIsCallLoading(true);

      const response = await fetch(`/api/call/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callName: callId,
          selectedPlan: card.selectedPlan,
        }),
      });

      const result = await response.json();
      console.log("createCall response:", result);

      if (!response.ok || !result.success) {
        toast({
          title: "Something went wrong.",
          description:
            result.error || "Your call cannot be created. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error creating call:", error);
      toast({
        title: "Something went wrong.",
        description: "Your call cannot be created. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCallLoading(false);
    }
  }

  return (
    <div className="relative">
      <CardShell
        card={card}
        func={() => setShowCallDropdown(true)}
        isLoading={isCallLoading}
      />

      <DropdownMenu open={showCallDropdown} onOpenChange={setShowCallDropdown}>
        <DropdownMenuTrigger
          asChild
          className="absolute right-7 top-10"
        >
          <Button
            variant="ghost"
            className={cn(
              "invisible flex items-center gap-3 hover:bg-transparent"
            )}
          >
            Create
            <Icons.add color="#0F172A" className="ml-2" width={16} height={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={async () => {
              const ok = await createCall();
              setShowCallDropdown(false);
              if (!ok) return;

              router.push(`/call/${callId}`);
            }}
          >
            Start a call now
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async () => {
              const ok = await createCall();
              setShowCallDropdown(false);
              if (!ok) return;

              setShowCallLinkDialog(true);
            }}
          >
            Create call for later
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCallLinkDialog} onOpenChange={setShowCallLinkDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Here is the link to your meeting</DialogTitle>
            <DialogDescription>
              This link is your gateway to connect with your guests at the
              appointed time. Make sure to copy and save this link, as you&apos;ll
              need it to join the call too.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-2 flex w-full flex-col items-end justify-between">
            <div className="my-4 w-full space-y-1">
              <Label htmlFor="link">Call Link</Label>
              <Input
                disabled
                value={inviteLink}
                placeholder={inviteLink || "Meeting link will appear here"}
                required
                id="link"
                className={cn("w-full border-ring")}
              />
            </div>
            <Button
              size="lg"
              className="mt-2 ml-auto w-full rounded-md font-normal md:mt-0 md:ml-2 md:w-fit"
              onClick={async () => {
                if (!inviteLink) return;
                await copyToClipboard(inviteLink);
                toast({
                  title: "Copied to clipboard",
                  description:
                    "The invite link has been copied to your clipboard.",
                  variant: "default",
                });
              }}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
