const { readdirSync, statSync, existsSync, copyFileSync } = require('fs')
const { resolve } = require('path')
const { build } = require('vite')
const pkg = require(resolve(`package.json`))

const baseUrl = 'src/plugins'
const outDir = 'dist'
const excludeDirs = []

main()

async function main() {
  const dirs = readdirSync(resolve(__dirname, `../${baseUrl}`))
  const targets = dirs.filter((dir) => {
    if (excludeDirs.includes(dir)) return false

    return statSync(resolve(__dirname, `../${baseUrl}/${dir}`)).isDirectory()
  })

  await Promise.all(targets.map(buildAndCopy))
}

async function buildAndCopy(target) {
  const watch = process.argv.includes('-w') || process.argv.includes('--watch')
  await startBuild(target)
  await copyManifest(target)
  if (watch) {
    await startBuild(target, watch)
  }
}

async function startBuild(target, watch) {
  const tsIndexUrl = resolve(__dirname, `../${baseUrl}/${target}/index.ts`)
  const tsxIndexUrl = resolve(__dirname, `../${baseUrl}/${target}/index.tsx`)

  let indexUrl = tsIndexUrl
  if (!existsSync(indexUrl)) {
    indexUrl = tsxIndexUrl
  }

  await build({
    build: {
      lib: {
        entry: indexUrl,
        name: 'index',
        fileName: (format) => `index.js`,
      },
      rollupOptions: {
        output: [
          {
            format: 'umd',
            name: 'index',
            assetFileNames: 'index.[ext]',
          },
        ],
      },
      outDir: resolve(__dirname, `../${outDir}/${target}/`),
      watch: watch ? {} : false,
      emptyOutDir: !watch,
    },
  })
}

async function copyManifest(target) {
  copyFileSync(resolve(__dirname, `../${baseUrl}/${target}/manifest.json`), resolve(__dirname, `../${outDir}/${target}/manifest.json`))
}
