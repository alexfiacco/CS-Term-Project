const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();
for(const n of process.argv.slice(2)){const p=await b.newPage({deviceScaleFactor:2,viewport:{width:1200,height:900}});
await p.goto('file://'+path.join(__dirname,n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
const w=await p.evaluate(()=>document.body.scrollWidth);await p.setViewportSize({width:w,height:900});await p.waitForTimeout(200);
await p.screenshot({path:path.join(__dirname,n+'.png'),fullPage:true});await p.close();}await b.close();})();
