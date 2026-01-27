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
        verona: { sector: 'Curva Est Inf 8', row: '1', seat: '10', gate: '9', pdfFile: 'images/verona_andy.pdf' },
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
        verona: { sector: 'Curva Est Inf 8', row: '1', seat: '12', gate: '9', pdfFile: 'images/verona_ken.pdf' },
        train: { pkpass: 'images/train_ken.pkpass', coach: '2' }
    },
    chris: {
        name: 'Chris',
        fullName: 'Christopher Phillips',
        outbound: { seat: '15E', group: '5', pdfPage: 5 },
        fiorentina: { sector: 'PLA', row: '1', seat: '27', gate: 'P02', pdfFile: 'images/fiorentina_ken_chris.pdf', pdfPage: 1 },
        verona: { sector: 'Curva Est Inf 8', row: '1', seat: '11', gate: '9', pdfFile: 'images/verona_chris.pdf' },
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

    // Update costs display for this lad
    updateCostsDisplay();

    // Update predictions display for this lad
    updatePredictionsDisplay();

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

// ============================================
// WEATHER FORECAST
// ============================================

const WEATHER_CITIES = [
    { name: 'Verona', lat: 45.4384, lon: 10.9916 },
    { name: 'Florence', lat: 43.7696, lon: 11.2558 }
];

const WMO_CODES = {
    0: { icon: '☀️', desc: 'Clear sky' },
    1: { icon: '🌤️', desc: 'Mainly clear' },
    2: { icon: '⛅', desc: 'Partly cloudy' },
    3: { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Foggy' },
    48: { icon: '🌫️', desc: 'Icy fog' },
    51: { icon: '🌦️', desc: 'Light drizzle' },
    53: { icon: '🌦️', desc: 'Drizzle' },
    55: { icon: '🌧️', desc: 'Heavy drizzle' },
    61: { icon: '🌧️', desc: 'Light rain' },
    63: { icon: '🌧️', desc: 'Rain' },
    65: { icon: '🌧️', desc: 'Heavy rain' },
    71: { icon: '🌨️', desc: 'Light snow' },
    73: { icon: '🌨️', desc: 'Snow' },
    75: { icon: '❄️', desc: 'Heavy snow' },
    80: { icon: '🌦️', desc: 'Rain showers' },
    81: { icon: '🌧️', desc: 'Rain showers' },
    82: { icon: '⛈️', desc: 'Heavy showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm + hail' },
    99: { icon: '⛈️', desc: 'Thunderstorm + hail' }
};

function getWeatherInfo(code) {
    return WMO_CODES[code] || { icon: '🌡️', desc: 'Unknown' };
}

async function loadWeather() {
    const container = document.getElementById('weather-content');
    if (!container) return;

    try {
        let html = '';
        for (const city of WEATHER_CITIES) {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=Europe/Rome`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather fetch failed');
            const data = await response.json();

            html += `<div class="weather-city-section"><h4 class="weather-city-title">${city.name}</h4><div class="weather-grid">`;

            for (let i = 0; i < data.daily.time.length; i++) {
                const date = new Date(data.daily.time[i] + 'T12:00:00');
                const dayStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
                const weather = getWeatherInfo(data.daily.weather_code[i]);
                const min = Math.round(data.daily.temperature_2m_min[i]);
                const max = Math.round(data.daily.temperature_2m_max[i]);

                html += `
                    <div class="weather-day">
                        <span class="weather-date">${dayStr}</span>
                        <span class="weather-icon">${weather.icon}</span>
                        <span class="weather-temp-range">${min}° / ${max}°</span>
                        <span class="weather-desc">${weather.desc}</span>
                    </div>`;
            }

            html += `</div></div>`;
        }

        html += `<p class="weather-note">Live forecast from Open-Meteo</p>`;
        container.innerHTML = html;
    } catch (e) {
        console.error('Weather error:', e);
        container.innerHTML = '<p class="weather-note">Could not load weather</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => loadWeather());

// ============================================
// COST SPLITTING FUNCTIONALITY
// ============================================

const EXPENSES_KEY = 'lads-expenses';
const JSONBLOB_ID = '019bfac8-1b6b-759d-a533-8c5644418d84';
const JSONBLOB_BASE = `https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`;
// Use CORS proxy for browser requests
const JSONBLOB_URL = `https://corsproxy.io/?${encodeURIComponent(JSONBLOB_BASE)}`;
const allLads = ['matt', 'ken', 'chris', 'andy', 'mark'];

let expensesCache = [];
let lastSyncTime = 0;

// Generate a unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Simple sync: fetch from cloud
async function fetchExpenses() {
    showSyncStatus('syncing');
    try {
        const response = await fetch(JSONBLOB_URL);
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        const cloudExpenses = data.expenses || [];

        // Merge with local
        const local = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
        const merged = new Map();
        local.forEach(e => merged.set(e.id, e));
        cloudExpenses.forEach(e => merged.set(e.id, e));

        expensesCache = Array.from(merged.values());
        expensesCache.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesCache));

        // Push local-only items to cloud
        if (expensesCache.length > cloudExpenses.length) {
            await syncToCloud();
        }

        lastSyncTime = Date.now();
        showSyncStatus('synced');
    } catch (e) {
        console.error('Fetch failed:', e);
        expensesCache = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
        showSyncStatus('offline');
    }
    return expensesCache;
}

// Simple sync: save to cloud
async function syncToCloud() {
    try {
        const response = await fetch(JSONBLOB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expenses: expensesCache })
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        showSyncStatus('synced');
        return true;
    } catch (e) {
        console.error('Save failed:', e);
        showSyncStatus('offline');
        return false;
    }
}

function showSyncStatus(status) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    el.className = 'sync-status ' + status;
    el.textContent = status === 'syncing' ? 'Syncing...' : status === 'synced' ? 'Synced' : 'Offline';
}

function getExpenses() {
    return expensesCache;
}

async function addExpense(description, amount, paidBy, splitBetween) {
    const expense = {
        id: generateUniqueId(),
        description,
        amount: parseFloat(amount),
        paidBy,
        splitBetween,
        timestamp: new Date().toISOString()
    };

    expensesCache.push(expense);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesCache));
    await syncToCloud();
    return expense;
}

