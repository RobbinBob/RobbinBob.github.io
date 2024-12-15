document.addEventListener("scroll", () => {

    var scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    const images = document.querySelectorAll(".image");

    images.forEach((image, index) => {
        const start = index * viewportHeight;
        const end = (index + 1) * viewportHeight;

        if(scrollPosition >= start && scrollPosition <= end) {
            const progress = (scrollPosition - start) / viewportHeight;
            const maskStart = 100 * progress;

            image.style.clipPath = `inset(0 0 ${maskStart}%  0)`;
        } else if (scrollPosition > end) {
            image.style.clipPath = "inset(0 0 100% 0)";
        } else {
            image.style.clipPath = "inset(0 0 0 0)";
        }
    });
});

document.addEventListener("mousemove", (mouseEvt) => {
    const mouseXProgress = (mouseEvt.clientX / window.innerWidth) * 100;
    const subimages = document.querySelectorAll('.subimage');

    const skew = 15;
    const width = 50;

    var p1 = mouseXProgress - width;
    var p2 = mouseXProgress;
    var p3 = mouseXProgress + width;
    
    subimages[0].style.clipPath = `polygon(${p1 + skew}% 100%, ${p1 - skew}% 0, 0 0, 0 100%)`;
    subimages[1].style.clipPath = `polygon(${p2 + skew}% 100%, ${p2 - skew}% 0, 0 0, 0 100%)`;
    subimages[2].style.clipPath = `polygon(${p3 + skew}% 100%, ${p3 - skew}% 0, 0 0, 0 100%)`;
})