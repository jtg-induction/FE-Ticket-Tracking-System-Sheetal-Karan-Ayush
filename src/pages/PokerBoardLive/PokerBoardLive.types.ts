import { PokerEvent } from "@features/pokerPlanning/livePokerBoard/pokerBoard.schema";
import { SessionResponseType } from "@features/pokerPlanning/pokerSession/session.schemas";

export type PokerBoardProps = {
    session: SessionResponseType;
    sendAction: (action: PokerEvent['event'], payload?: Record<string, unknown>) => void;
    lastJsonMessage: PokerEvent | null;
    onBack?: () => void;
}
