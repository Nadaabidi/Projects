const menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".main-container");

/*when we click on menu a function will run & toggle-method will be active*/
menu.addEventListener("click", () => {
    container.classList.toggle("active");
})
