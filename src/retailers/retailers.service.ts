import { Injectable } from '@nestjs/common';
import { CostcoService } from './costco/costco.service';
import { ColesService } from './coles/coles.service';
import { WoolworthsService } from './woolworths/woolworths.service';
import { RetailerEnum } from './@enums/retailer.enum';
import { flatten, map, values } from 'lodash';
import { IgaService } from './iga/iga.service';

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
      [RetailerEnum.Woolworths]: this.woolworthsService.getProductsBySearchTerm(
        searchTerm,
      ),
      [RetailerEnum.Coles]: this.colesService.getProductsBySearchTerm(
        searchTerm,
      ),
      [RetailerEnum.Costco]: this.costcoService.getProductsBySearchTerm(
        searchTerm,
      ),
      [RetailerEnum.IGA]: this.igaService.getProductsBySearchTerm(searchTerm),
    };

    if (retailers) {
      const serviceCalls = map(
        retailers,
        (retailer) => searchServices[retailer],
      );

      const results = await Promise.all(values(serviceCalls));
      return flatten(results);
    }

    const allResults = await Promise.all(values(searchServices));
    return flatten(allResults);
  }
}