async function deleteExpense(id) {
    // Convert to string for comparison (handles old numeric IDs and new string IDs)
    const idStr = String(id);
    expensesCache = expensesCache.filter(e => String(e.id) !== idStr);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesCache));
    await syncToCloud();
}

function calculateBalances() {
    const expenses = getExpenses();
    const balances = {};

    // Initialize all balances to 0
    allLads.forEach(lad => balances[lad] = 0);

    expenses.forEach(expense => {
        const shareAmount = expense.amount / expense.splitBetween.length;

        // Person who paid gets credit
        balances[expense.paidBy] += expense.amount;

        // Everyone who benefited owes their share
        expense.splitBetween.forEach(lad => {
            balances[lad] -= shareAmount;
        });
    });

    return balances;
}

function calculateSettlements() {
    const balances = calculateBalances();
    const settlements = [];

    // Separate into creditors and debtors
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([lad, balance]) => {
        if (balance > 0.01) {
            creditors.push({ lad, amount: balance });
        } else if (balance < -0.01) {
            debtors.push({ lad, amount: -balance });
        }
    });

    // Sort by amount descending
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Match debtors to creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.amount, creditor.amount);

        if (amount > 0.01) {
            settlements.push({
                from: debtor.lad,
                to: creditor.lad,
                amount: amount
            });
        }

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return settlements;
}

function formatCurrency(amount) {
    return '€' + Math.abs(amount).toFixed(2);
}

function renderExpensesList() {
    const container = document.getElementById('expenses-list');
    const totalEl = document.getElementById('total-spent');
    if (!container) return;

    const expenses = getExpenses();

    if (expenses.length === 0) {
        container.innerHTML = '<p class="no-expenses">No expenses yet</p>';
        if (totalEl) totalEl.textContent = '€0.00';
        return;
    }

    // Sort by most recent first
    const sortedExpenses = [...expenses].sort((a, b) => b.id - a.id);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    container.innerHTML = sortedExpenses.map(expense => {
        const paidByName = ladsData[expense.paidBy]?.name || expense.paidBy;
        const splitNames = expense.splitBetween.map(l => ladsData[l]?.name || l).join(', ');
        const date = new Date(expense.timestamp);
        const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

        return `
            <div class="expense-item" data-id="${expense.id}">
                <div class="expense-info">
                    <div class="expense-desc">${expense.description}</div>
                    <div class="expense-meta">${paidByName} paid • Split: ${splitNames} • ${dateStr}</div>
                </div>
                <span class="expense-amount">${formatCurrency(expense.amount)}</span>
                <button class="expense-delete" onclick="handleDeleteExpense('${expense.id}')">×</button>
            </div>
        `;
    }).join('');
}

function renderBalance() {
    const amountEl = document.getElementById('balance-amount');
    const statusEl = document.getElementById('balance-status');
    if (!amountEl || !currentLad) return;

    const balances = calculateBalances();
    const myBalance = balances[currentLad] || 0;

    amountEl.textContent = formatCurrency(myBalance);
    amountEl.classList.remove('positive', 'negative', 'zero');

    if (myBalance > 0.01) {
        amountEl.classList.add('positive');
        amountEl.textContent = '+' + formatCurrency(myBalance);
        statusEl.textContent = 'Others owe you';
    } else if (myBalance < -0.01) {
        amountEl.classList.add('negative');
        amountEl.textContent = '-' + formatCurrency(myBalance);
        statusEl.textContent = 'You owe others';
    } else {
        amountEl.classList.add('zero');
        amountEl.textContent = '€0.00';
        statusEl.textContent = 'All settled up!';
    }
}

function renderSettlements() {
    const container = document.getElementById('settlement-list');
    if (!container) return;

    const settlements = calculateSettlements();

    if (settlements.length === 0) {
        const expenses = getExpenses();
        if (expenses.length === 0) {
            container.innerHTML = '<p class="no-settlements">Add expenses to see who owes what</p>';
        } else {
            container.innerHTML = '<p class="no-settlements">All settled up!</p>';
        }
        return;
    }

    container.innerHTML = settlements.map(s => {
        const fromName = ladsData[s.from]?.name || s.from;
        const toName = ladsData[s.to]?.name || s.to;
        return `
            <div class="settlement-item">
                <div class="settlement-arrow">
                    <span class="settlement-from">${fromName}</span>
                    <span class="settlement-icon">→</span>
                    <span class="settlement-to">${toName}</span>
                </div>
                <span class="settlement-amount">${formatCurrency(s.amount)}</span>
            </div>
        `;
    }).join('');
}

async function handleDeleteExpense(id) {
    if (confirm('Delete this expense?')) {
        await deleteExpense(id);
        updateCostsDisplay();
    }
}

function updateCostsDisplay() {
    renderExpensesList();
    renderBalance();
    renderSettlements();
}

function initCostsForm() {
    const form = document.getElementById('expense-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentLad) {
            alert('Please select who you are first');
            return;
        }

        const descInput = document.getElementById('expense-desc');
        const amountInput = document.getElementById('expense-amount');
        const submitBtn = form.querySelector('button[type="submit"]');
        const checkboxes = document.querySelectorAll('#split-options input:checked');

        const description = descInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const splitBetween = Array.from(checkboxes).map(cb => cb.value);

        if (!description || !amount || amount <= 0) {
            alert('Please fill in all fields');
            return;
        }

        if (splitBetween.length === 0) {
            alert('Please select at least one person to split with');
            return;
        }

        // Disable button while saving
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';

        await addExpense(description, amount, currentLad, splitBetween);

        // Reset form
        descInput.value = '';
        amountInput.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Expense';

        updateCostsDisplay();
    });

    // Refresh button
    const refreshBtn = document.getElementById('refresh-expenses');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            await fetchExpenses();
            updateCostsDisplay();
            refreshBtn.disabled = false;
        });
    }
}

