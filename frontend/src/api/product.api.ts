import apiClient from "./client";

import type {
    Product,
    ProductVariant,
} from "../types/product";

export async function getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
        "/products",
    );

    return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
    const response = await apiClient.get<Product>(
        `/products/${productId}`,
    );

    return response.data;
}

export async function getProductVariants(
    productId: string,
): Promise<ProductVariant[]> {
    const response = await apiClient.get<ProductVariant[]>(
        `/products/${productId}/variants`,
    );

    return response.data;
}