import Client from "../domain/client.entity";

export default interface ClientGateway {
  create(client: Client): Promise<void>;
  findById(id: string): Promise<Client>;
}