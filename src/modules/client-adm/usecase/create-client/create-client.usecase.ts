import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { CreateClientUseCaseInputDTO, CreateClientUseCaseOutputDTO } from "./create-client.usecase.dto";

export default class CreateClientUseCase {
  constructor(
    private readonly clientRepository: ClientGateway,
  ) {}

  async execute(input: CreateClientUseCaseInputDTO): Promise<CreateClientUseCaseOutputDTO> {
    const client = new Client({
      id: input.id ? new Id(input.id) : undefined,
      name: input.name,
      email: input.email,
      address: input.address,
    });

    await this.clientRepository.create(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}