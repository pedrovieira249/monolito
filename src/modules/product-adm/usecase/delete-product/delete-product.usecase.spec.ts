import DeleteProductUseCase from "./delete-product.usecase";

const MockProductRepository = jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(undefined),
});

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=delete-product.usecase.spec.ts" no terminal
describe("DeleteProductUseCase Teste", () => {
    it("should delete a product", async () => {
        const MockProductRepositoryInstance = new MockProductRepository();
        const useCase = new DeleteProductUseCase(MockProductRepositoryInstance);

        const input = { id: "157" };

        const result = await useCase.execute(input);

        expect(MockProductRepositoryInstance.delete).toHaveBeenCalledWith(input.id);

        expect(result.id).toEqual(input.id);
    });
});
