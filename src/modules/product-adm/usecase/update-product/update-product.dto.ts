export interface UpdateProductInputDTO {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface UpdateProductOutputDTO {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}
