/**
 * Script pour la gestion de la liste des notes collantes sur la page Omerta
 */

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.sticky-notes-grid');
    const allNotes = document.querySelectorAll('.sticky-note');
    
    if (!grid || allNotes.length === 0) return;
    
    // Séparer les notes normales du bouton retour
    const returnNote = document.querySelector('.return-note');
    const notes = Array.from(allNotes).filter(note => !note.classList.contains('return-note'));
    
    // État de la taille actuelle (comme l'explorateur de fichiers)
    // 0: très petite, 1: petite, 2: moyenne, 3: grande, 4: très grande
    let currentSize = 2; // Moyenne par défaut
    const sizeClasses = ['extra-small', 'small', 'medium', 'large', 'extra-large'];
    const sizeLabels = ['Très petite', 'Petite', 'Moyenne', 'Grande', 'Très grande'];
    const sizeIcons = ['fa-th', 'fa-th-large', 'fa-th-list', 'fa-list', 'fa-list-alt'];
    
    // Fonction pour appliquer la taille
    function applySize(sizeIndex) {
        // Retirer toutes les classes de taille
        sizeClasses.forEach(cls => grid.classList.remove(cls));
        
        // Ajouter la nouvelle classe
        grid.classList.add(sizeClasses[sizeIndex]);
        
        // Mettre à jour le label et l'icône
        const sizeLabel = document.getElementById('size-label');
        const sizeBtn = document.getElementById('size-toggle-btn');
        if (sizeLabel) {
            sizeLabel.textContent = sizeLabels[sizeIndex];
        }
        if (sizeBtn) {
            const icon = sizeBtn.querySelector('i');
            if (icon) {
                icon.className = `fas ${sizeIcons[sizeIndex]}`;
            }
        }
        
        currentSize = sizeIndex;
    }
    
    // Initialiser avec la taille moyenne
    applySize(2);
    
    // Bouton pour changer la taille (comme l'explorateur de fichiers)
    const sizeBtn = document.getElementById('size-toggle-btn');
    if (sizeBtn) {
        sizeBtn.addEventListener('click', function() {
            // Passer à la taille suivante (cyclique)
            const nextSize = (currentSize + 1) % sizeClasses.length;
            applySize(nextSize);
            
            // Animation du bouton
            sizeBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                sizeBtn.style.transform = '';
            }, 150);
        });
    }
    
    // S'assurer que le bouton retour est toujours en bas
    if (returnNote && returnNote.parentNode) {
        returnNote.parentNode.appendChild(returnNote);
    }
    
    // Animation au survol améliorée
    notes.forEach((note, index) => {
        // Effet de focus au clic
        note.addEventListener('click', function(e) {
            // Retirer le focus des autres notes
            notes.forEach(n => n.classList.remove('focused'));
            // Ajouter le focus à cette note
            this.classList.add('focused');
            
            // Animation de clic
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Effet au survol
        note.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
        });
        
        note.addEventListener('mouseleave', function() {
            if (!this.classList.contains('focused')) {
                this.style.zIndex = '10';
            }
        });
    });
    
    // Raccourci clavier pour changer la taille (Ctrl/Cmd + +/-)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                const nextSize = Math.min(sizeClasses.length - 1, currentSize + 1);
                applySize(nextSize);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                const prevSize = Math.max(0, currentSize - 1);
                applySize(prevSize);
            }
        }
    });
    
    // Sauvegarder la taille préférée dans localStorage
    const savedSize = localStorage.getItem('omertaGridSize');
    
    // Wrapper pour sauvegarder à chaque changement
    const originalApplySize = applySize;
    applySize = function(sizeIndex) {
        originalApplySize(sizeIndex);
        localStorage.setItem('omertaGridSize', sizeIndex.toString());
    };
    
    // Charger la taille sauvegardée au démarrage
    if (savedSize !== null) {
        const sizeIndex = parseInt(savedSize, 10);
        if (sizeIndex >= 0 && sizeIndex < sizeClasses.length) {
            applySize(sizeIndex);
        }
    }
});
