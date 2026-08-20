import apiClient from "./client";

export interface PaymentResponse {
    id: string;
    rental_id: string;
    payment_type: string;
    status: string;
    amount: number;
    stripe_payment_id?: string;
    client_secret?: string;
}

export const createPayment = async (
    rentalId: string,
    amount: number,
    paymentType: string = "rental"
): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(`/rentals/${rentalId}/payments`, {
        payment_type: paymentType,
        amount,
    });
    return response.data;
};

export const verifyPayment = async (
    rentalId: string,
    paymentId: string
): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(
        `/rentals/${rentalId}/payments/${paymentId}/verify`
    );
    return response.data;
};

export const createLateFeePayment = async (rentalId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(`/rentals/${rentalId}/late-fee`);
    return response.data;
};

export const payLateFee = async (paymentId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(
        `/rentals/payments/${paymentId}/pay-late-fee`
    );
    return response.data;
};
