document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('background-video');
            const toggleButton = document.getElementById('toggle-video-sound');

            if (video && toggleButton) {
                // Video avtomatik ishga tushishi kerak, lekin ovozsiz (brauzer talabi)
                video.play().catch(error => {
                    console.warn("Video autoplay bloklandi. Foydalanuvchi harakatini kuting.");
                });

                // Tugma holatini yangilash funksiyasi
                const updateButton = () => {
                    toggleButton.innerHTML = video.muted ? '🔇' : '🔊';
                };
                
                // Dastlabki holatni o'rnatish
                updateButton();

                // Tugmani bosish hodisasi
                toggleButton.addEventListener('click', () => {
                    // Ovozni teskarisiga o'zgartirish
                    video.muted = !video.muted;
                    updateButton();
                    
                    // Agar video pauza bo'lsa (masalan, autoplay bloklangan bo'lsa), uni ishga tushiramiz
                    if (video.paused) {
                        video.play().catch(e => {
                            console.error("Ijroga tushirishda xatolik:", e);
                        });
                    }
                });
            }
        });
        