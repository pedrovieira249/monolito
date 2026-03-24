import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm-facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/product-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../store-product/factory/store-catalog.facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();

        const placeOrderUseCase = new PlaceOrderUseCase(
            clientFacade,
            productFacade,
            catalogFacade,
            paymentFacade,
            invoiceFacade
        );

        return new CheckoutFacade(placeOrderUseCase);
    }
}
