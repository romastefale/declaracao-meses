// @ts-check
/**
 * Gera o texto e o HTML monobloco da carta.
 * O mesmo arquivo serve o site (index) e o download (NN-meses.html).
 */

/**
 * @typedef {"masculino" | "feminino" | "neutro"} Genero
 * @typedef {{ nome: string, genero: string }} Pessoa
 * @typedef {{
 *   meses: number,
 *   remetente: Pessoa,
 *   destinatario: Pessoa,
 *   recado?: string,
 *   repositorio?: string,
 * }} Config
 * @typedef {{ nome: string, legenda: string, src: string }} Imagem
 * @typedef {{ regular: string, semibold: string, italic: string, sans: string, sansMedium: string }} Fontes
 * @typedef {{ numero: string, texto: string, agora: boolean }} Marco
 * @typedef {{
 *   titulo: string,
 *   arquivo: string,
 *   olho: string,
 *   nomeR: string,
 *   nomeD: string,
 *   paragrafos: string[],
 *   amores: string[],
 *   tempoTitulo: string,
 *   tempo: Marco[],
 *   fecho: string,
 *   seu: string,
 *   recado: string,
 *   repo: string,
 * }} Modelo
 */

export const coracoes = [
  { top: "7%", left: "6%", size: 28, delay: "0s", opacity: 0.5, rot: "-16deg", ouro: false },
  { top: "16%", left: "84%", size: 46, delay: "0.7s", opacity: 0.36, rot: "10deg", ouro: true },
  { top: "40%", left: "3%", size: 18, delay: "1.3s", opacity: 0.34, rot: "8deg", ouro: false },
  { top: "48%", left: "90%", size: 32, delay: "0.2s", opacity: 0.26, rot: "-10deg", ouro: true },
  { top: "70%", left: "8%", size: 38, delay: "1s", opacity: 0.2, rot: "-12deg", ouro: false },
  { top: "76%", left: "80%", size: 22, delay: "1.6s", opacity: 0.42, rot: "14deg", ouro: false },
  { top: "90%", left: "16%", size: 16, delay: "0.5s", opacity: 0.32, rot: "6deg", ouro: true },
  { top: "86%", left: "68%", size: 52, delay: "1.4s", opacity: 0.14, rot: "-6deg", ouro: true },
];

const TITULOS = [
  "O começo",
  "Um mês",
  "Dois meses",
  "Três meses",
  "Quatro meses",
  "Cinco meses",
  "Seis meses",
  "Sete meses",
  "Oito meses",
  "Nove meses",
  "Dez meses",
  "Onze meses",
  "Doze meses",
];

const CONTAGEM = [
  "estes dias",
  "este mês",
  "dois meses",
  "três meses",
  "quatro meses",
  "cinco meses",
  "seis meses",
  "sete meses",
  "oito meses",
  "nove meses",
  "dez meses",
  "onze meses",
  "doze meses",
];

const MARCOS = [
  "",
  "O primeiro mês foi o susto bom de te reconhecer no meio de tanta gente.",
  "No segundo, o teu nome já morava na minha boca sem pedir licença.",
  "No terceiro, o dia comum virou programa.",
  "No quarto, eu aprendi o teu silêncio — e gostei de ficar nele.",
  "No quinto, a saudade ganhou endereço e horário.",
  "No sexto, seis luas e a certeza quieta de que eu escolheria de novo.",
  "No sétimo, o amor saiu da novidade e sentou-se à mesa, como quem mora.",
  "No oitavo, eu te amei também nos dias sem brilho.",
  "No nono, a gente já era um jeito de estar no mundo.",
  "No décimo, contei nos dedos e ainda sobrou coração.",
  "No décimo primeiro, a pressa passou. Ficou o querer ficar.",
  "No décimo segundo, um ano inteiro cabendo no teu nome.",
];

/**
 * @param {Genero} genero
 * @param {string} masculino
 * @param {string} feminino
 * @param {string} neutro
 */
function flex(genero, masculino, feminino, neutro) {
  if (genero === "feminino") return feminino;
  if (genero === "neutro") return neutro;
  return masculino;
}

