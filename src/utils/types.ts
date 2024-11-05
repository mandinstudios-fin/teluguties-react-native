export type CustomConfirmationResult = {
    verificationId: string | null;
    confirm: (verificationCode: string) => Promise<any>;
};