import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=product.repository.spec.ts" no terminal
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

    it("should create a product", async () => {
        const dataAtual = new Date();
        const products  = [
            {
                id: "1",
                name: "Product 1",
                description: "Description of Product 1",
                salesPrice: 100,
                stock: 10,
                createdAt: dataAtual,
                updatedAt: dataAtual,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description of Product 2",
                salesPrice: 200,
                stock: 20,
                    createdAt: dataAtual,
                    updatedAt: dataAtual,
            },
            {
                id: "3",
                name: "Product 3",
                description: "Description of Product 3",
                salesPrice: 300,
                stock: 30,
                createdAt: dataAtual,
                updatedAt: dataAtual,
            }
        ];

        await ProductModel.bulkCreate(products);

        const productsDb = await ProductModel.findAll();

        expect(productsDb).toBeDefined();
        expect(productsDb.length).toBe(products.length);
        expect(productsDb.map(p => p.toJSON())).toEqual(products);
    });

    it("should find a product", async () => {
        const dataAtual = new Date();

        await ProductModel.create({
            id: "4",
            name: "Product 4",
            description: "Description 4",
            salesPrice: 400,
            stock: 40,
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });

        const productRepository = new ProductRepository();
        const product = await productRepository.findById("4");

        expect(product.id.id).toBe("4");
        expect(product.name).toBe("Product 4");
        expect(product.description).toBe("Description 4");
        expect(product.salesPrice).toBe(400);
        expect(product.stock).toBe(40);
    });
});