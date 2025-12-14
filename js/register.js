/**
 * =========================================================
 * MN IT Academy - Login/Register Sahifasi JS Mantig'i
 * =========================================================
 * * Vazifalar:
 * 1. O'zbekiston viloyatlari ro'yxatini "Select" maydoniga yuklash.
 * 2. Fon video pleerini boshqarish (Ovozni yoqish/o'chirish va IJRO).
 * */

// O'ZBEKISTON VILOYATLARI RO'YXATI (Soddalashtirilgan)
const regionsList = [
    "Toshkent shahri", 
    "Toshkent viloyati",
    "Samarqand viloyati",
    "Andijon viloyati",
    "Farg'ona viloyati",
    "Namangan viloyati",
    "Buxoro viloyati",
    "Qashqadaryo viloyati",
    "Surxondaryo viloyati",
    "Xorazm viloyati",
    "Navoiy viloyati",
    "Jizzax viloyati",
    "Sirdaryo viloyati",
    "Qoraqalpog'iston R."
];

/**
 * Sahifa to'liq yuklangandan so'ng asosiy funksiyalarni ishga tushirish.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTLARNI ANIQLASH ---
    const regionSelect = document.getElementById('region');
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    // =========================================================
    // 1. VILOYAT RO'YXATINI TO'LDIRISH FUNKSIYASI
    // =========================================================
    /**
     * regionsList massividan olingan qiymatlar bilan <select id="region"> elementini to'ldiradi.
     */
    const populateRegions = () => {
        if (!regionSelect) {
            // Agar "region" select maydoni mavjud bo'lmasa (masalan, Login.html da)
            return; 
        }
        
        // Birinchi bo'sh yoki o'qish uchun matnni qo'shish
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Viloyatni tanlang...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        regionSelect.appendChild(defaultOption);

        // Asosiy ro'yxatni yuklash
        regionsList.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    };

    populateRegions();


    // =========================================================
    // 2. OVOZ BOSHQARUVI MANTIQI
    // =========================================================
    if (video && toggleButton) {
        
        // Autoplay xatoligini bartaraf etish uchun, odatda Chrome/Safari brauzerlari
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi). Foydalanuvchi o'zi ishga tushirishi mumkin:", error);
        });

        /**
         * Ovoz tugmasining matnini (🔊/🔇) videoning joriy holatiga qarab yangilaydi.
         */
        const updateButtonText = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
        };
        
        // Sahifa yuklanganda tugmani birinchi marta yangilash
        updateButtonText();

        // Tugmani bosish hodisasini tinglash
        toggleButton.addEventListener('click', () => {
            // Ovoz holatini o'zgartirish
            video.muted = !video.muted;
            
            // Tugma matnini yangilash
            updateButtonText();
            
            // Agar video to'xtatilgan bo'lsa, uni ishga tushirish (Odatda, foydalanuvchi interaksiyasidan keyin ruxsat beriladi)
            if (video.paused) {
                video.play().catch(e => {
                    console.error("Video ijrosini qayta boshlashda xatolik:", e);
                });
            }
        });
    }
    
    // =========================================================
    // 3. (QO'SHIMCHA) FORMADAN YUBORISH MANTIG'I
    // =========================================================
    
    // Agar formani AJAX orqali yuborish kerak bo'lsa, bu yerga funksiya qo'shiladi:
    /*
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Ma'lumotlarni yuborish logikasi (fetch/XMLHttpRequest)
            console.log("Forma yuborildi...");
        });
    }
    */
});
