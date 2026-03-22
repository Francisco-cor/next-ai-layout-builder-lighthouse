import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// jsdom does not ship TextEncoder/TextDecoder — polyfill from Node's built-in
Object.assign(global, { TextEncoder, TextDecoder })
