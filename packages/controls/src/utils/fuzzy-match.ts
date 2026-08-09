export function fuzzyMatch(input: string, search: string) {
  // Edge cases
  const searchLen = search.length;
  if (searchLen === 0) return true;
  const inputLen = input.length;
  if (searchLen > inputLen) return false;

  // Micro-optimized main loop
  let searchPos = 0;

  for (let i = 0; i < inputLen && searchPos < searchLen; i++) {
    if (input.charCodeAt(i) === search.charCodeAt(searchPos)) {
      searchPos++;
      // Early exit when remaining input can't contain remaining search
      if (searchLen - searchPos > inputLen - i - 1) return false;
    }
    // Early exit when remaining lengths match but current chars don't
    else if (searchLen - searchPos === inputLen - i) return false;
  }

  return searchPos === searchLen;
}
