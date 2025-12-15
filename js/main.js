/* --- Birlashtirilgan JAVASCRIPT KODI (Faqat birinchi klik ovozni yoqadi, keyin tugma boshqaradi) --- */

// Sahifa to'liq yuklangandan so'ng barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // A. STATISTIKA HISOBLAGICH EFFEKTI (COUNTUP) - O'zgarishsiz
    // ========================================

    function countUp(el) {
        // ... (CountUp funksiyasi kodi)
        const target = parseInt(el.getAttribute('data-target'));
        const initialValue = parseInt(el.innerText) || 0;
        
        let suffix = '';
        const id = el.id;
        if (id === 'stat1' || id === 'stat2' || id === 'stat3') {
            suffix = '+';
        } else if (id === 'stat4') {
            suffix = '%';
        }

        const duration = 2000; 
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = Math.floor(progress * (target - initialValue) + initialValue);

            el.innerText = currentValue.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    const statsBanner = document.querySelector('.stats-banner');
    const statItems = document.querySelectorAll('.stats-grid h3');
    let animationStarted = false; 

    if (statsBanner) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationStarted) {
                    statItems.forEach(item => {
                        countUp(item); 
                    });
                    animationStarted = true;
                    observer.unobserve(statsBanner); 
                }
            });
        }, {
            threshold: 0.1 
        });

        observer.observe(statsBanner);
    }


    // ========================================
    // B. UMUMIY OVOZ BOSHQARUV ELEMENTLARI
    // ========================================

    const toggleButton = document.getElementById('toggle-sound');
    const videoElement = document.getElementById('background-video');
    
    // YANGI O'ZGARUVCHI: Birinchi klik sodir bo'lganligini kuzatish
    let initialClickOccurred = false; 
    let isPlaying = false; 

    // Tugma matnini va holatini yangilash funksiyasi
    const updateButtonState = (isMuted) => {
        const text = isMuted ? '🔇 Ovozni yoqish' : '🔊 Ovozni o\'chirish'; 
        
        if (toggleButton) {
            toggleButton.setAttribute('data-text', text); 
            
            // Faqat musiqa ijro etilayotganda 'active' klassini qo'shish
            if (!isMuted && isPlaying) {
                toggleButton.classList.add('active'); 
            } else {
                toggleButton.classList.remove('active'); 
            }
        }
    };


    // ========================================
    // C. FON VIDEO VA MUSIQA OVOZINI BOSHQARISH (YANGI MANTIQ)
    // ========================================
    
    // Fon video elementini boshlang'ich holatga sozlash
    if (videoElement) {
        videoElement.muted = true; 
    }
    
    // Ovozni yoqish/o'chirish funksiyasi (Video va Musiqa uchun)
    const toggleSound = (mutedState) => {
        if (videoElement) {
            videoElement.muted = mutedState;
            // Agar ovoz yoqilsa va video pauzada bo'lsa (bloklangan bo'lishi mumkin), ijro etishga urinish
            if (!mutedState && videoElement.paused) {
                videoElement.play().catch(e => console.error("Video ijrosini boshlashda xatolik:", e));
            }
        }
        if (typeof music !== 'undefined') {
            music.muted = mutedState;
            // Agar ovoz yoqilsa va musiqa pauzada bo'lsa, ijro etishga urinish
            if (!mutedState && music.paused) {
                music.play().catch(e => console.error("Musiqa ijrosini boshlashda xatolik:", e));
            }
        }
        updateButtonState(mutedState);
    };

    // 1. DOKUMENTGA BIRINCHI KLIK TINGLOVCHISI
    // Ekranning istalgan joyiga birinchi marta bosish
    document.addEventListener('click', function handleInitialClick() {
        if (!initialClickOccurred) {
            // Ovozni yoqish
            toggleSound(false); 
            initialClickOccurred = true;
            
            // Bir marta ishlatilgandan so'ng, bu tinglovchini o'chiramiz
            document.removeEventListener('click', handleInitialClick); 
        }
    });

    // 2. TUGMA ORQALI BOSHQARUV
    // Keyingi boshqaruvlar faqat tugma orqali
    if (toggleButton) {
        toggleButton.addEventListener('click', (event) => {
            // Hodisaning butun dokumentga tarqalishini to'xtatish
            event.stopPropagation();
            
            // Agar birinchi klik bo'lgan bo'lsa, tugma boshqaruvni o'z qo'liga oladi
            if (initialClickOccurred) {
                // Hozirgi holatni teskari qilib ovozni o'zgartirish
                const newMutedState = videoElement ? !videoElement.muted : !music.muted;
                toggleSound(newMutedState);
            } else {
                 // Agar hali birinchi klik bo'lmagan bo'lsa, bu tugma kliki initialClick hodisasini ishga tushirishi kerak.
                 // toggleSound(false) chaqiriladi.
                 toggleSound(false);
                 initialClickOccurred = true;
                 document.removeEventListener('click', handleInitialClick);
            }
        });
    }


    // ========================================
    // D. PLAYLIST BOSHQARUVI - O'zgarishsiz (Musiqani ijro etish logikasi)
    // ========================================

    const music = new Audio();
    music.autoplay = true;
    music.muted = true; 
    music.volume = 0.4; 
    
    const playlist = [
        "../music/jadidalarim.mp3",
        "../music/orqa-fon-musiqa.mp3",
        "../music/soy-boyida.mp3",
        "../music/yalla-music.mp3",
        "../music/uzbekistan-yoshlari.mp3"
    ];
    
    let currentTrackIndex = 0;
    
    const playTrack = (index) => {
        music.src = playlist[index];
        music.load();
        
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
            }).catch(error => {
                isPlaying = false;
                console.warn("Autoplay bloklandi. Foydalanuvchi harakatini kuting."); 
            });
        }
    };
    
    music.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack(currentTrackIndex);
    });
    
    playTrack(currentTrackIndex);
    updateButtonState(music.muted); 

    // ========================================
    // E. FOOTER YILINI YANGILASH
    // ========================================
    document.getElementById('year').textContent = new Date().getFullYear();
});
