/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];

  if (param === 'asc') {
    arrCopy.sort(compareAsc);
  } else if (param === 'desc') {
    arrCopy.sort(compareDesc);
  }
  return arrCopy;
}

const collator = new Intl.Collator(["ru-RU", "en-EN"], {
  caseFirst: "upper"
});

const compareAsc = (a, b) => collator.compare(a, b);

const compareDesc = (a, b) => {
  return collator.compare(a, b) * -1;
};