/** @param {string} valor */
export function normalizaGenero(valor) {
  const g = String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (["f", "fem", "feminino", "feminina", "mulher"].includes(g)) return /** @type {Genero} */ ("feminino");
  if (["n", "neutro", "neutra", "nb", "nao-binario", "nao binario"].includes(g)) {
    return /** @type {Genero} */ ("neutro");
  }
  if (["m", "masc", "masculino", "masculina", "homem"].includes(g)) return /** @type {Genero} */ ("masculino");
  throw new Error(`Gênero inválido: "${valor}". Use masculino, feminino ou neutro.`);
}

/** @param {unknown} valor */
export function lerMeses(valor) {
  const n = typeof valor === "number" ? valor : Number(String(valor).trim());
  if (!Number.isInteger(n) || n < 0 || n > 12) {
    throw new Error("O campo meses precisa ser um número inteiro de 0 a 12.");
  }
  return n;
}

/** @param {number} meses */
export function nomeArquivo(meses) {
  return `${String(meses).padStart(2, "0")}-meses.html`;
}

/** @param {string} texto */
function limpaNome(texto) {
  const nome = String(texto || "").trim();
  if (!nome) throw new Error("O nome não pode ficar vazio.");
  if (nome.length > 80) throw new Error("Use um nome com até 80 caracteres.");
  return nome;
}

/** @param {Config} config */
export function modeloDaCarta(config) {
  const meses = lerMeses(config.meses);
  const nomeR = limpaNome(config.remetente.nome);
  const nomeD = limpaNome(config.destinatario.nome);
  const gR = normalizaGenero(config.remetente.genero);
  const gD = normalizaGenero(config.destinatario.genero);
  const vocativo = flex(gD, "amado", "amada", "amor");
  const recado = typeof config.recado === "string" ? config.recado.trim() : "";
  const repo = typeof config.repositorio === "string" ? config.repositorio.trim() : "";

  const abertura =
    meses === 0
      ? `${nomeD}, nem fechamos um mês e eu já escrevo como quem não quer deixar o começo escapar.`
      : meses === 1
        ? `${nomeD}, um mês inteiro com você e o calendário já me parece pequeno.`
        : `${nomeD}, ${CONTAGEM[meses]} não são muitos se a gente pensar em vida inteira. São muitos se a gente pensar no quanto eu já te reconheço de olhos fechados.`;

  const gratidao = flex(
    gR,
    "Eu cheguei até aqui grato. Não pelo número — por você ter ficado, e por eu ter aprendido que ficar também se conjuga todo dia.",
    "Eu cheguei até aqui grata. Não pelo número — por você ter ficado, e por eu ter aprendido que ficar também se conjuga todo dia.",
    "Cheguei até aqui com o peito agradecido. Não pelo número — por você ter ficado, e por eu ter aprendido que ficar também se conjuga todo dia.",
  );

  const detalhe = `Tem manhã em que o teu nome é a primeira coisa arrumada da minha cabeça. Tem noite em que eu reviso o dia só para achar onde você esteve. É assim que eu te amo, ${vocativo}: em detalhe, sem pressa de acabar.`;

  /** @type {Marco[]} */
  const tempo =
    meses === 0
      ? [
          {
            numero: "00",
            texto: "Ainda não fechamos trinta dias. Já fechamos um lugar: eu, do teu lado.",
            agora: true,
          },
        ]
      : MARCOS.slice(1, meses + 1).map((texto, indice) => ({
          numero: String(indice + 1).padStart(2, "0"),
          texto,
          agora: indice + 1 === meses,
        }));

  return {
    titulo: TITULOS[meses],
    arquivo: nomeArquivo(meses),
    olho: meses === 0 ? "o primeiro capítulo" : "comemoração de namoro",
    nomeR,
    nomeD,
    paragrafos: [abertura, gratidao, detalhe],
    amores: [
      "O jeito como o dia fica mais leve quando você chega.",
      "A coragem mansa de ficar, mesmo nos dias sem espetáculo.",
      "As conversas que não precisam de plateia.",
      "O teu cuidado, sobretudo quando ele vem quieto.",
      "A vontade de te contar as coisas primeiro.",
      "O futuro cabendo no presente, sem atropelo.",
      `Você, ${nomeD}, sendo a parte mais bonita do meu comum.`,
    ],
    tempoTitulo: meses === 0 ? "Antes do primeiro mês" : "Os meses, um a um",
    tempo,
    fecho:
      meses === 0
        ? `${nomeD}, se o começo coubesse numa frase só, seria esta: eu te amo, e eu escolho te amar outra vez amanhã.`
        : meses === 1
          ? `${nomeD}, se este mês coubesse numa frase só, seria esta: eu te amo, e eu escolho te amar outra vez amanhã.`
          : `${nomeD}, se ${CONTAGEM[meses]} coubessem numa frase só, seria esta: eu te amo, e eu escolho te amar outra vez amanhã.`,
    seu: flex(gR, "com o coração inteiro, seu", "com o coração inteiro, sua", "com o coração inteiro"),
    recado,
    repo,
  };
}

