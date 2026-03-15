import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { UpdateProductInputDTO, UpdateProductOutputDTO } from "./update-product.dto";

export default class UpdateProductUseCase {
    private readonly _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: UpdateProductInputDTO): Promise<UpdateProductOutputDTO> {
        const product = new Product({
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock,
        });

        await this._productRepository.update(input.id, product);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
        };
    }
}
