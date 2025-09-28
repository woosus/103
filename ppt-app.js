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
      '긴급쿠폰신청.mp4','긴급쿠폰신청1.mp4',
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

  function openJoin(){ window.open(cfg.JOIN_URL || '#','_blank'); }
  function openContact(){
    const k = cfg.KAKAO_LINK || '#', t = cfg.TELEGRAM_LINK || '#';
    alert(`카카오: ${k}\\n텔레그램: ${t}`);
    if(k && k !== '#') window.open(k,'_blank');
  }

  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if(!a) return; e.preventDefault();
    const act = a.dataset.action;
    if(act==='promo'){ flashThenPlay(cfg.VIDEO_PROMO || '프로모션.mp4', false); }
    if(act==='coupon'){ flashThenPlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true); }
    if(act==='emergency'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='participate'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='contact'){ openContact(); }
    if(act==='join'){ openJoin(); }
  });

  // Console quick tester: window._check('assets/파일.mp4')
  window._check = (p)=>fetch(p||'assets/긴급쿠폰신청.mp4', {method:'HEAD'}).then(r=>console.log(r.status, r.headers.get('content-type')));

  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g'){ document.querySelector('.cm-grid').classList.toggle('show'); } });
})();
