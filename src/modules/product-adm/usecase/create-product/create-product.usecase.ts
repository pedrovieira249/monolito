import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { CreateProductInputDTO, CreateProductOutputDTO } from "./create-product.dto";

export default class CreateProductUseCase {
    private readonly _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: CreateProductInputDTO): Promise<CreateProductOutputDTO> {
        const props = {
            id: input.id ? new Id(input.id) : new Id(),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock,
        };

        const product = new Product(props);

        await this._productRepository.create(product);
        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }
}