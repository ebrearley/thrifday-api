import { Injectable } from '@nestjs/common';
import { CostcoService } from './costco/costco.service';
import { ColesService } from './coles/coles.service';
import { WoolworthsService } from './woolworths/woolworths.service';
import { RetailerEnum } from './@enums/retailer.enum';
import { flatten, includes } from 'lodash';
import { IgaService } from './iga/iga.service';
import { RetailerProductModel } from './models/retailer-product.model';
import { ProductDto } from '@products/dtos/product.dto';

@Injectable()
export class RetailersService {
  constructor(
    private readonly woolworthsService: WoolworthsService,
    private readonly colesService: ColesService,
    private readonly costcoService: CostcoService,
    private readonly igaService: IgaService,
  ) {}

  async searchForProducts(searchTerm: string, retailers?: RetailerEnum[]) {
    if (retailers) {
      const promises = [];

      if (includes(retailers, RetailerEnum.Woolworths)) {
        const promise = this.woolworthsService.getProductsBySearchTerm(
          searchTerm,
        );
        promises.push(promise);
      }

      if (includes(retailers, RetailerEnum.Coles)) {
        const promise = this.colesService.getProductsBySearchTerm(searchTerm);
        promises.push(promise);
      }

      if (includes(retailers, RetailerEnum.Costco)) {
        const promise = this.costcoService.getProductsBySearchTerm(searchTerm);
        promises.push(promise);
      }

      if (includes(retailers, RetailerEnum.IGA)) {
        const promise = this.igaService.getProductsBySearchTerm(searchTerm);
        promises.push(promise);
      }

      const results = await Promise.all(promises);
      return flatten(results);
    }

    const allResults = await Promise.all([
      this.woolworthsService.getProductsBySearchTerm(searchTerm),
      this.colesService.getProductsBySearchTerm(searchTerm),
      this.costcoService.getProductsBySearchTerm(searchTerm),
      this.igaService.getProductsBySearchTerm(searchTerm),
    ]);
    return flatten(allResults);
  }

  async getProductDetails(
    url: string,
    retailer: RetailerEnum,
  ): Promise<RetailerProductModel> {
    if (retailer === RetailerEnum.Woolworths) {
      const productDetils: ProductDto = await this.woolworthsService.getProductByUrl(
        url,
      );
      return RetailerProductModel.fromProductDto(productDetils);
    }

    return null;
  }
}
