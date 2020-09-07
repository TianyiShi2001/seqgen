function fixed_columns(str, n, backslash = false, initial_n) {
  let res = "";
  initial_n = initial_n || n;
  if (n === 0) {
    n = str.length;
  }
  res += str.slice(0, initial_n);
  for (let i = initial_n; i < str.length; i += n) {
    backslash && (res += "\\");
    res += "\n";
    res += str.slice(i, i + n);
  }
  return res;
}

function format_i_s(template, i, str) {
  return template.replace("${i}", i).replace("${s}", str);
}

function initial_trailing_space(template, i, n) {
  let s = template.replace("${i}", i);
  let t = n - s.indexOf("${s}");
  // assert(t > 0);
  return t;
}

/**
 * Format string. Fix columns if required.
 * @param {string} str sequence (raw, not formatted)
 * @param {string} template template containing ${i} and ${s}
 * @param {number} i ${i}
 * @param {number} n number of columns
 * @param {boolean} backslash blackslash before \n
 */
function format_and_fix_columns(str, template, i, n, backslash) {
  let fixed = fixed_columns(str, n, backslash, initial_trailing_space(template, i, n));
  return format_i_s(template, i, fixed);
}

module.exports = { format_and_fix_columns };
