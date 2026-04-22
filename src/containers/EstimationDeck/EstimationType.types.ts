import { ParticipantType } from "@features/pokerPlanning/livePokerBoard/pokerBoard.schema";

export type EstimationDeckProps = {
    options: readonly number[];
    activeTicketId: number | null | undefined;
    onVote: (points: number) => void;
    participants?: ParticipantType[];
    currentUserId?: number;
}
