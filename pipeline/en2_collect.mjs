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


// poll video_status for each job id until done/failed, then download the MP4
const jobs = JSON.parse(fs.readFileSync(process.argv[2] || 'renders/jobs.json', 'utf8'));
const pending = Object.entries(jobs).filter(([k, v]) => v && v.job);
const done = {};
const t0 = Date.now();
while (Object.keys(done).length < pending.length && Date.now() - t0 < 40 * 60 * 1000) {
  for (const [clip, v] of pending) {
    if (done[clip]) continue;
    const r = await rpc('tools/call', { name: 'video_status', arguments: { job_id: v.job } });
    const st = r.structuredContent?.result || r.structuredContent || JSON.parse((r.content || []).map((c) => c.text || '').join(''));
    if (st.state === 'done' && st.video_url) {
      const buf = Buffer.from(await (await fetch(st.video_url)).arrayBuffer());
      fs.writeFileSync(`renders/${clip}.mp4`, buf);
      done[clip] = 'done';
      console.log(clip, 'done', buf.length, 'bytes');
    } else if (st.state === 'failed') {
      done[clip] = 'failed';
      console.log(clip, 'FAILED', st.error);
    }
  }
  if (Object.keys(done).length < pending.length) await new Promise((r) => setTimeout(r, 30000));
}
console.log(JSON.stringify(done));
