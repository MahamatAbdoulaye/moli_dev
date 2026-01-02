// ===== DOM Elements =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const themeButton = document.getElementById('theme-toggle');
const searchButton = document.getElementById('search-btn');
const searchClose = document.getElementById('search-close');
const searchModal = document.getElementById('search');
const searchInput = document.querySelector('.search__input');
const loginButton = document.getElementById('login-btn');
const loginClose = document.getElementById('login-close');
const loginModal = document.getElementById('login');
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('form-message');

// ===== Initialisation =====
document.addEventListener('DOMContentLoaded', () => {
    removeDuplicateProfile();
    fixJeSuisText();
    initTheme();
    setTimeout(initTextAnimation, 100);
    initEventListeners();
    initSmoothScroll();
    updateFooterYear();
});

// ===== Fonctions utilitaires =====
function removeDuplicateProfile() {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;
    
    const allProfiles = heroContent.querySelectorAll('.hero__profile');
    for (let i = 1; i < allProfiles.length; i++) {
        allProfiles[i].remove();
    }
}

function fixJeSuisText() {
    const heroDynamic = document.querySelector('.hero__dynamic');
    if (!heroDynamic) return;
    
    const jeSuisElement = heroDynamic.querySelector('.hero__dynamic-text');
    if (!jeSuisElement) {
        heroDynamic.innerHTML = `
            <span class="hero__dynamic-text">Je suis </span>
            <div class="text-animation-container">
                <span class="changing-text"></span>
            </div>
        `;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (themeButton) {
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeButton.className = 'ri-sun-line nav__theme';
        } else {
            body.classList.remove('dark-theme');
            themeButton.className = 'ri-moon-line nav__theme';
        }
    }
}

function initEventListeners() {
    // Menu mobile
    if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);
    if (navClose) navClose.addEventListener('click', closeMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && !href.startsWith('http') && window.innerWidth <= 1020) {
                closeMobileMenu();
            }
        });
    });
    
    // Thème
    if (themeButton) themeButton.addEventListener('click', toggleTheme);
    
    // Recherche
    if (searchButton) searchButton.addEventListener('click', openSearchModal);
    if (searchClose) searchClose.addEventListener('click', closeSearchModal);
    
    // Login
    if (loginButton) loginButton.addEventListener('click', openLoginModal);
    if (loginClose) loginClose.addEventListener('click', closeLoginModal);
    
    // Contact
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
    
    // Événements généraux
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearchModal();
            closeLoginModal();
            closeMobileMenu();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (searchModal && searchModal.classList.contains('show-search') && 
            !e.target.closest('.search__form') && 
            !e.target.closest('#search-btn') &&
            !e.target.closest('#search-close')) {
            closeSearchModal();
        }
        
        if (loginModal && loginModal.classList.contains('show-login') && 
            !e.target.closest('.login__form') && 
            !e.target.closest('#login-btn') &&
            !e.target.closest('#login-close')) {
            closeLoginModal();
        }
        
        if (navMenu && navMenu.classList.contains('show-menu') && 
            !e.target.closest('.nav__menu') && 
            !e.target.closest('#nav-toggle') &&
            !e.target.closest('#nav-close')) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('scroll', updateActiveLink);
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1020 && document.body.classList.contains('menu-open')) {
            closeMobileMenu();
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('http') || href.includes('.html')) return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(link => link.classList.remove('active-link'));
                this.classList.add('active-link');
            }
        });
    });
}

function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== Gestion du menu mobile =====
function toggleMobileMenu() {
    navMenu.classList.toggle('show-menu');
    document.body.classList.toggle('menu-open');
    
    if (navToggle) {
        const toggleIcon = navToggle.querySelector('i');
        if (toggleIcon) {
            toggleIcon.className = navMenu.classList.contains('show-menu') 
                ? 'ri-close-line' 
                : 'ri-menu-line';
        }
    }
}

function openMobileMenu() {
    navMenu.classList.add('show-menu');
    document.body.classList.add('menu-open');
    
    if (navToggle) {
        const toggleIcon = navToggle.querySelector('i');
        if (toggleIcon) toggleIcon.className = 'ri-close-line';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('show-menu');
    document.body.classList.remove('menu-open');
    
    if (navToggle) {
        const toggleIcon = navToggle.querySelector('i');
        if (toggleIcon) toggleIcon.className = 'ri-menu-line';
    }
}

// ===== Gestion du thème =====
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeButton.className = 'ri-sun-line nav__theme';
        localStorage.setItem('theme', 'dark');
    } else {
        themeButton.className = 'ri-moon-line nav__theme';
        localStorage.setItem('theme', 'light');
    }
}

// ===== Gestion de la recherche =====
function openSearchModal() {
    searchModal.classList.add('show-search');
    if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 100);
    }
}

function closeSearchModal() {
    searchModal.classList.remove('show-search');
}

// ===== Gestion du login =====
function openLoginModal() {
    loginModal.classList.add('show-login');
}

function closeLoginModal() {
    loginModal.classList.remove('show-login');
}

// ===== Gestion du formulaire =====
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Veuillez entrer une adresse email valide', 'error');
        return;
    }
    
    showMessage('Envoi du message en cours...', 'success');
    
    setTimeout(() => {
        showMessage('Message envoyé avec succès !', 'success');
        contactForm.reset();
        
        setTimeout(() => {
            if (contactMessage) contactMessage.style.display = 'none';
        }, 5000);
    }, 1500);
}

function showMessage(message, type) {
    if (!contactMessage) return;
    contactMessage.textContent = message;
    contactMessage.className = `form__message ${type}`;
    contactMessage.style.display = 'block';
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== Animation du texte (simplifiée) =====
let professionIndex = 0;
let charIndex = 0;
let isDeleting = false;
const professions = [
    "Développeur Full-Stack",
    "Designer UI/UX",
    "Ingénieur DevOps"
];

function initTextAnimation() {
    const changingText = document.querySelector('.changing-text');
    if (changingText) typeEffect();
}

function typeEffect() {
    const currentProfession = professions[professionIndex];
    const typingElement = document.querySelector('.changing-text');
    if (!typingElement) return;
    
    if (isDeleting) {
        typingElement.textContent = currentProfession.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentProfession.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentProfession.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        professionIndex = (professionIndex + 1) % professions.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

// ===== Gestion des liens actifs =====
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link?.classList.add('active-link');
        } else {
            link?.classList.remove('active-link');
        }
    });
}