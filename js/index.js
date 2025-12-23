document.addEventListener('DOMContentLoaded', function() {

    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');

    if (navToggle && nav) {
        
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('open'); 
            
            const icon = navToggle.querySelector('i');
            if (nav.classList.contains('open')) {
                icon.className = 'fa fa-times';
            } else {
                icon.className = 'fa fa-bars';
            }
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                navToggle.querySelector('i').className = 'fa fa-bars'; 
            });
        });
    }


    // ========================================
    // A. STATISTIKA HISOBLAGICH EFFEKTI (COUNTUP)
    // ========================================

    function countUp(el) {
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
    // C. FON VIDEO VA MUSIQA OVOZINI BOSHQARISH
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


    document.addEventListener('click', function handleInitialClick() {
        if (!initialClickOccurred) {
            toggleSound(false); 
            initialClickOccurred = true;
            document.removeEventListener('click', handleInitialClick); 
        }
    });


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
    // D. PLAYLIST BOSHQARUVI
    // ========================================

    const music = new Audio();
    music.autoplay = true;
    music.muted = true; 
    music.volume = 0.4; 
    
    const playlist = [
        "../music/uzbekistan-yoshlari.mp3",
        "../music/keling-yoshlar.mp3",
        "../music/jadidalarim.mp3",
        "../music/orqa-fon-musiqa.mp3",
        "../music/yalla-music.mp3",
        "../music/soy-boyida.mp3",
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


    document.getElementById('year').textContent = new Date().getFullYear();
});
