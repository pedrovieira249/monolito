import CreateClientUseCase from "./create-client.usecase";

const MockRepository = () => {
  return {
    create: jest.fn(),
    findById: jest.fn(),
  };
}
// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=create-client.usecase.spec.ts" no terminal
describe("CreateClientUseCase", () => {
  it("should create a client", async () => {
      const repository = MockRepository();
      const usecase = new CreateClientUseCase(repository);

      const result = await usecase.execute({
        name: "Client 1",
        email: "client1@example.com",
        address: "Address 1",
      });

      expect(repository.create).toHaveBeenCalled();
      expect(result.id).toBeDefined();
      expect(result.name).toBe("Client 1");
      expect(result.email).toBe("client1@example.com");
      expect(result.address).toBe("Address 1");
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
  });
});