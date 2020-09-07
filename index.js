const { format_and_fix_columns } = require("./format");
const AMINO_ACID_CHARS = ["A", "R", "N", "D", "C", "Q", "E", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V", "B", "Z", "X"];
const DNA_CHARS = ["A", "T", "C", "G"];
const RNA_CHARS = ["A", "U", "C", "G"];

function random_choice(choices) {
  return choices[~~(Math.random() * choices.length)];
}

function mutate(string, alphabet, del = 0.1, ins = 0.1, replace = 0.1) {
  string = Array.from(string);
  for (let i = 0; i < ~~(del * string.length); i++) {
    let j = ~~(Math.random() * string.length);
    string = string.slice(0, j).concat(string.slice(j + 1));
  }
  for (let i = 0; i < ~~(ins * string.length); i++) {
    let j = ~~(Math.random() * string.length);
    string = string
      .slice(0, j)
      .concat([random_choice(alphabet)])
      .concat(string.slice(j));
  }
  for (let i = 0; i < ~~(replace * string.length); i++) {
    let j = ~~(Math.random() * string.length);
    string = string
      .slice(0, j)
      .concat([random_choice(alphabet)])
      .concat(string.slice(j + 1));
  }
  return string.join("");
}

class SeqGenerator {
  constructor(alphabet, len, n, mutation_rates, template, backslash, ncol) {
    this.alphabet = alphabet;
    this.len = len;
    this.n = n;
    this.mutation_rates = mutation_rates;
    this.template = template;
    this.ncol = ncol;
    this.backslash = backslash;
  }
  generate() {
    let sequences = this.gen_raw_sequences();
    if (!this.template) {
      return sequences.join("\n");
    }
    let formatted_seqs = [];
    for (let i = 0; i < this.n; i++) {
      const seq = sequences[i];
      formatted_seqs.push(format_and_fix_columns(seq, this.template, i + 1, this.ncol, this.backslash));
    }
    return formatted_seqs.join("\n");
  }
  random_seq() {
    let res = [];
    for (let i = 0; i < this.len; i++) {
      res.push(random_choice(this.alphabet));
    }
    return res.join("");
  }

  gen_raw_sequences() {
    let seq0 = this.random_seq(this.len, this.alphabet);
    let res = [seq0];
    if (this.mutation_rates) {
      for (let i = 1; i < this.n; i++) {
        res.push(mutate(seq0, this.alphabet, ...this.mutation_rates));
      }
    } else {
      for (let i = 1; i < this.n; i++) {
        res.push(this.random_seq(this.len, this.alphabet));
      }
    }
    return res;
  }
}

module.exports = { SeqGenerator, AMINO_ACID_CHARS, DNA_CHARS, RNA_CHARS };
