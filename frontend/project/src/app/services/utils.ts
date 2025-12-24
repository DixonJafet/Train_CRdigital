export function addMinutes(time: string, minutesToAdd: number): string {
  let [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + minutesToAdd);

  return date.toTimeString().slice(0, 5); 
}