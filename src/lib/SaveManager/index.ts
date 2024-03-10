import {
  base64ToStream,
  compressStream,
  decompressStream,
  responseFromJson,
  responseToBase64,
  toJsonStream
} from '../../utils/compression.ts'

export async function saveFileToLocalStorage(name: string, data: unknown) {
  const blob = compressStream(toJsonStream(data))
  const compressedData = await responseToBase64(blob)

  localStorage.setItem('ok-palette-last', name)
  localStorage.setItem(name, compressedData)
}

export async function getFileFromLocalStorage(name?: string) {
  const lastSaveName = localStorage.getItem('ok-palette-last')
  const filenameToLoad = name || lastSaveName

  if (!filenameToLoad) {
    return Promise.reject(new Error('No filename entry in local storage'))
  }

  const dataInBase64 = localStorage.getItem(filenameToLoad)

  if (!dataInBase64) {
    return Promise.reject(new Error(`No file with name "${filenameToLoad}"`))
  }

  const blob = decompressStream(base64ToStream(dataInBase64))

  return await responseFromJson(blob)
}
