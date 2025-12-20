
    // Karusel elementlarini tanlab olamiz
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.fa-chevron-left').parentElement;
    const nextBtn = document.querySelector('.fa-chevron-right').parentElement;

    let currentIndex = 0;
    let autoPlayInterval;

    // Slaydni ko'rsatish funksiyasi
    function showSlide(index) {
        // Indeks chegaradan chiqib ketmasligini ta'minlaymiz
        if (index >= testimonialCards.length) currentIndex = 0;
        else if (index < 0) currentIndex = testimonialCards.length - 1;
        else currentIndex = index;

        // Barcha kartalarni yashirib, keraklisini ko'rsatamiz
        testimonialCards.forEach((card, i) => {
            card.style.display = (i === currentIndex) ? 'block' : 'none';
        });

        // Nuqtalar (dots) holatini yangilaymiz
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Keyingi slaydga o'tish
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Oldingi slaydga o'tish
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Avtomatik ijro (Auto-play) - Har 2.5 soniyada
    function startAutoPlay() {
        stopAutoPlay(); // Dublikat bo'lmasligi uchun avval to'xtatamiz
        autoPlayInterval = setInterval(nextSlide, 2500);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Tugmalarga hodisalar biriktirish
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Tugma bosilganda taymerni qayta nolga tushiramiz
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
    });

    // Nuqtalarga bosilganda o'tish
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            startAutoPlay();
        });
    });

    // Sichqoncha karusel ustiga kelganda auto-play to'xtaydi, chiqib ketganda davom etadi
    const container = document.querySelector('.testimonial-container');
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Dastlabki ishga tushirish
    showSlide(currentIndex);
    startAutoPlay();


    const darkModeBtn = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeBtn.querySelector('i');

// Avval saqlangan holatni tekshirish
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

darkModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('dark-mode', 'disabled');
    }
});