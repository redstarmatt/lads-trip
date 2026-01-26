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
// COST SPLITTING FUNCTIONALITY
// ============================================

const EXPENSES_KEY = 'lads-expenses';
const JSONBLOB_ID = '019bfac8-1b6b-759d-a533-8c5644418d84';
const JSONBLOB_URL = `https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`;
const allLads = ['matt', 'ken', 'chris', 'andy', 'mark'];

let expensesCache = [];
let isSyncing = false;
let lastSyncTime = 0;

// Fetch expenses from JSONBlob
async function fetchExpenses() {
    try {
        showSyncStatus('syncing');
        const response = await fetch(JSONBLOB_URL, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        expensesCache = data.expenses || [];
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expensesCache));
        lastSyncTime = Date.now();
        showSyncStatus('synced');
        return expensesCache;
    } catch (error) {
        console.log('Using local cache:', error);
        showSyncStatus('offline');
        const stored = localStorage.getItem(EXPENSES_KEY);
        expensesCache = stored ? JSON.parse(stored) : [];
        return expensesCache;
    }
}

// Save expenses to JSONBlob
async function saveExpensesToCloud(expenses) {
    if (isSyncing) return;
    isSyncing = true;
    showSyncStatus('syncing');

    try {
        const response = await fetch(JSONBLOB_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ expenses })
        });
        if (!response.ok) throw new Error('Failed to save');
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
        lastSyncTime = Date.now();
        showSyncStatus('synced');
    } catch (error) {
        console.error('Failed to sync:', error);
        showSyncStatus('offline');
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    } finally {
        isSyncing = false;
    }
}

function showSyncStatus(status) {
    const statusEl = document.getElementById('sync-status');
    if (!statusEl) return;

    statusEl.className = 'sync-status ' + status;
    if (status === 'syncing') {
        statusEl.textContent = 'Syncing...';
    } else if (status === 'synced') {
        statusEl.textContent = 'Synced';
    } else {
        statusEl.textContent = 'Offline';
    }
}

function getExpenses() {
    return expensesCache;
}

function saveExpenses(expenses) {
    expensesCache = expenses;
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    saveExpensesToCloud(expenses);
}

async function addExpense(description, amount, paidBy, splitBetween) {
    // Fetch latest first to avoid conflicts
    await fetchExpenses();

    const expense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        paidBy,
        splitBetween,
        timestamp: new Date().toISOString()
    };
    expensesCache.push(expense);
    saveExpenses(expensesCache);
    return expense;
}

async function deleteExpense(id) {
    await fetchExpenses();
    const expenses = expensesCache.filter(e => e.id !== id);
    saveExpenses(expenses);
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
                <button class="expense-delete" onclick="handleDeleteExpense(${expense.id})">×</button>
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
