import { HttpService, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { WoolworthsProductStockCodeResponseDto } from './dtos/woolworths-product-stockcode-response.dto';
import { WoolworthsProductSearchResponseDto } from './dtos/woolworths-product-search-response.dto';
import { flatMap, isNumber, toNumber } from 'lodash';
import { ProductDto } from '@products/dtos/product.dto';

@Injectable()
export class WoolworthsService {
  constructor(private httpService: HttpService) {}

  async getProductsBySearchTerm(searchTerm: string): Promise<ProductDto[]> {
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
      return serachProduct.Products.map(ProductDto.fromWoolworthsProductDto);
    });

    return products || [];
  }

  async getProductByUrl(url: string): Promise<ProductDto> {
    if (!url) {
      return null;
    }

    const urlParts = url.split('/');
    const productDetailsIndex = urlParts.indexOf('productdetails');
    const stockCode = toNumber(urlParts[productDetailsIndex + 1]);

    if (!stockCode) {
      return null;
    }

    const product = await this.getProductByStockCode(stockCode);
    return product;
  }

  async getProductByStockCode(stockCode: number): Promise<ProductDto> {
    const response = await this.httpService
      .get<WoolworthsProductStockCodeResponseDto>(
        `https://www.woolworths.com.au/apis/ui/product/detail/${stockCode}`,
      )
      .toPromise();

    if (!response) {
      return null;
    }

    return ProductDto.fromWoolworthsProductDto(response.data.Product);
  }
}
