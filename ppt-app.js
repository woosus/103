\
(()=>{
  const cfg = window.BET33_CONFIG || {};
  const monitor = document.getElementById('monitor');
  const triTL = document.getElementById('triTL');
  const triBR = document.getElementById('triBR');
  const hlineX = document.getElementById('hlineX');
  const flashBlack = document.getElementById('flashBlack');
  const flashWhite = document.getElementById('flashWhite');
  const nav = document.querySelector('.nav');

  function recalc(){
    const gold = document.getElementById('goldline').getBoundingClientRect().bottom + window.scrollY;
    const r = monitor.getBoundingClientRect();
    const centerY = Math.round(r.top + window.scrollY + r.height/2);
    const hbarH = parseFloat(getComputedStyle(hlineX).height)||0;
    hlineX.style.top = `${centerY - hbarH/2}px`;

    const tlH = Math.max(centerY - gold, 0);
    triTL.style.top = `${gold}px`;
    triTL.style.height = `${tlH}px`;
    triTL.style.clipPath = `polygon(0 0, 100% 0, 0 100%)`;

    const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const brH = Math.max(docH - centerY, 0);
    triBR.style.top = `${centerY}px`;
    triBR.style.height = `${brH}px`;
    triBR.style.clipPath = `polygon(100% 0, 100% 100%, 0 100%)`;
  }
  window.addEventListener('resize', recalc);
  window.addEventListener('scroll', recalc, {passive:true});
  window.addEventListener('load', recalc);

  function buildCandidates(name){
    const set = new Set([
      name,
      cfg.VIDEO_PROMO, cfg.VIDEO_COUPON_APPLY, cfg.VIDEO_EMERGENCY,
      '쿠폰신청하기.mp4','쿠폰신청하기1.mp4',
      '긴급쿠폰신청.mp4','긴급쿠폰신청1.mp4','긴급쿠폰신청.MP4',
      '프로모션.mp4','promotion.mp4','promo.mp4',
      '1033333333.mp4','emergency-bg.mp4'
    ]);
    return [...set].filter(Boolean).map(s => /^https?:/.test(s)||s.startsWith('assets/') ? s : `assets/${s}`);
  }
  function flashThenPlay(name, withInline=false){
    const V = document.createElement('video');
    Object.assign(V,{autoplay:true,muted:true,playsInline:true,preload:'auto',style:'border-radius:0.3cm;'});
    buildCandidates(name).forEach(s=>{ const so=document.createElement('source'); so.src=s; V.appendChild(so); });

    flashBlack.style.display='block';
    setTimeout(()=>{
      flashBlack.style.display='none';
      flashWhite.style.display='block';
      setTimeout(()=>{
        flashWhite.style.display='none';
        monitor.innerHTML='';
        monitor.appendChild(V);
        V.play().catch(()=>{});
      }, 60);
    }, 60);

    V.addEventListener('ended', ()=>{
      if(withInline){
        const form = document.createElement('div');
        form.className='inline-form';
        form.innerHTML = `<label>ID <input type="text" placeholder="아이디"/></label>
                          <label>24시간내 이용횟수 <input class="small" type="text" placeholder="숫자"/></label>
                          <button>확인</button>`;
        monitor.appendChild(form);
        form.querySelector('button').addEventListener('click', ()=>{ form.remove(); });
      }else{ V.remove(); }
    }, {once:true});

    V.addEventListener('error', ()=>{
      alert('동영상을 찾지 못했습니다. 다음 경로를 확인하세요:\\n' + buildCandidates(name).join('\\n'));
    }, {once:true});
  }

  // promo engine
  function makeStage(){
    const stage = document.createElement('div');
    stage.className = 'promo-stage';
    stage.innerHTML = `
      <div class="promo-bg-top" id="pbgTop"></div>
      <div class="promo-bg-bottom" id="pbgBottom"></div>

      <div class="promo-row" id="prowTop">
        <img id="pimgTop" class="promo-img" alt="top banner"/>
        <div class="promo-mask-top"></div>
      </div>

      <div class="promo-row" id="prowMid"></div>

      <div class="promo-row" id="prowBottom">
        <img id="pimgBottom" class="promo-img" alt="bottom banner"/>
        <div class="promo-mask-bottom"></div>
      </div>

      <div class="promo-skip" id="pSkip" title="다음 배너"></div>
    `;
    return stage;
  }

  function runPromo(){
    const slides = (cfg.PROMO_SLIDES && cfg.PROMO_SLIDES.length) ? cfg.PROMO_SLIDES.slice() : [];
    if(!slides.length){ alert('프로모션 슬라이드가 설정되지 않았습니다. config.js의 PROMO_SLIDES를 채워주세요.'); return; }
    monitor.innerHTML='';
    const stage = makeStage();
    monitor.appendChild(stage);

    const topImg = stage.querySelector('#pimgTop');
    const bottomImg = stage.querySelector('#pimgBottom');
    const bgTop = stage.querySelector('#pbgTop');
    const bgBottom = stage.querySelector('#pbgBottom');
    const skip = stage.querySelector('#pSkip');

    let idx = 0, modeIdx = 0, timer = null;
    function load(i){
      const s = slides[i % slides.length];
      topImg.src = s.top;
      bottomImg.src = s.bottom;
    }
    const wait = (ms)=>new Promise(r=>setTimeout(r,ms));
    function bgOffset(){
      const v = (cfg.PROMO_BG_TIMING||'with').toLowerCase();
      if(v==='before') return -300;
      if(v==='after') return 300;
      return 0;
    }

    async function playSlide(){
      const mode = (cfg.PROMO_MODES && cfg.PROMO_MODES.length) ? cfg.PROMO_MODES[modeIdx % cfg.PROMO_MODES.length] : 'slide';

      if(mode==='slide'){
        topImg.style.transition='none'; bottomImg.style.transition='none';
        topImg.style.transform='translateX(-120%)'; bottomImg.style.transform='translateX(120%)';
        bgTop.style.transition='none'; bgBottom.style.transition='none';
        bgTop.style.width='0'; bgBottom.style.width='0';
        await wait(30);

        const off = bgOffset();
        if(off<=0){
          setTimeout(()=>{
            bgTop.style.transition='width 2000ms ease';
            bgBottom.style.transition='width 2000ms ease';
            bgTop.style.width='100%'; bgBottom.style.width='100%';
          }, Math.max(0,-off));
        }
        topImg.style.transition='transform 1500ms ease';
        bottomImg.style.transition='transform 1500ms ease';
        topImg.style.transform='translateX(0)'; bottomImg.style.transform='translateX(0)';
        if(off>0){
          setTimeout(()=>{
            bgTop.style.transition='width 2000ms ease';
            bgBottom.style.transition='width 2000ms ease';
            bgTop.style.width='100%'; bgBottom.style.width='100%';
          }, off);
        }
        await wait(2000);
      }else{
        // collapse
        topImg.style.transition='none'; bottomImg.style.transition='none';
        topImg.style.transform='translateY(0)'; bottomImg.style.transform='translateY(0)';
        await wait(30);
        topImg.style.transition='transform 2000ms ease-in';
        bottomImg.style.transition='transform 2000ms ease-in';
        topImg.style.transform='translateY(60%)';
        bottomImg.style.transform='translateY(-60%)';
        bgTop.style.transition='width 2000ms ease'; bgBottom.style.transition='width 2000ms ease';
        bgTop.style.width='100%'; bgBottom.style.width='100%';
        await wait(2000);
        // swap roles
        const s = slides[idx % slides.length];
        slides[idx % slides.length] = { top: s.bottom, bottom: s.top };
      }
    }

    async function cycle(){
      clearTimeout(timer);
      load(idx);
      await playSlide();
      idx = (idx + 1) % slides.length;
      modeIdx++;
      timer = setTimeout(cycle, (cfg.PROMO_INTERVAL_SEC||4)*1000);
    }
    skip.onclick=()=>cycle();
    cycle();
  }

  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if(!a) return; e.preventDefault();
    const act = a.dataset.action;
    if(act==='promo'){ runPromo(); }
    if(act==='coupon'){ flashThenPlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true); }
    if(act==='emergency'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='participate'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
  });

  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g'){ document.querySelector('.cm-grid').classList.toggle('show'); } });
  window._check = (p)=>fetch(p||'assets/긴급쿠폰신청.MP4', {method:'HEAD'}).then(r=>console.log(r.status, r.headers.get('content-type')));
})();
