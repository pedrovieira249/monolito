import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import CreateClientUseCase from "../usecase/create-client/create-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find.client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm-facade.factory";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=client-adm.facade.spec.ts" no terminal
describe("ClientAdmFacade Teste", () => {
    let sequelize: Sequelize;
    const dataAtual = new Date();

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Client 1",
            email: "client1@example.com",
            address: "Address 1",
            createdAt: dataAtual,
            updatedAt: dataAtual,
        }

        await facade.create(input);

        const client = await ClientModel.findOne({ where: { id: input.id } })

        expect(client).toBeDefined()
        expect(client.id).toBe(input.id)
        expect(client.name).toBe(input.name)
        expect(client.email).toBe(input.email)
        expect(client.address).toBe(input.address)
    });

    it("should find a client by id", async () => {
        const repositoryCliente = new ClientRepository();
        const findByIdUseCase   = new FindClientUseCase(repositoryCliente);
        const createUseCase     = new CreateClientUseCase(repositoryCliente)
        const facade            = new ClientAdmFacade({
            createUseCase: createUseCase,
            findByIdUseCase: findByIdUseCase
        });

        const input = {
            id: "2",
            name: "Client 2",
            email: "client2@example.com",
            address: "Address 2",
            createdAt: dataAtual,
            updatedAt: dataAtual,
        }

        const newClient = await facade.create(input)

        const client = await facade.findById({ id: newClient.id })

        expect(client).toBeDefined()
        expect(client.id).toBe(input.id)
        expect(client.name).toBe(input.name)
        expect(client.email).toBe(input.email)
        expect(client.address).toBe(input.address)      
    });
    
});