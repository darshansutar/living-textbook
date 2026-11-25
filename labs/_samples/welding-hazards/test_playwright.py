import asyncio, sys
from playwright.async_api import async_playwright
SP='C:/Users/darsh/AppData/Local/Temp/claude/de378b954c6b0053/4c446378-b716-4538-814c-3d77d560cf25/scratchpad/'
URL='file:///F:/living%20textbook/living-textbook/labs/_samples/welding-hazards/index.html'
tag=sys.argv[1] if len(sys.argv)>1 else 'w'
CLICK = """(id)=>{ if(id==='cable'){const p=document.querySelector('[data-hit="cable"] .cable-m'); const pt=p.getPointAtLength(p.getTotalLength()*0.15); const m=p.getScreenCTM(); return [m.a*pt.x+m.c*pt.y+m.e, m.b*pt.x+m.d*pt.y+m.f];}
  const e=document.querySelector('[data-hit="'+id+'"] .pad')||document.querySelector('[data-hit="'+id+'"]'); const r=e.getBoundingClientRect(); return [r.x+r.width/2, r.y+r.height/2]}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(channel='chrome',headless=True,args=['--enable-gpu','--ignore-gpu-blocklist','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':1600,'height':900})
        errs=[]; pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=SP+f'{tag}_0_title.png')
        await pg.wait_for_timeout(1200); await pg.screenshot(path=SP+f'{tag}_0b_title_sparks.png')
        print('cam title', await pg.evaluate('JSON.stringify(LAB.cam().map(v=>Math.round(v)))'), 'particles live', await pg.evaluate('LAB.fx.parts.filter(p=>p.on).length'))
        await pg.evaluate('window.__camSlow=5'); await pg.click('#t_start'); await pg.wait_for_timeout(1700); await pg.screenshot(path=SP+f'{tag}_0c_zoom_mid.png')
        print('cam mid', await pg.evaluate('JSON.stringify(LAB.cam().map(v=>Math.round(v)))'))
        await pg.evaluate('window.__camSlow=1'); await pg.wait_for_timeout(5500)
        print('cam end', await pg.evaluate('JSON.stringify(LAB.cam().map(v=>Math.round(v)))'))
        print('particles step1', await pg.evaluate('LAB.fx.parts.filter(p=>p.on).length'))
        await pg.screenshot(path=SP+f'{tag}_1_step1.png')
        async def tap(id):
            x,y=await pg.evaluate(CLICK,id); await pg.mouse.click(x,y)
        # wrong tap on the wet patch while the machine is live, then the right tap
        await tap('cable'); await pg.wait_for_timeout(500)
        print('wrong tap (cable) fb:', await pg.inner_text('#feedback'))
        await tap('wet'); await pg.wait_for_timeout(400)
        print('wrong tap (wet while live) fb:', await pg.inner_text('#feedback'))
        await pg.screenshot(path=SP+f'{tag}_1b_wrong.png')
        await pg.click('#showme'); await pg.wait_for_timeout(900); await pg.screenshot(path=SP+f'{tag}_1c_showme.png')
        await tap('switch'); await pg.wait_for_timeout(1900)
        print('s1 ok:', await pg.inner_text('#feedback'), '|', await pg.inner_text('#readout'))
        await pg.screenshot(path=SP+f'{tag}_2_step1_done.png')
        await pg.click('#actions .btn'); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=SP+f'{tag}_3_step2.png')
        await tap('stubs'); await pg.wait_for_timeout(400); print('wrong2:', await pg.inner_text('#feedback'))
        await tap('wet'); await pg.wait_for_timeout(1300); await pg.screenshot(path=SP+f'{tag}_4a_drying_mid.png'); await pg.wait_for_timeout(1900)
        print('s2 ok:', await pg.inner_text('#feedback'), '|', await pg.inner_text('#readout'))
        await pg.screenshot(path=SP+f'{tag}_4_step2_done.png')
        await pg.click('#actions .btn'); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=SP+f'{tag}_5_step3.png')
        await tap('bin'); await pg.wait_for_timeout(400); print('wrong3:', await pg.inner_text('#feedback'))
        await tap('cotton'); await pg.wait_for_timeout(650); await pg.screenshot(path=SP+f'{tag}_6a_cotton_mid.png'); await pg.wait_for_timeout(2000)
        print('s3 ok:', await pg.inner_text('#feedback'), '|', await pg.inner_text('#readout'))
        await pg.screenshot(path=SP+f'{tag}_6_step3_done.png')
        await pg.click('#actions .btn'); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=SP+f'{tag}_7_step4.png')
        await pg.click('#choices .choice >> nth=1 >> .pick'); await pg.wait_for_timeout(500); print('wrong4:', await pg.inner_text('#feedback'))
        await pg.click('#choices .choice >> nth=0 >> .pick'); await pg.wait_for_timeout(2600)
        print('s4 ok:', await pg.inner_text('#feedback'), '|', await pg.inner_text('#readout'))
        await pg.screenshot(path=SP+f'{tag}_8_step4_done.png')
        await pg.click('#actions .btn'); await pg.wait_for_timeout(2000)
        await pg.screenshot(path=SP+f'{tag}_9_end.png')
        await pg.evaluate('window.__camSlow=4'); await pg.click('#end_back'); await pg.wait_for_timeout(1700); await pg.screenshot(path=SP+f'{tag}_9b_zoomout_mid.png'); await pg.evaluate('window.__camSlow=1'); await pg.wait_for_timeout(5500); await pg.screenshot(path=SP+f'{tag}_9c_overview_after.png')
        print('screen after back', await pg.evaluate('document.body.dataset.screen'))
        print('screen', await pg.evaluate('document.body.dataset.screen'), 'errors:', errs[:8])
        await b.close()
asyncio.run(main())
