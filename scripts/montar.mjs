import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nomeArquivo, renderMonobloco } from "./render-monobloco.js";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MIMES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function lerJson(relativo) {
  const arquivo = path.join(raiz, relativo);
  return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

function dataUrl(arquivo, mime) {
  const b64 = fs.readFileSync(arquivo).toString("base64");
  return `data:${mime};base64,${b64}`;
}

function listarImagens() {
  const pasta = path.join(raiz, "imagens");
  /** @type {Record<string, string>} */
  let legendas = {};
  const legendasPath = path.join(pasta, "legendas.json");
  if (fs.existsSync(legendasPath)) {
    legendas = JSON.parse(fs.readFileSync(legendasPath, "utf8"));
  }
  if (!fs.existsSync(pasta)) return [];
  return fs
    .readdirSync(pasta)
    .filter((nome) => MIMES[path.extname(nome).toLowerCase()])
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((nome) => {
      const ext = path.extname(nome).toLowerCase();
      const legenda = typeof legendas[nome] === "string" ? legendas[nome] : "";
      return {
        nome,
        legenda,
        src: dataUrl(path.join(pasta, nome), MIMES[ext]),
      };
    });
}

function fonte(nome) {
  const arquivo = path.join(raiz, "fontes", nome);
  if (!fs.existsSync(arquivo)) return "";
  return dataUrl(arquivo, "font/woff2");
}

const config = lerJson("variaveis/casal.json");
const html = renderMonobloco({
  config,
  imagens: listarImagens(),
  fonts: {
    regular: fonte("fraunces-400.woff2"),
    semibold: fonte("fraunces-600.woff2"),
    italic: fonte("fraunces-italic.woff2"),
    sans: fonte("outfit-400.woff2"),
    sansMedium: fonte("outfit-500.woff2"),
  },
});

const arquivo = nomeArquivo(Number(config.meses));
for (const nome of fs.readdirSync(raiz)) {
  if (/^\d{2}-meses\.html$/.test(nome) && nome !== arquivo) {
    fs.unlinkSync(path.join(raiz, nome));
  }
}

fs.writeFileSync(path.join(raiz, "index.html"), html);
fs.writeFileSync(path.join(raiz, arquivo), html);

if (fs.readFileSync(path.join(raiz, "index.html"), "utf8") !== fs.readFileSync(path.join(raiz, arquivo), "utf8")) {
  throw new Error("index.html e o arquivo de meses ficaram diferentes.");
}

console.log(`Carta pronta: index.html e ${arquivo} (${html.length} caracteres).`);
