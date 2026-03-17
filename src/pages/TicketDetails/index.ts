export { TicketDetails } from './TicketDetails.page';
export const comments = [
            {
                id: 1,
                user: 'First User',
                commentText: 'Ticket created and assigned to Tech Team.',
                parentComment: null,
                time: '2026-02-06T12:10:00Z',
            },
            {
                id: 2,
                user: 'Jane Doe',
                commentText: 'Checking the payment logs now.',
                parentComment: null,
                time: '2026-03-06T12:15:00Z',
            },
            {
                id: 3,
                user: 'Second User',
                commentText: 'Reply to first comment',
                parentComment: 1,
                time: '2026-03-06T12:55:00Z',
            },
            {
                id: 4,
                user: 'Second User',
                commentText: 'Fixed the issue',
                parentComment: 1,
                time: '2026-03-07T10:10:00Z',
            },
        ]
