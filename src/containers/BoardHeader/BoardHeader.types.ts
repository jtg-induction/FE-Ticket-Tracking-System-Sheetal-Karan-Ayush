import { PokerEvent } from "@features/pokerPlanning/pokerBoard/pokerBoard.schema";

export type BoardHeaderProps = {
    timeleft: number | null;
    sendAction: (event: PokerEvent['event'], payload: Record<string, unknown>) => void;
}
