import ProductGateway from "../../gateway/product-gateway";


export default class FindAllProductsUseCase {
    constructor(private readonly productGateway: ProductGateway) {}

    async execute(): Promise<any> {
        const products = await this.productGateway.findAll();
        return products;
    }
}