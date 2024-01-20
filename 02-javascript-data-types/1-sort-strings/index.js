/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];

  if (param === 'asc') {
    arrCopy.sort(compare_asc);
  } else if (param === 'desc'){
    arrCopy.sort(compare_desc);
  }
  return arrCopy
}

function compare_asc(a, b) {
  let collator = new Intl.Collator(["ru-RU", "en-EN"], {
    caseFirst: "upper"
  });

  return collator.compare(a, b)
}

function compare_desc(a, b) {
  let collator = new Intl.Collator(["ru-RU", "en-EN"], {
    caseFirst: "upper"
  });

  return collator.compare(a, b) * -1
}