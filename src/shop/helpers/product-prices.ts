import { EConstants } from 'src/config';
import { Cill } from 'src/product/cill.schema';
import { Product } from 'src/product/product.schema';
import { Shutter } from 'src/product/shutter.schema';
import { IQuotationProduct, IQuotationSummary } from '../dto/quotation.dto';
import { ECillOptions, EShutterOptions } from '../quotation.schema';
import { getProductPriceByDimensions } from './quotation-validation';

export interface IPriceInjectedProduct extends IQuotationProduct {
  price: number;
  name: string;
  warning?: string;
}
export function injectPricesToQuotationProducts(
  quotationSummary: IQuotationSummary,
  targetedProducts: Product[],
  cills: Cill,
  shutters: Shutter,
): IPriceInjectedProduct[] {
  const priceInjectedProducts: IPriceInjectedProduct[] = [];
  quotationSummary.quotationProducts.forEach((quotationProduct) => {
    const matchingProduct = targetedProducts.find(
      (targetedProduct) =>
        targetedProduct.family === quotationSummary.family &&
        targetedProduct.name === quotationProduct.productType,
    );
    const { price, error } = getProductPriceByDimensions(
      quotationProduct.height,
      quotationProduct.width,
      matchingProduct,
    );
    if (error !== undefined) {
      return;
    }

    const priceInjectedProduct = {
      ...quotationProduct,
      name: quotationProduct.productType,
      price: price,
    };
    priceInjectedProducts.push(priceInjectedProduct);

    //If there is cill, add cill to products
    if (quotationProduct.cill !== ECillOptions.UNSELECTED) {
      const priceInjectedCill = {
        ...quotationProduct,
        name: `Ablakpárkány: ${quotationProduct.cill}`,
        price: getCillPrice(quotationProduct.cill, cills),
      };
      priceInjectedProducts.push(priceInjectedCill);
    }

    //If there is shutter, add shutter to products
    if (quotationProduct.shutter !== EShutterOptions.UNSELECTED) {
      const { price, warning } = getShutterPrice(
        quotationProduct.width,
        quotationProduct.height,
        quotationProduct.shutter,
        shutters,
      );

      const priceInjectedShutter = {
        ...quotationProduct,
        name: `Redőny: ${quotationProduct.shutter}`,
        price,
        warning,
      };
      priceInjectedProducts.push(priceInjectedShutter);
    }
  });

  console.log('priceInjectedProducts:');
  console.log(priceInjectedProducts);

  return priceInjectedProducts;
}

function getCillPrice(cill, cills) {
  switch (cill) {
    case ECillOptions.CILL_KULSO_ALUMINIUM: {
      return cills.aluminium.cm10;
    }
    case ECillOptions.CILL_BELSO_KULSO_ALUMINIUM: {
      return cills.aluminium.cm10;
    }
    case ECillOptions.CILL_BELSO_MUANYAG: {
      return cills.pvc.cm10;
    }
    case ECillOptions.CILL_BELSO_KULSO_MUANYAG: {
      return cills.pvc.cm10;
    }
    default:
      return 0;
  }
}
function getShutterPrice(
  width_mm,
  height_mm,
  shutter: EShutterOptions,
  shutters: Shutter,
): { price: number; warning?: string } {
  switch (shutter) {
    case EShutterOptions.SHUTTER_ALUMINIUM: {
      return getPriceFromArea(
        width_mm,
        height_mm,
        shutters.aluminium.nmAr,
        shutters.aluminium.minFizetendoNm,
        shutters.aluminium.maxRendelhetoNm,
      );
    }
    case EShutterOptions.SHUTTER_ALUMINIUM_SZUNYOGHALO: {
      return getPriceFromArea(
        width_mm,
        height_mm,
        shutters.aluminiumSzunyoghalos.nmAr,
        shutters.aluminiumSzunyoghalos.minFizetendoNm,
        shutters.aluminiumSzunyoghalos.maxRendelhetoNm,
      );
    }
    case EShutterOptions.SHUTTER_MUANYAG: {
      return getPriceFromArea(
        width_mm,
        height_mm,
        shutters.muanyag.nmAr,
        shutters.muanyag.minFizetendoNm,
        shutters.muanyag.maxRendelhetoNm,
      );
    }
    case EShutterOptions.SHUTTER_MUANYAG_SZUNYOGHALO: {
      return getPriceFromArea(
        width_mm,
        height_mm,
        shutters.muanyagSzunyoghalos.nmAr,
        shutters.muanyagSzunyoghalos.minFizetendoNm,
        shutters.muanyagSzunyoghalos.maxRendelhetoNm,
      );
    }

    default:
      return {
        price: 0,
        warning: 'Ennél a terméknél az árszámításban hiba történt',
      };
  }
}

function getPriceFromArea(
  width_mm,
  height_mm,
  pricePerM2,
  minPrice,
  maxM2,
): { price: number; warning: string | undefined } {
  const area_m2 = width_mm * height_mm * EConstants.mm2_TO_m2;
  console.log('area:');
  console.log(area_m2);
  console.log('pricePerM2:');
  console.log(pricePerM2);
  console.log('area*pricePerM2:');
  console.log(area_m2 * pricePerM2);
  if (area_m2 * pricePerM2 < minPrice) {
    return {
      price: minPrice,
      warning: `Legkisebb fizetendő összeg: ${minPrice} Ft`,
    };
  }
  if (area_m2 > maxM2) {
    return {
      price: minPrice,
      warning: `A legnagyobb választható felület: ${maxM2} négyzetméter. A kívánt mennyiség ezt meghaladja.`,
    };
  }
  return {
    price: area_m2 * pricePerM2,
    warning: undefined,
  };
}
