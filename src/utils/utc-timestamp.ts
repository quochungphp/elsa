export const utcTimestamp = (): number => {
  return Date.now();
};

export function measureTime<T>(func: () => T): T {
  const start = Date.now();
  const result = func();
  const end = Date.now();
  const elapsedTime = end - start;
  console.log(`Time elapsed for ${func}: ${elapsedTime}ms`);
  return result;
}

export async function measureTimeAsync<T>(func: () => Promise<T>): Promise<T> {
  const start = Date.now();
  const result = await func();
  const end = Date.now();
  const elapsedTime = end - start;
  console.log(`Time elapsed for ${func}: ${elapsedTime}ms`);
  return result;
}

export function secondsUntilEndOfDate(): number {
  const d = new Date(Date.now());
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const secondsUntilEndOfDate = 24 * 60 * 60 - h * 60 * 60 - m * 60 - s;
  return secondsUntilEndOfDate;
}
