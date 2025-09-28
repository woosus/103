
(()=>{
  const cfg = window.BET33_CONFIG || {};
  const monitor = document.getElementById('monitor');
  const nav = document.querySelector('.nav');

  function buildCandidates(name){
    const list = [];
    if(name) list.push(name);
    ['쿠폰신청하기','긴급쿠폰신청'].forEach(k => { list.push(`${k}.mp4`); list.push(`${k}1.mp4`); });
    const out = [];
    new Set(list).forEach(s=>{
      if(!s) return;
      if(/^https?:\/\//.test(s) || s.startsWith('assets/')) out.push(s);
      else out.push(`assets/${s}`);
    });
    return out;
  }

  function sequencePlay(name, withInline=false){
    const srcs = buildCandidates(name);
    const V = document.createElement('video');
    Object.assign(V, {autoplay:true, muted:true, playsInline:true, preload:'auto'});
    srcs.forEach(s => { const so = document.createElement('source'); so.src = s; V.appendChild(so); });

    const BG = document.createElement('div');
    Object.assign(BG.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',background:'#000',zIndex:20,display:'none'});
    document.body.appendChild(BG);

    monitor.appendChild(V);
    let inMonitor = true;
    const swap = () => {
      if(V.ended || V.paused) return;
      if(inMonitor){ BG.style.display='block'; BG.appendChild(V); }
      else { monitor.appendChild(V); BG.style.display='none'; }
      inMonitor = !inMonitor;
    };
    const iv = setInterval(swap, 250);

    V.addEventListener('ended', ()=>{
      clearInterval(iv); BG.remove();
      if(withInline){
        const form = document.createElement('div');
        form.className='inline-form';
        form.innerHTML = `<label>ID <input type="text" placeholder="아이디"></label>
                          <label>24시간내 이용횟수 <input class="small" type="text" placeholder="숫자"></label>
                          <button>확인</button>`;
        monitor.appendChild(form);
        form.querySelector('button').addEventListener('click', ()=>{ form.remove(); });
      }else{ V.remove(); }
    }, {once:true});

    V.addEventListener('error', ()=>{
      alert('동영상을 찾지 못했습니다. 다음 경로를 확인하세요:\\n' + srcs.join('\\n'));
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
    if(act==='coupon'){ sequencePlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true); }
    if(act==='emergency'){ sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='participate'){ sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false); }
    if(act==='contact'){ openContact(); }
    if(act==='join'){ openJoin(); }
  });

  window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g'){ document.getElementById('cmGrid').classList.toggle('show'); } });
})();
