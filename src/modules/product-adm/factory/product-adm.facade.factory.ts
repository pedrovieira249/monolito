import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";
import CreateProductUseCase from "../usecase/create-product/create-product.usecase";
import DeleteProductUseCase from "../usecase/delete-product/delete-product.usecase";
import UpdateProductUseCase from "../usecase/update-product/update-product.usecase";

export default class ProductAdmFacadeFactory {
    static create(): ProductAdmFacade {
        const productRepository    = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const checkStockUseCase    = new CheckStockUseCase(productRepository);
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
        const deleteProductUseCase = new DeleteProductUseCase(productRepository);

        return new ProductAdmFacade({
            createProductUsecase: createProductUseCase,
            checkStockUseCase:    checkStockUseCase,
            updateProductUseCase: updateProductUseCase,
            deleteProductUseCase: deleteProductUseCase,
        });
    }
}
