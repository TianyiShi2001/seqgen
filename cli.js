#!/usr/bin/env node
let yargs = require("yargs");
let { SeqGenerator, AMINO_ACID_CHARS, DNA_CHARS, RNA_CHARS } = require("./index.js");

let format = require("./format.js");
const { boolean, number } = require("yargs");
let argv = yargs // eslint-disable-line
  .alias("V", "version")
  .alias("h", "help")
  .help("help")
  .usage("Usage: $0 [OPTIONS] NUMBER_OF_SEQUENCES")
  .option("dna", {
    alias: "d",
    describe: "Generate DNA sequences",
    type: "boolean",
    demand: false,
  })
  .option("rna", {
    alias: "r",
    describe: "Generate RNA sequences",
    type: "boolean",
    demand: false,
  })
  .option("protein", {
    alias: "p",
    describe: "Generate DNA sequences",
    type: "boolean",
    demand: false,
  })
  .option("mutate", {
    alias: "m",
    describe: "Deletion, insersion, and substitution rates.",
    type: "string",
  })
  .option("template", { alias: "t", describe: "template", type: String })
  .option("ncol", { alias: "n", describe: "number of columns", type: number })
  .option("backslash", { alias: "b", describe: "backslash before newline", type: boolean })
  .example("$0 cli.js -p 1000\n└───→Generate a random polypeptide sequence with 1000 amino acid residues")
  .example("$0 cli.js 1000 5 -t 'let DNA_${i} = \"${s}\";' -n80\n└───→Generate 5 1000-nucleotide sequences; format using the given template; column width=80")
  .epilog("copyright (c) 2020 Tianyi Shi")
  .showHelpOnFail(false).argv;

function parse_related(m) {
  if (m === undefined) {
    return undefined;
  }
  if (m === "") {
    return [0.2, 0.2, 0.2];
  }
  let n = m
    .split(/,\s*/g)
    .map((n) => +n)
    .map((n) => (n < 1 ? n : n / 100));
  return n;
}

function main() {
  let related = parse_related(argv.m);
  let len = argv._[0];
  let n = argv._[1];
  let alphabet = argv.dna ? DNA_CHARS : argv.rna ? RNA_CHARS : argv.protein ? AMINO_ACID_CHARS : DNA_CHARS;
  let generator = new SeqGenerator(alphabet, len, n, related, argv.template, argv.backslash, argv.ncol);
  let res = generator.generate();
  console.log(res);
}

let template = 'static DNA_${i}: &\'static [u8] = b"${s}";';
main();
