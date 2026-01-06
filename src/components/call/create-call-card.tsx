/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React from "react";
import CardShell from "../layout/card-shell";
import { useRouter } from "next/navigation";
import { useCallId } from "~/context/call-id-context";
import { useToast } from "../ui/use-toast";
import { getSession } from "next-auth/react";
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
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  const [scheduledInviteLink, setScheduledInviteLink] = React.useState("");
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [scheduledTime, setScheduledTime] = React.useState("");
  const [scheduledTimeZone, setScheduledTimeZone] = React.useState(
    () => Intl?.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [inviteeInput, setInviteeInput] = React.useState("");
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [scheduleError, setScheduleError] = React.useState<string | null>(null);
  const { copyToClipboard } = useClipboard();

  // Use public env var safely on client
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const inviteLink = appUrl ? `${appUrl}/call/${callId}` : "";
  const displayInviteLink = scheduledInviteLink;

  const timeZoneOptions = React.useMemo(() => {
    const intl = Intl as typeof Intl & {
      supportedValuesOf?: (input: string) => string[];
    };
    const supported = intl.supportedValuesOf ? intl.supportedValuesOf("timeZone") : [];
    const unique = new Set<string>(["UTC", scheduledTimeZone, ...supported]);
    return Array.from(unique).sort();
  }, [scheduledTimeZone]);

  function resetScheduleForm() {
    setScheduledDate("");
    setScheduledTime("");
    setInviteeInput("");
    setScheduleError(null);
    setScheduledInviteLink("");
    setScheduledTimeZone(Intl?.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }

  function toUTCISOString(date: string, time: string, timeZone: string): string {
    // Convert user-selected date/time in a specific timezone into a UTC ISO string.
    const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
    const [hour = 0, minute = 0] = time.split(":" ).map(Number);
    const target = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(target);
    const mapped: Record<string, string> = {};
    for (const part of parts) {
      if (part.type !== "literal") {
        mapped[part.type] = part.value;
      }
    }

    const zonedTime = Date.UTC(
      Number(mapped.year),
      Number(mapped.month) - 1,
      Number(mapped.day),
      Number(mapped.hour),
      Number(mapped.minute),
      Number(mapped.second)
    );

    const offset = zonedTime - target.getTime();
    return new Date(target.getTime() - offset).toISOString();
  }

  function parseInvitees(): string[] {
    return inviteeInput
      .split(/[\s,]+/)
      .map((email) => email.trim())
      .filter(Boolean);
  }

  async function sendInvites(
    recipients: string[],
    linkToSend: string,
    scheduledIso: string
  ) {
    if (!recipients.length) return;

    const currentUser = await getSession();
    if (
      !currentUser ||
      typeof currentUser.user?.email !== "string" ||
      typeof currentUser.user?.name !== "string"
    ) {
      toast({
        title: "Unable to send invites",
        description: "You must be logged in to send email invites.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients,
        link: linkToSend,
        senderImage: currentUser.user.image,
        invitedByUsername: currentUser.user.name,
        invitedByEmail: currentUser.user.email,
        scheduledStartTime: scheduledIso,
        scheduledTimeZone,
      }),
    });

    if (!response.ok) {
      toast({
        title: "Invite sending failed",
        description: "We could not send one or more invites. Please retry.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Invites sent",
        description: `Invites emailed to ${recipients.length} recipient(s).`,
      });
    }
  }

  async function createCall(): Promise<boolean> {
    return (await createCallWithSchedule()).success;
  }

  async function createCallWithSchedule(
    scheduledStartTime?: string
  ): Promise<{ success: boolean; inviteLink?: string; error?: string }> {
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
          scheduledStartTime,
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
        return { success: false, error: result.error };
      }

      return { success: true, inviteLink: result.inviteLink ?? inviteLink };
    } catch (error) {
      console.error("Error creating call:", error);
      toast({
        title: "Something went wrong.",
        description: "Your call cannot be created. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Failed to create call" };
    } finally {
      setIsCallLoading(false);
    }
  }

  async function handleScheduleSubmit() {
    setScheduleError(null);

    if (!scheduledDate || !scheduledTime) {
      setScheduleError("Pick a date and time before scheduling.");
      return;
    }

    const scheduledIso = toUTCISOString(
      scheduledDate,
      scheduledTime,
      scheduledTimeZone
    );

    if (new Date(scheduledIso).getTime() < Date.now()) {
      setScheduleError("Selected time is in the past. Choose a future slot.");
      return;
    }

    setIsScheduling(true);

    const creation = await createCallWithSchedule(scheduledIso);
    if (!creation.success || !creation.inviteLink) {
      setIsScheduling(false);
      return;
    }

    setScheduledInviteLink(creation.inviteLink);

    const emails = parseInvitees();
    if (emails.length) {
      await sendInvites(emails, creation.inviteLink, scheduledIso);
    }

    toast({
      title: "Call scheduled",
      description: "Your call link is ready and invites have been handled.",
    });

    setIsScheduling(false);
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
              setShowCallDropdown(false);
              setShowScheduleDialog(true);
            }}
          >
            Create call for later
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={showScheduleDialog}
        onOpenChange={(open) => {
          setShowScheduleDialog(open);
          if (!open) resetScheduleForm();
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Schedule a call for later</DialogTitle>
            <DialogDescription>
              Pick a date, universal time zone, and time. We will create the link
              and email everyone you list.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="schedule-timezone">Universal time zone</Label>
                <select
                  id="schedule-timezone"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={scheduledTimeZone}
                  onChange={(e) => setScheduledTimeZone(e.target.value)}
                >
                  {timeZoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="schedule-time">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="invitees">Invite by email (comma or space separated)</Label>
              <textarea
                id="invitees"
                value={inviteeInput}
                onChange={(e) => setInviteeInput(e.target.value)}
                placeholder="alice@example.com, bob@example.com"
                className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Add as many recipients as you need. We&apos;ll email them the link after scheduling.
              </p>
            </div>

            {scheduleError && (
              <p className="text-sm text-red-500">{scheduleError}</p>
            )}

            <div className="space-y-2 rounded-md border border-dashed border-muted px-3 py-2">
              <Label htmlFor="scheduled-link">Call link</Label>
              <Input
                id="scheduled-link"
                disabled
                value={displayInviteLink}
                placeholder="Link will appear after scheduling"
                className="w-full"
              />
              <Button
                size="sm"
                variant="secondary"
                className="w-full md:w-fit"
                disabled={!displayInviteLink}
                onClick={async () => {
                  if (!displayInviteLink) return;
                  await copyToClipboard(displayInviteLink);
                  toast({
                    title: "Copied to clipboard",
                    description: "The invite link has been copied to your clipboard.",
                  });
                }}
              >
                Copy link
              </Button>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowScheduleDialog(false);
                  resetScheduleForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="min-w-[180px]"
                onClick={handleScheduleSubmit}
                disabled={isScheduling || isCallLoading}
              >
                {(isScheduling || isCallLoading) && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Schedule &amp; send invites
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
