// Lads, Lads, Lads! - Trip App

// Data for each lad - includes PDF page numbers (1-indexed)
const ladsData = {
    matt: {
        name: 'Matt',
        fullName: 'Matthew Lewsey',
        outbound: { seat: '15A', group: '5', pdfPage: 1 },
        fiorentina: { sector: 'PLA', row: '1', seat: '30', gate: 'P02', pdfPage: 1 },
        verona: { sector: 'Curva Est Inf 8', row: '1', seat: '14', gate: '9', pdfFile: 'images/verona_matt.pdf' },
        train: { pkpass: 'images/train_matt.pkpass', coach: '2' }
    },
    andy: {
        name: 'Andy',
        fullName: 'Andrew Brown',
        outbound: { seat: '15B', group: '5', pdfPage: 2 },
        fiorentina: { sector: 'PLA', row: '1', seat: '29', gate: 'P02', pdfPage: 2 },
        verona: null, // TBC
        train: null // TBC
    },
    mark: {
        name: 'Mark',
        fullName: 'Mark Brown',
        outbound: { seat: '15C', group: '5', pdfPage: 3 },
        fiorentina: { sector: 'PLA', row: '1', seat: '28', gate: 'P02', pdfPage: 3 },
        verona: { sector: 'Curva Est Inf 8', row: '1', seat: '13', gate: '9', pdfFile: 'images/verona_mark.pdf' },
        train: { pkpass: 'images/train_mark.pkpass', coach: '2' }
    },
    ken: {
        name: 'Ken',
        fullName: 'Kenneth Chu',
        outbound: { seat: '15D', group: '5', pdfPage: 4 },
        fiorentina: { sector: 'PLA', row: '1', seat: '26', gate: 'P02', pdfFile: 'images/fiorentina_ken_chris.pdf', pdfPage: 2 },
        verona: null, // TBC
        train: { pkpass: 'images/train_ken.pkpass', coach: '2' }
    },
    chris: {
        name: 'Chris',
        fullName: 'Christopher Phillips',
        outbound: { seat: '15E', group: '5', pdfPage: 5 },
        fiorentina: { sector: 'PLA', row: '1', seat: '27', gate: 'P02', pdfFile: 'images/fiorentina_ken_chris.pdf', pdfPage: 1 },
        verona: null, // TBC
        train: { pkpass: 'images/train_chris.pkpass', coach: '2' }
    }
};

let currentLad = null;

// DOM Elements - initialized after DOM loads
let selectScreen, mainScreen, welcomeMsg, backBtn, ladCards, tabBtns, tabContents;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    selectScreen = document.getElementById('select-screen');
    mainScreen = document.getElementById('main-screen');
    welcomeMsg = document.getElementById('welcome-msg');
    backBtn = document.getElementById('back-btn');
    ladCards = document.querySelectorAll('.lad-card');
    tabBtns = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');

    // Check if a lad was previously selected
    const savedLad = localStorage.getItem('selectedLad');
    if (savedLad && ladsData[savedLad]) {
        selectLad(savedLad);
    }

    // Set up event listeners for lad cards
    ladCards.forEach(card => {
        card.addEventListener('click', () => {
            const lad = card.dataset.lad;
            selectLad(lad);
        });
    });

    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showSelectScreen();
        });
    }

    // Tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Set up modal close
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
    }
});

function selectLad(lad) {
    currentLad = lad;
    localStorage.setItem('selectedLad', lad);

    const ladInfo = ladsData[lad];

    // Get DOM elements directly to ensure they exist
    const selectScreenEl = document.getElementById('select-screen');
    const mainScreenEl = document.getElementById('main-screen');
    const welcomeMsgEl = document.getElementById('welcome-msg');

    if (welcomeMsgEl) {
        welcomeMsgEl.textContent = `Welcome, ${ladInfo.name}!`;
    }

    // Update boarding pass info
    updateBoardingPass(ladInfo);

    // Update football tickets
    updateFootballTickets(ladInfo);

    // Update train tickets
    updateTrainTicket(ladInfo);

    // Show main screen
    if (selectScreenEl) selectScreenEl.classList.remove('active');
    if (mainScreenEl) mainScreenEl.classList.add('active');
}

function showSelectScreen() {
    localStorage.removeItem('selectedLad');
    mainScreen.classList.remove('active');
    selectScreen.classList.add('active');
}

function switchTab(tabId) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

function updateBoardingPass(ladInfo) {
    // Outbound flight - elements may not exist
    const outboundSeat = document.getElementById('outbound-seat');
    const outboundGroup = document.getElementById('outbound-group');

    if (ladInfo.outbound && outboundSeat) {
        outboundSeat.textContent = ladInfo.outbound.seat;
    }
    if (ladInfo.outbound && outboundGroup) {
        outboundGroup.textContent = ladInfo.outbound.group;
    }
}

