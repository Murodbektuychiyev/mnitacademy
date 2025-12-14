/* --- Birlashtirilgan JAVASCRIPT KODI (Media Session API bilan yangilandi) --- */

// Sahifa to'liq yuklangandan so'ng barcha funksiyalarni ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // A. STATISTIKA HISOBLAGICH EFFEKTI (COUNTUP) - O'zgarishsiz
    // ========================================
    // ... (A bo'limining kodi, o'zgarishsiz)
    function countUp(el) { /* ... kod ... */ }
    const statsBanner = document.querySelector('.stats-banner');
    const statItems = document.querySelectorAll('.stats-grid h3');
    let animationStarted = false; 
    if (statsBanner) { /* ... kod ... */ }
    // ========================================


    // ========================================
    // B. UMUMIY OVOZ BOSHQARUV ELEMENTLARI - O'zgarishsiz
    // ========================================
    const toggleButton = document.getElementById('toggle-sound');
    const videoElement = document.getElementById('background-video');
    let initialClickOccurred = false; 
    let isPlaying = false; 

    const updateButtonState = (isMuted) => {
        const text = isMuted ? '🔇 Ovozni yoqish' : '🔊 Ovozni o\'chirish'; 
        if (toggleButton) {
            toggleButton.setAttribute('data-text', text); 
            if (!isMuted && isPlaying) {
                toggleButton.classList.add('active'); 
            } else {
                toggleButton.classList.remove('active'); 
            }
        }
    };
    // ========================================


    // ========================================
    // C. FON VIDEO VA MUSIQA OVOZINI BOSHQARISH - O'zgarishsiz
    // ========================================
    
    if (videoElement) {
        videoElement.muted = true; 
    }

    const toggleSound = (mutedState) => {
        if (videoElement) {
            videoElement.muted = mutedState;
            if (!mutedState && videoElement.paused) {
                videoElement.play().catch(e => console.error("Video ijrosini boshlashda xatolik:", e));
            }
        }
        if (typeof music !== 'undefined') {
            music.muted = mutedState;
            if (!mutedState && music.paused) {
                music.play().catch(e => console.error("Musiqa ijrosini boshlashda xatolik:", e));
            }
        }
        updateButtonState(mutedState);
    };

    function handleInitialClick() {
        if (!initialClickOccurred) {
            toggleSound(false); 
            initialClickOccurred = true;
            document.removeEventListener('click', handleInitialClick); 
        }
    }
    document.addEventListener('click', handleInitialClick);

    if (toggleButton) {
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (initialClickOccurred) {
                const newMutedState = videoElement ? !videoElement.muted : !music.muted;
                toggleSound(newMutedState);
            } else {
                 toggleSound(false);
                 initialClickOccurred = true;
                 document.removeEventListener('click', handleInitialClick);
            }
        });
    }
    // ========================================


    // ========================================
    // D. PLAYLIST BOSHQARUVI VA MEDIA SESSION API
    // ========================================

    const music = new Audio();
    music.autoplay = true;
    music.muted = true; 
    music.volume = 0.4; 
    
    // Qo'shiqlar ro'yxati va ularning metama'lumotlari
    const playlist = [
        { src: "../music/jadidalarim.mp3", title: "Jadidlarim", artist: "MN IT Academy" },
        { src: "../music/orqa-fon-musiqa.mp3", title: "Orqa Fon Musiqasi", artist: "MN IT Academy" }, 
        { src: "../music/soy-boyida.mp3", title: "Soy Bo'yida", artist: "MN IT Academy" }, 
        { src: "../music/yalla-music.mp3", title: "Yalla Music", artist: "MN IT Academy" }, 
    ];
    
    let currentTrackIndex = 0;
    
    // --- YANGI QISM: Media Session metama'lumotlarini o'rnatish ---
    const updateMediaSession = () => {
        if ('mediaSession' in navigator) {
            const track = playlist[currentTrackIndex];
            
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: 'MN IT Academy',
                artwork: [
                    // Bu yerga sayt logosi yoki albom muqovasining manzili qo'shiladi
                    { src: 'img/favicon-logo.png', sizes: '96x96', type: 'image/png' },
                    { src: 'img/favicon-logo.png', sizes: '128x128', type: 'image/png' },
                ]
            });
        }
    };
    
    // Musiqani ijro etish funksiyasi
    const playTrack = (index) => {
        currentTrackIndex = index;
        music.src = playlist[currentTrackIndex].src;
        music.load();
        
        const playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updateMediaSession(); // Qo'shiq o'zgarganda metama'lumotni yangilash
            }).catch(error => {
                isPlaying = false;
                console.warn("Autoplay bloklandi. Foydalanuvchi harakatini kuting."); 
            });
        }
    };
    
    // --- YANGI QISM: Media Session Tugma Boshqaruvchilari ---
    if ('mediaSession' in navigator) {
        
        // Keyingi qo'shiq
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            playTrack(currentTrackIndex);
        });

        // Oldingi qo'shiq
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            playTrack(currentTrackIndex);
        });
        
        // Pauza tugmasini boshqarish (Brauzer pleyeridagi || tugmasi)
        navigator.mediaSession.setActionHandler('pause', () => {
            music.pause();
            isPlaying = false;
            updateButtonState(music.muted);
        });
        
        // Play tugmasini boshqarish (Brauzer pleyeridagi > tugmasi)
        navigator.mediaSession.setActionHandler('play', () => {
            music.play();
            isPlaying = true;
            updateButtonState(music.muted);
        });
    }

    // Musiqa tugashi hodisasi: Keyingi musiqaga o'tish (Loop)
    music.addEventListener('ended', () => {
        playTrack((currentTrackIndex + 1) % playlist.length);
    });
    
    // Sahifa yuklanganda dastlabki ijroni boshlash
    playTrack(currentTrackIndex);
    
    // Dastlabki tugma holatini o'rnatish
    updateButtonState(music.muted); 

    // ========================================
    // E. FOOTER YILINI YANGILASH
    // ========================================
    document.getElementById('year').textContent = new Date().getFullYear();
});