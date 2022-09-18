import { Product } from 'src/product/product.schema';
import { roundNearest100 } from 'src/utils/math-functions';
import { IQuotationSummary } from '../dto/quotation.dto';

export function validateQuotation(
  products: Product[],
  quotationSummary: IQuotationSummary,
) {
  console.log('products:');
  console.log(products);

  console.log('quotationSummary:');
  console.log(quotationSummary);

  let allGood = true;

  quotationSummary.quotationProducts.forEach((quotationProduct) => {
    const product = products.find((product) => {
      if (
        product.name === quotationProduct.productType &&
        product.family === quotationSummary.family
      )
        return true;
      return false;
    });
    console.log('product:');
    console.log(product);

    const roundedHeight = roundNearest100(quotationProduct.height);
    const roundedWidth = roundNearest100(quotationProduct.width);

    if (
      product === undefined ||
      !product.priceMatrix.heights.includes(roundedHeight) ||
      !product.priceMatrix.widths.includes(roundedWidth)
    ) {
      console.log('product width/height is unorthodox');
      allGood = false;
      return;
    }
    const hidx = product.priceMatrix.heights.findIndex(
      (height) => height === roundedHeight,
    );
    const widx = product.priceMatrix.widths.findIndex(
      (width) => width === roundedWidth,
    );
    if (
      hidx === -1 ||
      widx === -1 ||
      product.priceMatrix.prices.length < hidx + 1 || //overflow - nonexistent price
      product.priceMatrix.prices[hidx].length < widx + 1 || //overflow - nonexistent price
      product.priceMatrix.prices[hidx][widx] === -1 //not available price
    ) {
      console.log(
        `product price is unavailable. \n product: ${product.family} ${product.name}hidx: ${hidx} widx: ${widx}`,
      );
      allGood = false;
      return;
    }
  });

  if (!allGood) {
    return false;
  }

  console.log('All Good');
  return true;
}

export function getProductPriceByDimensions(
  height: number,
  width: number,
  product: Product,
): { hidx; widx; price; error } {
  const roundedHeight = roundNearest100(height);
  const roundedWidth = roundNearest100(width);

  if (
    product === undefined ||
    !product.priceMatrix.heights.includes(roundedHeight) ||
    !product.priceMatrix.widths.includes(roundedWidth)
  ) {
    console.log('product width/height is unorthodox');
    return {
      widx: undefined,
      hidx: undefined,
      price: undefined,
      error: 'Price not found for these dimensions',
    };
  }
  const hidx = product.priceMatrix.heights.findIndex(
    (height) => height === roundedHeight,
  );
  const widx = product.priceMatrix.widths.findIndex(
    (width) => width === roundedWidth,
  );

  if (
    hidx === -1 ||
    widx === -1 ||
    product.priceMatrix.prices.length < hidx + 1 || //overflow - nonexistent price
    product.priceMatrix.prices[hidx].length < widx + 1 || //overflow - nonexistent price
    product.priceMatrix.prices[hidx][widx] === -1 //not available price
  ) {
    const errorString = `product price is unavailable. \n product: ${product.family} ${product.name}hidx: ${hidx} widx: ${widx}`;
    console.log(errorString);
    return {
      hidx: undefined,
      widx: undefined,
      price: undefined,
      error: errorString,
    };
  }

  const price = product.priceMatrix.prices[hidx][widx];

  return { hidx, widx, price, error: undefined };
}
