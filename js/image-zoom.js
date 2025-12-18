/**
 * Système de zoom pour les images de la page graphisme
 */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('image-zoom-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    const closeBtn = document.querySelector('.zoom-modal-close');
    const overlay = document.querySelector('.zoom-modal-overlay');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const prevBtn = document.querySelector('.zoom-modal-prev');
    const nextBtn = document.querySelector('.zoom-modal-next');
    
    let currentZoom = 1;
    let currentImageIndex = 0;
    let images = [];
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    // Récupère toutes les images zoomables
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    zoomableImages.forEach((img, index) => {
        images.push({
            src: img.dataset.zoomSrc || img.src,
            alt: img.alt
        });
        
        // Ajoute l'événement de clic sur l'image
        img.addEventListener('click', () => openZoomModal(index));
        
        // Ajoute aussi l'événement sur le bouton zoom dans l'overlay
        const card = img.closest('.graphisme-card');
        if (card) {
            const zoomBtn = card.querySelector('.zoom-btn');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openZoomModal(index);
                });
            }
        }
    });
    
    function openZoomModal(index) {
        currentImageIndex = index;
        currentZoom = 1;
        zoomedImage.src = images[index].src;
        zoomedImage.alt = images[index].alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetImageTransform();
    }
    
    function closeZoomModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentZoom = 1;
        resetImageTransform();
    }
    
    function resetImageTransform() {
        const container = document.querySelector('.zoom-modal-image-container');
        container.style.transform = 'scale(1) translate(0, 0)';
        container.style.cursor = 'default';
    }
    
    function zoomImage(factor) {
        currentZoom = Math.max(0.5, Math.min(5, currentZoom * factor));
        const container = document.querySelector('.zoom-modal-image-container');
        container.style.transform = `scale(${currentZoom})`;
        container.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    }
    
    // Événements
    closeBtn.addEventListener('click', closeZoomModal);
    overlay.addEventListener('click', closeZoomModal);
    
    zoomInBtn.addEventListener('click', () => zoomImage(1.2));
    zoomOutBtn.addEventListener('click', () => zoomImage(0.8));
    zoomResetBtn.addEventListener('click', () => {
        currentZoom = 1;
        resetImageTransform();
    });
    
    // Navigation entre les images
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openZoomModal(currentImageIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openZoomModal(currentImageIndex);
    });
    
    // Zoom avec la molette de la souris
    const imageContainer = document.querySelector('.zoom-modal-image-container');
    imageContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoomImage(delta);
    }, { passive: false });
    
    // Déplacement de l'image zoomée avec la souris
    imageContainer.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.pageX - imageContainer.offsetLeft;
            startY = e.pageY - imageContainer.offsetTop;
            scrollLeft = imageContainer.scrollLeft;
            scrollTop = imageContainer.scrollTop;
            imageContainer.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        
        const currentTransform = imageContainer.style.transform.match(/translate\(([^)]+)\)/);
        const currentTranslate = currentTransform ? currentTransform[1].split(',').map(v => parseFloat(v.trim()) || 0) : [0, 0];
        
        imageContainer.style.transform = `scale(${currentZoom}) translate(${currentTranslate[0] + walkX}px, ${currentTranslate[1] + walkY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (currentZoom > 1) {
            imageContainer.style.cursor = 'grab';
        }
    });
    
    // Fermeture avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeZoomModal();
        }
        if (e.key === 'ArrowLeft' && modal.classList.contains('active')) {
            prevBtn.click();
        }
        if (e.key === 'ArrowRight' && modal.classList.contains('active')) {
            nextBtn.click();
        }
    });
});

