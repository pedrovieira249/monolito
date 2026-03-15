import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/product-adm.facade.factory";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=product-adm.facade.spec.ts" no terminal
describe("ProductAdmFacade Teste", () => {
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
        const productAdmFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "100",
            name: "Product 100",
            description: "Description of Product 1",
            purchasePrice: 100,
            stock: 10,
        };

        await productAdmFacade.create(input);

        const productDb = await ProductModel.findOne({
            where: { id: input.id },
        });

        expect(input.id).toEqual(productDb.id);
        expect(input.name).toEqual(productDb.name);
        expect(input.description).toEqual(productDb.description);
        expect(input.purchasePrice).toEqual(productDb.purchasePrice);
        expect(input.stock).toEqual(productDb.stock);
    });

    it("should check stock", async () => {
        const productAdmFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "200",
            name: "Product 200",
            description: "Description of Product 200",
            purchasePrice: 200,
            stock: 20,
        };

        await productAdmFacade.create(input);

        const inputCheckStock = {
            productId: input.id,
            stock: input.stock,
        };

        const result = await productAdmFacade.checkStock(inputCheckStock);

        expect(result.productId).toEqual(input.id);
        expect(result.stock).toEqual(input.stock);
    });

    it("should update a product", async () => {
        const productAdmFacade = ProductAdmFacadeFactory.create();

        await productAdmFacade.create({
            id: "300",
            name: "Product 300",
            description: "Description of Product 300",
            purchasePrice: 300,
            stock: 30,
        });

        const inputUpdate = {
            id: "300",
            name: "Product 300 Updated",
            description: "Description Updated",
            purchasePrice: 999,
            stock: 99,
        };

        const result = await productAdmFacade.update(inputUpdate);

        const productDb = await ProductModel.findOne({ where: { id: "300" } });

        expect(result.id).toEqual(inputUpdate.id);
        expect(result.name).toEqual(inputUpdate.name);
        expect(productDb.name).toEqual(inputUpdate.name);
        expect(productDb.purchasePrice).toEqual(inputUpdate.purchasePrice);
        expect(productDb.stock).toEqual(inputUpdate.stock);
    });

    it("should delete a product", async () => {
        const productAdmFacade = ProductAdmFacadeFactory.create();

        await productAdmFacade.create({
            id: "400",
            name: "Product 400",
            description: "Description of Product 400",
            purchasePrice: 400,
            stock: 40,
        });

        const result = await productAdmFacade.delete({ id: "400" });

        const productDb = await ProductModel.findOne({ where: { id: "400" } });

        expect(result.id).toEqual("400");
        expect(productDb).toBeNull();
    });
});

