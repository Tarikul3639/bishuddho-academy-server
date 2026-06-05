export interface EnrollmentWithUser {
    _id: string;

    userId: {
        _id: string;
        name: string;
        email: string;
    };

    status: string;

    paymentSummary: {
        method: "bkash" | "nagad" | "cash";
        trxId?: string;
        amount: number;
        paidAt: string;
    };
}