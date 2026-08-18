import apiClient from "./client";

export interface RentalCreateData {
    variant_id: string;
    start_at: string;
    end_at: string;
    quantity: number;
    unit_price?: number;
}

export interface Rental {
    id: string;
    status: string;
    start_at: string;
    end_at: string;
    rental_amount: number;
    deposit_amount: number;
    total_amount: number;
}

export interface RentalItemDetail {
    id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product_name: string;
    product_id?: string;
    variant_sku: string;
    variant_brand?: string;
    variant_color?: string;
    variant_size?: string;
}

export interface RentalDetail extends Rental {
    user_id: string;
    created_at?: string;
    items: RentalItemDetail[];
    payments?: Array<{
        id: string;
        payment_type: string;
        status: string;
        amount: number;
        stripe_payment_id?: string;
    }>;
}

export const createRental = async (data: RentalCreateData): Promise<Rental> => {
    const response = await apiClient.post<Rental>("/rentals/", data);
    return response.data;
};

export const getRentals = async (): Promise<RentalDetail[]> => {
    const response = await apiClient.get<RentalDetail[]>("/rentals/");
    return response.data;
};

export const getRentalById = async (rentalId: string): Promise<RentalDetail> => {
    const response = await apiClient.get<RentalDetail>(`/rentals/${rentalId}`);
    return response.data;
};

export const cancelRental = async (rentalId: string): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post<{ id: string; status: string }>(`/rentals/${rentalId}/cancel`);
    return response.data;
};

export const returnRental = async (rentalId: string): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post<{ id: string; status: string }>(`/rentals/${rentalId}/return`);
    return response.data;
};

export const getLateFee = async (rentalId: string): Promise<{ late_fee: number }> => {
    const response = await apiClient.get<{ late_fee: number }>(`/rentals/${rentalId}/late-fee`);
    return response.data;
};
