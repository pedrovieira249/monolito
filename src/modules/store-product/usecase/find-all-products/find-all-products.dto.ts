export interface FindAllProductsDTO {
    products: {
        id: string;
        name: string;
        description: string;
        salePrice: number;
        stock: number;
    }[];
}