import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "../facade/invoice.facade";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const invoiceRepository = new InvoiceRepository();
    const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    const findUseCase = new FindInvoiceUseCase(invoiceRepository);

    return new InvoiceFacade({
      generateUseCase,
      findUseCase,
    });
  }
}
