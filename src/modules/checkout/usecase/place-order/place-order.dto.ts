export interface PlaceOrderInputDTO {
    clientId: string;
    products: {
        productId: string;
        quantity: number;
    }[];
}

export interface PlaceOrderOutputDTO {
    id: string;
    clientId: string;
    invoiceId: string | null;
    total: number;
    products: {
        productId: string;
        quantity: number;
    }[];
    status: string;
}