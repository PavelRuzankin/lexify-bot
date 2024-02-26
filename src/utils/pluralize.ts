export const pluralize = (
  n: number,
  one: string,
  two: string,
  five: string
) => {
  if (n === 0) {
    return five;
  }

  let number = n;
  number = Math.abs(number);
  number %= 100;

  if (number >= 5 && number <= 20) {
    return five;
  }

  number %= 10;

  if (number === 1) {
    return one;
  }

  if (number >= 2 && number <= 4) {
    return two;
  }

  return five;
};