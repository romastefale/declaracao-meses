# Declaração de meses

Uma carta de namoro em **um único HTML**. As fotos não ficam soltas: o GitHub Actions lê a pasta `imagens`, embute cada arquivo dentro da página e publica duas cópias idênticas:

- `index.html` — o que o GitHub Pages mostra
- `06-meses.html` (ou `00` … `12`) — o mesmo conteúdo, pronto para baixar e abrir em qualquer aparelho, mesmo sem internet

O número do arquivo segue o campo `meses` em `variaveis/casal.json`.

## Como personalizar

1. Abra [`variaveis/casal.json`](variaveis/casal.json).
   - `remetente` é quem escreve. `destinatario` é quem recebe.
   - `genero` aceita `masculino`, `feminino` ou `neutro` (a carta ajusta “grato/grata”, “amado/amada”).
   - `meses` é um inteiro de **0 a 12**.
   - `recado` é opcional. Se preencher, aparece uma seção só de vocês.
2. Coloque as fotos em [`imagens/`](imagens/). Vale `jpg`, `jpeg`, `png`, `gif`, `webp` e `svg`. A ordem é a ordem do nome do arquivo (`01-`, `02-`…).
3. Se quiser legenda, acrescente o nome do arquivo em [`imagens/legendas.json`](imagens/legendas.json).
4. Suba a mudança para a branch `main`.

Em cerca de um minuto a Action recria o `index.html` e o `NN-meses.html`. Os dois ficam iguais, com as fotos e as fontes dentro do arquivo. Apague as imagens de exemplo quando for usar as de vocês — senão elas entram na carta.

A página publicada fica em [romastefale.github.io/declaracao-meses](https://romastefale.github.io/declaracao-meses/) depois deste único ajuste, que o GitHub só deixa fazer na mão:

1. Abra **Settings → Pages** do repositório.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Branch **main**, pasta **/ (root)** e salve.

O `index.html` já está pronto, então o site aparece em seguida. Enquanto isso, o arquivo [06-meses.html](https://github.com/romastefale/declaracao-meses/blob/main/06-meses.html) já pode ser baixado do repositório.

O botão **Baixar** entrega o monobloco. Abrir esse arquivo no celular ou no computador mostra a mesma carta, com as imagens, sem depender do GitHub.

## O que não editar à mão

`index.html` e `NN-meses.html` são gerados. Na próxima subida de nomes ou fotos eles são reescritos. Mude a carta pelo JSON, pelas imagens ou, se quiser outro texto-base, por `scripts/render-monobloco.js`.

Este repositório é público para o GitHub Pages gratuito funcionar. Quando os nomes e as fotos forem reais, o link também será público. O arquivo baixado é o que você envia no privado.
