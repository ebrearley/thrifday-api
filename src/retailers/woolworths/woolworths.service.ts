import { HttpService, Injectable } from '@nestjs/common';
import { ProductModel } from '../models/product.model';
import fetch from 'node-fetch';
import { WoolworthsProductStockCodeResponseDto } from './dtos/woolworths-product-stockcode-response.dto';
import { WoolworthsProductSearchResponseDto } from './dtos/woolworths-product-search-response.dto';
import { flatMap } from 'lodash';

@Injectable()
export class WoolworthsService {
  constructor(private httpService: HttpService) {}

  async getProductsBySearchTerm(searchTerm: string): Promise<ProductModel[]> {
    const body = JSON.stringify({
      SearchTerm: searchTerm,
    });

    const response = await fetch(
      'https://www.woolworths.com.au/apis/ui/Search/products',
      {
        method: 'post',
        body,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip',
        },
      },
    );

    const searchResponse: WoolworthsProductSearchResponseDto = await response.json();

    const products = flatMap(searchResponse.Products, (serachProduct) => {
      return serachProduct.Products.map(ProductModel.fromWoolworthsProductDto);
    });

    return products || [];
  }

  async getProductByStockCode(stockCode: number): Promise<ProductModel> {
    const response = await this.httpService
      .get<WoolworthsProductStockCodeResponseDto>(
        `https://www.woolworths.com.au/apis/ui/product/detail/${stockCode}`,
      )
      .toPromise();

    if (!response) {
      return null;
    }

    return ProductModel.fromWoolworthsProductDto(response.data.Product);
  }
}
