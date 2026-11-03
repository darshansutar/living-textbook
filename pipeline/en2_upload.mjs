// Upload local files to the EN2 render box through the EN2 video MCP (video_upload),
// so large images never pass through a chat tool call. The MCP URL is read from
// EN2_MCP_URL or from ~/.codex/config.toml ([mcp_servers.en2_video] url) and is never printed.
//
//   node en2_upload.mjs file1.png file2.png ...   -> prints JSON [{file, sha256, name}]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

function mcpUrl() {
  if (process.env.EN2_MCP_URL) return process.env.EN2_MCP_URL;
  const cfg = fs.readFileSync(path.join(os.homedir(), '.codex', 'config.toml'), 'utf8');
  const m = cfg.match(/\[mcp_servers\.en2_video\][^[]*?url\s*=\s*"([^"]+)"/);
  if (!m) throw new Error('EN2 MCP url not found (set EN2_MCP_URL)');
  return m[1];
}

const URL_ = mcpUrl();
let session = null;
let id = 0;

async function rpc(method, params, notify = false) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  if (session) headers['mcp-session-id'] = session;
  const body = notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: ++id, method, params };
  const res = await fetch(URL_, { method: 'POST', headers, body: JSON.stringify(body) });
  if (res.headers.get('mcp-session-id')) session = res.headers.get('mcp-session-id');
  if (notify) return null;
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} HTTP ${res.status}: ${text.slice(0, 300)}`);
  const json = text.trim().startsWith('{')
    ? JSON.parse(text)
    : JSON.parse(text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5)).pop());
  if (json.error) throw new Error(`${method}: ${JSON.stringify(json.error).slice(0, 300)}`);
  return json.result;
}

await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'living-textbook-uploader', version: '1.0' } });
await rpc('notifications/initialized', {}, true);

const out = [];
for (const file of process.argv.slice(2)) {
  const bytes = fs.readFileSync(file);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const result = await rpc('tools/call', { name: 'video_upload', arguments: { data_base64: bytes.toString('base64'), filename: path.basename(file) } });
  const txt = (result.content || []).map((c) => c.text || '').join('');
  let parsed;
  try { parsed = JSON.parse(txt); } catch { parsed = { raw: txt }; }
  out.push({ file, sha256, ...(result.structuredContent?.result || result.structuredContent || parsed) });
}
console.log(JSON.stringify(out, null, 2));
