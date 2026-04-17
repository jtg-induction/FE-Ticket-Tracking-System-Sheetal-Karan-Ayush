import { PokerEvent } from "@features/pokerPlanning/livePokerBoard/pokerBoard.schema";

export type BoardHeaderProps = {
    projectKey?: string | null,
    timeleft: number | null;
    sendAction: (event: PokerEvent['event'], payload: Record<string, unknown>) => void;
}
