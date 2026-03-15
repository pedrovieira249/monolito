import ProductGateway from "../../gateway/product.gateway";
import { DeleteProductInputDTO, DeleteProductOutputDTO } from "./delete-product.dto";

export default class DeleteProductUseCase {
    private readonly _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: DeleteProductInputDTO): Promise<DeleteProductOutputDTO> {
        await this._productRepository.delete(input.id);

        return { id: input.id };
    }
}
