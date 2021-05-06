import { Injectable } from '@nestjs/common';
import { CostcoService } from './costco/costco.service';
import { ColesService } from './coles/coles.service';
import { WoolworthsService } from './woolworths/woolworths.service';
import { RetailerEnum } from './@enums/retailer.enum';
import { flatten, map, values } from 'lodash';
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
    const searchServices = {
      [RetailerEnum.Woolworths]: this.woolworthsService.getProductsBySearchTerm,
      [RetailerEnum.Coles]: this.colesService.getProductsBySearchTerm,
      [RetailerEnum.Costco]: this.costcoService.getProductsBySearchTerm,
      [RetailerEnum.IGA]: this.igaService.getProductsBySearchTerm,
    };

    if (retailers) {
      const serviceCalls = map(retailers, (retailer) =>
        searchServices[retailer](searchTerm),
      );

      const results = await Promise.all(values(serviceCalls));
      return flatten(results);
    }

    const allResults = await Promise.all(values(searchServices));
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
