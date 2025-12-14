/* --- Birlashtirilgan JAVASCRIPT KODI --- */

// Sahifa to'liq yuklangandan so'ng barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // A. STATISTIKA HISOBLAGICH EFFEKTI (COUNTUP)
    // ========================================

    function countUp(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const initialValue = parseInt(el.innerText) || 0;
        
        // 1. Suffix (qo'shimcha belgi) ni aniqlash
        let suffix = '';
        const id = el.id;
        // 'stat1' va 'stat2', 'stat3' uchun + belgisi
        if (id === 'stat1' || id === 'stat2' || id === 'stat3') {
            suffix = '+';
        } 
        // 'stat4' uchun % belgisi
        else if (id === 'stat4') {
            suffix = '%';
        }

        // 2. Animatsiya sozlamalari
        const duration = 2000; // 2 soniya
        const startTime = performance.now();

        // 3. Animatsiya kadrlari funksiyasi
        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = Math.floor(progress * (target - initialValue) + initialValue);

            el.innerText = currentValue.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        // Animatsiyani boshlash
        requestAnimationFrame(animate);
    }

    // Statistika bo'limi elementlari
    const statsBanner = document.querySelector('.stats-banner');
    const statItems = document.querySelectorAll('.stats-grid h3');
    let animationStarted = false; // Bir marta ishga tushirish uchun belgi

    // Intersection Observer orqali stats bo'limini kuzatish
    if (statsBanner) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Agar bo'lim ko'rinadigan bo'lsa va animatsiya hali boshlanmagan bo'lsa
                if (entry.isIntersecting && !animationStarted) {
                    statItems.forEach(item => {
                        countUp(item); // Har bir elementni animatsiya qilish
                    });
                    animationStarted = true;
                    observer.unobserve(statsBanner); // Kuzatishni to'xtatish
                }
            });
        }, {
            threshold: 0.1 
        });

        // Kuzatishni boshlash
        observer.observe(statsBanner);
    }


    // ========================================
    // B. OVOZNI BOSHQARISH VA PLAYLIST
    // ========================================
    
    const toggleButton = document.getElementById('toggle-sound');

    // Agar tugma topilmasa, Musiqa funksiyasini ishga tushirmaymiz
    if (!toggleButton) return; 

    const music = new Audio();
    music.autoplay = true;
    music.muted = true; 
    music.volume = 0.4; // Ovoz balandligini biroz pasaytirish mumkin
    
    // Musiqa fayllari ro'yxati (Iltimos, manzilini to'g'rilang)
    const playlist = [
        "../music/jadidalarim.mp3", // Musiqa 1
        "../music/orqa-fon-musiqa.mp3",      // Musiqa 2
        "../music/soy-boyida.mp3",      // Musiqa 3
        "../music/yalla-music.mp3",      // Musiqa 4
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false; 
    
    // Tugmani matni va holatini yangilash
    const updateButtonState = (isMuted) => {
        const text = isMuted ? '🔇 Ovozni yoqish' : '🎵 Ovozni o‘chirish';
        
        // Asosiy tugma matnini va CSS uchun data-text ni yangilash
        // Matnni faqat ::after elementidan foydalanish uchun o'chirib qo'yamiz
        // toggleButton.innerHTML = text; 
        toggleButton.setAttribute('data-text', text); 
        
        if (!isMuted && isPlaying) {
            toggleButton.classList.add('active'); // Raqs effekti yoqish
        } else {
            toggleButton.classList.remove('active'); // Raqs effekti o'chirish
        }
    };

    // Musiqani ijro etish funksiyasi
    const playTrack = (index) => {
        music.src = playlist[index];
        music.load();
        
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updateButtonState(music.muted);
            }).catch(error => {
                isPlaying = false;
                // Konsolda xatolikni ko'rsatish
                console.warn("Autoplay bloklandi. Tugma bosilishini kuting."); 
                updateButtonState(music.muted);
            });
        }
    };
    
    // Musiqa tugashi hodisasi: Keyingi musiqaga o'tish (Loop)
    music.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playTrack(currentTrackIndex);
    });
    
    // Sahifa yuklanganda dastlabki ijroni boshlash
    playTrack(currentTrackIndex);
    
    // Dastlabki tugma holatini o'rnatish
    updateButtonState(music.muted); 
    
    // Tugmani bosish tinglovchisi (Ovozni yoqish/o'chirish)
    toggleButton.addEventListener('click', () => {
        if (music.muted) {
            // Ovozni yoqish
            music.muted = false;
            // Agar pauzada bo'lsa va ijro bloklangan bo'lsa, qayta ijro etishga urinish
            if (music.paused) { 
                music.play().catch(e => console.error("Ovozni yoqishda xatolik:", e));
            }
        } else {
            // Ovozni o'chirish
            music.muted = true;
        }
        updateButtonState(music.muted); 
    });
});

document.getElementById('year').textContent = new Date().getFullYear();
