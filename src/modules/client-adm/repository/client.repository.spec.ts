import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=client.repository.spec.ts" no terminal
describe("ClientRepository", () => {
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
        const client = await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "cleinte1@email.com",
            address: "Address 1",
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });
        
        const repositoryCliente = new ClientRepository();
        const clientDb = await repositoryCliente.findById(client.id);

        expect(client.id).toEqual(clientDb.id.id);
        expect(client.name).toEqual(clientDb.name);
        expect(client.email).toEqual(clientDb.email);
        expect(client.address).toEqual(clientDb.address);
        expect(client.createdAt).toEqual(clientDb.createdAt);
        expect(client.updatedAt).toEqual(clientDb.updatedAt);
    });

    it("should find a client", async () => {
        const client = new Client({
            id: new Id("2"),
            name: "Client 2",
            email: "cleinte2@email.com",
            address: "Address 2",
            createdAt: dataAtual,
            updatedAt: dataAtual,
        });

        const repositoryCliente = new ClientRepository();
        await repositoryCliente.create(client);

        const clientDb = await ClientModel.findOne({
            where: { id: client.id.id },
        });

        expect(client.id.id).toEqual(clientDb.id);
        expect(client.name).toEqual(clientDb.name);
        expect(client.email).toEqual(clientDb.email);
        expect(client.address).toEqual(clientDb.address);
        expect(client.createdAt).toEqual(clientDb.createdAt);
        expect(client.updatedAt).toEqual(clientDb.updatedAt);
    });
});