// Initialize costs when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    initCostsForm();
    // Load from local cache first for instant display
    const stored = localStorage.getItem(EXPENSES_KEY);
    expensesCache = stored ? JSON.parse(stored) : [];
    updateCostsDisplay();
    // Then fetch latest from cloud
    await fetchExpenses();
    updateCostsDisplay();
});

// Auto-refresh when costs tab becomes visible
document.addEventListener('DOMContentLoaded', () => {
    const costsTab = document.querySelector('[data-tab="costs"]');
    if (costsTab) {
        costsTab.addEventListener('click', async () => {
            // Only refresh if it's been more than 10 seconds since last sync
            if (Date.now() - lastSyncTime > 10000) {
                await fetchExpenses();
                updateCostsDisplay();
            }
        });
    }
});

// ============================================
// PREDICTIONS GAME - Fiorentina vs Como
// ============================================

const PREDICTIONS_KEY = 'lads-predictions';
const PRED_JSONBLOB_ID = '019bffc0-5996-7c87-8b2a-76cbafc7350f';
const PRED_JSONBLOB_BASE = `https://jsonblob.com/api/jsonBlob/${PRED_JSONBLOB_ID}`;
const PRED_JSONBLOB_URL = `https://corsproxy.io/?${encodeURIComponent(PRED_JSONBLOB_BASE)}`;
const KICKOFF_UTC = new Date('2026-01-27T20:00:00Z'); // 21:00 CET = 20:00 UTC

let predictionsCache = { predictions: {}, results: {} };
let predLastSyncTime = 0;
let countdownInterval = null;

// -- Sync --

async function fetchPredictions() {
    showPredSyncStatus('syncing');
    try {
        const response = await fetch(PRED_JSONBLOB_URL);
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const cloudData = await response.json();
        const local = JSON.parse(localStorage.getItem(PREDICTIONS_KEY) || '{}');

        // Merge: cloud wins for other lads, local wins for current lad
        const merged = {
            predictions: { ...(cloudData.predictions || {}), ...(local.predictions || {}) },
            results: cloudData.results || local.results || {}
        };
        // Cloud predictions override for non-current lad
        if (cloudData.predictions) {
            Object.keys(cloudData.predictions).forEach(lad => {
                if (lad !== currentLad) {
                    merged.predictions[lad] = cloudData.predictions[lad];
                }
            });
        }

        predictionsCache = merged;
        localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictionsCache));

        // Push local data to cloud if we have local predictions not in cloud
        const localPreds = local.predictions || {};
        const cloudPreds = cloudData.predictions || {};
        const hasLocalOnly = Object.keys(localPreds).some(k => !cloudPreds[k] || localPreds[k].submittedAt !== cloudPreds[k].submittedAt);
        if (hasLocalOnly) {
            await syncPredictionsToCloud();
        }

        predLastSyncTime = Date.now();
        showPredSyncStatus('synced');
    } catch (e) {
        console.error('Predictions fetch failed:', e);
        const local = JSON.parse(localStorage.getItem(PREDICTIONS_KEY) || '{}');
        predictionsCache = {
            predictions: local.predictions || {},
            results: local.results || {}
        };
        showPredSyncStatus('offline');
    }
    return predictionsCache;
}

