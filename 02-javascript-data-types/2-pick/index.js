/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  for (let k of Object.keys(obj)) {
    if (!fields.includes(k)) {
      delete obj[k]
    }
  }

  return obj
};