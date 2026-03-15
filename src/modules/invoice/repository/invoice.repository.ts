import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<Invoice> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          invoiceId: invoice.id.id,
          name: item.name,
          price: item.price,
        })),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      { include: [{ model: InvoiceItemsModel }] }
    );

    return invoice;
  }

  async find(id: string): Promise<Invoice> {
    const model = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemsModel }],
    });

    if (!model) throw new Error("Invoice not found");

    return new Invoice({
      id: new Id(model.id),
      name: model.name,
      document: model.document,
      address: new Address({
        street: model.street,
        number: model.number,
        complement: model.complement,
        city: model.city,
        state: model.state,
        zipCode: model.zipCode,
      }),
      items: model.items.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
