
/**
 * Lightweight gallery popup without external dependencies.
 * Usage: add class 'js-open-gallery' and a 'data-gallery' attribute with
 * a comma-separated list of image URLs to any element (e.g., the card).
 */
(function(){
  const overlay = document.getElementById('lb-overlay');
  const imgEl = overlay.querySelector('.lb-image');
  const prevBtn = overlay.querySelector('.lb-prev');
  const nextBtn = overlay.querySelector('.lb-next');
  const closeBtn = overlay.querySelector('.lb-close');
  const backdrop = overlay.querySelector('.lb-backdrop');
  const idxEl = overlay.querySelector('.lb-index');
  const totalEl = overlay.querySelector('.lb-total');

  let images = [];
  let index = 0;

  function open(gallery, startIndex=0){
    images = gallery.filter(Boolean).map(s => s.trim()).filter(Boolean);
    if(images.length === 0){ return; }
    index = Math.min(Math.max(startIndex, 0), images.length-1);
    totalEl.textContent = images.length;
    setImage(index);
    overlay.classList.remove('lb-hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function close(){
    overlay.classList.add('lb-hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function setImage(i){
    index = i;
    imgEl.src = images[index];
    idxEl.textContent = index + 1;
  }

  function next(){ setImage( (index + 1) % images.length ); }
  function prev(){ setImage( (index - 1 + images.length) % images.length ); }

  // Controls
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Keyboard support
  window.addEventListener('keydown', (e)=>{
    if(overlay.classList.contains('lb-hidden')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // Hook up triggers
  document.addEventListener('click', function(e){
    const trigger = e.target.closest('.js-open-gallery');
    if(!trigger) return;
    e.preventDefault();
    const list = (trigger.getAttribute('data-gallery') || '').split(',');
    const coverImg = trigger.querySelector('img');
    if((!list || list.length === 0) && coverImg) list.push(coverImg.getAttribute('src'));
    open(list, 0);
  });
})();