async function syncPredictionsToCloud() {
    try {
        const response = await fetch(PRED_JSONBLOB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(predictionsCache)
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        showPredSyncStatus('synced');
        return true;
    } catch (e) {
        console.error('Predictions save failed:', e);
        showPredSyncStatus('offline');
        return false;
    }
}

function showPredSyncStatus(status) {
    const el = document.getElementById('pred-sync-status');
    if (!el) return;
    el.className = 'sync-status ' + status;
    el.textContent = status === 'syncing' ? 'Syncing...' : status === 'synced' ? 'Synced' : 'Offline';
}

// -- Scoring --

function scoreFinalScore(pred, result) {
    if (!pred || !result || result.home === null || result.away === null) return 0;
    const pH = pred.home, pA = pred.away;
    const rH = result.home, rA = result.away;
    // Exact
    if (pH === rH && pA === rA) return 10;
    // Result (W/D/L)
    const predResult = Math.sign(pH - pA);
    const realResult = Math.sign(rH - rA);
    if (predResult === realResult) {
        // Right result + close (total goals off by 1)
        const predTotal = pH + pA;
        const realTotal = rH + rA;
        if (Math.abs(predTotal - realTotal) <= 1) return 5;
        return 3;
    }
    return 0;
}

function scoreMinute(pred, result, maxPts) {
    if (pred === null || pred === undefined || result === null || result === undefined) return 0;
    const diff = Math.abs(pred - result);
    if (diff === 0) return maxPts;
    if (diff <= 3) return 4;
    if (diff <= 5) return 3;
    if (diff <= 10) return 1;
    return 0;
}

function scoreExact(pred, result, maxPts, tolerances) {
    if (pred === null || pred === undefined || result === null || result === undefined) return 0;
    const diff = Math.abs(pred - result);
    if (diff === 0) return maxPts;
    for (const [threshold, pts] of tolerances) {
        if (diff <= threshold) return pts;
    }
    return 0;
}

function scoreBTTS(pred, result) {
    if (!pred || !result) return 0;
    return pred === result ? 4 : 0;
}

function scoreNameMatch(pred, result, maxPts) {
    if (!pred || !result) return 0;
    const pNorm = pred.trim().toLowerCase();
    const rNorm = result.trim().toLowerCase();
    if (pNorm === rNorm) return maxPts;
    // Surname match: last word of each
    const pSurname = pNorm.split(/\s+/).pop();
    const rSurname = rNorm.split(/\s+/).pop();
    if (pSurname === rSurname && pSurname.length > 1) return 4;
    return 0;
}

function calculatePredictionScore(prediction, results) {
    if (!prediction || !results) return 0;
    let total = 0;
    // 1. Final Score (max 10)
    total += scoreFinalScore(prediction.finalScore, results.finalScore);
    // 2. First Goal Minute (max 6)
    total += scoreMinute(prediction.firstGoalMinute, results.firstGoalMinute, 6);
    // 3. Total Goals (max 6)
    total += scoreExact(prediction.totalGoals, results.totalGoals, 6, [[1, 3], [2, 1]]);
    // 4. Both Teams Score (max 4)
    total += scoreBTTS(prediction.bothTeamsToScore, results.bothTeamsToScore);
    // 5. Number of Cards (max 6)
    total += scoreExact(prediction.numberOfCards, results.numberOfCards, 6, [[1, 4], [2, 2], [3, 1]]);
    // 6. Man of the Match (max 6)
    total += scoreNameMatch(prediction.manOfTheMatch, results.manOfTheMatch, 6);
    // 7. First Yellow Minute (max 6)
    total += scoreMinute(prediction.firstYellowMinute, results.firstYellowMinute, 6);
    // 8. First Goalscorer (max 6)
    total += scoreNameMatch(prediction.firstGoalscorer, results.firstGoalscorer, 6);
    return total;
}

function getDetailedScores(prediction, results) {
    if (!prediction || !results) return [];
    return [
        { label: 'Final Score', pts: scoreFinalScore(prediction.finalScore, results.finalScore), max: 10 },
        { label: '1st Goal Min', pts: scoreMinute(prediction.firstGoalMinute, results.firstGoalMinute, 6), max: 6 },
        { label: 'Total Goals', pts: scoreExact(prediction.totalGoals, results.totalGoals, 6, [[1, 3], [2, 1]]), max: 6 },
        { label: 'BTTS', pts: scoreBTTS(prediction.bothTeamsToScore, results.bothTeamsToScore), max: 4 },
        { label: 'Cards', pts: scoreExact(prediction.numberOfCards, results.numberOfCards, 6, [[1, 4], [2, 2], [3, 1]]), max: 6 },
        { label: 'MOTM', pts: scoreNameMatch(prediction.manOfTheMatch, results.manOfTheMatch, 6), max: 6 },
        { label: '1st Yellow Min', pts: scoreMinute(prediction.firstYellowMinute, results.firstYellowMinute, 6), max: 6 },
        { label: '1st Scorer', pts: scoreNameMatch(prediction.firstGoalscorer, results.firstGoalscorer, 6), max: 6 }
    ];
}

// -- Countdown --

function isBeforeKickoff() {
    return new Date() < KICKOFF_UTC;
}

function updateCountdown() {
    const el = document.getElementById('countdown-text');
    if (!el) return;

    const now = new Date();
    const diff = KICKOFF_UTC - now;

    if (diff <= 0) {
        // After kickoff
        const hoursSinceKO = (now - KICKOFF_UTC) / (1000 * 60 * 60);
        if (hoursSinceKO < 3) {
            el.textContent = 'MATCH IN PROGRESS';
            el.className = 'countdown-live';
        } else {
            el.textContent = 'FULL TIME';
            el.className = 'countdown-locked';
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    let text = '';
    if (days > 0) text += `${days}d `;
    text += `${hours}h ${mins}m ${secs}s`;
    el.textContent = 'Predictions lock in: ' + text;
    el.className = 'countdown-active';
}

function startCountdown() {
    updateCountdown();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

// -- Rendering --

function renderLeagueTable() {
    const container = document.getElementById('pred-league-table');
    if (!container) return;

    const results = predictionsCache.results || {};
    const predictions = predictionsCache.predictions || {};
    const hasResults = results.finalScore && results.finalScore.home !== null;

    if (!hasResults) {
        const ladCount = Object.keys(predictions).length;
        if (ladCount === 0) {
            container.innerHTML = '<p class="no-predictions">No predictions submitted yet</p>';
        } else {
            container.innerHTML = '<p class="no-predictions">' + ladCount + ' prediction' + (ladCount !== 1 ? 's' : '') + ' submitted - awaiting results</p>';
        }
        return;
    }

    // Calculate scores
    const scores = allLads
        .filter(lad => predictions[lad])
        .map(lad => ({
            lad,
            name: ladsData[lad]?.name || lad,
            points: calculatePredictionScore(predictions[lad], results)
        }))
        .sort((a, b) => b.points - a.points);

    if (scores.length === 0) {
        container.innerHTML = '<p class="no-predictions">No predictions to score</p>';
        return;
    }

    const medals = ['gold', 'silver', 'bronze'];
    const medalIcons = ['1st', '2nd', '3rd'];

    container.innerHTML = scores.map((s, i) => {
        const posClass = i < 3 ? medals[i] : '';
        const posText = i < 3 ? medalIcons[i] : (i + 1);
        return `
            <div class="pred-league-row">
                <span class="pred-league-pos ${posClass}">${posText}</span>
                <span class="pred-league-name">${s.name}</span>
                <span class="pred-league-pts">${s.points} pts</span>
            </div>
        `;
    }).join('');
}

function renderPredictionForm() {
    const formContainer = document.getElementById('pred-form-container');
    const allContainer = document.getElementById('pred-all-container');
    if (!formContainer) return;

    const beforeKO = isBeforeKickoff();
    const myPrediction = predictionsCache.predictions?.[currentLad];

    if (beforeKO) {
        // Show form or submitted message
        formContainer.style.display = '';
        if (allContainer) allContainer.style.display = 'none';

        if (myPrediction) {
            // Already submitted - show confirmation
            const form = document.getElementById('prediction-form');
            if (form) {
                form.innerHTML = `
                    <div class="pred-submitted-msg">
                        <span class="check-icon">&#9989;</span>
                        <div class="msg-text">Predictions Submitted!</div>
                        <div class="msg-sub">Locked in at ${new Date(myPrediction.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                `;
            }
        } else {
            // Ensure the form is fresh (re-read from HTML if needed)
            // Form already exists in HTML
        }
    } else {
        // After kickoff: hide form, show all predictions
        formContainer.style.display = 'none';
        if (allContainer) {
            allContainer.style.display = '';
            renderAllPredictions();
        }
    }
}

function renderAllPredictions() {
    const container = document.getElementById('pred-all-grid');
    if (!container) return;

    const predictions = predictionsCache.predictions || {};
    const results = predictionsCache.results || {};
    const hasResults = results.finalScore && results.finalScore.home !== null;
    const ladsWithPreds = allLads.filter(l => predictions[l]);

    if (ladsWithPreds.length === 0) {
        container.innerHTML = '<p class="no-predictions">No predictions were submitted</p>';
        return;
    }

    const markets = [
        { key: 'finalScore', label: 'Score', fmt: v => v ? `${v.home}-${v.away}` : '-' },
        { key: 'firstGoalMinute', label: '1st Goal Min', fmt: v => v !== null && v !== undefined ? v + "'" : '-' },
        { key: 'totalGoals', label: 'Total Goals', fmt: v => v !== null && v !== undefined ? v : '-' },
        { key: 'bothTeamsToScore', label: 'BTTS', fmt: v => v ? (v.charAt(0).toUpperCase() + v.slice(1)) : '-' },
        { key: 'numberOfCards', label: 'Cards', fmt: v => v !== null && v !== undefined ? v : '-' },
        { key: 'manOfTheMatch', label: 'MOTM', fmt: v => v || '-' },
        { key: 'firstYellowMinute', label: '1st Yellow', fmt: v => v !== null && v !== undefined ? v + "'" : '-' },
        { key: 'firstGoalscorer', label: '1st Scorer', fmt: v => v || '-' }
    ];

    let html = '<table class="pred-all-table">';
    html += '<thead><tr><th>Market</th>';
    ladsWithPreds.forEach(l => {
        html += `<th>${ladsData[l]?.name || l}</th>`;
    });
    if (hasResults) html += '<th>Result</th>';
    html += '</tr></thead><tbody>';

    markets.forEach(m => {
        html += '<tr>';
        html += `<td>${m.label}</td>`;
        ladsWithPreds.forEach(l => {
            const val = predictions[l]?.[m.key];
            html += `<td>${m.fmt(val)}</td>`;
        });
        if (hasResults) {
            html += `<td>${m.fmt(results[m.key])}</td>`;
        }
        html += '</tr>';
    });

    // Points row if results exist
    if (hasResults) {
        html += '<tr class="pred-result-row"><td>Points</td>';
        ladsWithPreds.forEach(l => {
            const pts = calculatePredictionScore(predictions[l], results);
            html += `<td>${pts}</td>`;
        });
        html += '<td></td></tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderResultsForm() {
    const container = document.getElementById('pred-results-container');
    if (!container) return;

    const results = predictionsCache.results || {};

    // Pre-fill results form if results exist
    if (results.finalScore && results.finalScore.home !== null) {
        const fields = [
            ['res-home', results.finalScore?.home],
            ['res-away', results.finalScore?.away],
            ['res-first-goal-min', results.firstGoalMinute],
            ['res-total-goals', results.totalGoals],
            ['res-cards', results.numberOfCards],
            ['res-motm', results.manOfTheMatch],
            ['res-first-yellow-min', results.firstYellowMinute],
            ['res-first-scorer', results.firstGoalscorer]
        ];
        fields.forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val !== null && val !== undefined) el.value = val;
        });
        // BTTS radio
        if (results.bothTeamsToScore) {
            const radio = document.querySelector(`input[name="res-btts"][value="${results.bothTeamsToScore}"]`);
            if (radio) radio.checked = true;
        }
    }
}

function updatePredictionsDisplay() {
    renderLeagueTable();
    renderPredictionForm();
    renderResultsForm();
}

// -- Form Handling --

function initPredictionForm() {
    const form = document.getElementById('prediction-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentLad) {
            alert('Please select who you are first');
            return;
        }
        if (!isBeforeKickoff()) {
            alert('Predictions are locked - match has started!');
            return;
        }

        const homeVal = document.getElementById('pred-home')?.value;
        const awayVal = document.getElementById('pred-away')?.value;
        const firstGoalMin = document.getElementById('pred-first-goal-min')?.value;
        const totalGoals = document.getElementById('pred-total-goals')?.value;
        const btts = document.querySelector('input[name="pred-btts"]:checked')?.value;
        const cards = document.getElementById('pred-cards')?.value;
        const motm = document.getElementById('pred-motm')?.value;
        const firstYellowMin = document.getElementById('pred-first-yellow-min')?.value;
        const firstScorer = document.getElementById('pred-first-scorer')?.value;

        if (!homeVal || !awayVal || !firstGoalMin || !totalGoals || !btts || !cards || !motm || !firstYellowMin || !firstScorer) {
            alert('Please fill in all predictions');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const prediction = {
            finalScore: { home: parseInt(homeVal), away: parseInt(awayVal) },
            firstGoalMinute: parseInt(firstGoalMin),
            totalGoals: parseInt(totalGoals),
            bothTeamsToScore: btts,
            numberOfCards: parseInt(cards),
            manOfTheMatch: motm.trim(),
            firstYellowMinute: parseInt(firstYellowMin),
            firstGoalscorer: firstScorer.trim(),
            submittedAt: new Date().toISOString()
        };

        predictionsCache.predictions[currentLad] = prediction;
        localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictionsCache));
        await syncPredictionsToCloud();

        updatePredictionsDisplay();
    });
}

