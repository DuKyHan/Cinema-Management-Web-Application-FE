export const requireNonNull = <T>(value: T | null | undefined): T => {
  if (value == null) {
    throw new Error('Value is null or undefined');
  }
  return value;
};

export const alphabetNumberFromRowColumn = (
  row: number,
  column: number,
): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${alphabet[row]}${column + 1}`;
};

export const numberCompactFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
});
