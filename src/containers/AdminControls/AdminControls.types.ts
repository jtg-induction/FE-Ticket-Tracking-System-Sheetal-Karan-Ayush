import { ParticipantType, PokerEvent } from "@features/pokerPlanning/livePokerBoard/pokerBoard.schema";

export interface AdminControlsProps {
    activeTicketId: number | null | undefined;
    onReveal: () => void;
    onSkip: () => void;
    onConfirm: (estimate: number) => void;
    participants: ParticipantType[];
    allowedValues: readonly number[];
    lastJsonMessage: PokerEvent | null,
    isRevealed: boolean,
}
