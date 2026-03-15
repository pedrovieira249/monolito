import ClientGateway from "../../gateway/client.gateway";
import { FindClientUseCaseInputDTO, FindClientUseCaseOutputDTO } from "./find-client.usecase.dto";

export default class FindClientUseCase {
  constructor(
    private readonly clientRepository: ClientGateway,
  ) {}

  async execute(input: FindClientUseCaseInputDTO): Promise<FindClientUseCaseOutputDTO> {

    const client = await this.clientRepository.findById(input.id);

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