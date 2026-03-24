import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import { PlaceOrderInputDTO } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockClientFacade: jest.Mocked<ClientAdmFacadeInterface> = {
    create: jest.fn(),
    findById: jest.fn(),
};

const mockProductFacade: jest.Mocked<ProductAdmFacadeInterface> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    checkStock: jest.fn(),
};

const mockCatalogFacade: jest.Mocked<any> = {
    find: jest.fn(),
    findAll: jest.fn(),
};

const mockPaymentFacade: jest.Mocked<any> = {
    process: jest.fn(),
};

const mockInvoiceFacade: jest.Mocked<any> = {
    generate: jest.fn(),
    find: jest.fn(),
};

const mockDate = new Date("2024-01-01");

describe("PlaceOrderUseCase unit test", () => {
    let placeOrderUseCase: PlaceOrderUseCase;

    beforeEach(() => {
        placeOrderUseCase = new PlaceOrderUseCase(
            mockClientFacade,
            mockProductFacade,
            mockCatalogFacade,
            mockPaymentFacade,
            mockInvoiceFacade
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("validateProducts method", () => {
        it("should throw an error if no products are selected", async () => {
            await expect(placeOrderUseCase.validateProducts(null)).rejects.toThrow("No products selected");
        });

        it("should throw an error if products array is empty", async () => {
            await expect(placeOrderUseCase.validateProducts([])).rejects.toThrow("Product not found");
        });
    });

    describe("validateCheckStock method", () => {
        it("should throw an error if product is out of stock", async () => {
            mockProductFacade.checkStock.mockResolvedValueOnce({ productId: "prod1", stock: 0 });

            await expect(
                placeOrderUseCase.validateCheckStock([{ productId: "prod1", quantity: 1 }])
            ).rejects.toThrow("Product is out of stock");
        });

        it("should not throw if all products are in stock", async () => {
            mockProductFacade.checkStock.mockResolvedValueOnce({ productId: "prod1", stock: 5 });

            await expect(
                placeOrderUseCase.validateCheckStock([{ productId: "prod1", quantity: 1 }])
            ).resolves.not.toThrow();
        });
    });

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error if product not found", async () => {
            await expect(placeOrderUseCase.getProducts("prod1")).rejects.toThrow("Product not found");
        });

        it("should return a product", async () => {
            mockCatalogFacade.find.mockResolvedValueOnce({
                id: "prod1",
                name: "Product 1",
                description: "Description 1",
                salesPrice: 10,
            });

            const product = await placeOrderUseCase.getProducts("prod1");

            expect(product.id.id).toBe("prod1");
            expect(product.name).toBe("Product 1");
            expect(product.description).toBe("Description 1");
            expect(product.salesPrice).toBe(10);
        });
    });

    describe("execute method", () => {
        it("should throw an error when client not found", async () => {
            mockClientFacade.findById.mockResolvedValueOnce(null);

            const input: PlaceOrderInputDTO = {
                clientId: "0",
                products: [{ productId: "prod1", quantity: 1 }],
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Client not found");
        });

        it("should throw an error when no products are selected", async () => {
            mockClientFacade.findById.mockResolvedValueOnce({
                id: "0",
                name: "Client",
                email: "client@email.com",
                address: "Street 1",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const input: PlaceOrderInputDTO = {
                clientId: "0",
                products: [],
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Product not found");
        });

        it("should throw an error when product is out of stock", async () => {
            mockClientFacade.findById.mockResolvedValueOnce({
                id: "0",
                name: "Client",
                email: "client@email.com",
                address: "Street 1",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockProductFacade.checkStock.mockResolvedValueOnce({ productId: "prod1", stock: 0 });

            const input: PlaceOrderInputDTO = {
                clientId: "0",
                products: [{ productId: "prod1", quantity: 1 }],
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Product is out of stock");
        });
    });

    describe("place an order", () => {
        const clientMock = {
            id: "client-1",
            name: "Client",
            email: "client@email.com",
            address: "Street 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const productCatalogMock = {
            id: "prod1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 10,
        };

        beforeEach(() => {
            mockClientFacade.findById.mockResolvedValueOnce(clientMock);
            mockProductFacade.checkStock.mockResolvedValueOnce({ productId: "prod1", stock: 10 });
            mockCatalogFacade.find.mockResolvedValueOnce(productCatalogMock);
        });

        it("should place an order with payment approved and generate invoice", async () => {
            mockPaymentFacade.process.mockResolvedValueOnce({
                transactionId: "tx-1",
                orderId: "order-1",
                amount: 10,
                status: "approved",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            mockInvoiceFacade.generate.mockResolvedValueOnce({
                id: "invoice-1",
                name: "Client",
                document: "client@email.com",
                street: "Street 1",
                number: "0",
                complement: "",
                city: "",
                state: "",
                zipCode: "",
                items: [{ id: "prod1", name: "Product 1", price: 10 }],
                total: 10,
            });

            const input: PlaceOrderInputDTO = {
                clientId: "client-1",
                products: [{ productId: "prod1", quantity: 1 }],
            };

            const output = await placeOrderUseCase.execute(input);

            expect(output.id).toBeDefined();
            expect(output.clientId).toBe("client-1");
            expect(output.invoiceId).toBe("invoice-1");
            expect(output.total).toBe(10);
            expect(output.status).toBe("approved");
            expect(output.products).toEqual(input.products);

            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockPaymentFacade.process).toHaveBeenCalledWith(
                expect.objectContaining({ amount: 10 })
            );
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Client",
                    items: expect.arrayContaining([
                        expect.objectContaining({ id: "prod1", name: "Product 1", price: 10 }),
                    ]),
                })
            );
        });

        it("should place an order with payment declined and not generate invoice", async () => {
            mockPaymentFacade.process.mockResolvedValueOnce({
                transactionId: "tx-2",
                orderId: "order-2",
                amount: 10,
                status: "declined",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const input: PlaceOrderInputDTO = {
                clientId: "client-1",
                products: [{ productId: "prod1", quantity: 1 }],
            };

            const output = await placeOrderUseCase.execute(input);

            expect(output.id).toBeDefined();
            expect(output.clientId).toBe("client-1");
            expect(output.invoiceId).toBeNull();
            expect(output.total).toBe(10);
            expect(output.status).toBe("pending");
            expect(output.products).toEqual(input.products);

            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).not.toHaveBeenCalled();
        });
    });
});
