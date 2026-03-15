import FindAllProductsUseCase from "./find-all-products.usecase";
// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=find-all-products.usecase.spec.ts" no terminal
describe("FindAllProductsUseCase Teste", () => {
    const products = [
        {
            id: "1",
            name: "Product 1",
            description: "Description of Product 1",
            salePrice: 100,
            stock: 10,
        },
        {
            id: "2",
            name: "Product 2",
            description: "Description of Product 2",
            salePrice: 200,
            stock: 20,
        },
        {
            id: "3",
            name: "Product 3",
            description: "Description of Product 3",
            salePrice: 300,
            stock: 30,
        }
    ];

    const MockProductGateway = jest.fn().mockReturnValue({
        findAll: jest.fn().mockResolvedValue(products),
        findById: jest.fn(),
    });

    it("should find all products", async () => {
        const MockProductGatewayInstance = new MockProductGateway();
        const useCase = new FindAllProductsUseCase(MockProductGatewayInstance);

        const result = await useCase.execute();

        expect(MockProductGatewayInstance.findAll).toHaveBeenCalled();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(products.length);
        expect(result).toEqual(products);
    });
});