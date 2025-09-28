
(() => {
  const cfg = window.BET33_CONFIG || {};
  const screen = document.getElementById('screen');
  const topBanner = document.getElementById('topBanner');
  const bottomBanner = document.getElementById('bottomBanner');
  const bgSweep = document.getElementById('bgSweep');
  const nav = document.querySelector('.nav');
  const cmGrid = document.getElementById('cmGrid');

  // Demo banners (replace with actual images/videos as needed)
  const bannerPairs = [
    {top:'30% 즉시보너스', bottom:'프리스핀 손실금 100% 보너스', mode:1},
    {top:'프리스핀 손실금 100% 당첨', bottom:'300배 이상 보너스 당첨', mode:2},
    {top:'BET33 비공식 파트너', bottom:'모든 이벤트는 비공식 참여란 작성', mode:1}
  ];
  let idx = 0;
  function showPair(i){
    const pair = bannerPairs[i % bannerPairs.length];
    topBanner.textContent = pair.top;
    bottomBanner.textContent = pair.bottom;
    // reset
    topBanner.className = 'banner gold';
    bottomBanner.className = 'banner blue';
    // animation style
    if(pair.mode === 2){
      topBanner.classList.add('wipe');
      bottomBanner.classList.add('wipe');
    }else{
      topBanner.classList.add('show');
      bottomBanner.classList.add('show');
    }
    // trigger background sweep
    bgSweep.classList.remove('active');
    void bgSweep.offsetWidth;
    bgSweep.classList.add('active');
  }
  showPair(idx);
  setInterval(()=>{ idx=(idx+1)%bannerPairs.length; showPair(idx); }, 4000);

  // Modal helpers
  const modal = document.getElementById('modal');
  const modalCard = document.getElementById('modalCard');
  function openModal(html, onOpen){
    modalCard.innerHTML = html;
    modal.classList.add('show');
    if(onOpen) onOpen(modalCard);
  }
  function closeModal(){ modal.classList.remove('show'); modalCard.innerHTML=''; }
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

  // Video play sequence (monitor -> fullscreen background -> back + inline form)
  function sequencePlay(videoName, withInlineForm=false){
    const src = tryVideo(videoName);
    // create video elements
    const mon = document.createElement('video');
    mon.src = src;
    mon.autoplay = true; mon.muted = true; mon.playsInline = true;
    mon.style.position = 'absolute'; mon.style.inset = '0'; mon.style.width = '100%'; mon.style.height='100%'; mon.style.objectFit = 'cover';
    screen.appendChild(mon);
    setTimeout(()=>{
      // full background stage
      const bg = document.createElement('video');
      bg.src = src; bg.autoplay = true; bg.muted = true; bg.playsInline = true; bg.loop = false;
      Object.assign(bg.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',objectFit:'cover',zIndex:35,background:'#000'});
      document.body.appendChild(bg);
      setTimeout(()=>{
        // remove full background
        bg.remove();
        // show inline form if requested
        if(withInlineForm){
          const form = document.createElement('div');
          form.className='inline-form';
          form.innerHTML = `<label>ID: <input type="text" placeholder="아이디"/></label>
            <label>24시간내 이용횟수 <input class="small" type="text" placeholder="숫자"/></label>
            <button>확인</button>`;
          screen.appendChild(form);
          form.querySelector('button').addEventListener('click', ()=>{
            mon.pause(); mon.remove(); form.remove();
          });
        }else{
          mon.pause(); mon.remove();
        }
      }, 250);
    }, 250);
  }

  function tryVideo(videoName){
    const candidate = `assets/${videoName}`;
    // Fallback to included sample video if actual asset not found (cannot check FS here; assume provided)
    return candidate || cfg.FALLBACK_VIDEO;
  }

  // Actions
  nav.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const act = btn.dataset.action;
    if(act==='coupon'){
      // 쿠폰신청: monitor -> bg -> back + inline small form
      sequencePlay(cfg.VIDEO_COUPON_APPLY || '쿠폰신청하기.mp4', true);
    }else if(act==='emergency'){
      sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false);
    }else if(act==='participate'){
      openParticipate();
    }else if(act==='contact'){
      openContact();
    }else if(act==='join'){
      openJoin();
    }else if(act==='promo'){
      // just emphasize banners by restarting background sweep
      bgSweep.classList.remove('active'); void bgSweep.offsetWidth; bgSweep.classList.add('active');
    }
  });

  function openContact(){
    const kakao = cfg.KAKAO_LINK || 'https://@@@@@KAKAO_LINK@@@@@';
    const tg = cfg.TELEGRAM_LINK || 'https://@@@@@TELEGRAM_LINK@@@@@';
    openModal(`
      <h2>문의</h2>
      <p>카카오톡: <a href="${kakao}" target="_blank" rel="noopener">bi747</a></p>
      <p>텔레그램: <a href="${tg}" target="_blank" rel="noopener">@coin_cs</a></p>
      <div class="actions"><button onclick="document.getElementById('modal').classList.remove('show')">닫기</button></div>
    `);
  }

  function openJoin(){
    const joinUrl = cfg.JOIN_URL || 'https://www.bet33.online/?a=57991';
    openModal(`
      <h2>가입하기</h2>
      <div class="row"><input type="text" placeholder="비공식 파트너 서비스 아이디"/><input type="text" placeholder="성함"/></div>
      <div class="row"><input type="password" placeholder="비밀번호"/><input type="tel" placeholder="연락처"/></div>
      <div class="actions">
        <a href="${joinUrl}" target="_blank" rel="noopener"><button>공식 사이트로 이동</button></a>
        <button id="btnJoinSubmit">가입하기</button>
      </div>
    `, (card)=>{
      card.querySelector('#btnJoinSubmit').addEventListener('click', ()=>{
        // congratulation -> coupon preference
        openModal(`
          <h2>가입을 축하드립니다</h2>
          <p>쿠폰을 받으실 수 있게 간단한 선호도를 선택해 주세요.</p>
          <div class="survey">
            ${[
              ['선호하시는 게임', ['스포츠','카지노','슬롯']],
              ['일주일 평균 이용 횟수', ['2회','4회 이상','6회 이상']],
              ['1회 평균 충전금액', ['5만원 이상','10만원 이상','20만원 이상']],
              ['최근 한달 24시간 기준 최다 충전 횟수', ['4회 이상','7회 이상','10회 이상']],
              ['최근 한달 가장 크게 한 1회 충전금액', ['10만원 이상','50만원 이상','100만원 이상']],
              ['안전 가정 시 입금보너스 얼마면 충전?', ['20% 이상','30% 이상','40% 이상/50% 이상']],
              ['이벤트 소식 알림', ['알려달라','필요없다','필요할때 내가 본다']]
            ].map(([q,opts],i)=>`
              <div class="q"><div>${i+1}. ${q}</div>
                ${opts.map((o,j)=>`<label><input type="radio" name="q${i}" ${j===0?'checked':''}/> ${o}</label>`).join('')}
              </div>`).join('')}
          </div>
          <div class="actions">
            <button onclick="document.getElementById('modal').classList.remove('show')">쿠폰받기</button>
          </div>
        `);
      });
    });
  }

  function openParticipate(){
    const html = `
      <h2>프로모션 참여</h2>
      <p>카테고리를 선택하세요.</p>
      <div class="survey">
        ${['30% 즉시보너스','프리스핀 손실금 100% 보너스','프리스핀 손실금 100% 당첨','300배 이상 보너스 당첨']
        .map((t,i)=> `<label><input type="checkbox" ${i===0?'checked':''}/> ${t}</label>`).join('')}
      </div>
      <div class="actions">
        <button id="btnPtcSubmit">확인</button>
      </div>
      <div style="margin-top:0.3cm;color:#ff8"><strong>회원만 참여 가능합니다</strong></div>
    `;
    openModal(html, (card)=>{
      card.querySelector('#btnPtcSubmit').addEventListener('click', ()=>{
        // 회원만 가능 안내 후 1초 뒤 긴급쿠폰신청.mp4 재생 → 메인으로
        closeModal();
        setTimeout(()=> sequencePlay(cfg.VIDEO_EMERGENCY || '긴급쿠폰신청.mp4', false), 1000);
      });
    });
  }

  // Keyboard toggle for cm grid
  window.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase()==='g'){
      cmGrid.classList.toggle('show');
    }
  });
})();
