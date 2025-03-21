// Suppression du chargement automatique au DOMContentLoaded
// Le chargement sera géré uniquement par script.js lors du changement de section

async function loadFavorisContent(container, userId) {
    console.log('Début loadFavorisContent - container:', container);
    console.log('État du container HTML avant modification:', container.innerHTML);
    
    try {
        // Création de la structure HTML
        container.innerHTML = `
            <div class="favoris-header">
                <h2>Favoris</h2>
            </div>
            
            <!-- Onglets des dates -->
            <div class="date-tabs">
                <div class="tab-scroll">
                    <button class="date-tab active" data-date="today">
                        <div class="tab-day">Auj</div>
                        <div class="tab-date">20 mars</div>
                    </button>
                    <button class="date-tab" data-date="tomorrow">
                        <div class="tab-day">Ven</div>
                        <div class="tab-date">21 mars</div>
                    </button>
                    <button class="date-tab" data-date="day-after">
                        <div class="tab-day">Sam</div>
                        <div class="tab-date">22 mars</div>
                    </button>
                    <button class="date-tab" data-date="day-later">
                        <div class="tab-day">Dim</div>
                        <div class="tab-date">23 mars</div>
                    </button>
                </div>
            </div>
            
            <!-- Filtres par sport -->
            <div class="sport-filter">
                <button class="sport-btn active" data-sport="all">Tous</button>
                <button class="sport-btn" data-sport="football">Football</button>
                <button class="sport-btn" data-sport="basketball">Basketball</button>
                <button class="sport-btn" data-sport="tennis">Tennis</button>
                <button class="sport-btn" data-sport="volleyball">Volleyball</button>
            </div>
            
            <!-- Live match en cours -->
            <div class="live-match">
                <div class="live-badge">• En direct depuis 20'</div>
                <div class="match-teams">Suisse - Écosse</div>
                <div class="match-info">
                    <div class="match-score">Score: 1-0</div>
                    <div class="match-league">UEFA Nations League</div>
                    <div class="match-location">En direct de Genève</div>
                </div>
            </div>
            
            <!-- Liste des matchs favoris -->
            <div class="favorite-matches">
                <div id="favorite-matches-container">
                    <!-- Les matchs favoris seront chargés ici -->
                    <div class="loading">Chargement des matchs favoris...</div>
                </div>
            </div>
        `;
        
        console.log('HTML des favoris généré et inséré');
        console.log('État du container HTML après modification:', container.innerHTML);
        
        // Charger les matchs favoris
        loadFavoriteMatches(userId);
        
        // Ajouter les gestionnaires d'événements
        setupEventListeners();
        
    } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        container.innerHTML = `<div class="error">Impossible de charger les favoris. Veuillez réessayer plus tard.</div>`;
    }
}

