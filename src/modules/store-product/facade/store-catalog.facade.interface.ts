import Id from "../../@shared/domain/value-object/id.value-object";

export interface FindStoreCatalogFacadeInputDTO {
    id: string;
}

export interface FindStoreCatalogFacadeOutputDTO {
    id: string; 
    name: string;
    description: string;  
    salesPrice: number;
    stock: number;
}

export interface FindAllStoreCatalogFacadeOutputDTO {
    products: {
        id: Id;
        name: string;
        description: string;
        salesPrice: number;
        stock: number;
    }[];
}

export default interface StoreCatalogFacadeInterface {
    find(id: FindStoreCatalogFacadeInputDTO): Promise<FindStoreCatalogFacadeOutputDTO>;
    findAll(): Promise<FindAllStoreCatalogFacadeOutputDTO>;
}