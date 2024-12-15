fetch('/src/elements/header.html').then(response => response.text()).then(data => {
    document.getElementById('header').outerHTML = data;
});

fetch('/src/elements/footer.html').then(response => response.text()).then(data => {
    document.getElementById('footer').outerHTML = data;
});