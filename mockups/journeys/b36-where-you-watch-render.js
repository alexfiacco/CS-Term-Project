const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2,viewport:{width:1330,height:900}});
await p.goto('file://'+path.join(__dirname,'b36-where-you-watch.html'));await p.waitForTimeout(500);
console.log(await p.textContent('#fit'));await p.screenshot({path:path.join(__dirname,'b36-where-you-watch.png'),fullPage:true});await b.close();})();
