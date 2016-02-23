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
