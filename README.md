# Portfólio · Pedro Vieira

Portfólio bilíngue (PT/EN) feito com Next.js 16, TypeScript e Tailwind CSS 4.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. A raiz redireciona para `/pt` ou `/en` conforme o idioma do navegador.

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos em português | `src/content/pt.ts` |
| Textos em inglês | `src/content/en.ts` |
| E-mail, links, stack e links dos projetos | `src/content/index.ts` (objeto `profile`) |
| Layout das seções | `src/app/[lang]/page.tsx` |
| Cores, fundo e animações | `src/app/globals.css` |

`en.ts` usa o mesmo tipo de `pt.ts`, então o TypeScript avisa se faltar algum texto traduzido.

## Publicar

O jeito mais simples é importar o repositório na [Vercel](https://vercel.com): ela detecta o Next.js sozinha. As páginas `/pt` e `/en` são geradas estaticamente no build.

## Pesquisa

`docs/questionario-portfolio.md` reúne os padrões encontrados em portfólios de desenvolvedores e o questionário usado para montar este site.
