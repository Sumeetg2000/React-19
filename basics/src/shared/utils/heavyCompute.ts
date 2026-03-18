export function heavyCompute(input: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < 20000; i++) {
    result.push(`${input}-${i}`);
  }
  return result;
}