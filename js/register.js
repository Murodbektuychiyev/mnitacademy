/**
 * =========================================================
 * MN IT Academy - Login/Register Sahifasi JS Mantig'i (YANGILANGAN)
 * =========================================================
 * * Vazifalar:
 * 1. O'zbekiston viloyatlari ro'yxatini "Select" maydoniga yuklash.
 * 2. Fon video pleerini boshqarish (Birinchi klik orqali ovozni yoqish).
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
    
    // Yangi o'zgaruvchi: Birinchi klik sodir bo'lganligini kuzatish
    let initialInteractionOccurred = false;


    // =========================================================
    // 1. VILOYAT RO'YXATINI TO'LDIRISH FUNKSIYASI - O'zgarishsiz
    // =========================================================
    const populateRegions = () => {
        if (!regionSelect) {
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
    // 2. OVOZ BOSHQARUVI MANTIQI (YANGILANGAN)
    // =========================================================
    if (video && toggleButton) {
        
        // Dastlabki sozlash
        video.muted = true;

        // Video Autoplay
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
        });

        // --- BOSH FUNKSIYALAR ---

        /**
         * Tugmaning ichki matnini (🔊/🔇) videoning joriy holatiga qarab yangilaydi.
         */
        const updateButtonText = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
            
            // Agar video ijro etilmayotgan bo'lsa (va ovoz yoqiq bo'lsa), uni ishga tushirishga urinish
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        };
        
        /**
         * Videoning ovoz holatini o'zgartiradi va tugma holatini yangilaydi.
         */
        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonText();
        }
        
        // Sahifa yuklanganda tugmani birinchi marta yangilash
        updateButtonText();


        // --- A. BIRINCHI INTERAKTSIYA (EKRANGA BOSISH) ---
        /**
         * Ekranning istalgan joyiga birinchi marta bosilganda ovozni yoqish uchun
         * bir marta ishlatiladigan tinglovchi.
         */
        document.addEventListener('click', function handleInitialInteraction() {
            if (!initialInteractionOccurred) {
                
                // Ovozni yoqish
                toggleVideoSound(false); 
                initialInteractionOccurred = true;
                
                // Bir marta ishlatilgandan so'ng, bu tinglovchini o'chiramiz
                document.removeEventListener('click', handleInitialInteraction);
            }
        });
        
        // --- B. KEYINGI BOSHQARUV (TUGMA ORQALI) ---
        
        // Tugmani bosish hodisasini tinglash
        toggleButton.addEventListener('click', (event) => {
            
            // Hodisaning butun dokumentga tarqalishini to'xtatish (muhim)
            event.stopPropagation();
            
            if (initialInteractionOccurred) {
                // Agar boshlang'ich interaksiya bo'lgan bo'lsa, tugma boshqaruvni o'z qo'liga oladi.
                // Ovoz holatini teskarisiga o'zgartirish
                toggleVideoSound(!video.muted);
            } else {
                // Agar hali birinchi interaksiya bo'lmagan bo'lsa (va tugma bosilgan bo'lsa)
                // Ovozni yoqish va boshqaruvni tugmaga berish
                toggleVideoSound(false);
                initialInteractionOccurred = true;
                document.removeEventListener('click', handleInitialInteraction);
            }
        });

    } 
});
