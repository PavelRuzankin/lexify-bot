export type ValidationData = {
  isValid: true,
} | {
  isValid: false,
  invalidWords: string[]
}