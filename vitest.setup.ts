// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Fix jsdom TextEncoder/TextDecoder issue with esbuild/wrangler
// jsdom's implementation doesn't produce proper Uint8Array instances
import { TextEncoder, TextDecoder } from 'util'

Object.assign(globalThis, { TextEncoder, TextDecoder })
