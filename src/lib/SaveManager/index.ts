import {
  base64ToStream,
  compressStream,
  decompressStream,
  responseToBase64,
  responseToJson,
  toJsonStream
} from '../../utils/compression.ts'

export async function saveFileToLocalStorage(name: string, data: unknown) {
  const blob = await compressStream(toJsonStream(data))
  const compressedData = await responseToBase64(blob)

  localStorage.setItem('ok-palette-last', name)
  localStorage.setItem(name, compressedData)
}

export async function getFileFromLocalStorage(name?: string) {
  const lastSaveName = localStorage.getItem('ok-palette-last')
  const filenameToLoad = name || lastSaveName

  if (!filenameToLoad) {
    return Promise.reject()
  }

  const dataInBase64 = localStorage.getItem(filenameToLoad)

  if (!dataInBase64) {
    return Promise.reject(`No file with name "${filenameToLoad}"`)
  }

  const blob = await decompressStream(base64ToStream(dataInBase64))

  return await responseToJson(blob)
}
