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
    
    // État de la taille actuelle (0: compact, 1: moyen, 2: large)
    let currentSize = 1; // Moyen par défaut
    const sizeClasses = ['compact', 'medium', 'large'];
    const sizeLabels = ['Compact', 'Moyen', 'Large'];
    const sizeIcons = ['fa-compress-alt', 'fa-expand-alt', 'fa-expand-arrows-alt'];
    
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
            sizeLabel.textContent = `Taille: ${sizeLabels[sizeIndex]}`;
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
    applySize(1);
    
    // Bouton pour changer la taille
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
    
    // Animation au survol avec effet de "levée"
    notes.forEach(note => {
        note.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        note.addEventListener('mouseleave', function() {
            this.style.zIndex = '10';
            this.style.transform = '';
        });
    });
});
