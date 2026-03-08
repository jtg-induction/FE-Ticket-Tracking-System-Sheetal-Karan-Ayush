import { useState } from 'react';
import { CommentItemProps } from './CommentItem.types';
import { Box, Button, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';


export const CommentItem = ({ comment, replies, onReply }: CommentItemProps) => {

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleSendClick = () => {
        if (replyText.trim() && onReply) {
            onReply(replyText, comment.id);
            setReplyText("");
            setShowReply(false);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight="bold">{comment.user}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {dayjs(comment.time).format("DD-MM-YYYY")}
                </Typography>
            </Box>

            <Typography
                variant="body2"
            >{comment.commentText}</Typography>

            {!comment.parentComment && (
                <Button size="small" onClick={() => setShowReply(!showReply)}>
                    {showReply ? 'Cancel' : 'Reply'}
                </Button>
            )}

            {showReply && (
                <Box
                    display="flex"
                    gap={2}
                >
                    <TextField
                        size="small"
                        fullWidth
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
                        placeholder="Write reply..."
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendClick}
                        disabled={!replyText.trim()}
                    >
                        Send
                    </Button>
                </Box>
            )}

            {replies.length > 0 && (
                <Box sx={{
                    paddingLeft: 4,
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                }}>
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={[]}
                            onReply={onReply}
                        />
                    ))}
                </Box>
            )}


        </Box>
    );
};