const {app, BrowserWindow, dialog, shell, session} = require('electron');
const {randomBytes} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
let server, origin;
const driveURL = 'https://drive.google.com/drive/folders/1idnsM6Uo4PZhueN_JoOOQetAStqgruQu';
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => {const w=BrowserWindow.getAllWindows()[0]; if(w){if(w.isMinimized())w.restore();w.focus();}});
  app.whenReady().then(start).catch(error=>{dialog.showErrorBox('ManeeFlow could not start', error.message);app.quit();});
}
async function start() {
  // Read user-owned settings only, never read a .env from the working directory.
  const configPath = path.join(app.getPath('userData'), 'ai.env');
  if(!fs.existsSync(configPath)) fs.writeFileSync(configPath,'# Restart ManeeFlow after editing. Never share this file.\nAI_BASE_URL=https://api.openai.com/v1\nAI_MODEL=\nAI_API_KEY=\n',{mode:0o600});
  const {parseEnv} = require('node:util');
  const config = parseEnv(fs.readFileSync(configPath,'utf8'));
  const {createStudioServer} = await import(pathToFileURL(path.join(__dirname,'../server.js')).href);
  const token = randomBytes(32).toString('hex');
  server = createStudioServer({config, token});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  origin = `http://127.0.0.1:${server.address().port}`;
  const ses = session.fromPartition('maneeflow');
  ses.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
  ses.setPermissionCheckHandler(()=>false);
  ses.webRequest.onBeforeSendHeaders((details,callback)=>{
    // Token only for this application's loopback origin; renderer never sees it.
    const headers = {...details.requestHeaders};
    delete headers['X-ManeeFlow-Token']; delete headers['x-maneeflow-token'];
    if(new URL(details.url).origin===origin) headers['X-ManeeFlow-Token']=token;
    callback({requestHeaders:headers});
  });
  ses.on('will-download',(_event,item)=>{item.setSaveDialogOptions({title:'Save ManeeFlow project',defaultPath:'maneeflow-project.json'});});
  const {Menu} = require('electron');
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform==='darwin'?[{role:'appMenu'}]:[]),
    {label:'File',submenu:[{label:'AI settings…',click:async()=>{const error=await shell.openPath(configPath);if(error)dialog.showErrorBox('Cannot open settings',error);}},{type:'separator'},{role:process.platform==='darwin'?'close':'quit'}]},
    {role:'editMenu'},{role:'viewMenu'}
  ]));
  function openWindow(){
    const win = new BrowserWindow({width:1320,height:940,minWidth:760,minHeight:620,title:'ManeeFlow',backgroundColor:'#f5f6f2',webPreferences:{session:ses,nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
    win.webContents.setWindowOpenHandler(({url})=>{if(url===driveURL)void shell.openExternal(url);return {action:'deny'};});
    win.webContents.on('will-navigate',(event,url)=>{if(url!==`${origin}/`)event.preventDefault();});
    win.loadURL(`${origin}/`);
  }
  openWindow();
  app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)openWindow();});
}
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
app.on('before-quit',()=>{server?.close();server?.closeAllConnections();});