export const cartaCss = `
#carta {
  --ink: #3c2428;
  --rose: #b94b5a;
  --gold: #a9783d;
  --wine: #6e2e3a;
  --paper: #f4e7dc;
  --glass: rgba(255, 250, 246, 0.62);
  --line: rgba(255, 255, 255, 0.74);
  min-height: 100vh;
  color: var(--ink);
  background-color: var(--paper);
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent 22rem),
    radial-gradient(46rem 22rem at 50% -8rem, rgba(185, 75, 90, 0.15), transparent 70%);
  font-family: "Outfit", "Avenir Next", "Segoe UI", sans-serif;
  font-size: 1.0625rem;
  line-height: 1.55;
  position: relative;
}
#carta * { box-sizing: border-box; }
#carta h1, #carta h2, #carta .assinatura, #carta .depara, #carta .promessa {
  font-family: "Fraunces", "Iowan Old Style", Palatino, Georgia, serif;
  font-weight: 560;
  letter-spacing: -0.03em;
}
#carta .ceu {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
#carta .coracao {
  position: absolute;
  color: var(--rose);
  animation: carta-sobe 7.5s ease-in-out infinite;
}
#carta .coracao.ouro { color: var(--gold); }
#carta .coracao svg { display: block; width: 100%; height: 100%; }
#carta .capa, #carta .miolo { position: relative; z-index: 1; }
#carta .capa {
  width: min(40rem, calc(100% - 2rem));
  margin: 0 auto;
  padding: 4.25rem 0 1.5rem;
  text-align: center;
}
#carta .olho {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}
#carta h1 {
  margin: 0.35rem 0 0;
  font-size: clamp(3rem, 11vw, 5.6rem);
  line-height: 0.95;
  color: var(--wine);
  text-wrap: balance;
}
#carta .traco {
  width: 4.25rem;
  height: 0.18rem;
  margin: 1rem auto 0;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--rose), var(--gold));
}
#carta .depara {
  margin: 1.1rem 0 0;
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 500;
}
#carta .depara em {
  font-style: italic;
  font-weight: 500;
  color: var(--gold);
  font-size: 1rem;
  padding: 0 0.3rem;
}
#carta .miolo {
  width: min(40rem, calc(100% - 2rem));
  margin: 0 auto;
  padding: 0.5rem 0 4.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
#carta .vidro {
  background: var(--glass);
  border: 1px solid var(--line);
  border-radius: 1.7rem;
  padding: 1.3rem 1.25rem 1.35rem;
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  box-shadow: 0 18px 46px rgba(110, 46, 58, 0.08);
}
#carta p { margin: 0; }
#carta .vidro p + p { margin-top: 0.9rem; }
#carta h2 {
  margin: 0.15rem 0 0.85rem;
  font-size: clamp(1.7rem, 4vw, 2.05rem);
  line-height: 1.15;
  color: var(--wine);
}
#carta .amores, #carta .tempo {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
#carta .amores li, #carta .tempo li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
}
#carta .amores svg {
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.28rem;
  color: var(--rose);
}
#carta .tempo li {
  padding: 0.85rem 0.95rem;
  border-radius: 1.2rem;
  background: rgba(255, 250, 246, 0.38);
}
#carta .tempo li.agora {
  background: var(--glass);
  border: 1px solid var(--line);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
#carta .num {
  font-family: "Fraunces", Palatino, Georgia, serif;
  color: var(--wine);
  font-size: 1.3rem;
  line-height: 1;
  min-width: 2rem;
  padding-top: 0.12rem;
}
#carta .galeria {
  display: grid;
  gap: 0.9rem;
}
#carta figure {
  margin: 0;
  padding: 0.6rem 0.6rem 0.75rem;
  background: var(--glass);
  border: 1px solid var(--line);
  border-radius: 1.5rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 16px 40px rgba(62, 36, 40, 0.08);
}
#carta img {
  width: 100%;
  height: 16rem;
  object-fit: cover;
  border-radius: 1.05rem;
  display: block;
}
#carta figcaption {
  padding: 0.7rem 0.35rem 0.1rem;
  font-size: 0.95rem;
}
#carta .vazio {
  margin: 0;
  color: rgba(60, 36, 40, 0.78);
}
#carta .promessa {
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.4rem, 4vw, 1.85rem);
  line-height: 1.35;
  letter-spacing: -0.02em;
}
#carta .assinatura {
  margin-top: 1.25rem;
  font-size: 2rem;
  line-height: 1;
  color: var(--wine);
}
#carta .seu {
  margin-top: 0.4rem;
  font-size: 0.95rem;
}
#carta .baixar {
  text-align: center;
  padding: 0.6rem 0.4rem 0.2rem;
}
#carta .baixar .nota {
  color: rgba(60, 36, 40, 0.76);
  font-size: 0.98rem;
}
#carta .baixar-btn {
  appearance: none;
  border: 0;
  margin-top: 1rem;
  background: var(--wine);
  color: #fffaf6;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  min-height: 3rem;
  padding: 0.8rem 1.35rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(110, 46, 58, 0.22);
}
#carta .baixar-btn:hover { background: #5c2631; }
#carta .baixar-btn:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
#carta .baixar-btn:disabled { opacity: 0.7; cursor: progress; }
#carta .rodape {
  margin: 1rem 0 0;
  font-size: 0.86rem;
  color: rgba(60, 36, 40, 0.68);
}
#carta .rodape a { color: var(--wine); }
@keyframes carta-sobe {
  0%, 100% { transform: translateY(0) rotate(var(--rot)); }
  50% { transform: translateY(-12px) rotate(var(--rot)); }
}
@media (min-width: 720px) {
  #carta .galeria { grid-template-columns: 1fr 1fr; }
  #carta .galeria figure:first-child { grid-column: 1 / -1; }
  #carta .galeria figure:first-child img { height: 22rem; }
  #carta .vidro { padding: 1.55rem 1.6rem 1.6rem; }
}
@media (prefers-reduced-motion: reduce) {
  #carta .coracao { animation: none; }
}
`;

