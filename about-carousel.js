// Carrousel d'images automatique
document.addEventListener('DOMContentLoaded', function() {
    const carouselSlides = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // Fonction pour mettre à jour le carrousel
    function updateCarousel() {
        // Déplacer le conteneur
        carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Mettre à jour les indicateurs
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Passer à la diapositive suivante
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    // Passer à la diapositive précédente
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    // Aller à une diapositive spécifique
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Démarrer le défilement automatique
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Change toutes les 3 secondes
    }
    
    // Arrêter le défilement automatique
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Événements pour les boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Arrêter le défilement automatique au survol
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Démarrer le défilement automatique initial
    startAutoSlide();
    
    // Téléchargement du CV en PDF
    const downloadCvBtn = document.querySelector('.hero__button-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Afficher un message de chargement
            showNotification('Préparation du téléchargement...', 'info');
            
            // Option 1: Télécharger directement le fichier HTML (le navigateur pourra le sauvegarder en PDF)
            const link = document.createElement('a');
            link.href = 'cv.html?print=true';
            link.target = '_blank';
            link.download = 'CV_Mahamat_Abdoulaye.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Afficher une notification
            setTimeout(() => {
                showNotification('CV prêt au téléchargement! Utilisez Ctrl+P pour sauvegarder en PDF', 'success');
            }, 1000);
            
            // Option 2: Utiliser l'impression pour générer un PDF
            setTimeout(() => {
                // Ouvrir dans une nouvelle fenêtre pour impression
                const printWindow = window.open('cv.html?print=true', '_blank');
                if (printWindow) {
                    printWindow.onload = function() {
                        printWindow.print();
                    };
                }
            }, 500);
        });
    }
    
    // Supprimer le bouton PDF s'il existe déjà
    const pdfButton = document.querySelector('.hero__button-pdf');
    if (pdfButton) {
        pdfButton.remove();
    }
    
    // Fonction pour afficher les notifications
    function showNotification(message, type) {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles pour la notification
        const typeColors = {
            'info': '#3b82f6',
            'success': '#10b981',
            'error': '#ef4444'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background-color: ${typeColors[type] || typeColors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
            max-width: 400px;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Ajouter les styles d'animation pour les notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});