// Submit a batch of EN2 reference renders from a render plan, once each, and record the job IDs.
//
//   node ../../pipeline/en2_submit.mjs prompts/render_plan_openers.json uploads-openers.json renders/jobs-openers.json
//
// render plan: { quality, folder, clips: { <id>: { duration, prompt, refs: [project-relative files] } } }
// uploads:     output of en2_upload.mjs ([{file, sha256, name}]) - every ref must be uploaded and hash-matched.
// Jobs already present in the output file are never resubmitted (no duplicate paid renders).
// Quality is always Ultra (quality=true). The EN2 MCP URL comes from EN2_MCP_URL or ~/.codex/config.toml.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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
  const json = text.trim().startsWith('{') ? JSON.parse(text)
    : JSON.parse(text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5)).pop());
  if (json.error) throw new Error(`${method}: ${JSON.stringify(json.error).slice(0, 300)}`);
  return json.result;
}

const [planFile, uploadsFile, jobsFile] = process.argv.slice(2);
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
const uploads = JSON.parse(fs.readFileSync(uploadsFile, 'utf8'));
const byFile = Object.fromEntries(uploads.map((u) => [u.file.replace(/\\/g, '/'), u]));
for (const u of uploads) {
  if (!u.name.startsWith(`en2ref_${u.sha256.slice(0, 16)}`)) throw new Error(`hash mismatch for ${u.file}`);
}
const jobs = fs.existsSync(jobsFile) ? JSON.parse(fs.readFileSync(jobsFile, 'utf8')) : {};

await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'living-textbook-submit', version: '1.0' } });
await rpc('notifications/initialized', {}, true);

for (const [clip, c] of Object.entries(plan.clips)) {
  if (jobs[clip]?.job) { console.log(`${clip}: already submitted as ${jobs[clip].job}, skipped`); continue; }
  const refs = c.refs.map((f) => {
    const u = byFile[f];
    if (!u) throw new Error(`${clip}: ${f} not uploaded`);
    return u.name;
  });
  const args = { prompt: fs.readFileSync(c.prompt, 'utf8').trim(), refs, duration: c.duration, quality: true, folder: plan.folder };
  const r = await rpc('tools/call', { name: 'video_generate', arguments: args });
  const out = r.structuredContent?.result || r.structuredContent || JSON.parse((r.content || []).map((x) => x.text || '').join(''));
  if (!out.id) throw new Error(`${clip}: no job id returned: ${JSON.stringify(out).slice(0, 300)}`);
  jobs[clip] = { job: out.id, refs, ref_files: c.refs, duration: c.duration, quality: 'ultra', seed: out.seed, folder: plan.folder, state: out.state };
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  console.log(`${clip}: ${out.id} (${out.state})`);
}
