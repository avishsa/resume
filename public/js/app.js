const navitems = document.querySelectorAll('.nav-item');
navitems.forEach(nav => {
    nav.addEventListener('click', (e) => {
        e.preventDefault();
        let oldActive = document.querySelector('.nav-item.active');
        oldActive.classList.remove('active');
        e.target.parentElement.classList.add('active');
    }
    )
});
