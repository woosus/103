\
(()=>{
  const cfg = window.BET33_CONFIG || {};
  const monitor = document.getElementById('monitor');
  const nav = document.querySelector('.nav');

  function sequencePlay(videoName, withInline=false){
    const src = `assets/${videoName}`;
    // stage 1: monitor
    const mon = document.createElement('video');
    Object.assign(mon, {src:src, autoplay:true, muted:true, playsInline:true, preload:'metadata'});
    Object.assign(mon.style, {borderRadius:'0.3cm'});
    monitor.appendChild(mon);
    mon.addEventListener('ended', ()=>{
      // stage 2: full background
      const bg = document.createElement('video');
      Object.assign(bg, {src:src, autoplay:true, muted:true, playsInline:true, preload:'metadata'});
      Object.assign(bg.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',objectFit:'cover',zIndex:20,background:'#000'});
      document.body.appendChild(bg);
      bg.addEventListener('ended', ()=>{
        bg.remove();
        if(withInline){
          const form = document.createElement('div');
          form.className='inline-form';
          form.innerHTML = `<label>ID <input type="text" placeholder="아이디"/></label>
                            <label>24시간내 이용횟수 <input class="small" type="text" placeholder="숫자"/></label>
                            <button>확인</button>`;
          monitor.appendChild(form);
          form.querySelector('button').addEventListener('click', ()=>{ mon.pause(); mon.remove(); form.remove(); });
        }else{
          mon.pause(); mon.remove();
        }
      }, {once:true});
    }, {once:true});
  }

  function openJoin(){
    alert('가입하기: config.js에 JOIN_URL을 넣어주세요.');
    window.open(cfg.JOIN_URL || '#', '_blank');
  }
  function openContact(){
    const k = cfg.KAKAO_LINK || '#', t = cfg.TELEGRAM_LINK || '#';
    alert(`카카오: ${k}\n텔레그램: ${t}`);
    if(k && k !== '#') window.open(k,'_blank');
  }

  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if(!a) return;
    e.preventDefault();
    const act = a.dataset.action;
    if(act==='promo'){ /* only visual baseline for PPT skin */ }
    if(act==='coupon'){ sequencePlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true); }
    if(act==='emergency'){ sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='participate'){ sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='contact'){ openContact(); }
    if(act==='join'){ openJoin(); }
  });

  // cm grid toggle
  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g'){ document.getElementById('cmGrid').classList.toggle('show'); } });
})();
