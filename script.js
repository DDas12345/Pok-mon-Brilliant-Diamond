document.addEventListener('DOMContentLoaded', () => {
    // Header shadow adjustment on window position scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 11, 30, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(10, 11, 30, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // --- Home Navigation Explicit Link Handler ---
    const homeTriggers = document.querySelectorAll('a[href="#home"]');
    const homeSection = document.getElementById('home');

    homeTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Prevent default jump behavior to execute custom view logic cleanly
            e.preventDefault();

            // 1. Smoothly scroll down or reset back to the Home viewport
            if (homeSection) {
                homeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // 2. Clear out any open dropdown menus by forcing a brief blur/reset
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                setTimeout(() => {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                }, 300);
            });

            // 3. Update navbar highlights safely
            document.querySelectorAll('.nav-link-item').forEach(link => link.classList.remove('active'));
            const homeNavLink = document.querySelector('.nav-links a[href="#home"]');
            if (homeNavLink) homeNavLink.classList.add('active');

            // 4. Force a console or UI acknowledgment if needed for debugging/responses
            console.log("Navigated to Home section successfully.");
        });
    });

    // Intersection Observer configs for element slide-ins
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer targets across page layout
    const animatedElements = document.querySelectorAll('.feature-card, .starter-card, .underground-card, .character-card, .elite-card, .gym-card, .team-card, .champ-card, .section-title, .underground-promo, .legendary-wrapper, .contest-stage-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Dynamic style declaration for viewport visibility transition
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Profile Character Name Modals 
    const charCards = document.querySelectorAll('.character-card');
    const modal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const saveBtn = document.getElementById('save-name');
    const cancelBtn = document.getElementById('cancel-name');
    let activeCharNameEl = null;

    charCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.edit-name-btn')) {
                const charId = card.dataset.character;
                activeCharNameEl = document.getElementById(`${charId}-name`);
                nameInput.value = activeCharNameEl.textContent;
                modal.classList.remove('hidden');
                return;
            }
            charCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    saveBtn.addEventListener('click', () => {
        if (nameInput.value.trim() !== "" && activeCharNameEl) {
            activeCharNameEl.textContent = nameInput.value.trim();
        }
        modal.classList.add('hidden');
    });

    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Interactive Super Contest Rhythm Loop Engine
    const rhythmTrack = document.getElementById('rhythm-mini');
    const tapActionBtn = document.getElementById('perform-tap-btn');
    const movingNote = document.getElementById('note-1');
    const scoreDisplay = document.getElementById('contest-score');

    let gameScore = 0;
    let currentNotePosition = 110; // Percent offset off right boundary
    let noteSpeed = 0.65;

    function processNoteLoop() {
        if (!movingNote) return;
        currentNotePosition -= noteSpeed;

        if (currentNotePosition < -10) {
            currentNotePosition = 110; // Recycles note back to right off-screen position
        }
        movingNote.style.left = currentNotePosition + '%';
        requestAnimationFrame(processNoteLoop);
    }

    // Kick off background execution loop if layout references exist
    if (movingNote) {
        requestAnimationFrame(processNoteLoop);
    }

    function evaluateTapPerformance() {
        if (!rhythmTrack) return;

        // Target boundary is located at left: 15%. Determine if position is close.
        const alignmentDistance = Math.abs(currentNotePosition - 15);
        let judgmentString = "MISS";
        let judgmentColor = "#ff4a4a";
        let scoreAddition = 0;

        if (alignmentDistance <= 4) {
            judgmentString = "🌟 PERFECT!";
            judgmentColor = "#ffd700";
            scoreAddition = 500;
        } else if (alignmentDistance <= 9) {
            judgmentString = "👍 GOOD";
            judgmentColor = "#00d2ff";
            scoreAddition = 200;
        }

        // Apply scoring upgrades
        gameScore += scoreAddition;
        if (scoreDisplay) {
            scoreDisplay.textContent = String(gameScore).padStart(5, '0');
        }

        // Float visual banner alert over track block
        const notification = document.createElement('div');
        notification.style.position = 'absolute';
        notification.style.top = '15%';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.fontWeight = '800';
        notification.style.fontSize = '1.3rem';
        notification.style.color = judgmentColor;
        notification.style.textShadow = '0 0 10px rgba(0,0,0,0.8)';
        notification.style.pointerEvents = 'none';
        notification.textContent = judgmentString;

        rhythmTrack.appendChild(notification);

        // Recycle note node immediately on verified structural hits
        if (scoreAddition > 0) {
            currentNotePosition = 110;
        }

        setTimeout(() => notification.remove(), 600);
    }

    if (tapActionBtn) {
        tapActionBtn.addEventListener('click', evaluateTapPerformance);
    }
    if (rhythmTrack) {
        rhythmTrack.addEventListener('click', (e) => {
            if (e.target !== tapActionBtn) evaluateTapPerformance();
        });
    }

    // Digging Animation Reflow Shake Simulator
    const excavationCard = document.querySelector('.underground-card');
    if (excavationCard) {
        excavationCard.addEventListener('click', () => {
            excavationCard.style.animation = 'none';
            void excavationCard.offsetWidth; // Force Layout Reflow
            excavationCard.style.animation = 'shake 0.5s ease-in-out';
        });
    }

    // Starter Selection Data Array Panel
    const starterCards = document.querySelectorAll('.starter-card');
    const detailsContainer = document.getElementById('starter-details');
    const detailsName = document.getElementById('details-name');
    const detailsText = document.getElementById('details-text');

    const starterInfo = {
        turtwig: {
            name: "Turtwig",
            text: "Made of soil, the shell on its back hardens when it drinks water. It lives along lakes. The leaf on its head wilts if it is thirsty."
        },
        chimchar: {
            name: "Chimchar",
            text: "It agilely scales sheer cliffs to live atop craggy mountains. Its fire is put out when it sleeps. The gas made in its belly burns as fire at its rear."
        },
        piplup: {
            name: "Piplup",
            text: "A proud Pokémon, it dislikes accepting food from people. Its thick down guards it from cold. It lives along shores in northern countries."
        }
    };

    starterCards.forEach(card => {
        card.addEventListener('click', () => {
            const pokemon = card.dataset.pokemon;
            const info = starterInfo[pokemon];
            if (info && detailsContainer && detailsName && detailsText) {
                detailsName.textContent = info.name;
                detailsText.textContent = info.text;
                detailsContainer.classList.remove('hidden');
            }
        });
    });

    // Game Editions Checkout Modals
    const preorderBtn = document.getElementById('preorder-btn');
    const preorderModal = document.getElementById('preorder-modal');
    const closePreorder = document.querySelector('.close-preorder');
    const versionBtns = document.querySelectorAll('.version-btn');
    const boxArt = document.getElementById('preorder-box-art');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (preorderBtn && preorderModal) {
        preorderBtn.addEventListener('click', () => preorderModal.classList.remove('hidden'));
    }
    if (closePreorder && preorderModal) {
        closePreorder.addEventListener('click', () => preorderModal.classList.add('hidden'));
    }

    versionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            versionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            if (boxArt) {
                if (btn.classList.contains('diamond-btn')) {
                    boxArt.src = 'images/box_diamond.png';
                } else if (btn.classList.contains('pearl-btn')) {
                    boxArt.src = 'images/box_pearl.png';
                }
            }
        });
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkoutBtn.innerHTML = 'Processing...';
            setTimeout(() => {
                checkoutBtn.innerHTML = 'Thank You! 🎉';
                checkoutBtn.style.background = '#48d0b0';
                setTimeout(() => {
                    if (preorderModal) preorderModal.classList.add('hidden');
                    checkoutBtn.innerHTML = 'Proceed to Checkout';
                    checkoutBtn.style.background = '';
                }, 1500);
            }, 1000);
        });
    }

    // Historical Manuscript Dialogue Modal
    const mythBtn = document.getElementById('myth-btn');
    const mythModal = document.getElementById('myth-modal');
    const closeMyth = document.querySelector('.close-myth');

    if (mythBtn && mythModal) {
        mythBtn.addEventListener('click', () => mythModal.classList.remove('hidden'));
    }
    if (closeMyth && mythModal) {
        closeMyth.addEventListener('click', () => mythModal.classList.add('hidden'));
    }

    // Global background click modal dismissal handling
    window.addEventListener('click', (e) => {
        if (e.target === preorderModal) preorderModal.classList.add('hidden');
        if (e.target === mythModal) mythModal.classList.add('hidden');
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Team Galactic Grunt Dialogue Interactivity
    const gruntBtn = document.querySelector('.grunt-talk-btn');
    const gruntText = document.getElementById('grunt-text');

    const gruntQuotes = [
        "\"Our Leader is making a brand new universe! ...Wait, are we invited to it?\"",
        "\"I'm just a Grunt. I don't ask questions, I just look cool in this bowl cut!\"",
        "\"We are stealing electricity from Valley Windworks because... uh... reasons!\"",
        "\"Don't look at me! I lost my keys to the Veilstone HQ warehouse again.\"",
        "\"My Wurmple is in the top percentage of Wurmples! Oh wait, wrong region.\""
    ];

    if (gruntBtn && gruntText) {
        gruntBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * gruntQuotes.length);
            gruntText.textContent = gruntQuotes[randomIndex];
            gruntText.classList.remove('hidden');
        });
    }
});