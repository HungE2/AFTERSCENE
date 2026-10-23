(function(){
  var video=document.getElementById('app-video');
  if(!video)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function update(){if(reduced.matches){video.pause();video.currentTime=0}else{var p=video.play();if(p&&typeof p.catch==='function')p.catch(function(){})}}
  update();
  if(typeof reduced.addEventListener==='function')reduced.addEventListener('change',update);
  else if(typeof reduced.addListener==='function')reduced.addListener(update);
})();

