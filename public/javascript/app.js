$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
  });
const navitems = document.querySelectorAll('.nav-item');
navitems.forEach(nav => {
    nav.addEventListener('click', (e) => {
        let oldActive = document.querySelector('.nav-item.active');
        oldActive.classList.remove('active');
        e.target.parentElement.classList.add('active');
    }
    )
});
