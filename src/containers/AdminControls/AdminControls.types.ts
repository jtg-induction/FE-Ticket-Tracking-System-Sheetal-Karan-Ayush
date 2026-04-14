import { ParticipantType } from "@features/pokerPlanning/pokerBoard/pokerBoard.schema";

export interface AdminControlsProps {
    activeTicketId: number | null | undefined;
    onReveal: () => void;
    onSkip: () => void;
    onConfirm: (estimate: number) => void;
    participants: ParticipantType[];
    allowedValues: readonly number[];
}
