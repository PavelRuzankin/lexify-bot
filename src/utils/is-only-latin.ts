export const isOnlyLatin = (input: string): boolean => {
  return /^[a-zA-Z]+$/.test(input.replace(/[\s\p{P}]/gu, ''));
}