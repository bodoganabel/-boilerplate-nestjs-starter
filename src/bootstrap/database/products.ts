import { Product } from 'src/product/product.schema';
import { EProductTypeOptions } from 'src/shop/quotation.schema';

export const pvcFamilies = [
  'Inoutic Arcade',
  'Inoutic Prestige',
  'Inoutic Eforte',
  'Rehau Euro',
  'Rehau Synegro',
  'Rehau Geneo',
];
export const woodenFamilies = [
  'Borovi Trend',
  'Borovi Gold',
  'Borovi Platinum',
];

export const families = [...pvcFamilies, ...woodenFamilies];

const products = [
  {
    category: 'Ablak',
    items: [
      EProductTypeOptions.ABLAK_FIX,
      EProductTypeOptions.ABLAK_NYILO,
      EProductTypeOptions.ABLAK_BUKO,
      EProductTypeOptions.ABLAK_BUKO_NYILO,
      EProductTypeOptions.ABLAK_KETSZARNYU_BUKO_NYILO,
      EProductTypeOptions.ABLAK_KETSZARNYU_BUKO_NYILO_TOKOSZTOTT,
    ],
  },
  {
    category: 'Erkélyajtó',
    items: [
      EProductTypeOptions.ERKEYAJTO_NYILO,
      EProductTypeOptions.ERKEYAJTO_BUKO_NYILO,
      EProductTypeOptions.ERKEYAJTO_KETSZARNYU,
      EProductTypeOptions.ERKEYAJTO_TOLO_BUKO,
    ],
  },
  {
    category: 'Bejárati Ajtó',
    items: [
      EProductTypeOptions.AJTO_EGYSZARNYU,
      EProductTypeOptions.AJTO_KETSZARNYU,
    ],
  },
];

const referenceProduct = {
  category: 'Bejárati Ajtó',
  name: 'Kétszárnyú Bejárati Ajtó',
  family: 'Inoutic Arcade',
  priceMatrix: {
    widths: [900, 1000, 1100, 1200],
    heights: [2000, 2100, 2200, 2300, 2400],
    prices: [
      [78700, 80058, 81343, 82620],
      [79903, 81254, 84804, 87509],
      [81023, 84404, 87509, 89589],
      [82149, 85058, 87651, -1],
      [83274, 85713, -1, -1],
    ],
  },
  image: '',
};

function generateProducts() {
  const result = [];

  families.forEach((family) => {
    products.forEach((product) => {
      product.items.forEach((item) => {
        result.push({
          category: product.category,
          name: item,
          family,
          priceMatrix: referenceProduct.priceMatrix,
          image: '',
        });
      });
    });
  });

  return result;
}

export const initialProducts: Product[] = generateProducts();
