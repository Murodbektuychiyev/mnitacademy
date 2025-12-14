/**
 * =========================================================
 * MN IT Academy - Video Boshqaruvi Mantig'i
 * =========================================================
 * Vazifalar:
 * 1. Fon videosini avtomatik ishga tushirishga urinish.
 * 2. Ovozni yoqish/o'chirish tugmasi mantiqini boshqarish.
 * 3. Video pauza holatida bo'lsa, uni foydalanuvchi harakatidan keyin ishga tushirish.
 */

// Sahifa to'liq yuklangandan so'ng asosiy funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTLARNI ANIQLASH ---
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    // Agar elementlar mavjud bo'lsa, mantiqni ishga tushirish
    if (video && toggleButton) {
        
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
        
        // Dastlabki holatni o'rnatish
        updateButtonText();

        // =========================================================
        // 2. TUGMANI BOSISH HODISASI (EVENT LISTENER)
        // =========================================================
        
        toggleButton.addEventListener('click', () => {
            // Ovoz holatini teskarisiga o'zgartirish
            video.muted = !video.muted;
            
            // Tugma matnini yangilash
            updateButtonText();
            
            // Agar video pauza holatida bo'lsa (masalan, autoplay bloklangan bo'lsa), uni ishga tushiramiz.
            if (video.paused) {
                video.play().catch(e => {
                    console.error("Video ijrosini qayta boshlashda xatolik:", e);
                });
            }
        });
    } else {
        console.warn("HTML elementlari topilmadi: 'background-video' yoki 'toggle-video-sound'.");
    }
});
