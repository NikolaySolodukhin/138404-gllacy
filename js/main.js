(function() {
  'use strict';
  const link = document.querySelector('.feedback__btn');
  const overlay = document.querySelector('.overlay');
  const popup = overlay.parentNode.querySelector('.modal');
  const close = popup.querySelector('.modal__btn');

  link.addEventListener('click', function(event) {
    event.preventDefault();
    popup.classList.add('modal--show');
    overlay.classList.add('overlay--show');
  });

  link.addEventListener('enter', function(event) {
    event.preventDefault();
    popup.classList.add('modal--show');
    overlay.classList.add('overlay--show');
  });

  overlay.addEventListener('click', function(event) {
    event.preventDefault();
    popup.classList.remove('modal--show');
    overlay.classList.remove('overlay--show');
  });

  close.addEventListener('click', function(event) {
    event.preventDefault();
    popup.classList.remove('modal--show');
    overlay.classList.remove('overlay--show');
  });
})();
