import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, {
    CheckStockInputDTO,
    CheckStockOutputDTO,
    CreateProductInputDTO,
    DeleteProductInputDTO,
    DeleteProductOutputDTO,
    UpdateProductInputDTO,
    UpdateProductOutputDTO,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
  createProductUsecase: UseCaseInterface;
  checkStockUseCase: UseCaseInterface;
  updateProductUseCase: UseCaseInterface;
  deleteProductUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private readonly _createProductUsecase: UseCaseInterface;
  private readonly _checkStockUsecase: UseCaseInterface;
  private readonly _updateProductUseCase: UseCaseInterface;
  private readonly _deleteProductUseCase: UseCaseInterface;

  constructor(useCases: UseCasesProps) {
    this._createProductUsecase = useCases.createProductUsecase;
    this._checkStockUsecase = useCases.checkStockUseCase;
    this._updateProductUseCase = useCases.updateProductUseCase;
    this._deleteProductUseCase = useCases.deleteProductUseCase;
  }

    async findAll(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async findById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async create(product: CreateProductInputDTO): Promise<void> {
        await this._createProductUsecase.execute(product);
    }
    async update(input: UpdateProductInputDTO): Promise<UpdateProductOutputDTO> {
        return await this._updateProductUseCase.execute(input);
    }
    async delete(input: DeleteProductInputDTO): Promise<DeleteProductOutputDTO> {
        return await this._deleteProductUseCase.execute(input);
    }
    async checkStock(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
        return await this._checkStockUsecase.execute(input);
    }
}