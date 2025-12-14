/**
 * =========================================================
 * MN IT Academy - Video Fon Boshqaruvi Mantig'i
 * =========================================================
 * Bu fayl asosan quyidagi funksiyalarni bajaradi:
 * 1. Fon videosini avtomatik ishga tushirish (autoplay xatolarini hisobga olgan holda).
 * 2. Ovozni yoqish/o'chirish tugmasi holatini boshqarish va uning funksionalligini ta'minlash.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. ELEMENTLARNI ANIQLASH ---
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    // Agar ikkala element ham mavjud bo'lsa, mantiqni ishga tushiramiz
    if (video && toggleButton) {
        
        // =========================================================
        // 2. VIDEO AUTOPLAY MANTIQI
        // =========================================================
        
        /**
         * Video ijrosini boshlashga harakat qiladi. Brauzerlar ko'pincha ovozli videolarni
         * avtomatik ishga tushirishni bloklaydi, shuning uchun 'play()' metodi Promise qaytaradi.
         */
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi):", error);
            // Odatda, bu yerda foydalanuvchiga videoni qo'lda ishga tushirish taklif qilinadi.
        });

        
        // =========================================================
        // 3. OVOZ TUGMASINI BOSHQARISH FUNKSIYASI
        // =========================================================

        /**
         * Tugmaning ichki matnini (🔊 yoki 🔇) videoning joriy 'muted' holatiga qarab yangilaydi.
         */
        const updateButtonStatus = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
        };
        
        // Dastlabki yuklanishda tugma holatini o'rnatish
        updateButtonStatus();

        // Tugmani bosish hodisasini tinglash
        toggleButton.addEventListener('click', () => {
            
            // Ovoz holatini teskarisiga o'zgartirish (true -> false, false -> true)
            video.muted = !video.muted;
            
            // Tugma matnini yangilash
            updateButtonStatus();
            
            // Agar video oldin bloklangan yoki to'xtatilgan bo'lsa, uni ishga tushiramiz.
            // Foydalanuvchi interaksiyasidan keyin brauzerlar ko'pincha ijroga ruxsat beradi.
            if (video.paused) {
                video.play().catch(e => {
                    console.error("Video ijrosini qayta boshlashda xatolik:", e);
                });
            }
        });

    } else {
        console.warn("HTML elementlari to'g'ri bog'lanmagan. IDs: 'background-video' yoki 'toggle-video-sound' topilmadi.");
    }
});
