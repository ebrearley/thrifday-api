import { HttpService, Injectable } from '@nestjs/common';
import { ProductModel } from '@retailers/models/product.model';
import { map, compact } from 'lodash';
import { CostcoProductSearchResponseDto } from './dtos/costco-product-search-response.dto';

@Injectable()
export class CostcoService {
  constructor(private httpService: HttpService) {}

  async getProductsBySearchTerm(searchTerm: string): Promise<ProductModel[]> {
    const response = await this.httpService
      .get<CostcoProductSearchResponseDto>(
        `https://www.costco.com.au/rest/v2/australia/products/search?fields=FULL&query=${searchTerm}`,
      )
      .toPromise();

    const inStockProducts = compact(
      map(response?.data?.products || [], (product) => {
        if (!product?.price?.value) {
          return null;
        }

        return product;
      }),
    );

    return map(inStockProducts, ProductModel.fromCoscoProductDto) || [];
  }
}
