"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var process_1 = require("process");
var perf_hooks_1 = require("perf_hooks");
var xanaFile = process.argv[2];
if (!xanaFile) {
  LogXanaCompilationError("Nenhum arquivo especificado!");
  (0, process_1.exit)(1);
}
if (!xanaFile.endsWith(".xs")) {
  LogXanaCompilationError("'".concat(xanaFile.substring(1), "' n\u00E3o \u00E9 um arquivo XanaScript! Arquivos XanaScript terminam em .xs"));
  (0, process_1.exit)(1);
}
fs_1.readFile(process.cwd() + xanaFile, function (err, data) {
  if (err) {
    LogXanaCompilationError("Erro ao compilar o seu arquivo! \x1b[0m \n\n" + err);
    (0, process_1.exit)(1);
  }
  LogXanaInfo("Iniciando a compila\u00E7\u00E3o de '".concat(xanaFile.substring(1), "' "));
  var t0 = perf_hooks_1.performance.now();
  var xanaScript = data.toString();
  var JSOutput = "";
  xanaScript.split(/\r?\n/).forEach(function (line) {
    if (!line)
      return;
    var lineContent = line.split(" ");
    lineContent.forEach(function (word) {
      var _a, _b;
      try {
        var previousWord = (_a = lineContent[lineContent.indexOf(word) - 1]) !== null && _a !== void 0 ? _a : "";
        var nextWord = (_b = lineContent[lineContent.indexOf(word) + 1]) !== null && _b !== void 0 ? _b : "";
        var TranslatedWord = processWord(word, nextWord, previousWord);
        JSOutput += TranslatedWord + " ";
      }
      catch (Exception) {
        LogXanaError("".concat(Exception), lineContent.indexOf(word) + 1);
        (0, process_1.exit)(1);
      }
    });
    JSOutput += "\n";
  });
  fs_1.writeFile(process.cwd() + xanaFile.replace(".xs", ".js"), JSOutput, function (err) {
    if (err)
      LogXanaCompilationError("Erro ao compilar o seu arquivo! \n\n" + err);
  });
  var elapsedTime = perf_hooks_1.performance.now() - t0;
  LogXanaInfo("Compila\u00E7\u00E3o conclu\u00EDda dentro de ".concat(elapsedTime.toFixed(2), "ms "));
});
function processWord(word, nextWord, previousWord) {
  /*
    XanaScript 'Parrow' Function
  */
  if (word.includes("8==>"))
    word = word.replace("8==>", "=>");
  /*
    XanaScript Reserved Wordss
  */
  if (word.includes("buceta") && nextWord.endsWith(")") || nextWord.endsWith("){"))
    word = word.replace("buceta", "function");
  /*
    XanaScript General
  */
  if (word.includes("ejacular("))
    word = word.replace("ejacular(", "console.log(");
  if (word.includes("copular(") && previousWord === "=")
    word = word.replace("copular(", "require(");
  /*
    XanaScript Math Operations
  */
  if (word.includes("Math.FudeNoCeu("))
    word = word.replace("Math.FudeNoCeu(", "Math.ceil(");
  if (word.includes("Math.Enquadrar("))
    word = word.replace("Math.Enquadrar(", "Math.sqrt(");
  if (word.includes("Math.LaparAoChao("))
    word = word.replace("Math.LaparAoChao(", "Math.floor(");
  return word;
}
function LogXanaError(content, line) {
  console.error("\u001B[41m XanaError: Ocorreu um erro ao processar a linha ".concat(line, " \u001B[0m"));
  console.error("\u001B[41m ".concat(content, " \u001B[0m"));
  console.log("\n");
}
function LogXanaCompilationError(content) {
  console.error("\x1b[41m XanaCompiler: " + content + "\x1b[0m");
  console.log("\n");
}
function LogXanaInfo(content) {
  console.error("\x1b[45m XanaInfo: " + content + "\x1b[0m");
  console.log("\n");
}
