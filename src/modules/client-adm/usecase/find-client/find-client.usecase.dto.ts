export interface FindClientUseCaseInputDTO {
    id: string;
}

export interface FindClientUseCaseOutputDTO {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}