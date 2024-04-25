// Reads theme preference from cookies
function setTheme() {
    const cookies = document.cookie.split(";");
    if(cookies.map(c => c.trim()).filter(c => c.match("theme=dark")).length > 0) {
        document.body.classList.add("dark");
    } else if (cookies.filter(c => c.match("theme=light")).length > 0) {
        document.body.classList.remove("dark");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark");
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if(event.matches) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const lightButton = document.querySelector("#light-switch");
    lightButton.addEventListener("click", () => {
        if(document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.cookie = "theme=light;";
        }
        lightButton.blur();
    });
    //Makes the button usable without a mouse
    lightButton.onkeyup = e => e.key === "Enter" && lightButton.click();

    const darkButton = document.querySelector("#dark-switch");
    darkButton.addEventListener("click", () => {
        if(!document.body.classList.contains("dark")) {
            document.body.classList.add("dark");
            document.cookie = "theme=dark;";
        }
        darkButton.blur();
    });
    //Makes the button usable without a mouse
    darkButton.onkeyup = e => e.key === "Enter" && darkButton.click();
});