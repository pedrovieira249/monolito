import Product from "../domain/product.entity";

export interface CreateProductInputDTO {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

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

export interface DeleteProductInputDTO {
    id: string;
}

export interface DeleteProductOutputDTO {
    id: string;
}

export interface CheckStockInputDTO {
    productId: string;
    stock: number;
}

export interface CheckStockOutputDTO {
    productId: string;
    stock: number;
}

export default interface ProductAdmFacadeInterface {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    create(product: CreateProductInputDTO): Promise<void>;
    update(input: UpdateProductInputDTO): Promise<UpdateProductOutputDTO>;
    delete(input: DeleteProductInputDTO): Promise<DeleteProductOutputDTO>;
    checkStock(input: CheckStockInputDTO): Promise<CheckStockOutputDTO>;
}