export interface Product {
    id: string;
    vendor_id: string;
    name: string;
    slug: string;
    description: string | null;
    category_id: string;
    is_active: boolean;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    sku: string;
    brand: string | null;
    manufacturer: string | null;
    color: string | null;
    size: string | null;
    unit_price: number;
    is_active: boolean;
}