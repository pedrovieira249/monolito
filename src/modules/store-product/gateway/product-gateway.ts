import Product from "../domain/product.entity"

export default interface ProductGateway {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product>;
}