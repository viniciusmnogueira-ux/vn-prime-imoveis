const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const logoPath = path.join(root, "assets", "logo-vn-prime.png");
const logoDataUrl =
  "data:image/png;base64," + fs.readFileSync(logoPath).toString("base64");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const core = fs.readFileSync(path.join(root, "js", "core.js"), "utf8");
const catalog = fs.readFileSync(path.join(root, "js", "catalog-data.js"), "utf8");
const nav = fs.readFileSync(path.join(root, "js", "nav.js"), "utf8");
const idx = fs.readFileSync(path.join(root, "js", "index.js"), "utf8");
const planosHome = fs.readFileSync(path.join(root, "js", "planos-stripe-home.js"), "utf8");
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");

html = html.replace(/src="assets\/logo-vn-prime\.png"/g, `src="${logoDataUrl}"`);

html = html.replace(/<!-- CSS:[\s\S]*?<\/noscript>\s*/m, "");
html = html.replace(/<div\s+id="vnprime-css-alert"[\s\S]*?<\/div>\s*/m, "");

html = html.replace(/\s*<\/head>/, "\n    <style>\n" + css + "\n    </style>\n  </head>");

html = html.replace(/href="index\.html#/g, 'href="#');
html = html.replace(/href="index\.html"/g, 'href="#compra"');

html = html.replace(/href="cadastrar\.html[^"]*"/g, 'href="#quero-vender"');
html = html.replace(/href="vender\.html[^"]*"/g, 'href="#quero-vender"');
html = html.replace(/href="lead\.html"/g, 'href="#sobre"');
html = html.replace(/href="dashboard\.html"/g, 'href="#parceiros"');
html = html.replace(/href="admin\.html"/g, 'href="#sobre"');
html = html.replace(/href="sobre\.html"/g, 'href="#sobre"');

const queroVender = `
    <section class="section section--alt section-anchor" id="quero-vender">
      <div class="container" style="max-width: 720px; margin-inline: auto; text-align: center">
        <h2>Quero vender · Cadastro completo</h2>
        <p>
          Esta é a versão <strong>um arquivo só</strong> (para enviar por ZIP ou abrir na pasta Temp). O fluxo de cadastro em
          5 passos, pagamentos simulados e curadoria ficam nos arquivos <code>cadastrar.html</code>,
          <code>dashboard.html</code> e <code>admin.html</code> da pasta completa do projeto.
        </p>
        <p class="muted" style="margin-bottom: 0">
          Baixe ou copie a pasta <strong>VN PRIME IMBILIARIA</strong> inteira (com <code>style.css</code> e <code>js/</code>) e abra
          <code>index.html</code> no Explorador de Arquivos.
        </p>
      </div>
    </section>
`;

const sobreSection = `
    <section class="section section-anchor" id="sobre">
      <div class="container" style="max-width: 720px; margin-inline: auto">
        <h2>Sobre a VN Prime Imóveis</h2>
        <p>
          Plataforma de alto padrão em Belo Horizonte e região metropolitana. Ecossistema proprietários, corretores e
          fotógrafos — curadoria manual e planos 3%, 4% e 6%.
        </p>
        <p>
          <strong>Contato:</strong> Vinicius Nogueira · MOVI Empreendimentos ·
          <a href="tel:+5531984144250">(31) 98414-4250</a>
        </p>
      </div>
    </section>
`;

html = html.replace(
  /(\s*)<footer class="site-footer">/,
  "\n" + queroVender + "\n" + sobreSection + "$1<footer class=\"site-footer\">"
);

html = html.replace(
  /<script src="js\/core.js"><\/script>\s*<script src="js\/catalog-data.js"><\/script>\s*<script src="js\/nav.js"><\/script>\s*<script src="js\/index.js"><\/script>\s*<script src="js\/planos-stripe-home.js"><\/script>/,
  "<script>\n" +
    core +
    "\n</script>\n<script>\n" +
    catalog +
    "\n</script>\n<script>\n" +
    nav +
    "\n</script>\n<script>\n" +
    idx +
    "\n</script>\n<script>\n" +
    planosHome +
    "\n</script>"
);

html = html.replace(
  /<title>[^<]+<\/title>/,
  "<title>VN Prime Imóveis — Plataforma (arquivo único)</title>"
);

const out = path.join(root, "vn_prime_plataforma.html");
fs.writeFileSync(out, html, "utf8");
console.log("Wrote", out, "(" + Math.round(html.length / 1024) + " KB)");
