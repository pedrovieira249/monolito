import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product-gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const models = await ProductModel.findAll();

        return models.map(
            (model) =>
                new Product({
                    id: new Id(model.id),
                    name: model.name,
                    description: model.description,
                    salesPrice: model.salesPrice,
                    stock: model.stock,
                })
        );
    }

    async findById(id: string): Promise<Product> {
        const model = await ProductModel.findOne({ where: { id } });

        if (!model) {
            throw new Error("Product not found");
        }

        return new Product({
            id: new Id(model.id),
            name: model.name,
            description: model.description,
            salesPrice: model.salesPrice,
            stock: model.stock,
        });
    }
}