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
        
        // Ajouter un peu d'aléatoire dans la zone (70% de la zone pour plus d'espacement)
        const randomX = (Math.random() - 0.5) * zoneWidth * 0.7;
        const randomY = (Math.random() - 0.5) * zoneHeight * 0.7;
        
        // Rotation aléatoire entre -12 et 12 degrés (plus de rotation)
        const rotation = (Math.random() - 0.5) * 24;
        
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
    
    // Bouton pour réorganiser les notes
    const shuffleBtn = document.getElementById('shuffle-notes-btn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            // Mélanger l'ordre des notes pour un nouveau positionnement
            const notesArray = Array.from(notes);
            for (let i = notesArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [notesArray[i], notesArray[j]] = [notesArray[j], notesArray[i]];
            }
            
            // Réappliquer l'ordre mélangé au DOM
            notesArray.forEach(note => grid.appendChild(note));
            
            // Repositionner avec le nouvel ordre
            positionNotes();
            
            // Animation du bouton
            shuffleBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                shuffleBtn.style.transform = '';
            }, 500);
        });
    }
    
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
