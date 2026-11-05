const { chromium } = require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:900}});
await p.goto('file://'+path.join(__dirname,process.argv[2]+'.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
console.log(await p.evaluate((sel)=>[...document.querySelectorAll(sel)].map(e=>{const r=e.getBoundingClientRect();return (e.id||e.className)+' '+Math.round(r.top)+' '+Math.round(r.height)+' w'+Math.round(r.width)}).join('\n'),process.argv[3]));
console.log('doc',await p.evaluate(()=>document.documentElement.scrollHeight));await b.close()})();
