export default interface ProductGateway {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(product: any): Promise<void>;
    update(id: string, product: any): Promise<void>;
    delete(id: string): Promise<void>;
}