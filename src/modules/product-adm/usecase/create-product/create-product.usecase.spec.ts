import CreateProductUseCase from "./create-product.usecase";

const MockProductGateway = jest.fn().mockReturnValue({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
});

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=create-product.usecase.spec.ts" no terminal
describe('CreateProductUseCase Teste', () => {
    it('should create a new product', async () => {
        const MockProductGatewayInstance = new MockProductGateway();
        const useCase = new CreateProductUseCase(MockProductGatewayInstance); 

        const input = {
            name: 'Product 1',
            description: 'Description of Product 1',
            purchasePrice: 100,
            stock: 10
        };

        const result = await useCase.execute(input);

        expect(MockProductGatewayInstance.create).toHaveBeenCalledWith(expect.objectContaining({
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock
        }));

        expect(result.id).toBeDefined();
    });
});