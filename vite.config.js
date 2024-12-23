import path, { resolve } from 'node:path'
import url from 'node:url'
import { defineConfig } from 'vite'
import viteEslint from 'vite-plugin-eslint'
import viteImagemin from 'vite-plugin-imagemin'
import viteMultipage from 'vite-plugin-multipage'
import vitePug from 'vite-plugin-pug-transformer'
import viteSassGlob from 'vite-plugin-sass-glob-import'
import viteStylelint from 'vite-plugin-stylelint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const root = resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'src')
const outDir = resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'dist')
const timestamp = Date.now()

const isBackBuild = process.env.BACK_BUILD === 'true'

export default defineConfig({
  root,
  base: './',
  clearScreen: false,
  build: {
    outDir,
    emptyOutDir: true,
    minify: 'terser',
    chunkSizeWarningLimit: '1024',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo.name.split('.')[1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images'
          } else if (extType === 'css') {
            extType = 'styles'
          }
          return `${extType}/[name][extname]`
        },
        chunkFileNames: `scripts/[name].js`
      }
    }
  },
  plugins: [
    viteMultipage({
      mimeCheck: true,
      open: '/',
      pageDir: 'pages',
      purgeDir: 'pages',
      removePageDirs: true,
      rootPage: 'index.html'
    }),
    vitePug({
      pugOptions: {
        pretty: true
      }
    }),
    viteEslint({
      failOnError: false
    }),
    viteStylelint({
      // fix: true,
      lintInWorker: true
    }),
    viteSassGlob(),
    ...(!isBackBuild
      ? [
          viteImagemin({
            gifsicle: {
              optimizationLevel: 7,
              interlaced: false
            },
            mozjpeg: {
              quality: 75
            },
            pngquant: {
              quality: [0.7, 0.7],
              speed: 4
            },
            svgo: {
              plugins: [
                {
                  name: 'removeViewBox'
                },
                {
                  name: 'removeEmptyAttrs',
                  active: false
                }
              ]
            }
          })
        ]
      : []),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/images')],
      symbolId: '[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__'
    }),
    {
      name: 'replace-script-tag',
      apply: 'build',
      transformIndexHtml(html) {
        return html.replace(
          /<script type="module" crossorigin src="..\/..\/scripts\/index\.js"><\/script>/,
          `<script type="module" crossorigin src="scripts/index.js?${timestamp}"></script>`
        )
      }
    }
  ]
})

// Команды для Husky

// pre-commit
// npm run prettier:fix
// git add .

// pre-push
// npm run stylelint:fix
// npm run lint:fix
