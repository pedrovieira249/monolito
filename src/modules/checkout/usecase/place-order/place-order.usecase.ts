import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-product/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entityu";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private readonly _clientFacade: ClientAdmFacadeInterface;
    private readonly _productFacade: ProductAdmFacadeInterface;
    private readonly _catalogFacade: StoreCatalogFacadeInterface;
    private readonly _paymentFacade: PaymentFacadeInterface;
    private readonly _invoiceFacade: InvoiceFacadeInterface;


    constructor(clientFacade: ClientAdmFacadeInterface, productFacade: ProductAdmFacadeInterface, catalogFacade: StoreCatalogFacadeInterface, paymentFacade: PaymentFacadeInterface, invoiceFacade: InvoiceFacadeInterface) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._paymentFacade = paymentFacade;
        this._invoiceFacade = invoiceFacade;
    }

    async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
        const client = await this._clientFacade.findById({ id: input.clientId });

        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input.products);
        await this.validateCheckStock(input.products);

        const products = await this.getAllProducts(input.products);

        const clientEntity = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address,
        });

        const order = new Order({
            client: clientEntity,
            products,
        });

        const total = products.reduce((acc, product) => acc + product.salesPrice, 0);

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: total,
        });

        const isApproved = payment.status === "approved";

        const invoiceId = isApproved
            ? (
                  await this._invoiceFacade.generate({
                      name: client.name,
                      document: client.email,
                      street: client.address,
                      number: "0",
                      complement: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      items: products.map((p) => ({
                          id: p.id.id,
                          name: p.name,
                          price: p.salesPrice,
                      })),
                  })
              ).id
            : null;

        if (isApproved) {
            order.approve();
        }

        return {
            id: order.id.id,
            clientId: client.id,
            invoiceId,
            total,
            products: input.products,
            status: order.status,
        };
    }

    public async validateProducts(products?: { productId: string; quantity: number }[]): Promise<void> {
        if (!products) {
            throw new Error("No products selected");
        }
        
        if (products.length === 0) {
            throw new Error("Product not found");
        }
    
    }

    public async validateCheckStock(products: { productId: string; quantity: number }[]): Promise<void> {
        for (const item of products) {
            const { stock } = await this._productFacade.checkStock({ productId: item.productId, stock: item.quantity });

            if (stock === 0) {
                throw new Error("Product is out of stock");
            }
        }
    }

    public async getProducts(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });

        if (!product) {
            throw new Error("Product not found");
        }

        const productProps = { 
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        };

        return new Product(productProps);
    }

    private getAllProducts(products: { productId: string; quantity: number }[]): Promise<Product[]> {
        return Promise.all(products.map(async (item) => {
            const product = await this.getProducts(item.productId);
            return product;
        }));
    }
}