import { Wage } from 'src/product/wage.schema';
import { EDeliveryBuildOptions } from '../quotation.schema';
import { IPriceInjectedProduct } from './product-prices';

export interface IServicePrices {
  service_delivery: number;
  service_build: number;
  service_shutters: number;
  service_webs: number;
  service_cills: number;
}

export function getServicePrices(
  wages: Wage,
  quotationSummary,
  priceInjectedProducts: IPriceInjectedProduct[],
): IServicePrices {
  const servicePrices = {
    service_delivery: 0,
    service_build: 0,
    service_shutters: 0,
    service_webs: 0,
    service_cills: 0,
  };

  const productCount = priceInjectedProducts.reduce(
    (total, product) => total + parseInt(product.count),
    0,
  );

  console.log('quotationSummary.quotationDetails_deliveryBuildin:');
  console.log(quotationSummary.quotationDetails_deliveryBuildin);

  switch (quotationSummary.quotationDetails_deliveryBuildin) {
    case EDeliveryBuildOptions.UNSELECTED:
      break;
    case EDeliveryBuildOptions.BEEPITES:
      {
        servicePrices.service_build =
          wages.bontasBeepites * productCount + wages.kiszallas.zona0;
      }
      break;
    case EDeliveryBuildOptions.SZALLITAS:
      {
        servicePrices.service_delivery = wages.szallitas.zona0;
      }
      break;
    case EDeliveryBuildOptions.MINDKETTO:
      {
        servicePrices.service_build =
          wages.bontasBeepites * productCount + wages.kiszallas.zona0;
        servicePrices.service_delivery = wages.szallitas.zona0;
      }
      break;

    default:
      break;
  }

  console.log('servicePrices.service_build:');
  console.log(servicePrices.service_build);
  return servicePrices;
}
