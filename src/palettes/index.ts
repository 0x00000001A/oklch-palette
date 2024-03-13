import defaultPalette from './default.ts'

type PaletteExport = () => Promise<{
  default: typeof defaultPalette
}>

function getAvailablePalettes() {
  const imports = import.meta.glob('./*.ts')
  const importsPaths = Object.keys(import.meta.glob('./*.ts'))

  return importsPaths.reduce(
    (palette, filepath) => {
      const matches = filepath.match(/\/([^/]*?).[a-z]{2,4}$/)
      const filename = matches && matches[1]

      if (!filename) {
        console.error(`Unable to parse filename "${filepath}"`)
        return palette
      }

      const paletteName = filename.charAt(0).toUpperCase() + filename.substring(1)

      return {
        ...palette,
        [filename]: {
          lazyImport: imports[filepath] as PaletteExport,
          name: paletteName
        }
      }
    },
    {} as {
      [key: string]: {
        lazyImport: PaletteExport
        name: string
      }
    }
  )
}

const palettes = getAvailablePalettes()

export default palettes
