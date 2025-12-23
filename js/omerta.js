/**
 * Script pour le positionnement aléatoire des notes collantes sur la page Omerta
 */

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.sticky-notes-grid');
    const notes = document.querySelectorAll('.sticky-note');
    
    if (!grid || notes.length === 0) return;
    
    // Fonction pour générer une position aléatoire mais organisée
    function getRandomPosition(index, total, containerWidth, containerHeight) {
        // Calculer une zone pour chaque note pour éviter les superpositions
        const zonesPerRow = Math.ceil(Math.sqrt(total));
        const zoneWidth = containerWidth / zonesPerRow;
        const zoneHeight = containerHeight / Math.ceil(total / zonesPerRow);
        
        const row = Math.floor(index / zonesPerRow);
        const col = index % zonesPerRow;
        
        // Position de base dans la zone
        const baseX = col * zoneWidth;
        const baseY = row * zoneHeight;
        
        // Ajouter un peu d'aléatoire dans la zone (30% de la zone)
        const randomX = (Math.random() - 0.5) * zoneWidth * 0.3;
        const randomY = (Math.random() - 0.5) * zoneHeight * 0.3;
        
        // Rotation aléatoire entre -8 et 8 degrés
        const rotation = (Math.random() - 0.5) * 16;
        
        return {
            left: Math.max(20, Math.min(containerWidth - 320, baseX + randomX)),
            top: Math.max(40, Math.min(containerHeight - 200, baseY + randomY)),
            rotation: rotation
        };
    }
    
    // Fonction pour positionner toutes les notes
    function positionNotes() {
        const containerWidth = grid.offsetWidth || window.innerWidth - 40;
        const containerHeight = Math.max(
            grid.offsetHeight || window.innerHeight,
            window.innerHeight
        );
        
        // Mettre à jour la hauteur du conteneur
        grid.style.minHeight = `${containerHeight}px`;
        
        notes.forEach((note, index) => {
            const position = getRandomPosition(index, notes.length, containerWidth, containerHeight);
            
            note.style.left = `${position.left}px`;
            note.style.top = `${position.top}px`;
            note.style.setProperty('--note-rotation', `${position.rotation}deg`);
            note.style.position = 'absolute';
        });
        
        // Ajuster la hauteur du conteneur après positionnement
        let maxBottom = 0;
        notes.forEach(note => {
            const bottom = note.offsetTop + note.offsetHeight;
            if (bottom > maxBottom) maxBottom = bottom;
        });
        
        if (maxBottom > 0) {
            grid.style.minHeight = `${maxBottom + 100}px`;
        }
    }
    
    // Positionner les notes au chargement
    positionNotes();
    
    // Repositionner lors du redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionNotes, 250);
    });
    
    // Animation au survol avec effet de "levée"
    notes.forEach(note => {
        note.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            this.style.transform = `translateY(-15px) scale(1.08) rotate(${this.style.getPropertyValue('--note-rotation')})`;
        });
        
        note.addEventListener('mouseleave', function() {
            this.style.zIndex = '10';
            this.style.transform = '';
        });
    });
});
