export type RoomCodeResponse = {
    code: string;
}

export type EmailProps = {
    recipient?: string;
    recipients?: string[];
    link: string;
    recipientUsername?: string;
    senderImage?: string;
    invitedByUsername: string;
    invitedByEmail: string;
    scheduledStartTime?: string;
    scheduledTimeZone?: string;
}