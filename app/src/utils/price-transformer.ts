export const priceTransformer = (priceStr: string, regex: RegExp) =>
  priceStr.replace(regex, `$1.$2`);

export const GLISSHOP_PRICE_REGEX = /[\D]*(\d+),(\d+)[\D]*/g;
export const EASYGLISS_PRICE_REGEX = /[\D]*(\d+),(\d+)[\D]*/g;
export const SNOWLEADER_PRICE_REGEX = /[\D]*(\d+),(\d+)[\D]*/g;
export const XSPO_PRICE_REGEX = /[\W\D]*(\d+),(\d+)[\W\D]*/g;
