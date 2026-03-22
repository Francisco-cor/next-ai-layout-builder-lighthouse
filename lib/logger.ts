// Structured logger for server-side API routes.
// Outputs JSON in production (machine-parseable), pretty in development.
// Swap the `output` function for Sentry / Datadog / Axiom when ready.

type Level = 'info' | 'warn' | 'error'

interface LogEntry {
  level: Level
  event: string
  [key: string]: unknown
}

function output(entry: LogEntry) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry })
  if (entry.level === 'error') {
    console.error(line)
  } else if (entry.level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  info: (event: string, meta?: Record<string, unknown>) =>
    output({ level: 'info', event, ...meta }),
  warn: (event: string, meta?: Record<string, unknown>) =>
    output({ level: 'warn', event, ...meta }),
  error: (event: string, meta?: Record<string, unknown>) =>
    output({ level: 'error', event, ...meta }),
}
