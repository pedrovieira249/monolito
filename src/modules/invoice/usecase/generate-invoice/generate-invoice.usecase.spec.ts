import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = (): InvoiceGateway => ({
  generate: jest.fn().mockImplementation((invoice: Invoice) =>
    Promise.resolve(invoice)
  ),
  find: jest.fn(),
});

describe("GenerateInvoiceUseCase", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

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

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalledTimes(1);
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
});
