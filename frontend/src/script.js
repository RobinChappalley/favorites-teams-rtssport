document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');

    // Fonction pour changer de section
    function changeSection(sectionId) {
        // Masquer toutes les sections
        sections.forEach(section => {
            section.classList.remove('active');
            // Nettoyer le contenu des favoris si on quitte cette section
            if (section.id === 'favoris') {
                section.innerHTML = '';
            }
        });

        // Désactiver tous les liens de navigation
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Afficher la section sélectionnée
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            
            // Si c'est la section des favoris, initialiser son contenu
            if (sectionId === 'favoris' && typeof loadFavorisContent === 'function') {
                const userId = 'user123'; // ID utilisateur fixe pour l'exemple
                loadFavorisContent(selectedSection, userId);
            }
        }

        // Activer le lien de navigation correspondant
        const selectedNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (selectedNavItem) {
            selectedNavItem.classList.add('active');
        }
    }

    // Gérer les clics sur les liens de navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            changeSection(sectionId);
        });
    });

    // Gérer le hash de l'URL au chargement de la page
    const initialHash = window.location.hash.slice(1) || 'actualites';
    changeSection(initialHash);

    // Gérer les changements de hash pendant la navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'actualites';
        changeSection(hash);
    });
});