
export type CommentType = {
    id: number,
    user: string,
    commentText: string,
    parentComment: number | null,
    time: string,
}