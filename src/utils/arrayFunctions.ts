export const isArrayContainsAllTargetElements = (
  array: any[],
  target: any[],
) => {
  if (target.length === 0) {
    return false;
  }
  return target.every((value) => array.includes(value));
};

export function deepCopy_JSON(target: any[]) {
  return JSON.parse(JSON.stringify(target));
}
