// 1. Elementlarni tanlab olish
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-arrow:first-child');
const nextBtn = document.querySelector('.slider-arrow:last-child');
const container = document.querySelector('.testimonial-container');

let currentIndex = 0;
let autoPlayInterval;

// 2. Slaydni ko'rsatish funksiyasi
function showSlide(index) {
    // Indeksni aylana bo'ylab aylantirish (0 -> 1 -> 2 -> 0)
    currentIndex = (index + testimonialCards.length) % testimonialCards.length;

    // Kartalarni ko'rsatish/yashirish
    testimonialCards.forEach((card, i) => {
        card.style.display = (i === currentIndex) ? 'block' : 'none';
    });
    
    // Nuqtalarni yangilash
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// 3. Avtomatik ijro mantiqi
const startAuto = () => autoPlayInterval = setInterval(() => showSlide(currentIndex + 1), 3000);
const stopAuto = () => clearInterval(autoPlayInterval);

// 4. Hodisalarni biriktirish
nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
});

// Sichqoncha ustiga kelganda to'xtash, chiqib ketganda davom etish
container.addEventListener('mouseenter', stopAuto);
container.addEventListener('mouseleave', startAuto);

// 5. Dastlabki ishga tushirish
showSlide(currentIndex);
startAuto();
