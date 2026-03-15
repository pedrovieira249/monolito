import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {
  async create(entity: Client): Promise<void> {

    await ClientModel.create({
      id: entity.id.id,
      name: entity.name,
      email: entity.email,
      address: entity.address,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })
  }

  async findById(id: string): Promise<Client> {

    const client = await ClientModel.findOne({ where: { id } })

    if (!client) {
      throw new Error("Client not found")
    }

    return new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    })
  }

}