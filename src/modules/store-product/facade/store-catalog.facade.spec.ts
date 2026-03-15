import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/store-catalog.facade.factory";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=store-catalog.facade.spec.ts" no terminal
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

    beforeEach(async () => {
        // O beforeEach com truncate: true garante que a tabela seja limpa antes de cada teste, evitando conflito de chave primária entre eles.
        await ProductModel.destroy({ truncate: true });
    });

    it("should find all products", async () => {
        const facade = StoreCatalogFacadeFactory.create();
        const dataAtual = new Date();

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            stock: 10,
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            salesPrice: 200,
            stock: 20,
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });

        const result = await facade.findAll();

        expect(result.products.length).toBe(2);
        expect(result.products[0].id.id).toBe("1");
        expect(result.products[0].name).toBe("Product 1");
        expect(result.products[0].description).toBe("Description 1");
        expect(result.products[0].salesPrice).toBe(100);
        expect(result.products[1].id.id).toBe("2");
        expect(result.products[1].name).toBe("Product 2");
        expect(result.products[1].description).toBe("Description 2");
        expect(result.products[1].salesPrice).toBe(200);
    });

    it("should find a product", async () => {
        const facade = StoreCatalogFacadeFactory.create();
        const dataAtual = new Date();

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            stock: 10,
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });

        const result = await facade.find({ id: "1" });

        expect(result.id).toBe("1");
        expect(result.name).toBe("Product 1");
        expect(result.description).toBe("Description 1");
        expect(result.salesPrice).toBe(100);
  });
});