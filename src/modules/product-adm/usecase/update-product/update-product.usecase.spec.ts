import UpdateProductUseCase from "./update-product.usecase";

const MockProductRepository = jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn(),
});

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=update-product.usecase.spec.ts" no terminal
describe("UpdateProductUseCase Teste", () => {
    it("should update a product", async () => {
        const MockProductRepositoryInstance = new MockProductRepository();
        const useCase = new UpdateProductUseCase(MockProductRepositoryInstance);

        const input = {
            id: "157",
            name: "Product 157 Updated",
            description: "Description Updated",
            purchasePrice: 200,
            stock: 50,
        };

        const result = await useCase.execute(input);

        expect(MockProductRepositoryInstance.update).toHaveBeenCalledWith(
            input.id,
            expect.objectContaining({
                _name: input.name,
                _description: input.description,
                _purchasePrice: input.purchasePrice,
                _stock: input.stock,
            })
        );

        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(input.name);
        expect(result.description).toEqual(input.description);
        expect(result.purchasePrice).toEqual(input.purchasePrice);
        expect(result.stock).toEqual(input.stock);
    });
});
