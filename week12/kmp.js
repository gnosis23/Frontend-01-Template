/**
 * KMP 算法
 *
 */
function find(source, pattern) {
  const pi = [-1];
  let k = -1;
  for (let i = 1; i <= pattern.length; i++) {
    while (k >= 0 && pattern[k] !== pattern[i - 1]) {
      k = pi[k];
    }
    pi[i] = ++k;
  }

  k = 0;
  for (let i = 1; i <= source.length; i++) {
    while (k >= 0 && pattern[k] !== source[i - 1]) {
      k = pi[k];
    }
    k++;
    if (k === pattern.length) {
      return i - pattern.length;
    }
  }
  return -1;
}

module.exports = find;
