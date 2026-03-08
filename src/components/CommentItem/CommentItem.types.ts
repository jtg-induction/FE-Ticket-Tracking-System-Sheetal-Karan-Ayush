export type Comment = {
    id: number;
    commentText: string;
    user: string;
    parentComment?: number|null;
    time?:string;
}

export type CommentItemProps = {
    comment: Comment;
    replies: Comment[];
    onReply?: (text: string, parentId: number) => void;
}