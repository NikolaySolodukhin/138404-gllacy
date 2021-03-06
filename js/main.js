'use strict';
(function() {
  var link = document.querySelector('.feedback__btn');
  var overlay = document.querySelector('.overlay');
  var popup = overlay.parentNode.querySelector('.modal');
  var close = popup.querySelector('.modal__btn');

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

  ymaps.ready(function() {
    var myMap = new ymaps.Map(
        'map-canvas',
        {
          center: [59.9386236, 30.3230243],
          zoom: 16
        },
        {
          searchControlProvider: 'yandex#search'
        }
      ),
      myPlacemark = new ymaps.Placemark(
        myMap.getCenter(),
        {
          balloonContent: 'Gllacy'
        },
        {
          iconLayout: 'default#image',
          iconImageHref: '../img/map-pin.svg',
          iconImageSize: [79, 139],
          iconImageOffset: [-39, -139]
        }
      );

    myMap.geoObjects.add(myPlacemark);
  });
})();
