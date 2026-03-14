import type { SignupInput } from '@api';

export type OtpInput = SignupInput & { otp: number };
