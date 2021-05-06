import { Injectable } from '@nestjs/common';
import { ProductModel } from '@retailers/models/product.model';
import { IgaScrapedProductDto } from './dtos/iga-scraped-product.dto';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import { map, toNumber, replace, compact } from 'lodash';

@Injectable()
export class IgaService {
  async getProductsBySearchTerm(searchTerm: string): Promise<ProductModel[]> {
    const products = await this.getSearchPageResults(searchTerm);
    console.log(products);

    return map(compact(products), ProductModel.fromColesProductDto) || [];
  }

  private async getPageHtml(searchTerm: string) {
    const url = `https://igashop.com.au/?s=${searchTerm}&post_type=product`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pageHtml = await page.content();
    await browser.close();

    return pageHtml;
  }

  private async getSearchPageResults(
    url: string,
  ): Promise<IgaScrapedProductDto[]> {
    const pageHtml = await this.getPageHtml(url);
    const $ = cheerio.load(pageHtml);

    const $products = $('.product.purchasable');

    const products = map($products, ($product) => {
      const brand = '';
      const name = $('.woocommerce-loop-product__title', $product).text();
      const price = toNumber(
        replace(
          $('.woocommerce-Price-amount.amount', $product).text(),
          '$',
          '',
        ),
      );
      const packageSize = '';
      const unitPrice = $('.product-meta .ppu', $product).text();
      const productPageUrl = $('.product-wrap a', $product).attr('href');
      const imageUrl = $('img', $product).attr('src');

      if (!name || !price) {
        return null;
      }

      const productModel: IgaScrapedProductDto = {
        brand,
        name,
        imageUrl,
        unitPrice,
        productPageUrl,
        price,
        packageSize,
      };

      return productModel;
    });

    return products || [];
  }
}
