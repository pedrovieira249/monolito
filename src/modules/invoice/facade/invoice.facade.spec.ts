import { Sequelize } from "sequelize-typescript";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade", () => {
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
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "John Doe",
      document: "123.456.789-00",
      street: "Rua das Flores",
      number: "42",
      complement: "Apto 10",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      items: [
        { id: "1", name: "Product A", price: 50 },
        { id: "2", name: "Product B", price: 100 },
      ],
    };

    const result = await facade.generate(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123.456.789-00");
    expect(result.street).toBe("Rua das Flores");
    expect(result.number).toBe("42");
    expect(result.complement).toBe("Apto 10");
    expect(result.city).toBe("São Paulo");
    expect(result.state).toBe("SP");
    expect(result.zipCode).toBe("01310-100");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "1", name: "Product A", price: 50 });
    expect(result.items[1]).toEqual({ id: "2", name: "Product B", price: 100 });
    expect(result.total).toBe(150);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const generateInput = {
      name: "Jane Smith",
      document: "987.654.321-00",
      street: "Av. Paulista",
      number: "1000",
      complement: "Sala 5",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-200",
      items: [
        { id: "1", name: "Service A", price: 200 },
        { id: "2", name: "Service B", price: 300 },
      ],
    };

    const generated = await facade.generate(generateInput);
    const result = await facade.find({ id: generated.id });

    expect(result.id).toBe(generated.id);
    expect(result.name).toBe("Jane Smith");
    expect(result.document).toBe("987.654.321-00");
    expect(result.address.street).toBe("Av. Paulista");
    expect(result.address.number).toBe("1000");
    expect(result.address.complement).toBe("Sala 5");
    expect(result.address.city).toBe("São Paulo");
    expect(result.address.state).toBe("SP");
    expect(result.address.zipCode).toBe("01310-200");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "1", name: "Service A", price: 200 });
    expect(result.items[1]).toEqual({ id: "2", name: "Service B", price: 300 });
    expect(result.total).toBe(500);
    expect(result.createdAt).toBeDefined();
  });
});