function initResultsForm() {
    const form = document.getElementById('results-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const homeVal = document.getElementById('res-home')?.value;
        const awayVal = document.getElementById('res-away')?.value;

        // Allow partial results, but need at least the score
        if (!homeVal || !awayVal) {
            alert('Please enter at least the final score');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const firstGoalMin = document.getElementById('res-first-goal-min')?.value;
        const totalGoals = document.getElementById('res-total-goals')?.value;
        const btts = document.querySelector('input[name="res-btts"]:checked')?.value;
        const cards = document.getElementById('res-cards')?.value;
        const motm = document.getElementById('res-motm')?.value;
        const firstYellowMin = document.getElementById('res-first-yellow-min')?.value;
        const firstScorer = document.getElementById('res-first-scorer')?.value;

        predictionsCache.results = {
            finalScore: { home: parseInt(homeVal), away: parseInt(awayVal) },
            firstGoalMinute: firstGoalMin ? parseInt(firstGoalMin) : null,
            totalGoals: totalGoals ? parseInt(totalGoals) : null,
            bothTeamsToScore: btts || null,
            numberOfCards: cards ? parseInt(cards) : null,
            manOfTheMatch: motm ? motm.trim() : null,
            firstYellowMinute: firstYellowMin ? parseInt(firstYellowMin) : null,
            firstGoalscorer: firstScorer ? firstScorer.trim() : null
        };

        localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictionsCache));
        await syncPredictionsToCloud();

        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Results';

        updatePredictionsDisplay();
    });
}