export const CORACAO_PATH =
  "M12 21s-6.6-4.2-9.1-8C1 10.2 1.6 6.8 4.3 5.5c1.9-.9 4-.2 5.2 1.4.4.6.8 1 1.5 1s1.1-.4 1.5-1c1.2-1.6 3.3-2.3 5.2-1.4 2.7 1.3 3.3 4.7 1.4 7.5C18.6 16.8 12 21 12 21z";

function svgCoracao() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${CORACAO_PATH}"/></svg>`;
}

/** @param {string} texto */
function esc(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {Fontes} fonts */
function fontesCss(fonts) {
  /** @type {Array<[string, string, string]>} */
  const faces = [
    ["Fraunces", fonts.regular, "400"],
    ["Fraunces", fonts.semibold, "600"],
    ["Outfit", fonts.sans, "400"],
    ["Outfit", fonts.sansMedium, "500"],
  ];
  const regras = faces
    .filter((face) => face[1])
    .map(
      ([familia, url, peso]) => `@font-face{font-family:"${familia}";src:url("${url}") format("woff2");font-weight:${peso};font-style:normal;font-display:swap;}`,
    );
  if (fonts.italic) {
    regras.push(
      `@font-face{font-family:"Fraunces";src:url("${fonts.italic}") format("woff2");font-weight:500;font-style:italic;font-display:swap;}`,
    );
  }
  return regras.join("");
}

/**
 * @param {{ config: Config, imagens: Imagem[], fonts: Fontes }} entrada
 */
export function renderMonobloco(entrada) {
  const modelo = modeloDaCarta(entrada.config);
  const imagens = entrada.imagens || [];
  const ceu = coracoes
    .map((c) => {
      const classe = c.ouro ? "coracao ouro" : "coracao";
      return `<span class="${classe}" style="top:${c.top};left:${c.left};width:${c.size}px;height:${c.size}px;opacity:${c.opacity};animation-delay:${c.delay};--rot:${c.rot}">${svgCoracao()}</span>`;
    })
    .join("");

  const paragrafos = modelo.paragrafos.map((p) => `<p>${esc(p)}</p>`).join("");
  const amores = modelo.amores
    .map((item) => `<li>${svgCoracao()}<span>${esc(item)}</span></li>`)
    .join("");
  const tempo = modelo.tempo
    .map(
      (item) =>
        `<li class="${item.agora ? "agora" : ""}"><span class="num">${item.numero}</span><span>${esc(item.texto)}</span></li>`,
    )
    .join("");

  const galeria =
    imagens.length === 0
      ? `<section class="vidro"><h2>Pequenos retratos</h2><p class="vazio">Ainda não há fotos. Coloque imagens na pasta imagens e elas passam a morar dentro desta carta.</p></section>`
      : `<section><h2>Pequenos retratos</h2><div class="galeria">${imagens
          .map((img) => {
            const legenda = img.legenda ? `<figcaption>${esc(img.legenda)}</figcaption>` : "";
            return `<figure><img src="${esc(img.src)}" alt="${esc(img.legenda || img.nome)}">${legenda}</figure>`;
          })
          .join("")}</div></section>`;

  const recado = modelo.recado
    ? `<section class="vidro"><h2>E tem isto, que é só nosso</h2><p>${esc(modelo.recado)}</p></section>`
    : "";

  const repo = modelo.repo
    ? ` <a href="${esc(modelo.repo)}">Trocar nomes e fotos.</a>`
    : "";

  const script =
    "<script>(function(){var nome=" +
    JSON.stringify(modelo.arquivo) +
    ";var botao=document.getElementById('baixar');if(!botao)return;botao.addEventListener('click',function(){var html='<!DOCTYPE html>\\n'+document.documentElement.outerHTML;var blob=new Blob([html],{type:'text/html;charset=utf-8'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=nome;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},2000);});})();</script>";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f4e7dc">
<title>${esc(modelo.titulo)} — ${esc(modelo.nomeD)}</title>
<meta name="description" content="Uma carta de ${esc(modelo.titulo.toLowerCase())}, de ${esc(modelo.nomeR)} para ${esc(modelo.nomeD)}. As fotos vão dentro do arquivo.">
<style>
html,body{margin:0;padding:0;background:#f4e7dc;}
${fontesCss(entrada.fonts)}
${cartaCss}
</style>
</head>
<body>
<div id="carta">
  <div class="ceu" aria-hidden="true">${ceu}</div>
  <header class="capa">
    <p class="olho">${esc(modelo.olho)}</p>
    <h1>${esc(modelo.titulo)}</h1>
    <hr class="traco">
    <p class="depara"><span>${esc(modelo.nomeR)}</span><em>para</em><span>${esc(modelo.nomeD)}</span></p>
  </header>
  <main class="miolo">
    <section class="vidro">${paragrafos}</section>
    <section class="vidro"><h2>O que eu amo em você</h2><ul class="amores">${amores}</ul></section>
    <section class="vidro"><h2>${esc(modelo.tempoTitulo)}</h2><ol class="tempo">${tempo}</ol></section>
    ${galeria}
    ${recado}
    <section class="vidro fecho">
      <p class="promessa">${esc(modelo.fecho)}</p>
      <p class="assinatura">${esc(modelo.nomeR)}</p>
      <p class="seu">${esc(modelo.seu)}</p>
    </section>
    <section class="baixar">
      <p class="nota">Esta carta cabe num único arquivo. As fotos vão junto e ela abre em qualquer lugar que abra HTML, mesmo sem internet.</p>
      <button type="button" class="baixar-btn" id="baixar">Baixar ${esc(modelo.arquivo)}</button>
      <p class="rodape">Os nomes moram em variaveis/casal.json. As fotos, na pasta imagens. Ao subir uma mudança, esta página e o arquivo para baixar são refeitos juntos.${repo}</p>
    </section>
  </main>
</div>
${script}
</body>
</html>
`;
}
