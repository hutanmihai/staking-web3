export const timestampToDateString = (timestamp: number) => {
  return new Date(Number(timestamp) * 1000).toLocaleString()
}
