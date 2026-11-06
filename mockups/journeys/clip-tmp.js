const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900},deviceScaleFactor:2});
await p.goto('file://'+path.join(__dirname,process.argv[2]+'.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const [x,y,w,h]=process.argv[3].split(',').map(Number);
await p.screenshot({path:'/tmp/claude-0/-home-user-CS-Term-Project/3b15a6fd-9770-5491-87a5-4cf8acc3cc2b/scratchpad/'+process.argv[4],clip:{x,y,width:w,height:h},fullPage:true});await b.close();})();