// -- Init --

function initPredictions() {
    initPredictionForm();
    initResultsForm();
    startCountdown();

    // Refresh button
    const refreshBtn = document.getElementById('refresh-predictions');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            await fetchPredictions();
            updatePredictionsDisplay();
            refreshBtn.disabled = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initPredictions();
    // Load from local cache first
    const stored = localStorage.getItem(PREDICTIONS_KEY);
    if (stored) {
        try {
            predictionsCache = JSON.parse(stored);
        } catch (e) {
            predictionsCache = { predictions: {}, results: {} };
        }
    }
    updatePredictionsDisplay();
    // Then fetch latest
    await fetchPredictions();
    updatePredictionsDisplay();
});

// Auto-refresh when predictions tab becomes visible
document.addEventListener('DOMContentLoaded', () => {
    const predTab = document.querySelector('[data-tab="predictions"]');
    if (predTab) {
        predTab.addEventListener('click', async () => {
            if (Date.now() - predLastSyncTime > 10000) {
                await fetchPredictions();
                updatePredictionsDisplay();
            }
        });
    }
});

// ============================================
// BCLC GAME
// ============================================

const BCLC = {
    players: [],
    activePlayers: [],
    currentPlayerIndex: 0,
    deck: [],
    currentCards: [],
    flippedCount: 0,
    totalFingers: 0,

    // Card types: 5 blank, 2 small, 1 misshapen (mickey), 1 big
    cardTypes: [
        { type: 'blank', fingers: 0, count: 5 },
        { type: 'small', fingers: 1, count: 2 },
        { type: 'mickey', fingers: 2, count: 1 },
        { type: 'big', fingers: 3, count: 1 }
    ],

    // Chicken SVGs for card fronts (different chickens for variety)
    chickenSVGs: [
        // Rooster
        `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="60" rx="25" ry="30" fill="#D2691E"/>
            <circle cx="50" cy="35" r="18" fill="#D2691E"/>
            <polygon points="50,5 45,20 55,20" fill="#FF4444"/>
            <polygon points="50,8 47,18 53,18" fill="#FF6666"/>
            <polygon points="50,11 48,17 52,17" fill="#FF8888"/>
            <circle cx="44" cy="32" r="4" fill="white"/>
            <circle cx="44" cy="32" r="2" fill="black"/>
            <polygon points="50,38 45,45 55,45" fill="#FFA500"/>
            <ellipse cx="30" cy="65" rx="12" ry="20" fill="#8B4513"/>
            <ellipse cx="70" cy="65" rx="12" ry="20" fill="#8B4513"/>
            <line x1="42" y1="90" x2="42" y2="98" stroke="#FFA500" stroke-width="3"/>
            <line x1="58" y1="90" x2="58" y2="98" stroke="#FFA500" stroke-width="3"/>
            <polygon points="20,50 5,60 20,70" fill="#8B4513"/>
        </svg>`,
        // Hen
        `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="28" ry="28" fill="#CD853F"/>
            <circle cx="50" cy="38" r="16" fill="#CD853F"/>
            <polygon points="50,18 47,28 53,28" fill="#FF4444"/>
            <circle cx="44" cy="35" r="3" fill="white"/>
            <circle cx="44" cy="35" r="1.5" fill="black"/>
            <circle cx="56" cy="35" r="3" fill="white"/>
            <circle cx="56" cy="35" r="1.5" fill="black"/>
            <polygon points="50,40 46,46 54,46" fill="#FFA500"/>
            <ellipse cx="25" cy="60" rx="10" ry="15" fill="#A0522D"/>
            <ellipse cx="75" cy="60" rx="10" ry="15" fill="#A0522D"/>
            <line x1="40" y1="90" x2="40" y2="98" stroke="#FFA500" stroke-width="3"/>
            <line x1="60" y1="90" x2="60" y2="98" stroke="#FFA500" stroke-width="3"/>
        </svg>`,
        // Chick
        `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="60" rx="25" ry="25" fill="#FFD700"/>
            <circle cx="50" cy="38" r="18" fill="#FFD700"/>
            <circle cx="42" cy="35" r="4" fill="white"/>
            <circle cx="42" cy="35" r="2" fill="black"/>
            <circle cx="58" cy="35" r="4" fill="white"/>
            <circle cx="58" cy="35" r="2" fill="black"/>
            <polygon points="50,42 46,50 54,50" fill="#FF8C00"/>
            <ellipse cx="28" cy="58" rx="8" ry="12" fill="#FFE44D"/>
            <ellipse cx="72" cy="58" rx="8" ry="12" fill="#FFE44D"/>
            <line x1="42" y1="85" x2="42" y2="95" stroke="#FF8C00" stroke-width="2"/>
            <line x1="58" y1="85" x2="58" y2="95" stroke="#FF8C00" stroke-width="2"/>
            <ellipse cx="50" cy="22" rx="6" ry="4" fill="#FFE44D"/>
        </svg>`,
        // Fancy rooster
        `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="26" ry="28" fill="#8B0000"/>
            <circle cx="50" cy="36" r="17" fill="#8B0000"/>
            <path d="M50,5 Q60,15 55,25 Q65,20 60,30 Q70,28 62,35 L50,20 L38,35 Q30,28 40,30 Q35,20 45,25 Q40,15 50,5" fill="#FF2222"/>
            <circle cx="43" cy="33" r="4" fill="white"/>
            <circle cx="43" cy="33" r="2" fill="black"/>
            <polygon points="50,40 45,48 55,48" fill="#FFA500"/>
            <path d="M50,48 Q55,55 50,52 Q52,58 48,55" fill="#FF4444"/>
            <ellipse cx="28" cy="62" rx="12" ry="18" fill="#660000"/>
            <ellipse cx="72" cy="62" rx="12" ry="18" fill="#660000"/>
            <path d="M15,55 Q5,50 10,65 Q0,70 15,75" fill="#660000"/>
            <line x1="40" y1="90" x2="40" y2="98" stroke="#FFA500" stroke-width="3"/>
            <line x1="60" y1="90" x2="60" y2="98" stroke="#FFA500" stroke-width="3"/>
        </svg>`,
        // White hen
        `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="28" ry="28" fill="#F5F5F5"/>
            <circle cx="50" cy="38" r="16" fill="#F5F5F5"/>
            <polygon points="50,22 47,30 53,30" fill="#FF4444"/>
            <circle cx="44" cy="36" r="3" fill="#333"/>
            <circle cx="56" cy="36" r="3" fill="#333"/>
            <polygon points="50,42 46,48 54,48" fill="#FFA500"/>
            <ellipse cx="25" cy="62" rx="12" ry="16" fill="#E8E8E8"/>
            <ellipse cx="75" cy="62" rx="12" ry="16" fill="#E8E8E8"/>
            <line x1="40" y1="90" x2="40" y2="98" stroke="#FFA500" stroke-width="3"/>
            <line x1="60" y1="90" x2="60" y2="98" stroke="#FFA500" stroke-width="3"/>
        </svg>`
    ],

    // Penalty SVGs for card backs
    penaltySVGs: {
        blank: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="55" font-size="24" fill="#c9a66b" text-anchor="middle" font-weight="bold">SAFE</text>
            <circle cx="50" cy="75" r="8" fill="none" stroke="#4ade80" stroke-width="3"/>
            <path d="M44,75 L48,80 L56,70" stroke="#4ade80" stroke-width="3" fill="none"/>
        </svg>`,

        small: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="25" font-size="12" fill="#c9a66b" text-anchor="middle">1 FINGER</text>
            <ellipse cx="50" cy="55" rx="6" ry="15" fill="#FFB6C1"/>
            <ellipse cx="50" cy="72" rx="4" ry="4" fill="#FFB6C1"/>
            <circle cx="44" cy="72" r="5" fill="#FFB6C1"/>
            <circle cx="56" cy="72" r="5" fill="#FFB6C1"/>
        </svg>`,

        mickey: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="20" font-size="10" fill="#c9a66b" text-anchor="middle">2 FINGERS</text>
            <ellipse cx="50" cy="55" rx="10" ry="20" fill="#FFB6C1"/>
            <circle cx="35" cy="35" r="12" fill="#FFB6C1"/>
            <circle cx="65" cy="35" r="12" fill="#FFB6C1"/>
            <ellipse cx="50" cy="78" rx="5" ry="5" fill="#FFB6C1"/>
            <circle cx="42" cy="80" r="6" fill="#FFB6C1"/>
            <circle cx="58" cy="80" r="6" fill="#FFB6C1"/>
        </svg>`,

        big: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="15" font-size="9" fill="#c9a66b" text-anchor="middle" font-weight="bold">3 FINGERS!</text>
            <ellipse cx="50" cy="50" rx="16" ry="32" fill="#FF9999"/>
            <ellipse cx="50" cy="50" rx="16" ry="32" fill="url(#veins)" opacity="0.5"/>
            <defs>
                <pattern id="veins" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0,10 Q5,5 10,10 Q15,15 20,10" stroke="#FF6666" stroke-width="1" fill="none"/>
                </pattern>
            </defs>
            <ellipse cx="50" cy="85" rx="8" ry="6" fill="#FF9999"/>
            <circle cx="38" cy="88" r="8" fill="#FF9999"/>
            <circle cx="62" cy="88" r="8" fill="#FF9999"/>
            <path d="M34,75 Q30,70 34,65" stroke="#663333" stroke-width="0.5" fill="none"/>
            <path d="M40,60 Q38,50 42,40" stroke="#663333" stroke-width="0.5" fill="none"/>
            <path d="M55,65 Q58,55 54,45" stroke="#663333" stroke-width="0.5" fill="none"/>
            <path d="M62,70 Q65,60 60,50" stroke="#663333" stroke-width="0.5" fill="none"/>
            <path d="M30,90 Q25,85 30,80 M32,92 Q27,88 32,84" stroke="#553333" stroke-width="0.8" fill="none"/>
            <path d="M70,90 Q75,85 70,80 M68,92 Q73,88 68,84" stroke="#553333" stroke-width="0.8" fill="none"/>
        </svg>`
    },

    init() {
        // Setup screen
        document.getElementById('bclc-start-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('bclc-play-again-btn')?.addEventListener('click', () => this.resetToSetup());

        // Dealer mode toggle
        document.querySelectorAll('.bclc-radio-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.bclc-radio-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                option.querySelector('input').checked = true;

                const dealerSelect = document.getElementById('bclc-dealer-select');
                if (option.dataset.mode === 'select') {
                    dealerSelect.classList.remove('hidden');
                } else {
                    dealerSelect.classList.add('hidden');
                }
            });
        });

        // Update dealer dropdown when players change
        document.querySelectorAll('#bclc-player-select input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateDealerDropdown());
        });

        // Game screen
        document.getElementById('bclc-card-1')?.addEventListener('click', () => this.flipCard(1));
        document.getElementById('bclc-card-2')?.addEventListener('click', () => this.flipCard(2));
        document.getElementById('bclc-im-out-btn')?.addEventListener('click', () => this.playerOut());
        document.getElementById('bclc-next-btn')?.addEventListener('click', () => this.nextPlayer());
        document.getElementById('bclc-reset-btn')?.addEventListener('click', () => this.resetToSetup());
    },

    updateDealerDropdown() {
        const checkboxes = document.querySelectorAll('#bclc-player-select input:checked');
        const players = Array.from(checkboxes).map(cb => cb.value);
        const dropdown = document.getElementById('bclc-dealer-dropdown');

        dropdown.innerHTML = players.map(p => {
            const name = ladsData[p]?.name || p;
            return `<option value="${p}">${name}</option>`;
        }).join('');
    },

    createDeck() {
        this.deck = [];
        this.cardTypes.forEach(cardType => {
            for (let i = 0; i < cardType.count; i++) {
                this.deck.push({
                    type: cardType.type,
                    fingers: cardType.fingers
                });
            }
        });
        // Shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    startGame() {
        // Get selected players
        const checkboxes = document.querySelectorAll('#bclc-player-select input:checked');
        this.players = Array.from(checkboxes).map(cb => cb.value);

        if (this.players.length < 2) {
            alert('Need at least 2 players!');
            return;
        }

        // Determine dealer
        const dealerMode = document.querySelector('input[name="dealer-mode"]:checked').value;
        let dealer;

        if (dealerMode === 'random') {
            dealer = this.players[Math.floor(Math.random() * this.players.length)];
        } else {
            dealer = document.getElementById('bclc-dealer-dropdown').value;
            if (!this.players.includes(dealer)) {
                alert('Dealer must be one of the players!');
                return;
            }
        }

        // Order players so dealer goes last
        const dealerIndex = this.players.indexOf(dealer);
        const orderedPlayers = [
            ...this.players.slice(dealerIndex + 1),
            ...this.players.slice(0, dealerIndex + 1)
        ];

        this.dealer = dealer;
        this.activePlayers = [...orderedPlayers];
        this.currentPlayerIndex = 0;
        this.createDeck();

        this.showScreen('game');
        this.setupTurn();
    },

    setupTurn() {
        this.flippedCount = 0;
        this.totalFingers = 0;

        // Deal 2 cards
        if (this.deck.length < 2) {
            this.createDeck(); // Reshuffle if needed
        }
        this.currentCards = [this.deck.pop(), this.deck.pop()];

        // Update UI
        const player = this.activePlayers[this.currentPlayerIndex];
        const playerName = ladsData[player]?.name || player;
        const dealerName = ladsData[this.dealer]?.name || this.dealer;
        document.getElementById('bclc-current-player').textContent = `${playerName}'s Turn`;
        document.getElementById('bclc-dealer-info').textContent = `Dealer: ${dealerName}`;
        document.getElementById('bclc-players-left').textContent = `${this.activePlayers.length} left`;

        // Reset cards
        const card1 = document.getElementById('bclc-card-1');
        const card2 = document.getElementById('bclc-card-2');
        card1.dataset.flipped = 'false';
        card2.dataset.flipped = 'false';

        // Set random chicken fronts
        const chicken1 = this.chickenSVGs[Math.floor(Math.random() * this.chickenSVGs.length)];
        const chicken2 = this.chickenSVGs[Math.floor(Math.random() * this.chickenSVGs.length)];
        document.getElementById('bclc-card-1-front').innerHTML = chicken1;
        document.getElementById('bclc-card-2-front').innerHTML = chicken2;

        // Set penalty backs
        document.getElementById('bclc-card-1-back').innerHTML = this.penaltySVGs[this.currentCards[0].type];
        document.getElementById('bclc-card-2-back').innerHTML = this.penaltySVGs[this.currentCards[1].type];

        // Reset result and buttons
        document.getElementById('bclc-result').innerHTML = '';
        document.getElementById('bclc-result').className = 'bclc-result';
        document.getElementById('bclc-next-btn').disabled = true;
    },

    flipCard(cardNum) {
        const card = document.getElementById(`bclc-card-${cardNum}`);
        if (card.dataset.flipped === 'true') return;

        card.dataset.flipped = 'true';
        this.flippedCount++;
        this.totalFingers += this.currentCards[cardNum - 1].fingers;

        // Check if both cards flipped
        if (this.flippedCount === 2) {
            this.showResult();
        }
    },

    showResult() {
        const resultEl = document.getElementById('bclc-result');
        let resultClass = '';
        let text = '';
        let fingers = '';
        let instruction = '';

        if (this.totalFingers === 0) {
            resultClass = 'safe';
            text = 'SAFE!';
            fingers = '&#128077;';
            instruction = 'No drinking this round';
        } else {
            resultClass = `drink-${this.totalFingers}`;
            text = this.totalFingers === 1 ? '1 FINGER' : `${this.totalFingers} FINGERS`;
            fingers = '&#127866;'.repeat(this.totalFingers);
            instruction = 'Drink up!';
        }

        resultEl.className = `bclc-result ${resultClass}`;
        resultEl.innerHTML = `
            <div class="bclc-result-text">${text}</div>
            <div class="bclc-result-fingers">${fingers}</div>
            <div class="bclc-result-instruction">${instruction}</div>
        `;

        document.getElementById('bclc-next-btn').disabled = false;
    },

    playerOut() {
        const player = this.activePlayers[this.currentPlayerIndex];
        const playerName = ladsData[player]?.name || player;

        if (confirm(`${playerName} is out of beer?`)) {
            this.activePlayers.splice(this.currentPlayerIndex, 1);

            if (this.activePlayers.length <= 1) {
                this.endGame();
            } else {
                // Adjust index if needed
                if (this.currentPlayerIndex >= this.activePlayers.length) {
                    this.currentPlayerIndex = 0;
                }
                this.setupTurn();
            }
        }
    },

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;
        this.setupTurn();
    },

    endGame() {
        const winner = this.activePlayers[0];
        const winnerName = ladsData[winner]?.name || winner;
        document.getElementById('bclc-winner-name').textContent = winnerName;
        this.showScreen('gameover');
    },

    resetToSetup() {
        this.showScreen('setup');
    },

    showScreen(screen) {
        document.getElementById('bclc-setup').classList.remove('active');
        document.getElementById('bclc-game').classList.remove('active');
        document.getElementById('bclc-gameover').classList.remove('active');
        document.getElementById(`bclc-${screen}`).classList.add('active');
    }
};

// Initialize BCLC when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    BCLC.init();
});

// Register Service Worker
// Service Worker with force update
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Unregister old service workers and clear caches
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const reg of registrations) {
                await reg.unregister();
                console.log('Unregistered old SW');
            }

            // Clear all caches
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
                await caches.delete(name);
                console.log('Deleted cache:', name);
            }

            // Register fresh
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('SW registered:', registration.scope);

            // Force update check
            registration.update();
        } catch (error) {
            console.log('SW setup error:', error);
        }
    });
}
