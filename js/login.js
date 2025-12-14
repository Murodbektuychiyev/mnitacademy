/**
 * =========================================================
 * MN IT Academy - Video Boshqaruvi Mantig'i (YANGILANGAN)
 * =========================================================
 * Vazifalar:
 * 1. Fon videosini avtomatik ishga tushirishga urinish (ovozsiz).
 * 2. Ekranga birinchi marta bosilganda ovozni yoqishni ta'minlash.
 * 3. Keyingi ovoz boshqaruvlarini faqat tugma orqali ta'minlash.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTLARNI ANIQLASH ---
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    // Yangi o'zgaruvchi: Birinchi klik sodir bo'lganligini kuzatish
    let initialInteractionOccurred = false;

    // Agar elementlar mavjud bo'lsa, mantiqni ishga tushirish
    if (video && toggleButton) {
        
        // Dastlabki sozlash: Brauzer qoidalariga rioya qilish
        video.muted = true;

        // =========================================================
        // 1. AUTOPLAY VA OVOZ HOLATINI BOSHQARISH
        // =========================================================

        // Video avtomatik ishga tushishi kerak, lekin ovozsiz (brauzer talabi)
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi. Foydalanuvchi harakatini kuting:", error);
        });

        /**
         * Ovoz tugmasining belgisini (🔊/🔇) videoning joriy holatiga qarab yangilaydi.
         */
        const updateButtonText = () => {
            // Agar video ovozsiz bo'lsa (muted: true), 🔇 belgisini ko'rsatish
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
        };
        
        /**
         * Videoning ovoz holatini o'zgartiradi va tugma holatini yangilaydi.
         */
        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonText();
            
            // Agar ovoz yoqilsa va video pauzada bo'lsa (bloklangan bo'lishi mumkin), ijro etishga urinish
            if (!mutedState && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        }
        
        // Dastlabki holatni o'rnatish
        updateButtonText();

        // =========================================================
        // 2. INTERAKTIVLIK MANTIQI (Birinchi klik / Tugma)
        // =========================================================
        
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

    } else {
        console.warn("HTML elementlari topilmadi: 'background-video' yoki 'toggle-video-sound'.");
    }
});
