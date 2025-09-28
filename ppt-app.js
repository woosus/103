\
(()=>{
  const cfg = window.BET33_CONFIG || {};
  const monitor = document.getElementById('monitor');
  const nav = document.querySelector('.nav');
  const flashBlack = document.getElementById('flashBlack');
  const flashWhite = document.getElementById('flashWhite');
  const hlineX = document.getElementById('hlineX');

  function positionHLine(){
    const r = monitor.getBoundingClientRect();
    const h = parseFloat(getComputedStyle(hlineX).height) || 0;
    const top = Math.round(r.top + (r.height/2) - (h/2) + window.scrollY);
    hlineX.style.top = `${Math.max(top, 0)}px`;
  }
  window.addEventListener('resize', positionHLine);
  window.addEventListener('scroll', positionHLine, {passive:true});
  window.addEventListener('load', positionHLine);

  function buildCandidates(name){
    const out = new Set([name,'쿠폰신청하기.mp4','쿠폰신청하기1.mp4','긴급쿠폰신청.mp4','긴급쿠폰신청1.mp4']);
    return [...out].filter(Boolean).map(s => /^https?:/.test(s)||s.startsWith('assets/') ? s : `assets/${s}`);
  }

  function flashThenPlay(name, withInline=false){
    const V = document.createElement('video');
    Object.assign(V,{autoplay:true,muted:true,playsInline:true,preload:'auto',style:'border-radius:0.3cm;'});
    buildCandidates(name).forEach(s=>{ const so=document.createElement('source'); so.src=s; V.appendChild(so); });

    // 0.2초 안에서: 검정 (~60ms) -> 흰색 (~60ms) -> 재생 시작
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
    if(act==='coupon'){ flashThenPlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true); }
    if(act==='emergency'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='participate'){ flashThenPlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='contact'){ openContact(); }
    if(act==='join'){ openJoin(); }
  });

  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g'){ document.querySelector('.cm-grid').classList.toggle('show'); } });
})();
