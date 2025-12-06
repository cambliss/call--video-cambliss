"use client";
import { signOut } from "next-auth/react";
import UserAvatarLabelGroup from "../user-avatar-label-group";
import { useToast } from "../ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

interface User {
  name: string;
  email: string;
  image: string;
}

interface DropdownProps {
  user: User;
}

export default function UserAccountDropdown({ user }: DropdownProps) {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-0 py-0 text-yellow-100 hover:bg-yellow-400/10 md:px-4 md:py-2"
        >
          <UserAvatarLabelGroup user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 border border-yellow-400/60 bg-black/95 text-yellow-50 shadow-xl"
        align="end"
      >
        <DropdownMenuLabel className="pb-1 text-xs uppercase tracking-wide text-yellow-300">
          Your account
        </DropdownMenuLabel>
        <div className="px-2 pb-2 text-xs text-yellow-300/80">
          <p className="font-medium truncate">{user.name}</p>
          <p className="truncate text-[11px] text-yellow-500/80">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-yellow-400/30" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled
            className="cursor-not-allowed text-yellow-500/60 focus:bg-yellow-400/5"
          >
            <Icons.avatar width="16" height="16" className="mr-2" />
            Profile (coming soon)
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled
            className="cursor-not-allowed text-yellow-500/60 focus:bg-yellow-400/5"
          >
            <Icons.settings width="16" height="16" className="mr-2" />
            Settings (coming soon)
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-yellow-400/30" />

        <DropdownMenuItem
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
          onClick={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            }).catch((error) => {
              console.error("Error signing out:", error);
              toast({
                title: "Error signing out",
                description: "Please try again.",
                variant: "destructive",
              });
            });
          }}
        >
          <Icons.logout width="16" height="16" className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
