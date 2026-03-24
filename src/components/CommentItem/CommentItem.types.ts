export type Comment = {
    id: number;
    commentText: string;
    user: string;
    ticketId: number;
    parentComment?: number | null;
    time?: string;
};

export type CommentItemProps = {
    comment: Comment;
    onReply?: (text: string, parentId: number) => void;
};
