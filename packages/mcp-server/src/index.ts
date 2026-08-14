#!/usr/bin/env node

import { createInterface } from 'node:readline'
import { handleMessage, jsonRpcError, type JsonRpcRequest } from './server.js'

function log(message: string): void {
  console.error(message)
}

async function main(): Promise<void> {
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim()) continue
    try {
      const request = JSON.parse(line) as JsonRpcRequest
      const response = await handleMessage(request)
      if (response) {
        console.log(JSON.stringify(response))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(JSON.stringify(jsonRpcError(undefined, -32700, `Parse error: ${message}`)))
    }
  }
}

main().catch((error) => {
  log(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
