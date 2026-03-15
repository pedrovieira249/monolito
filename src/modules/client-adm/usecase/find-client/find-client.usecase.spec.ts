import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find.client.usecase";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=find-client.usecase.spec.ts" no terminal
describe("FindClientUseCase", () => {
    const client = new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "client1@example.com",
        address: "Address 1",
    });

    const MockRepository = () => {
        return {
            create: jest.fn(),
            findById: jest.fn().mockReturnValue(Promise.resolve(client)),
        };
    }

    it("should find a client", async () => {
        const repository = MockRepository();
        const usecase = new FindClientUseCase(repository);

        const input = {
            id: "1",
        };

        const result = await usecase.execute(input);

        expect(repository.findById).toHaveBeenCalled();
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toBe(client.email);
        expect(result.address).toBe(client.address);
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });
});