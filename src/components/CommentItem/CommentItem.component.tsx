import { useState } from 'react';

import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, Divider, IconButton,Stack,TextField, Typography } from '@mui/material';

import { useAuthStore } from '@features/auth';
import { useCreateCommentMutation } from '@features/comments/createComment/useCreateCommentMutation';
import { useDeleteCommentMutation } from '@features/comments/deleteComment/useDeleteCommentMutation';
import { useGetAllComments } from '@features/comments/getAllComments/useGetAllComments';
import { useUpdateCommentMutation } from '@features/comments/updateComment/useUpdateCommentMutation';
import { MAX_COMMENT_LENGTH } from '@pages/TicketDetails/TicketDetails.util';

import { DATE_FORMAT } from './CommentItem.constants';
import { CommentItemProps } from './CommentItem.types';

export const CommentItem = ({
    comment,
}: CommentItemProps) => {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');


    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.commentText);
    const [commentText, setCommentText] = useState(comment.commentText);
    
    const createCommentMutation = useCreateCommentMutation()
    const updateCommentMutation = useUpdateCommentMutation()
    const deleteCommentMutation = useDeleteCommentMutation()
    const { user } = useAuthStore()
    const { projectKey, ticketKey } = useParams<{
        projectKey: string;
        ticketKey: string;
    }>();

    const handleSaveEdit = () => {
        const payload = {
            content: editedText,
            comment_id: comment.id,
            ticket_id: comment.ticketId,
            ticket_key: ticketKey as string,
            project_key: projectKey as string,
        }
        updateCommentMutation.mutate(payload)
        setCommentText(editedText)
        setIsEditing(false);
    };

    const { data: replies, fetchNextPage: fetchRepliesNextPage, hasNextPage: hasRepliesNextPage } = useGetAllComments(
    {
        ticket_key: ticketKey as string,
        limit: 10,
        project_key: projectKey as string,
        parent_comment_id: comment.id,
    },
        showReply
    );

    const handleAddReply = () => {
        const payload = {
            content: replyText,
            project_key: projectKey as string,
            ticket_key: ticketKey as string,
            parent_comment_id: comment.id,
        }
        createCommentMutation.mutate(payload, {
            onSuccess: () => setReplyText('')
        });
    }

    const handleDeleteOnClick = () => {
        const payload = {
            comment_id: comment.id,
            ticket_key: ticketKey as string,
            project_key: projectKey as string,
        }
        deleteCommentMutation.mutate(payload)
    };

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
            >   
                <Box display='flex' alignItems="center" gap={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {comment.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {dayjs(comment.time).format(DATE_FORMAT)}
                    </Typography>
                </Box>
                {comment.user == user?.email && 
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
                            <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" onClick={handleDeleteOnClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                }
            </Box>

            {/* Toggle between display text and input box */}
            <Box marginTop={2} marginBottom={4}>
                {isEditing ? (
                    <Box display="flex" gap={2} alignItems='center'>
                        <TextField
                            size="small"
                            fullWidth
                            value={editedText}
                            multiline
                            minRows={1}
                            maxRows={4}
                            onChange={(e) => setEditedText(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSaveEdit}
                            disabled={!editedText.trim() || editedText.length > MAX_COMMENT_LENGTH}
                        >
                            Save
                        </Button>
                    </Box>
                ) : (
                    <Typography variant="subtitle1" sx={{ whiteSpace: 'pre-line' }}>{ commentText }</Typography>
                )}
            </Box>

            {!comment.parentComment && (
                <Button size="small" onClick={() => setShowReply(!showReply)}>
                    <Typography variant="caption">{showReply ? 'Close' : 'Replies'}</Typography>
                </Button>
            )}

            {showReply && (
                <Box display="flex" gap={2} mt={2} alignItems='center'>
                    <TextField
                        size="small"
                        fullWidth
                        value={replyText}
                        multiline
                        minRows={1}
                        maxRows={4}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && !e.shiftKey && handleAddReply()
                        }
                        placeholder="Write reply..."
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddReply}
                        disabled={!replyText.trim() || replyText.length > MAX_COMMENT_LENGTH}
                    >
                        Send
                    </Button>
                </Box>
            )}

            {showReply && 
                <Stack spacing={3} paddingLeft={8} mt={4} width='100%'>
                    {
                        replies?.pages?.length && (
                            <>
                                {replies.pages.flatMap((page) => page.comments).map((reply) => (
                                    <Box key={reply.id}>
                                        <Divider />
                                        <CommentItem
                                            comment={{
                                                id: reply.id,
                                                commentText: reply.comment,
                                                user: reply.email,
                                                ticketId: reply.ticket_id,
                                                parentComment: reply.parent_comment_id,
                                                time: reply.created_at,
                                            }}
                                        />
                                    </Box>
                                ))}
                                {hasRepliesNextPage &&
                                    <Button size="small" onClick={() => void fetchRepliesNextPage()}>
                                        <Typography variant="caption">{'Load More'}</Typography>
                                    </Button>
                                }
                            </>
                        )
                    }
                </Stack>
            }
        </Box>
    );
};
