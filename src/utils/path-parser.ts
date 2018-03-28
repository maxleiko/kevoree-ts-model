/* tslint:disable:max-classes-per-file */
export class SyntaxError extends Error {
  constructor(public message: any, public expected: any, public found: any, public location: any) {
    super();
    Object.setPrototypeOf(this, SyntaxError.prototype);
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, SyntaxError);
    }
  }
}

function buildMessage(expected: any, found: any) {
  const DESCRIBE_EXPECTATION_FNS: { [s: string]: (...args: any[]) => string } = {
    literal: (expectation: any) => {
      return '"' + literalEscape(expectation.text) + '"';
    },

    class: (expectation: any) => {
      let escapedParts = '';
      let i;

      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts +=
          expectation.parts[i] instanceof Array
            ? classEscape(expectation.parts[i][0]) + '-' + classEscape(expectation.parts[i][1])
            : classEscape(expectation.parts[i]);
      }

      return '[' + (expectation.inverted ? '^' : '') + escapedParts + ']';
    },

    any: () => {
      return 'any character';
    },

    end: () => {
      return 'end of input';
    },

    other: (expectation: any) => {
      return expectation.description;
    }
  };

  function hex(ch: any) {
    return ch
      .charCodeAt(0)
      .toString(16)
      .toUpperCase();
  }

  function literalEscape(s: any) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, (ch: any) => {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch: any) => {
        return '\\x' + hex(ch);
      });
  }

  function classEscape(s: any) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g, '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, (ch: any) => {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch: any) => {
        return '\\x' + hex(ch);
      });
  }

  function describeExpectation(expectation: any) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(e: any) {
    const descriptions = new Array(e.length);
    let i;
    let j;

    for (i = 0; i < e.length; i++) {
      descriptions[i] = describeExpectation(e[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + ' or ' + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(', ') + ', or ' + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(f: any) {
    return f ? '"' + literalEscape(f) + '"' : 'end of input';
  }

  return 'Expected ' + describeExpected(expected) + ' but ' + describeFound(found) + ' found.';
}

export function parse(input: string, options: any = {}) {
  let peg$startRuleFunction = peg$parsePath;
  const peg$FAILED = {};
  const peg$startRuleFunctions: any = { Path: peg$parsePath };
  const peg$c0 = '/';
  const peg$c1 = peg$literalExpectation('/', false);
  const peg$c2 = (refs: any) => {
      return refs || [];
  };
  const peg$c3 = '[';
  const peg$c4 = peg$literalExpectation('[', false);
  const peg$c5 = ']';
  const peg$c6 = peg$literalExpectation(']', false);
  const peg$c7 = (ref: any, key: any) => {
      return { ref, key };
  };
  const peg$c8 = (ref: any, refs: any) => {
      return [ref].concat(refs);
  };
  const peg$c9 = (ref: any) => {
      return [ref];
  };
  const peg$c10 = peg$otherExpectation('ref');
  const peg$c11 = /^[a-zA-Z0-9_]/;
  const peg$c12 = peg$classExpectation([['a', 'z'], ['A', 'Z'], ['0', '9'], '_'], false, false);
  const peg$c13 = peg$otherExpectation('key');
  const peg$c14 = /^[a-zA-Z0-9_:.-]/;
  const peg$c15 = peg$classExpectation([['a', 'z'], ['A', 'Z'], ['0', '9'], '_', ':', '.', '-'], false, false);
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailExpected: any[] = [];
  let peg$currPos = 0;
  let peg$savedPos = 0;
  let peg$maxFailPos = 0;
  let peg$silentFails = 0;
  let peg$result: any;

  if ('startRule' in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description: any, l: any) {
    l = l !== void 0 ? l : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      l
    );
  }

  function error(message: any, l: any) {
    l = l !== void 0 ? l : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, l);
  }

  function peg$literalExpectation(t: any, ignoreCase: any) {
    return { type: 'literal', text: t, ignoreCase };
  }

  function peg$classExpectation(parts: any, inverted: any, ignoreCase: any) {
    return { type: 'class', parts, inverted, ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: 'any' };
  }

  function peg$endExpectation() {
    return { type: 'end' };
  }

  function peg$otherExpectation(description: any) {
    return { type: 'other', description };
  }

  function peg$computePosDetails(pos: any) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos: any, endPos: any) {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(e: any) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(e);
  }

  function peg$buildSimpleError(message: any, l: any) {
    return new SyntaxError(message, null, null, l);
  }

  function peg$buildStructuredError(e: any, found: any, l: any) {
    return new SyntaxError(buildMessage(e, found), e, found, l);
  }

  function peg$parsePath() {
    let s0;
    let s1;
    let s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 47) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c1);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseRefList();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseRef() {
    let s0;
    let s1;
    let s2;
    let s3;
    let s4;

    s0 = peg$currPos;
    s1 = peg$parseRefString();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 91) {
        s2 = peg$c3;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c4);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseKeyString();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s4 = peg$c5;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c6);
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c7(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseRefList(): any {
    let s0;
    let s1;
    let s2;
    let s3;

    s0 = peg$currPos;
    s1 = peg$parseRef();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 47) {
        s2 = peg$c0;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c1);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseRefList();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c8(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseRef();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseRefString() {
    let s0;
    let s1;
    let s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c11.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c12);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c11.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c12);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c10);
      }
    }

    return s0;
  }

  function peg$parseKeyString() {
    let s0;
    let s1;
    let s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c14.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c15);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c14.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c15);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c13);
      }
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}