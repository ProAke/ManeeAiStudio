import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {validateProject, review, generate, demoScript} from './lib/workflow.js';
const files = {'/':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
export function createStudioServer({config = process.env, token = null} = {}) {
let busy = false;
return http.createServer(async(req,res)=>{
  if (token) {
    const address = `127.0.0.1:${req.socket.localPort}`;
    if (req.headers.host !== address || req.headers['x-maneeflow-token'] !== token) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
  }

  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'");
  const json=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try {
    if(req.url==='/api/status' && req.method==='GET') return json(200,{configured:!!(config.AI_MODEL&&config.AI_BASE_URL),model:config.AI_MODEL||null,drive:'manual',render:false});
    if(req.url==='/api/generate' && req.method==='POST'){
      // Reject browser cross-origin requests; no permissive CORS or browser-supplied endpoints.
      if(req.headers.origin && new URL(req.headers.origin).host!==req.headers.host) return json(403,{error:'Origin not allowed'});
      if(!req.headers['content-type']?.startsWith('application/json')) return json(415,{error:'Expected JSON'});
      let body='';
      for await(const chunk of req){body+=chunk; if(Buffer.byteLength(body)>24000) return json(413,{error:'ข้อมูลใหญ่เกินไป'});}
      const input=JSON.parse(body), project=validateProject(input);
      if(busy) return json(429,{error:'มีงานกำลังประมวลผล กรุณารอสักครู่'});
      busy=true;
      try{const script=input.mode==='demo'?demoScript(project):await generate(project, config);return json(200,{script,review:review(script),mode:input.mode==='demo'?'demo':'live',createdAt:new Date().toISOString()});}finally{busy=false;}
    }
    if(req.method==='GET' && files[req.url]) {const [name,type]=files[req.url];res.writeHead(200,{'Content-Type':type});return res.end(await readFile(new URL(`./public/${name}`,import.meta.url)));}
    json(404,{error:'Not found'});
  }catch(e){json(400,{error:e.name==='TimeoutError'?'AI หมดเวลารอ กรุณาตรวจสถานะก่อนลองใหม่':e instanceof SyntaxError?'JSON ไม่ถูกต้อง':e.message==='fetch failed'?'เชื่อมต่อ AI ไม่สำเร็จ':e.message});}
});
}

