const sideBar = document.querySelector('.side-bar');
const showBtn = document.querySelector('.show-side-bar');
const hideBtn = document.querySelector('.hide-side-bar');

showBtn.addEventListener('click', () => sideBar.classList.add('active'));
hideBtn.addEventListener('click', () => sideBar.classList.remove('active'));