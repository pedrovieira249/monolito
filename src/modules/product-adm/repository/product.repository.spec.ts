import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import ProductRepository from "./product.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=product-adm.repository.spec.ts" no terminal
describe("ProductRepository", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productProps = {
            id: new Id("1"),
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        };
        const product = new Product(productProps);
        const productRepository = new ProductRepository();

        await productRepository.create(product);

        const productDb = await ProductModel.findOne({
            where: { id: productProps.id.id },
        });

        expect(productProps.id.id).toEqual(productDb.id);
        expect(productProps.name).toEqual(productDb.name);
        expect(productProps.description).toEqual(productDb.description);
        expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
        expect(productProps.stock).toEqual(productDb.stock);
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            purchasePrice: 200,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product = await productRepository.findById("2");

        expect(product.id.id).toEqual("2");
        expect(product.name).toEqual("Product 2");
        expect(product.description).toEqual("Product 2 description");
        expect(product.purchasePrice).toEqual(200);
        expect(product.stock).toEqual(5);
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();

        await ProductModel.create({
            id: "3",
            name: "Product 3",
            description: "Product 3 description",
            purchasePrice: 300,
            stock: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product = new Product({
            id: new Id("3"),
            name: "Updated Product 3",
            description: "Updated Product 3 description",
            purchasePrice: 350,
            stock: 20,
        });

        await productRepository.update("3", product);

        const updatedProductDb = await ProductModel.findOne({
            where: { id: "3" },
        });

        expect(product.id.id).toEqual(updatedProductDb.id);
        expect(product.name).toEqual(updatedProductDb.name);
        expect(product.description).toEqual(updatedProductDb.description);
        expect(product.purchasePrice).toEqual(updatedProductDb.purchasePrice);
        expect(product.stock).toEqual(updatedProductDb.stock);
    });

    it("should delete a product", async () => {
        const productRepository = new ProductRepository();

        await ProductModel.create({
            id: "4",
            name: "Product 4",
            description: "Product 4 description",
            purchasePrice: 400,
            stock: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await productRepository.delete("4");

        const deletedProductDb = await ProductModel.findOne({
            where: { id: "4" },
        });

        expect(deletedProductDb).toBeNull();
    });
});