async function loadFavoriteMatches(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/favorites/events`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des événements favoris');
        }
        
        const events = await response.json();
        const container = document.getElementById('favorite-matches-container');
        
        if (events.length === 0) {
            container.innerHTML = `<div class="empty-state">Aucun match favori trouvé</div>`;
            return;
        }
        
        // Trier les événements par heure
        events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        
        let matchesHTML = '';
        
        events.forEach(event => {
            const eventTime = new Date(event.datetime);
            const formattedTime = eventTime.getHours().toString().padStart(2, '0') + ':' + 
                                 eventTime.getMinutes().toString().padStart(2, '0');
            
            // Trouver les équipes/participants
            let team1 = '';
            let team2 = '';
            let team1Flag = '';
            let team2Flag = '';
            
            if (event.participants && event.participants.length >= 2) {
                // Pour les matchs avec équipes
                team1 = event.participants.find(p => p.role === 'home' || p.role === 'player1')?.name || '';
                team2 = event.participants.find(p => p.role === 'away' || p.role === 'player2')?.name || '';
                
                // Déterminer les drapeaux en fonction des noms des équipes
                team1Flag = getFlagForTeam(team1);
                team2Flag = getFlagForTeam(team2);
            } else {
                // Pour les événements sans équipes (comme F1)
                team1 = event.name;
            }
            
            matchesHTML += `
                <div class="match-card" data-event-id="${event.id}">
                    <div class="match-time">${formattedTime}</div>
                    <div class="match-teams-container">
                        <div class="team">
                            ${team1Flag}
                            <span>${team1}</span>
                        </div>
                        ${team2 ? `
                        <div class="team">
                            ${team2Flag}
                            <span>${team2}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="match-favorite">
                        <span class="material-icons favorite-icon">star</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = matchesHTML;
        
        // Ajouter des écouteurs d'événements aux cartes de match
        document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventId = card.getAttribute('data-event-id');
                showMatchDetails(eventId);
            });
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des matchs favoris:', error);
        document.getElementById('favorite-matches-container').innerHTML = 
            `<div class="error">Impossible de charger les matchs. Veuillez réessayer plus tard.</div>`;
    }
}

function getFlagForTeam(teamName) {
    // Correspondance entre les noms d'équipe et les drapeaux
    const flagMap = {
        'Italie': '<div class="flag flag-italy"></div>',
        'Allemagne': '<div class="flag flag-germany"></div>',
        'Danemark': '<div class="flag flag-denmark"></div>',
        'Portugal': '<div class="flag flag-portugal"></div>',
        'Pays-Bas': '<div class="flag flag-netherlands"></div>',
        'Espagne': '<div class="flag flag-spain"></div>',
        'Suisse': '<div class="flag flag-switzerland"></div>',
        'Écosse': '<div class="flag flag-scotland"></div>'
    };
    
    return flagMap[teamName] || '';
}

async function showMatchDetails(eventId) {
    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du match');
        }
        
        const event = await response.json();
        
        // Utiliser la section des favoris au lieu de mainContent
        const favorisSection = document.getElementById('favoris');
        
        // Sauvegarder le contenu actuel pour pouvoir revenir en arrière
        const currentContent = favorisSection.innerHTML;
        
        // Formater l'heure
        const eventTime = new Date(event.datetime);
        const formattedTime = eventTime.getHours().toString().padStart(2, '0') + ':' + 
                             eventTime.getMinutes().toString().padStart(2, '0');
        
        // Trouver les équipes
        let team1 = '';
        let team2 = '';
        let team1Flag = '';
        let team2Flag = '';
        
        if (event.participants && event.participants.length >= 2) {
            team1 = event.participants.find(p => p.role === 'home' || p.role === 'player1')?.name || '';
            team2 = event.participants.find(p => p.role === 'away' || p.role === 'player2')?.name || '';
            
            team1Flag = getFlagForTeam(team1);
            team2Flag = getFlagForTeam(team2);
        }
        
        favorisSection.innerHTML = `
            <div class="match-details">
                <div class="match-details-header">
                    <button id="back-button" class="back-button">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <h2>Détails</h2>
                    <button class="notification-button">
                        <span class="material-icons">notifications</span>
                    </button>
                </div>
                
                <div class="match-teams-header">
                    <div class="team-flag-container">
                        ${team1Flag || '<div class="flag"></div>'}
                        <div class="team-name">${team1}</div>
                    </div>
                    
                    <div class="match-time-badge">${formattedTime}</div>
                    
                    <div class="team-flag-container">
                        ${team2Flag || '<div class="flag"></div>'}
                        <div class="team-name">${team2}</div>
                    </div>
                </div>
                
                <div class="match-tabs">
                    <button class="match-tab active">Infos</button>
                    <button class="match-tab">Statistiques</button>
                    <button class="match-tab">Composition</button>
                </div>
                
                <div class="match-referee">
                    <h3>Arbitre</h3>
                    <p>${event.referee || 'Information non disponible'}</p>
                    <div class="referee-stats">
                        <span>Moy. cartons</span>
                        <div class="card-stats">
                            <span class="red-card">0.29</span>
                            <span class="yellow-card">4.00</span>
                        </div>
                    </div>
                </div>
                
                <div class="match-competition">
                    <h3>Compétition</h3>
                    <p>${event.league?.name || event.tournament?.name || 'Non spécifié'}</p>
                    <p>${event.tournament?.round || ''}</p>
                </div>
                
                <div class="match-ranking">
                    <h3>Classement FIFA</h3>
                    <div class="ranking-container">
                        <div class="team-ranking">
                            ${team1Flag || ''}
                            <span>#9</span>
                        </div>
                        <span class="ranking-separator">—</span>
                        <div class="team-ranking">
                            ${team2Flag || ''}
                            <span>#10</span>
                        </div>
                    </div>
                </div>
                
                <div class="match-stadium">
                    <h3>Stade</h3>
                    <p>${event.venue || 'Information non disponible'}</p>
                </div>
                
                <div class="match-broadcast">
                    <h3>Chaînes de télévision</h3>
                    <div class="broadcast-channel">
                        <span class="tv-icon material-icons">tv</span>
                        <span>${event.broadcast?.channel || 'RTS 2'}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter l'écouteur d'événement pour le bouton de retour
        document.getElementById('back-button').addEventListener('click', () => {
            // Recharger complètement la section des favoris au lieu de restaurer l'ancien contenu
            const userId = 'user123';
            loadFavorisContent(favorisSection, userId);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des détails du match:', error);
        alert('Impossible de charger les détails du match. Veuillez réessayer plus tard.');
    }
}

function setupEventListeners() {
    // Gestionnaires d'événements pour les onglets de date
    document.querySelectorAll('.date-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Ici, vous pourriez charger les matchs pour la date sélectionnée
        });
    });
    
    // Gestionnaires d'événements pour les filtres de sport
    document.querySelectorAll('.sport-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Ici, vous pourriez filtrer les matchs par sport
        });
    });
}