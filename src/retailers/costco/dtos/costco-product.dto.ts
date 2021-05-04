export class CostcoProductDto {
  addableToCartFromListingPage: boolean;
  availableForPickup: boolean;
  availableForPreorder: boolean;
  averageRating: number;
  businessDelivery: boolean;
  code: string;
  description: string;
  displayExVatPrice: boolean;
  englishName: string;
  excludePaymentPlan: boolean;
  expeditedDelivery: boolean;
  hasOtherOptionsVariants: boolean;
  hidePriceValue: boolean;
  images: {
    format: string;
    imageType: string;
    url: string;
  }[];
  inMyWishlist: boolean;
  inRestrictedZone: boolean;
  isBaseProduct: boolean;
  isExternalVendorProduct: boolean;
  isExternalVendorVariantProduct: boolean;
  maxOrderQuantity: number;
  maxOrderQuantityPerDateRange: number;
  membership: boolean;
  membershipRestrictionApplied: boolean;
  minOrderQuantity: number;
  modulusItemQuantity: number;
  name: string;
  nameInSelectedLanguage: string;
  productCartGroupAvailableInWarehouse: boolean;
  purchasable: boolean;
  randomWeight: boolean;
  restricted: boolean;
  shippingIncluded: boolean;
  soldIndividually: boolean;
  stock: {
    contactDay: number;
    deliveryLeadTime: number;
    stockLevelStatus: string;
  };
  summary: string;
  tire: boolean;
  url: string;
  volumePricesFlag: boolean;
  warehouseFulfilled: boolean;
  warehouseHidePriceValue: boolean;
  price: {
    currencyIso: string;
    formattedValue: string;
    priceType: string;
    value: number;
  };
  pricePerUnit: {
    currencyIso: string;
    formattedValue: string;
    priceType: string;
    value: number;
  };
  unitType: string;
}
