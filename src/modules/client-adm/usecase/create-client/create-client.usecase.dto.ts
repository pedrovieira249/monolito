export interface CreateClientUseCaseInputDTO {
    id?: string;
    name: string;
    email: string;
    address: string;
}

export interface CreateClientUseCaseOutputDTO {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}