/**
 * Remove single element from array
 * @param {any} val - Any value that is going to remove from array
 */
Array.prototype.removeElement = function (val) {
  return this.filter((el) => el != val);
};

/**
 * Array diff remove one array from other
 * @param {array} arr - Removed array
 */
Array.prototype.removeArray = function (arr) {
  return this.filter((el) => !arr.includes(el));
};
