export interface CreateProductInputDTO {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface CreateProductOutputDTO {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}