/**
 * KMP 状态机
 *
 */

function match(pattern, string) {
  let fallbacks = buildFallbacks(pattern);

  let steps = [];
  for (let i = 0; i < pattern.length - 1; i++) {
    steps[i] = function (ch) {
      if (ch === pattern[i + 1]) {
        return i === pattern.length - 2 ? end : steps[i+1];
      } else {
        const fallbackIndex = fallbacks[i];
        return fallbackIndex === -1 ? start(ch) : steps[fallbackIndex](ch);
      }
    };
  }
  function start(ch) {
    return ch === string[0] ? steps[0] : start;
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

/**
 * 构建回退偏移
 * @param pattern 字符串
 */
function buildFallbacks(pattern) {
  let fallbacks = [];
  for (let i = 0; i < pattern.length; i++) {
    fallbacks[i] = -1;
    if (i !== 0) {
      let lastMatch = i - 1;
      while (true) {
        lastMatch = fallbacks[lastMatch]
        if (pattern[lastMatch + 1] === pattern[i]) {
          fallbacks[i] = lastMatch + 1;
          break;
        }
        if (lastMatch === -1) break;
      }
    }
  }
  return fallbacks;
}

function expect(target, actual, pattern = 'abababx') {
  if (target !== match(pattern, actual)) console.error(actual, pattern);
}

expect(false, "abcdefg");
expect(false, "aaaaa");
expect(true, "abababxdkfj");
expect(true, "ababxxxabababxababab");
expect(false, "ababxxxabababxababab", 'aaaa');
expect(true, "ababxxxabababxababab", 'abxxx');
