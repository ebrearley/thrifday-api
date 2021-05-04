import { Injectable } from '@nestjs/common';
import { ProductModel } from '../models/product.model';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { map, toNumber, compact } from 'lodash';
import { ColesScrapedProductDto } from './dtos/coles-scraped-product.dto';

@Injectable()
export class ColesService {
  async getProductsBySearchTerm(searchTerm: string): Promise<ProductModel[]> {
    const searchUrl = `https://shop.coles.com.au/a/burwood-east/everything/search/${encodeURI(
      searchTerm,
    )}`;

    const products = await this.getSearchPageResults(searchUrl);
    return map(compact(products), ProductModel.fromColesProductDto) || [];
  }

  private async getSearchPageResults(
    url: string,
  ): Promise<ColesScrapedProductDto[]> {
    const pageHtml = await this.getPageHtml(url);
    const $ = cheerio.load(pageHtml);

    const $products = $('.product');

    const products = map($products, ($product) => {
      const dollarValue = $('.dollar-value', $product).text();
      const centValue = $('.cent-value', $product).text();
      const price = toNumber(`${dollarValue}${centValue}`);

      const brand = $('.product-brand', $product).text();
      const name = $('.product-name', $product).text();
      const packageSize = $('.product-info .package-size', $product).text();
      const unitPrice = $('.package-price', $product).text();
      const productPageUrl = `https://shop.coles.com.au/${$('a', $product).attr(
        'href',
      )}`;

      const imageUrl = `https://shop.coles.com.au/${$('img', $product).attr(
        'src',
      )}`;

      if (!name || !price) {
        return null;
      }

      const productModel: ColesScrapedProductDto = {
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

  private async getPageHtml(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    );
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      Cookie:
        'AMCV_0B3D037254C7DE490A4C98A6%40AdobeOrg=1585540135%7CMCIDTS%7C18751%7CMCMID%7C73141151028445273930605524526606661495%7CMCAAMLH-1620645295%7C8%7CMCAAMB-1620645295%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1620047695s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-18758%7CvVersion%7C4.4.0; mbox=PC#396994ba6cf3406f80e0dd808db37981.36_0#1683285297|session#084266f7ea2e4366948865cfe64b153b#1620044009; _ga=GA1.3.1307995805.1575065622; MK_iplz=DB0vG0j6aHCdUrrco51ZcQ%3D%3D%3A%3AqxQcGPtnsFOMZBfGjX49UCdIWPmuX3FIM2vj33AkwZxcuiiOfL3WfvNyhSA4a2nvIQ0ASF2F5bYgqgGbrUtFNcceVNz%2BQyLS59%2FbwJUsuJ7vSCk9j1s8QG0cxeug6M%2BXrLphMW2HFEisjoMNSgsvjlcBIHO3Tpw9LQ8RVtF%2FBN1qdOtRlXC%2BBxPvHZHa7XD43GtHieEBaKxVtbDVOefCYAz8FgpxSwCGLWuhK0KtkNA2C2BnfxrkYp97bgyUJ4jA%2BYQnmZWaLoUiWZ468HCFTsVwQxmMbyPMwG9KIvOw4AqyMnSrXP%2Fp5fo3Oao8d%2FV7vgapjEFxQmJqaqp9jkWyezhQ9wSqGj8xLQ5AAiMHdrHUG1ye24bPBDLajzxSIciieODUz2rJWP4AeQXuxHYMxIHTFVv2%2BYORifsr%2FO36K4VtCT%2BzFE3M6%2BuWW5T%2BSOqaZTOAaT8GkyJDY93M43rE%2BTgYYlE%2FVMlALrzMRf4mvlBSGGIp%2B6xyFFPfNo5H4DsW; cf_uid1.7=640591ff-3d2b-fa1e-4c85-ede9530a3217; cache-generation=20210502T193736; JSESSIONID=0000Q_8FUnPmreC_VMfTTA-bZ9p:1ed88tmb3; WC_PERSISTENT=v0i4o559vsE3SqJn%2Fea9O46TZcecD3HffoBI5o6My7o%3D%3B2021-05-03+21%3A41%3A57.71_1620040494057-99756_20533_-1002%2C-1%2CAUD_20601_-1002%2C-1%2CAUD_20525_-1002%2C-1%2CAUD_20525; UID=-1002|20525|null|G; WC_SESSION_ESTABLISHED=true; WC_AUTHENTICATION_-1002=-1002%2Ccs9VOnH7HEM5Akfm%2FzKZnU1jUC%2B%2FSJYXwQXPaYtwdg8%3D; WC_ACTIVEPOINTER=-1%2C20525; WC_USERACTIVITY_-1002=-1002%2C20525%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C1517979015%2C8vYpwZhJdKTf8fG7e%2Fy8CveaYT1eDEZxHhuYmsNrfF5f4iH17WzUuenpJjqejqSBlPHECdt%2Fa1LgI2pmczxC4bwN0NdA3XST9SsaCukkopIua20Fey%2BGuE2DjLeY3mshPy9Lilof6AnBgpjMUhVIeY%2Bcc2gQ3FZ5z12frGyIPqYsku%2FeEPjU1d7N%2BcVyTkep9HEIQuDfPR3nzWjwuDsuMmXVq89qZTIRk7gI2b8cp2kW8XH1Y7hoEDBrM3eNIVDw; WC_GENERIC_ACTIVITYDATA=[16368216955%3Atrue%3Afalse%3A0%3A8yBgosabPB9BJUtasc4NoLxiKwwm9AzXx7EzVr3qVBk%3D][com.ibm.commerce.context.entitlement.EntitlementContext|10502%26null%2610502%26-2000%26null%26null%26null][com.ibm.commerce.context.audit.AuditContext|1620040494057-99756][com.ibm.commerce.context.globalization.GlobalizationContext|-1%26AUD%26-1%26AUD][com.ibm.commerce.store.facade.server.context.StoreGeoCodeContext|null%26null%26null%26null%26null%26null][com.ibm.commerce.context.experiment.ExperimentContext|null][com.ibm.commerce.context.ExternalCartContext|null][com.ibm.commerce.giftcenter.context.GiftCenterContext|null%26null%26null][au.com.coles.commerce.businesscontext.MemberAttributeContext|null][com.ibm.commerce.catalog.businesscontext.CatalogContext|29102%26null%26false%26false%26false][au.com.coles.framework.session.SessionContext|sessionid%253Aq2roEmeP2KLaAD_nKg5D2pP][CTXSETNAME|Store][com.ibm.commerce.context.base.BaseContext|20525%26-1002%26-1002%26-1]; check=true; canBrowseRestrictedProductsFlag=0; _gid=GA1.3.1215726918.1620040495; AMCVS_0B3D037254C7DE490A4C98A6%40AdobeOrg=1; deviceFP=010a30ca89bdf29186804b9ad6553ba1; BVBRANDID=5a15e1e3-613e-4260-be7e-464aa5a2583c; gs_v_GSN-452615-M=; gs_u_GSN-452615-M=f5a95e6be6aa4e5cbd767c07a10c21b5:3663:7274:1620042148710; firstVisit=1620040497.962; s_cc=true; ORA_FPC=id=da682bae-7a1f-4159-aa51-f4f6aec4b6ca; WTPERSIST=; analytics_integration=analytics%3D18014444; aam_uuid=78200483302310077830099590671970426481; s_sq=%5B%5BB%5D%5D; _fbp=fb.2.1620041075433.148577387; rslc=20525|29102|35; localisationCookie=10525|29102; ADRUM=s=1620045687086&r=https%3A%2F%2Fshop.coles.com.au%2Fa%2Fburwood-east%2Feverything%2Fsearch%2Fstrawberries%3F-694905333; JCOLAPP=0000TEKzSoJqEP9FPwHIZbSVO8S:1ehch5r71; sqaccessId.772313=5IhX4FXW3U4NyZn7:1620049182:85c458f90150ab8f74864ab8f26d486de854329045969388a13cf6ce5000e339; gs_p_GSN-452615-M=6; cf_uid1.7=640591ff-3d2b-fa1e-4c85-ede9530a3217; JSESSIONID=0000vHgQkgrd6w3lLxXrxv08xc2:1ed88tmb3; MK_iplz=SqiMR9JzNyBgherL%2BYGeiQ%3D%3D%3A%3AfwhtRgErMD5mv68F2KZR4OZ4Vy5ffW0qQ8vUrRG7UzyUP%2BvqUQKbTOFBn0BwzK7%2BpY97y%2BRzMFVp%2BS5A659JkMf2AxVzVDfjVP0Lyaa3yuEXdEmC6odfJM2BrKE9bq1sF4ovzK0bOI9yBse1nGWPiDBcXt2WVXEqYlXsNsD2Hp94n%2FU5qvna1ieJpa0B3fj8kMbVfmo%2Bb%2Bg%2BQyiQPsQ1S2YLf42GjPDdfaBcoJQJBsD8Rg927TYtVqmMkSnH7qIG8ikctbAw6wqifhD5qB8QLNPc2ejfJqEbLNZ4iyaqCfRi92bq6aN8Iy60mKbk5hbAXOTdmwTriw7sA6EQldhICYWlshuvniJ7k4EjrD05LSWCqi1PxOmdnk%2BsZWglG%2Bbh%2F6p1LNl4K30aEr33Nmb7zmJO0Bg092ami6R5uDuYui1Wkg3mNLqSUWGemwNYhNSsfyWRCDPMiLS6yUMF%2FXVHIxv2HGJzWuxfIbkfqNQwd90vkEba5r3joqPEuxp2g7f3; sqaccessId.772313=5IhX4FXW3U4NyZn7:1620048946:f6b3f6f8dbf2cbb85f3e33c491208e1142b496c2a6024e47814bac3051067a01',
      'Upgrade-Insecure-Requests': '1',
    });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const pageHtml = await page.content();
    await browser.close();

    return pageHtml;
  }
}
