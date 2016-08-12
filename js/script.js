   var link = document.querySelector(".feedback .btn");
   var popup = document.querySelector(".feedback-form");
   var close = popup.querySelector(".feedback-form .close");
   var form = popup.querySelector("form");
   var firstname = popup.querySelector("[name=text]");
   var firstemail = popup.querySelector("[name=email]");
   link.addEventListener("click", function (event) {
     event.preventDefault();
     popup.classList.add("feedback-form-show");
     name.focus();
   });
   close.addEventListener("click", function (event) {
     event.preventDefault();
     popup.classList.remove("feedback-form-show");
     popup.classList.remove("modal-error");
   });
   form.addEventListener("submit", function (event) {
     if (!firstname.value || !firstemail1.value) {
       event.preventDefault();
       popup.classList.add("modal-error");
     }
   });

   function initialize() {
     var mapOptions = {
       zoom: 16,
       center: new google.maps.LatLng(59.9386236, 30.3230243)
     }
     var map = new google.maps.Map(document.getElementById('map-canvas'),
       mapOptions);
     var image = "../img/map-pin.svg";
     var myLatLng = new google.maps.LatLng(59.9386236, 30.3230243);
     var beachMarker = new google.maps.Marker({
       position: myLatLng,
       map: map,
       icon: image
     });
   }
   google.maps.event.addDomListener(window, 'load', initialize);
