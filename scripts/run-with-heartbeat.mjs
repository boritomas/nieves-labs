#!/usr/bin/env node

import { spawn } from 'node:child_process';

const [, , timeoutArg, ...command] = process.argv;
const timeoutSeconds = Number(timeoutArg || 0);

if (!timeoutSeconds || command.length === 0) {
  console.error('Usage: node scripts/run-with-heartbeat.mjs <timeout-seconds> <command> [...args]');
  process.exit(2);
}

const label = command.join(' ');
const startedAt = Date.now();
console.log(`[watchdog] starting: ${label}`);

const child = spawn(command[0], command.slice(1), {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

const heartbeat = setInterval(() => {
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.log(`[watchdog] ${label} still running after ${elapsed}s`);
}, 30_000);

const timeout = setTimeout(() => {
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.error(`[watchdog] timeout after ${elapsed}s: ${label}`);
  child.kill('SIGTERM');
  setTimeout(() => child.kill('SIGKILL'), 5_000);
}, timeoutSeconds * 1000);

child.on('exit', (code, signal) => {
  clearInterval(heartbeat);
  clearTimeout(timeout);
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  if (signal) {
    console.error(`[watchdog] stopped by ${signal} after ${elapsed}s: ${label}`);
    process.exit(1);
  }
  console.log(`[watchdog] finished in ${elapsed}s with code ${code}: ${label}`);
  process.exit(code ?? 1);
});
