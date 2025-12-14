/**
 * =========================================================
 * MN IT Academy - Video Fon Boshqaruvi Mantig'i (YANGILANGAN)
 * =========================================================
 * Bu fayl asosan quyidagi funksiyalarni bajaradi:
 * 1. Fon videosini avtomatik ishga tushirish (autoplay xatolarini hisobga olgan holda).
 * 2. Birinchi foydalanuvchi interaksiyasi (ekranga bosish) orqali videoning ovozini yoqish.
 * 3. Keyingi boshqaruvlarni faqat maxsus tugma ('toggle-video-sound') orqali ta'minlash.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. ELEMENTLARNI ANIQLASH ---
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    // Yangi o'zgaruvchi: Birinchi klik sodir bo'lganligini kuzatish
    let initialInteractionOccurred = false;

    // Agar ikkala element ham mavjud bo'lsa, mantiqni ishga tushiramiz
    if (video && toggleButton) {
        
        // Dastlabki sozlash: Brauzer qoidalariga rioya qilish uchun
        video.muted = true;
        
        // =========================================================
        // 2. VIDEO AUTOPLAY MANTIQI
        // =========================================================
        
        // Videoni avtomatik ishga tushirishga harakat qilamiz (ovozsiz holatda).
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
            // Agar bloklansa ham, foydalanuvchi interaksiyasini kutishda davom etamiz.
        });

        
        // =========================================================
        // 3. OVOZNI BOSHQARISH FUNKSIYALARI
        // =========================================================

        /**
         * Tugmaning ichki matnini (🔊 yoki 🔇) videoning joriy 'muted' holatiga qarab yangilaydi.
         */
        const updateButtonStatus = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
            
            // Agar video ijro etilmayotgan bo'lsa (va ovoz yoqiq bo'lsa), uni ishga tushirishga urinish
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        };
        
        // Dastlabki yuklanishda tugma holatini o'rnatish
        updateButtonStatus();

        /**
         * Videoning ovoz holatini o'zgartiradi va tugma holatini yangilaydi.
         */
        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonStatus();
        }

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

    } else {
        console.warn("HTML elementlari to'g'ri bog'lanmagan. IDs: 'background-video' yoki 'toggle-video-sound' topilmadi.");
    }
});
