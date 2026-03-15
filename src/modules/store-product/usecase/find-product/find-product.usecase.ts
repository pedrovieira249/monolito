import ProductGateway from "../../gateway/product-gateway";
import { FindProductsInputDTO, FindProductsOutputDTO } from "./find-product.dto";

export default class FindProductUseCase {
    constructor(private readonly productGateway: ProductGateway) {}

    async execute(input: FindProductsInputDTO): Promise<FindProductsOutputDTO> {
        const product = await this.productGateway.findById(input.id);
        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
            stock: product.stock,
        };
    }
}