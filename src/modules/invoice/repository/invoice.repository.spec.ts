import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "123.456.789-00",
      address: new Address({
        street: "Rua das Flores",
        number: "42",
        complement: "Apto 10",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
      }),
      items: [
        new InvoiceItems({ id: new Id("1"), name: "Product A", price: 50 }),
        new InvoiceItems({ id: new Id("2"), name: "Product B", price: 100 }),
      ],
    });

    const repository = new InvoiceRepository();
    const result = await repository.generate(invoice);

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123.456.789-00");
    expect(result.address.street).toBe("Rua das Flores");
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(150);
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "123.456.789-00",
      address: new Address({
        street: "Rua das Flores",
        number: "42",
        complement: "Apto 10",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
      }),
      items: [
        new InvoiceItems({ id: new Id("1"), name: "Product A", price: 50 }),
        new InvoiceItems({ id: new Id("2"), name: "Product B", price: 100 }),
      ],
    });

    await repository.generate(invoice);
    const result = await repository.find("1");

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123.456.789-00");
    expect(result.address.street).toBe("Rua das Flores");
    expect(result.address.number).toBe("42");
    expect(result.address.complement).toBe("Apto 10");
    expect(result.address.city).toBe("São Paulo");
    expect(result.address.state).toBe("SP");
    expect(result.address.zipCode).toBe("01310-100");
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe("Product A");
    expect(result.items[1].name).toBe("Product B");
    expect(result.total).toBe(150);
  });

  it("should throw when invoice not found", async () => {
    const repository = new InvoiceRepository();
    await expect(repository.find("non-existent")).rejects.toThrow(
      "Invoice not found"
    );
  });
});
