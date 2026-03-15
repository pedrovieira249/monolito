import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    salesPrice: 100,
    stock: 10,
});

const MockRepository = () => {
    return {
        findById: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
    };
}
// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=find-product.usecase.spec.ts" no terminal
describe("FindProductUseCase Test", () => {
    it("should find a product", async () => {
        const repository = MockRepository();
        const useCase = new FindProductUseCase(repository);

        const input = {
            id: "1",
        };

        const result = await useCase.execute(input);

        expect(repository.findById).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.id).toEqual(product.id.id);
        expect(result.name).toEqual(product.name);
        expect(result.description).toEqual(product.description);
        expect(result.salesPrice).toEqual(product.salesPrice);
        expect(result.stock).toEqual(product.stock);
    });  
});  