function updateFootballTickets(ladInfo) {
    const fiorentinaTicket = document.getElementById('fiorentina-ticket');
    const veronaTicket = document.getElementById('verona-ticket');

    if (fiorentinaTicket) {
        if (ladInfo.fiorentina) {
            fiorentinaTicket.innerHTML = `
                <button class="view-ticket-btn" onclick="viewFiorentinaTicket()">View Ticket</button>
            `;
        } else {
            fiorentinaTicket.innerHTML = `
                <div class="ticket-placeholder">
                    <p class="placeholder-msg">Ticket coming soon</p>
                </div>
            `;
        }
    }

    if (veronaTicket) {
        if (ladInfo.verona) {
            veronaTicket.innerHTML = `
                <button class="view-ticket-btn" onclick="viewVeronaTicket()">View Ticket</button>
            `;
        } else {
            veronaTicket.innerHTML = `
                <div class="ticket-placeholder">
                    <p class="placeholder-msg">Ticket coming soon</p>
                </div>
            `;
        }
    }
}

function viewBoardingPass() {
    if (!currentLad) return;
    const ladInfo = ladsData[currentLad];
    const page = ladInfo.outbound.pdfPage;
    openPdfModal('images/boarding_pass.pdf', page, `${ladInfo.name}'s Boarding Pass`);
}

function viewFiorentinaTicket() {
    if (!currentLad) return;
    const ladInfo = ladsData[currentLad];
    if (!ladInfo.fiorentina) return;
    const pdfFile = ladInfo.fiorentina.pdfFile || 'images/fiorentina_tickets.pdf';
    const page = ladInfo.fiorentina.pdfPage;
    openPdfModal(pdfFile, page, `${ladInfo.name}'s Fiorentina Ticket`);
}

function viewVeronaTicket() {
    if (!currentLad) return;
    const ladInfo = ladsData[currentLad];
    if (!ladInfo.verona) return;
    openPdfModal(ladInfo.verona.pdfFile, 1, `${ladInfo.name}'s Verona Ticket`);
}

function updateTrainTicket(ladInfo) {
    const trainTicketContainer = document.getElementById('train-ticket');
    if (!trainTicketContainer) return;

    if (ladInfo.train) {
        trainTicketContainer.innerHTML = `
            <button class="view-ticket-btn" onclick="downloadTrainTicket()">Download Ticket</button>
        `;
    } else {
        trainTicketContainer.innerHTML = `
            <div class="ticket-placeholder">
                <p class="placeholder-msg">Ticket coming soon</p>
            </div>
        `;
    }
}

function downloadTrainTicket() {
    if (!currentLad) return;
    const ladInfo = ladsData[currentLad];
    if (!ladInfo.train) return;

    // Download the pkpass file
    const link = document.createElement('a');
    link.href = ladInfo.train.pkpass;
    link.download = `train_ticket_${ladInfo.name.toLowerCase()}.pkpass`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openPdfModal(pdfUrl, pageNum, title) {
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const pdfContainer = document.getElementById('pdf-container');

    modalTitle.textContent = title;

    // Use PDF.js to render the specific page
    pdfContainer.innerHTML = '<p class="loading-msg">Loading ticket...</p>';

    // Load PDF.js and render
    if (typeof pdfjsLib !== 'undefined') {
        renderPdfPage(pdfUrl, pageNum, pdfContainer);
    } else {
        // Fallback: open PDF in new tab with page anchor
        pdfContainer.innerHTML = `
            <p class="placeholder-msg">Opening PDF...</p>
            <a href="${pdfUrl}#page=${pageNum}" target="_blank" class="view-pdf-link">Open PDF</a>
        `;
        // Auto-open
        window.open(`${pdfUrl}#page=${pageNum}`, '_blank');
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('pdf-modal');
    modal.classList.remove('active');
}

async function renderPdfPage(url, pageNum, container) {
    try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(pageNum);

        const scale = 3.0;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Create a wrapper for pinch-to-zoom
        const wrapper = document.createElement('div');
        wrapper.className = 'pdf-zoom-wrapper';
        wrapper.appendChild(canvas);

        container.innerHTML = '';
        container.appendChild(wrapper);

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        // Add pinch-to-zoom functionality
        setupPinchZoom(wrapper, canvas);
    } catch (error) {
        console.error('Error rendering PDF:', error);
        container.innerHTML = `
            <p class="placeholder-msg">Could not load PDF preview</p>
            <a href="${url}#page=${pageNum}" target="_blank" class="view-pdf-link">Open PDF in new tab</a>
        `;
    }
}

function setupPinchZoom(wrapper, canvas) {
    let currentScale = 1;
    let startDistance = 0;
    let startScale = 1;
    let translateX = 0;
    let translateY = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function updateTransform() {
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }

    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            startDistance = getDistance(e.touches);
            startScale = currentScale;
        } else if (e.touches.length === 1 && currentScale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    }, { passive: false });

    wrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches);
            const scaleChange = currentDistance / startDistance;
            currentScale = Math.min(Math.max(startScale * scaleChange, 1), 5);

            if (currentScale === 1) {
                translateX = 0;
                translateY = 0;
            }
            updateTransform();
        } else if (e.touches.length === 1 && isDragging && currentScale > 1) {
            e.preventDefault();
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Double-tap to reset zoom
    let lastTap = 0;
    wrapper.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered:', registration.scope);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
