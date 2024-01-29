/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let res = ''
  const obj = {
    str: '',
    cnt: 0,
  }
  for (let i = 0; i < string.length; i++) {
    if (obj.str !== string.charAt(i)) {
      obj.cnt = 0;
    }
    if (obj.cnt >= size){
      continue;
    }
    obj.str = string.charAt(i);
    obj.cnt += 1;

    res += string.charAt(i);
  }
  return res;
}
