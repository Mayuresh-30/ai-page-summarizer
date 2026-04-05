
const MAX_LENGTH = 48_00;

export function limitText(text: string): string {
  if (text.length <= MAX_LENGTH) return text;
  return text.slice(0, MAX_LENGTH);
}