export function encodeToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

export function decodeFromBase64(data: string) {
  const atobString = atob(data)
  const atobStringLength = atobString.length

  const bytes = new Uint8Array(new ArrayBuffer(atobStringLength))

  for (let atobStringIndex = 0; atobStringIndex < atobStringLength; atobStringIndex++) {
    bytes[atobStringIndex] = atobString.charCodeAt(atobStringIndex)
  }

  return bytes
}

export function toStream(data: BlobPart) {
  return new Blob([data]).stream()
}

export function toJsonStream(data: unknown) {
  return toStream(JSON.stringify(data))
}

export function base64ToStream(base64String: string) {
  return toStream(decodeFromBase64(base64String))
}

export async function responseToJson(response: Response) {
  const blob = await response.blob()
  return JSON.parse(await blob.text())
}

export async function responseToBase64(response: Response) {
  const blob = await response.blob()
  const buffer = await blob.arrayBuffer()
  return encodeToBase64(buffer)
}

export async function compressStream(stream: ReadableStream) {
  const compressedReadableStream = stream.pipeThrough(new CompressionStream('gzip'))

  return new Response(compressedReadableStream)
}

export async function decompressStream(stream: ReadableStream) {
  const compressedReadableStream = stream.pipeThrough(new DecompressionStream('gzip'))

  return new Response(compressedReadableStream)
}
