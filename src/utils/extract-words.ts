export const extractWords = (input: string): string[] => {
  const words = input.match(/\b[\wа-яА-ЯёЁ]+\b/gu);

  return words ? [...words].map(word => word.toLowerCase()) : [];
};