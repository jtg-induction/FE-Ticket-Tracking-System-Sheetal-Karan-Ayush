export type EstimationDeckProps = {
    options: readonly number[];
    activeTicketId: number | null | undefined;
    onVote: (points: number) => void;
}
