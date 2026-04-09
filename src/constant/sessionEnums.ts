export const SESSION_STATUS = {
    1: { label: 'Created', color: 'default' },
    2: { label: 'Running', color: 'success' },
    3: { label: 'Finished', color: 'error' },
} as const;


export const SCALE_TYPE = {
    1: 'Fibonacci',
    2: 'Linear',
    3: 'Even',
    4: 'Odd',
    5: 'Custom',
} as const;

export const POSSIBLE_ESTIMATE_VALUES = {
    1: [0, 1, 2, 3, 5, 8],
    2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    3: [0, 2, 4, 6, 8, 10],
    4: [0, 1, 3, 5, 7, 9],
} as const;
