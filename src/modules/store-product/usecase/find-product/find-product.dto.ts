export interface FindProductsInputDTO {
    id: string;
}

export interface FindProductsOutputDTO {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
    stock: number;
}