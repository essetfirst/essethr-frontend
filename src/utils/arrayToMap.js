export default function arrayToMap(array, key) {
  if (typeof array !== typeof []) {
    return new Error("Expected argument to be type array");
  }

  return array
    .map((elem) => ({ [elem[key]]: elem }))
    .reduce((prev, next) => Object.assign({}, prev, next), {});
}
