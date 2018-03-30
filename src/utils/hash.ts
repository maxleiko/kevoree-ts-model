/* tslint:disable:no-bitwise */
export function hash(data: string) {
  let val = 0;
  if (data.length === 0) {
    return val + '';
  }
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    val = (val << 5) - val + char;
    val = val & val; // Convert to 32bit integer
  }
  return (val & 0xfffffff) + '';
}
