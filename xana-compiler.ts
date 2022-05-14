import fs from 'fs'
import { exit } from 'process'
import { performance } from 'perf_hooks'

const xanaFile: string = process.argv[2]

if (!xanaFile) {
  LogXanaCompilationError(`Nenhum arquivo especificado!`)
  exit(1)
}

if (!xanaFile.endsWith(".xs")) {
  LogXanaCompilationError(`'${xanaFile.substring(1)}' não é um arquivo XanaScript! Arquivos XanaScript terminam em .xs`)
  exit(1)
}

fs.readFile(process.cwd() + xanaFile, (err, data) => {
  if (err) {
    LogXanaCompilationError("Erro ao compilar o seu arquivo! \x1b[0m \n\n" + err)
    exit(1)
  }

  LogXanaInfo(`Iniciando a compilação de '${xanaFile.substring(1)}' `)

  const t0 = performance.now()

  const xanaScript: string = data.toString()

  let JSOutput: string = ""

  xanaScript.split(/\r?\n/).forEach(line => {
    if (!line) return

    const lineContent: string[] = line.split(" ")

    lineContent.forEach(word => {
      try {
        let previousWord = lineContent[lineContent.indexOf(word) - 1] ?? ""
        let nextWord = lineContent[lineContent.indexOf(word) + 1] ?? ""

        const TranslatedWord: string = processWord(word, nextWord, previousWord)

        JSOutput += TranslatedWord + " "
      } catch (Exception) {
        LogXanaError(`${Exception}`, lineContent.indexOf(word) + 1)
        exit(1)
      }
    })

    JSOutput += "\n"
  })

  fs.writeFile(process.cwd() + xanaFile.replace(".xs", ".js"), JSOutput, (err) => {
    if (err) LogXanaCompilationError("Erro ao compilar o seu arquivo! \n\n" + err)
  })

  const elapsedTime = performance.now() - t0

  LogXanaInfo(`Compilação concluída dentro de ${elapsedTime.toFixed(2)}ms `);
})

function processWord(word: string, nextWord: string, previousWord: string) {
  /*
    XanaScript 'Parrow' Function
  */
  if (word.includes("8==>"))
    word = word.replace("8==>", "=>")

  /*
    XanaScript Reserved Wordss
  */
  if (word.includes("buceta") && nextWord.endsWith(")") || nextWord.endsWith("){"))
    word = word.replace("buceta", "function")


  /*
    XanaScript General
  */
  if (word.includes("ejacular("))
    word = word.replace("ejacular(", "console.log(")

  if (word.includes("copular(") && previousWord === "=")
    word = word.replace("copular(", "require(")


  /*
    XanaScript Math Operations
  */
  if (word.includes("Math.FudeNoCeu("))
    word = word.replace("Math.FudeNoCeu(", "Math.ceil(")

  if (word.includes("Math.Enquadrar("))
    word = word.replace("Math.Enquadrar(", "Math.sqrt(")

  if (word.includes("Math.LaparAoChao("))
    word = word.replace("Math.LaparAoChao(", "Math.floor(")

  return word
}

function LogXanaError(content: string, line: number) {
  console.error(`\x1b[41m XanaError: Ocorreu um erro ao processar a linha ${line} \x1b[0m`)
  console.error(`\x1b[41m ${content} \x1b[0m`)
  console.log("\n")
}

function LogXanaCompilationError(content: string) {
  console.error("\x1b[41m XanaCompiler: " + content + "\x1b[0m")
  console.log("\n")
}

function LogXanaInfo(content: string) {
  console.error("\x1b[45m XanaInfo: " + content + "\x1b[0m")
  console.log("\n")
}

