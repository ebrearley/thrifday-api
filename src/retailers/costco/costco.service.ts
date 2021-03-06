import { HttpService, Injectable } from '@nestjs/common';
import { ProductDto } from '@products/dtos/product.dto';
import { map, compact } from 'lodash';
import { CostcoProductSearchResponseDto } from './dtos/costco-product-search-response.dto';

@Injectable()
export class CostcoService {
  constructor(private httpService: HttpService) {}

  async getProductsBySearchTerm(searchTerm: string): Promise<ProductDto[]> {
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

    return map(inStockProducts, ProductDto.fromCoscoProductDto) || [];
  }
}
