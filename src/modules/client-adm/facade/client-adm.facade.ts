import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { CreateClientFacadeInputDTO, CreateClientFacadeOutputDTO, FindClientFacadeInputDTO, FindClientFacadeOutputDTO } from "./client-adm.facade.interface";

export interface UseCasesProps {
    findByIdUseCase: UseCaseInterface;
    createUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
    private readonly _findByIdUseCase: UseCaseInterface;
    private readonly _createUseCase: UseCaseInterface

    constructor(useCases: UseCasesProps) {
        this._findByIdUseCase = useCases.findByIdUseCase;
        this._createUseCase = useCases.createUseCase;
    }

    async create(input: CreateClientFacadeInputDTO): Promise<CreateClientFacadeOutputDTO> {
        return await this._createUseCase.execute(input);
    }
    async findById(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO> {
        return await this._findByIdUseCase.execute(input);
    }
}