  /* ========================================== */
/* 1. PRELOADER (LOADING SCREEN)              */
/* ========================================== */
// Memastikan semua aset (gambar, font, dll) sudah dimuat sebelum web ditampilkan
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    
    // Simulasi loading bar jalan sampai 100%
    progressBar.style.width = '100%';
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Membuka kunci scroll pada body setelah loading selesai
        document.body.classList.remove('loading-state');
        
        // Memicu animasi awal (Hero Section) agar muncul perlahan
        triggerScrollAnimations();
    }, 1000); // Jeda 1 detik agar transisi mulus
});

/* ========================================== */
/* 2. CUSTOM CURSOR INTERACTION (VERSI FIX)   */
/* ========================================== */
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');

// Cek apakah device bukan layar sentuh
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        // Menggunakan left/top agar sinkron dengan CSS terbaru
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Lingkaran luar mengikuti dengan sedikit jeda (smooth)
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 40);
    });

    // Efek interaksi saat menyentuh tombol/link
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .info-card, .social-icon');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            cursorFollower.style.backgroundColor = 'rgba(0, 210, 255, 0.1)';
            cursorFollower.style.borderColor = 'rgba(0, 210, 255, 1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.backgroundColor = 'transparent';
            cursorFollower.style.borderColor = '#00d2ff';
        });
    });
}
/* ========================================== */
/* 3. NAVBAR SCROLL & MOBILE MENU             */
/* ========================================== */
const header = document.querySelector('.glass-header');
const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');

// Efek Navbar berubah warna saat halaman di-scroll ke bawah
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Fungsi buka/tutup menu di layar HP
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animasi icon hamburger berubah jadi tanda silang (X)
        const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
        if (navLinks.classList.contains('active')) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });
}

// Menutup menu mobile otomatis jika salah satu link diklik
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            mobileMenuBtn.click(); // Memicu klik untuk menutup
        }
    });
});

/* ========================================== */
/* 4. SCROLL ANIMATION (FADE IN UP)           */
/* ========================================== */
// Menggunakan Intersection Observer untuk mendeteksi elemen masuk ke layar
const fadeElements = document.querySelectorAll('.fade-in-up');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Animasi jalan saat 10% elemen sudah terlihat di layar
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animasi cuma jalan sekali
        }
    });
}, observerOptions);

function triggerScrollAnimations() {
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}
/* ========================================== */
/* 5. THREE.JS: ANIMASI BUMI 3D (BACKGROUND)  */
/* ========================================== */
let scene, camera, renderer, globe, stars, cloud;

function initThree() {
    const canvas = document.querySelector('#webgl-canvas');
    
    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.5;

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // Supaya background transparan dan menyatu dengan CSS
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Objek Utama: Bumi (Sphere)
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Material Bumi menggunakan Wireframe agar terlihat seperti hologram/tech
    // Anda bisa mengganti 'wireframe: true' menjadi false jika ingin bola solid
    const material = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
    });
    
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // 4. Tambahkan Titik Cahaya (Stars) di sekeliling
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const posArray = new Float32Array(starCount * 3);

    for(let i = 0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xffffff
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 5. Pencahayaan (Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d2ff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // 6. Mouse Interaction (Parallax Effect)
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // 7. Loop Animasi
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotasi otomatis bumi
        globe.rotation.y += 0.002;
        globe.rotation.x += 0.001;

        // Gerakan sedikit mengikuti kursor mouse (Parallax)
        const targetX = mouseX * 0.5;
        const targetY = mouseY * 0.5;

        globe.position.x += 0.05 * (targetX - globe.position.x);
        globe.position.y += 0.05 * (targetY - globe.position.y);
        
        stars.rotation.y += 0.0005;

        renderer.render(scene, camera);
    };

    animate();
}

// 8. Handle Resizing Jendela Browser
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Jalankan fungsi Three.js
initThree();

/* ========================================== */
/* 6. VANILLA TILT (EFEK KARTU 3D)            */
/* ========================================== */
// Inisialisasi library Vanilla Tilt yang kita panggil di HTML tadi
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
        max: 15,        // Kemiringan maksimal (derajat)
        speed: 400,     // Kecepatan transisi
        glare: true,    // Efek pantulan cahaya di kartu
        "max-glare": 0.2,
    });
}
