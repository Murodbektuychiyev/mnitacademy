import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. FIREBASE KONFIGURATSIYASI ---
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
const db = getFirestore(app);

// --- 2. FIREBASE: ISMNI OLISH ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists()) {
                const greeting = document.getElementById('user-greeting');
                if (greeting) greeting.innerText = `Xush kelibsiz, ${docSnap.data().name}!`;
            }
        } catch (e) { console.error("Firebase xatosi:", e); }
    } else {
        window.location.href = "login.html";
    }
});

// --- 3. HAMBURGER MENYU MANTIQI (Yangilangan: ☰ -> ✕) ---
const menuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (menuBtn && navMenu) {
    const menuIcon = menuBtn.querySelector('i'); // Tugma ichidagi <i> elementini olamiz

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        
        // Ikonkani almashtirish (Font Awesome klasslari bilan)
        if (navMenu.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-xmark'); // Bars -> X
            menuIcon.style.color = '#3b82f6'; // Ochilganda ko'k rang (ixtiyoriy)
        } else {
            menuIcon.classList.replace('fa-xmark', 'fa-bars'); // X -> Bars
            menuIcon.style.color = ''; // Asl rangiga qaytarish
        }
    };

    // Ekran bosilganda yopish
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuIcon.classList.replace('fa-xmark', 'fa-bars');
                menuIcon.style.color = '';
            }
        }
    });
}

// --- 4. AUTO CAROUSEL (2.5 SEKUND) ---
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.querySelector('.slider-arrow:last-child');
const prevBtn = document.querySelector('.slider-arrow:first-child');
const sliderContainer = document.querySelector('.testimonial-container');

if (cards.length > 0) {
    let index = 0;
    let timer;

    const show = (i) => {
        index = (i + cards.length) % cards.length;
        cards.forEach((c, n) => c.style.display = (n === index) ? 'block' : 'none');
        dots.forEach((d, n) => d.classList.toggle('active', n === index));
    };

    const start = () => { 
        clearInterval(timer); 
        timer = setInterval(() => show(index + 1), 2500); 
    };
    
    if (nextBtn) nextBtn.onclick = () => { show(index + 1); start(); };
    if (prevBtn) prevBtn.onclick = () => { show(index - 1); start(); };
    dots.forEach((d, i) => d.onclick = () => { show(i); start(); });

    if (sliderContainer) {
        sliderContainer.onmouseenter = () => clearInterval(timer);
        sliderContainer.onmouseleave = start;
    }

    show(0);
    start();
}

// --- 5. YILNI YANGILASH ---
const yr = document.getElementById('year');
if (yr) yr.innerText = new Date().getFullYear();
