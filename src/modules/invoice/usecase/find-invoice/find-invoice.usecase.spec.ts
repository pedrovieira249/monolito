import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import FindInvoiceUseCase from "./find-invoice.usecase";

const mockInvoice = new Invoice({
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

const MockRepository = (): InvoiceGateway => ({
  generate: jest.fn(),
  find: jest.fn().mockResolvedValue(mockInvoice),
});

describe("FindInvoiceUseCase", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const result = await usecase.execute({ id: "1" });

    expect(repository.find).toHaveBeenCalledWith("1");
    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123.456.789-00");
    expect(result.address).toEqual({
      street: "Rua das Flores",
      number: "42",
      complement: "Apto 10",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    });
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "1", name: "Product A", price: 50 });
    expect(result.items[1]).toEqual({ id: "2", name: "Product B", price: 100 });
    expect(result.total).toBe(150);
    expect(result.createdAt).toBeDefined();
  });
});
