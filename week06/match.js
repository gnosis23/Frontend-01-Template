/**
 * Homework: 使用状态机处理 abababx 字符串
 *
 */

function match(string) {
  const target = "abababx";
  // fallback 表示状态不匹配的时候，回退到哪个状态继续。-1表示回到start
  // index    -1  0  1  2  3  4  5  6
  // string    S  a  b  a  b  a  b  x  E
  // fallback    -1 -1  0  1  2  3 -1
  let fallbacks = [-1, -1, 0, 1, 2, 3, -1];

  let steps = [];
  for (let i = 0; i < target.length - 1; i++) {
    steps[i] = function (ch) {
      if (ch === target[i + 1]) {
        return i === target.length - 2 ? end : steps[i+1];
      } else {
        const fallbackIndex = fallbacks[i];
        return fallbackIndex === -1 ? start(ch) : steps[fallbackIndex](ch);
      }
    };
  }
  function start(ch) {
    return ch === 'a' ? steps[0] : start;
  }
  function end() {
    return end;
  }

  let state = start;
  for (let ch of string) {
    state = state(ch);
  }
  return state === end;
}

function expect(target, actual) {
  if (target !== match(actual)) console.error(actual);
}
expect(false, "abcdefg");
expect(false, "aaaaa");
expect(true, "abababxdkfj");
expect(true, "ababxxxabababxababab");
