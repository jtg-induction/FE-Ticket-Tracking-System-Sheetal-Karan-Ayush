import { useState } from "react";

import { Box, Button, Card, Divider, Stack, TextField, Typography } from "@mui/material";

import { CommentItem } from "@components";
import { useCreateCommentMutation } from "@features/comments/createComment/useCreateCommentMutation";
import { useGetAllComments } from "@features/comments/getAllComments/useGetAllComments";
import { useQueryClient } from "@tanstack/react-query";

import { COMMENTS_COUNT_LIMIT, MAX_COMMENT_LENGTH } from "./commentCard.config";
import { CommentCardProps } from "./commentCard.types";

     

export const CommentCard = ({ticketKey, projectKey}: CommentCardProps) => {

    const createCommentMutation = useCreateCommentMutation();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: comments, fetchNextPage: fetchCommentsNextPage, hasNextPage: hasCommentsNextPage, isLoading } = useGetAllComments({
        limit: COMMENTS_COUNT_LIMIT,
        ticket_key: ticketKey,
        parent_comment_id: null,
    });
    
    const handleAddComment = () => {
        const payload = {
            content: newComment,
            project_key: projectKey,
            ticket_key: ticketKey,
            parent_comment_id: null,
        }
        createCommentMutation.mutate(payload, {
            onSuccess: () => {
                setNewComment('');
                void queryClient.invalidateQueries({ queryKey: ['comments'] });
            },
        });
    }

    const allComments = comments?.pages.flatMap((p) => p.comments) ?? [];

    return ( 
        <Card
            sx={{
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: 'none',
            }}
        >
            <Typography variant="h3">Comments</Typography>

            {/* comment box */}
            <Box display="flex" gap={2} alignItems='center'>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={newComment}
                    multiline
                    minRows={1}
                    maxRows={4}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        
                        if (e.key === 'Enter' && !e.shiftKey) { 
                                handleAddComment();
                            }
                        }
                    }
                />
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || newComment.length > MAX_COMMENT_LENGTH}
                >
                    Comment
                </Button>
            </Box>

            {/* Comments List */}
            <Stack spacing={3}>
                {
                    allComments.length? (
                    <>
                        {allComments.map((comment) => (
                            <Box key={comment.id}>
                                <Divider />
                                <CommentItem
                                    comment={{
                                        id: comment.id,
                                        commentText: comment.comment,
                                        user: comment.email,
                                        ticketId: comment.ticket_id,
                                        parentComment: comment.parent_comment_id,
                                        time: comment.created_at,
                                    }}
                                />
                            </Box>
                        ))}
                        {hasCommentsNextPage &&
                            <Button size="small" onClick={() => void fetchCommentsNextPage()} disabled={isLoading}>
                                <Typography variant="caption">{isLoading ? 'Loading...' : 'Load More'}</Typography>
                            </Button>
                        }
                    </>
                    )
                    : (
                        <div>No comments</div>
                    )
                }
            </Stack>
        </Card>
    )
}
