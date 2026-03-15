import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id("157"),
    name: "Product 157",
    description: "Description of Product 157",
    purchasePrice: 157,
    stock: 157,
});

const MockProductRepository = jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(product),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
});

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=check-stock.usecase.spec.ts" no terminal
describe("CheckStockUseCase Teste", () => {
    it("should check stock", async () => {
        const MockProductRepositoryInstance = new MockProductRepository();
        const useCase = new CheckStockUseCase(MockProductRepositoryInstance);

        const input = {
            productId: "157"
        };

        const result = await useCase.execute(input);

        expect(MockProductRepositoryInstance.findById);

        expect(result.productId).toEqual(product.id.id);
        expect(result.stock).toEqual(product.stock);
    });
});