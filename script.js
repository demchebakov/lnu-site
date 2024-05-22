document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuList = document.querySelector('.nav-list');

    mobileMenu.addEventListener('click', function() {
        menuList.classList.toggle('active');
    });
});
