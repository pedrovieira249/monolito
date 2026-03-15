import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const models = await ProductModel.findAll();

        return models.map(
            (model) =>
                new Product({
                    id: new Id(model.id),
                    name: model.name,
                    description: model.description,
                    purchasePrice: model.purchasePrice,
                    stock: model.stock,
                })
        );
    }

    async findById(id: string): Promise<Product> {
        const model = await ProductModel.findOne({ where: { id } });

        if (!model) {
            throw new Error(`Product with id ${id} not found`);
        }

        return new Product({
            id: new Id(model.id),
            name: model.name,
            description: model.description,
            purchasePrice: model.purchasePrice,
            stock: model.stock,
        });
    }
    
    async create(product: Product): Promise<void> {
        await ProductModel.create({
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        });
    }

    async update(id: string, product: Product): Promise<void> {
        const [affectedRows] = await ProductModel.update(
            {
                name: product.name,
                description: product.description,
                purchasePrice: product.purchasePrice,
                stock: product.stock,
                updatedAt: new Date(),
            },
            { where: { id } }
        );

        if (affectedRows === 0) {
            throw new Error(`Product with id ${id} not found`);
        }
    }

    async delete(id: string): Promise<void> {
        const deletedRows = await ProductModel.destroy({ where: { id } });

        if (deletedRows === 0) {
            throw new Error(`Product with id ${id} not found`);
        }
    }
}