export interface CreateClientFacadeInputDTO {
    id?: string;
    name: string;
    email: string;
    address: string;
}

export interface CreateClientFacadeOutputDTO {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FindClientFacadeInputDTO {
    id: string;
}

export interface FindClientFacadeOutputDTO {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
    create(input: CreateClientFacadeInputDTO): Promise<CreateClientFacadeOutputDTO>;
    findById(input: FindClientFacadeInputDTO): Promise<FindClientFacadeOutputDTO>;
}