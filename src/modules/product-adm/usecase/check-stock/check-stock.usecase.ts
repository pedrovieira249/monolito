import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDTO, CheckStockOutputDTO } from "./check-stock.dto";

export default class CheckStockUseCase {
    private readonly _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
        const product = await this._productRepository.findById(input.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return {
            productId: product.id.id,
            stock: product.stock
        };
    }
}