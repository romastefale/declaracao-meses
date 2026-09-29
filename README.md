# Declaração de meses

Uma carta de namoro em **um único HTML**. As fotos não ficam soltas: o GitHub Actions lê a pasta `imagens`, embute cada arquivo dentro da página e publica duas cópias idênticas:

- `index.html` — o que o GitHub Pages mostra
- `Piero-Lucas.index` — o mesmo conteúdo, no nome de quem escreve e de quem recebe, para baixar e guardar. O nome segue o primeiro nome do remetente e o nome do destinatário.

## Como personalizar

1. Abra [`variaveis/casal.json`](variaveis/casal.json).
   - `remetente` é quem escreve. `destinatario` é quem recebe.
   - `genero` aceita `masculino`, `feminino` ou `neutro` (a carta ajusta “grato/grata”, “amado/amada”).
   - `meses` é um inteiro de **0 a 12**.
   - `recado` é opcional. Se preencher, aparece uma seção só de vocês.
2. Coloque as fotos em [`imagens/`](imagens/). Vale `jpg`, `jpeg`, `png`, `gif`, `webp` e `svg`. A ordem é a ordem do nome do arquivo (`01-`, `02-`…).
3. Se quiser legenda, acrescente o nome do arquivo em [`imagens/legendas.json`](imagens/legendas.json).
4. Suba a mudança para a branch `main`.

Em cerca de um minuto a Action recria o `index.html` e o arquivo `.index`. Os dois ficam iguais, com as fotos e as fontes dentro. Um arquivo de imagem vazio é ignorado.

A página publicada fica em [romastefale.github.io/declaracao-meses](https://romastefale.github.io/declaracao-meses/) depois deste único ajuste, que o GitHub só deixa fazer na mão:

1. Abra **Settings → Pages** do repositório.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Branch **main**, pasta **/ (root)** e salve.

O `index.html` já está pronto, então o site aparece em seguida. O arquivo para guardar sai pelo botão Baixar, com o nome de quem escreve e de quem recebe, terminado em `.index`.

O botão **Baixar** entrega o monobloco. Abrir esse arquivo no celular ou no computador mostra a mesma carta, com as imagens, sem depender do GitHub.

## O que não editar à mão

`index.html` e o `.index` são gerados. Na próxima subida de nomes ou fotos eles são reescritos. Mude a carta pelo JSON, pelas imagens ou, se quiser outro texto-base, por `scripts/render-monobloco.js`.

Este repositório é público para o GitHub Pages gratuito funcionar. Quando os nomes e as fotos forem reais, o link também será público. O arquivo baixado é o que você envia no privado.
