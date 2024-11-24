const menuBtn = document.getElementById('menuBtn');
const navbarNav = document.getElementById('navbarNav'); 

menuBtn.addEventListener('click', () => {
    navbarNav.classList.toggle('active');
});