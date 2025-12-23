import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// =========================================================
// 1. FIREBASE KONFIGURATSIYASI
// =========================================================
const firebaseConfig = {
    apiKey: "AIzaSyBPojRJlq-H-813eOaz13o44EJSDwRDQVw",
    authDomain: "mnitacademy-777.firebaseapp.com",
    projectId: "mnitacademy-777",
    storageBucket: "mnitacademy-777.firebasestorage.app",
    messagingSenderId: "645094960890",
    appId: "1:645094960890:web:9814e1bab983264a96a343"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    
    // --- VIDEO ELEMENTLARI ---
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');
    let initialInteractionOccurred = false;

    // --- FORMA ELEMENTLARI ---
    const resetForm = document.getElementById('reset-form');

    // =========================================================
    // 2. VIDEO VA OVOZ BOSHQARUVI MANTIQI
    // =========================================================
    if (video && toggleButton) {
        video.muted = true; // Boshida ovozsiz

        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
        });

        const updateButtonStatus = () => {
            toggleButton.innerHTML = video.muted ? '辦 Ovoz' : '🔊 Ovoz';
            
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Xatolik:", e));
            }
        };
        
        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonStatus();
        }

        // --- Ekran bo'ylab birinchi klik (Ovozni yoqish uchun) ---
        const handleInitialClick = () => {
            if (!initialInteractionOccurred) {
                toggleVideoSound(false); 
                initialInteractionOccurred = true;
                document.removeEventListener('click', handleInitialClick);
            }
        };
        document.addEventListener('click', handleInitialClick);

        // --- Ovoz tugmasi bosilganda ---
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (initialInteractionOccurred) {
                toggleVideoSound(!video.muted);
            } else {
                toggleVideoSound(false);
                initialInteractionOccurred = true;
                document.removeEventListener('click', handleInitialClick);
            }
        });
    }

    // =========================================================
    // 3. FIREBASE PAROLNI TIKLASH MANTIQI
    // =========================================================
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // HTML dagi <input id="email"> bilan mos bo'lishi kerak
            const emailInput = document.getElementById('email'); 
            const emailValue = emailInput ? emailInput.value.trim() : "";

            if (!emailValue) {
                alert("Iltimos, email manzilingizni kiriting!");
                return;
            }

            try {
                // Firebase orqali xat yuborish
                await sendPasswordResetEmail(auth, emailValue);
                
                alert("Parolni tiklash havolasi emailingizga yuborildi! Pochtangizni (va Spam papkasini) tekshiring.");
                
                // Muvaffaqiyatli bo'lsa, Login sahifasiga qaytarish
                window.location.href = "login.html";

            } catch (error) {
                console.error("Firebase Xatolik:", error.code, error.message);
                
                let userFriendlyMessage = "Xatolik yuz berdi. Qayta urinib ko'ring.";
                
                if (error.code === 'auth/user-not-found') {
                    userFriendlyMessage = "Bunday email bilan foydalanuvchi topilmadi!";
                } else if (error.code === 'auth/invalid-email') {
                    userFriendlyMessage = "Email manzili noto'g'ri kiritilgan!";
                } else if (error.code === 'auth/too-many-requests') {
                    userFriendlyMessage = "Juda ko'p urinish bo'ldi. Biroz kutib turing.";
                }

                alert(userFriendlyMessage);
            }
        });
    }
});
