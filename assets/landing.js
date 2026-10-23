(function(){
  document.querySelectorAll('.shop-column[data-copies]').forEach(function(column){
    var track=column.querySelector('.shop-track');
    var sequence=track&&track.querySelector('.poster-sequence');
    if(!sequence)return;
    for(var i=1;i<Number(column.dataset.copies);i++){
      var copy=sequence.cloneNode(true);
      copy.setAttribute('aria-hidden','true');
      copy.querySelectorAll('img').forEach(function(img){img.alt=''});
      track.appendChild(copy);
    }
  });
  var video=document.getElementById('app-video');
  if(!video)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function update(){if(reduced.matches){video.pause();video.currentTime=0}else{var p=video.play();if(p&&typeof p.catch==='function')p.catch(function(){})}}
  update();
  if(typeof reduced.addEventListener==='function')reduced.addEventListener('change',update);
  else if(typeof reduced.addListener==='function')reduced.addListener(update);
})();