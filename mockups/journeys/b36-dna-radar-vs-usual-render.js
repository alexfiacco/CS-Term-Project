const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2,viewport:{width:876,height:900}});
for(const n of process.argv.slice(2)){await p.goto('file://'+path.join(__dirname,n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const f=await p.$('#fit');if(f)console.log(await f.textContent());await p.screenshot({path:path.join(__dirname,n+'.png'),fullPage:true});}await b.close();})();
