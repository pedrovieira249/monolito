import ClientAdmFacade from "../facade/client-adm.facade";
import ClientAdmFacadeInterface from "../facade/client-adm.facade.interface";
import ClientRepository from "../repository/client.repository";
import CreateClientUseCase from "../usecase/create-client/create-client.usecase";
import FindClientUseCase from "../usecase/find-client/find.client.usecase";


export default class ClientAdmFacadeFactory {
    static create(): ClientAdmFacadeInterface {
        const clientRepository = new ClientRepository();
        const createClientUseCase = new CreateClientUseCase(clientRepository);
        const findUseCase = new FindClientUseCase(clientRepository);

        return new ClientAdmFacade({
            createUseCase: createClientUseCase,
            findByIdUseCase: findUseCase
        });
    }
}
