// Reference Date: 03 May 2026
const REFERENCE_DATE = new Date(2026, 4, 3); // May 3, 2026

// All exam data
const examsData = [
    // WA2 Assessments
    { name: 'Mathematics WA2', date: new Date(2026, 4, 4), category: 'wa2', type: 'WA2' },
    { name: 'Social Studies WA2', date: new Date(2026, 4, 4), category: 'wa2', type: 'WA2' },
    { name: 'Additional Mathematics WA2', date: new Date(2026, 4, 7), category: 'wa2', type: 'WA2' },
    { name: 'Chemistry WA2', date: new Date(2026, 4, 8), category: 'wa2', type: 'WA2' },
    
    // O-Levels
    { name: 'Tamil Paper 1 & 2', date: new Date(2026, 5, 2), category: 'o-level', type: 'O-Level' },
    { name: 'Tamil Listening Comprehension', date: new Date(2026, 6, 7), category: 'o-level', type: 'O-Level' },
    { name: 'English Oral', date: new Date(2026, 6, 14), category: 'o-level', type: 'O-Level' },
    { name: 'Tamil Oral Day 1', date: new Date(2026, 6, 16), category: 'o-level', type: 'O-Level' },
    { name: 'Tamil Oral Day 2', date: new Date(2026, 6, 16), category: 'o-level', type: 'O-Level' },
    { name: 'Tamil Oral Day 3', date: new Date(2026, 6, 17), category: 'o-level', type: 'O-Level' },
    { name: 'English Oral Day 2', date: new Date(2026, 6, 17), category: 'o-level', type: 'O-Level' },
    { name: 'Chemistry Practical', date: new Date(2026, 8, 30), category: 'o-level', type: 'O-Level' },
    { name: 'Physics Practical', date: new Date(2026, 9, 5), category: 'o-level', type: 'O-Level' },
    { name: 'English Paper 1 & 2', date: new Date(2026, 9, 19), category: 'o-level', type: 'O-Level' },
    { name: 'History Paper', date: new Date(2026, 9, 20), category: 'o-level', type: 'O-Level' },
    { name: 'Mathematics Paper 1', date: new Date(2026, 9, 21), category: 'o-level', type: 'O-Level' },
    { name: 'Mathematics Paper 2', date: new Date(2026, 9, 23), category: 'o-level', type: 'O-Level' },
    { name: 'Social Studies Paper', date: new Date(2026, 9, 26), category: 'o-level', type: 'O-Level' },
    { name: 'Additional Mathematics Paper 1', date: new Date(2026, 9, 26), category: 'o-level', type: 'O-Level' },
    { name: 'Chemistry Paper 2', date: new Date(2026, 9, 27), category: 'o-level', type: 'O-Level' },
    { name: 'Additional Mathematics Paper 2', date: new Date(2026, 9, 28), category: 'o-level', type: 'O-Level' },
    { name: 'Physics Paper 2', date: new Date(2026, 9, 29), category: 'o-level', type: 'O-Level' },
    { name: 'Tamil Paper 1 & 2', date: new Date(2026, 10, 3), category: 'o-level', type: 'O-Level' },
    { name: 'Chemistry Paper 1', date: new Date(2026, 10, 6), category: 'o-level', type: 'O-Level' },
    { name: 'Physics Paper 1', date: new Date(2026, 10, 6), category: 'o-level', type: 'O-Level' }
];

// Calculate days remaining
function calculateDaysRemaining(examDate) {
    const today = REFERENCE_DATE;
    const timeDifference = examDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
}

// Format date
function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// Get urgency level
function getUrgencyLevel(daysRemaining) {
    if (daysRemaining <= 0) return 'completed';
    if (daysRemaining <= 3) return 'urgent';
    if (daysRemaining <= 7) return 'high';
    if (daysRemaining <= 30) return 'medium';
    return 'planned';
}

// Get status text
function getStatusText(daysRemaining) {
    if (daysRemaining <= 0) return '✓ COMPLETED';
    if (daysRemaining === 1) return '🚨 TOMORROW';
    if (daysRemaining <= 3) return '🚨 CRITICAL';
    if (daysRemaining <= 7) return '📌 HIGH PRIORITY';
    if (daysRemaining <= 30) return '📋 MEDIUM PRIORITY';
    return '🟢 PLANNED';
}

// Create exam card HTML
function createExamCard(exam, index) {
    const daysRemaining = calculateDaysRemaining(exam.date);
    const urgency = getUrgencyLevel(daysRemaining);
    const status = getStatusText(daysRemaining);
    const isCompleted = localStorage.getItem(`exam-${index}-completed`) === 'true';
    const examNote = localStorage.getItem(`exam-${index}-note`) || '';
    
    const progressPercent = Math.max(0, Math.min(100, ((daysRemaining) / 187) * 100));
    
    const html = `
        <div class="exam-card ${urgency} ${isCompleted ? 'completed' : ''}" data-index="${index}" data-category="${exam.category}" data-urgency="${urgency}">
            <div class="exam-header">
                <div class="exam-title">${exam.name}</div>
                <div class="exam-date">${formatDate(exam.date)}</div>
            </div>
            
            <div class="exam-countdown">
                ${daysRemaining <= 0 ? '✓ DONE' : `${daysRemaining} DAYS`}
            </div>
            
            <div class="exam-status">
                <span class="status-badge ${urgency}">${status}</span>
                <span class="status-badge" style="background: rgba(0,0,0,0.05); color: var(--text-light);">${exam.type}</span>
            </div>
            
            <div class="exam-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">${Math.round(progressPercent)}% Complete</div>
            </div>
            
            <div class="exam-actions">
                <button class="action-btn mark-complete-btn" onclick="toggleComplete(${index})">
                    ${isCompleted ? '↩️ Undo' : '✓ Done'}
                </button>
                <button class="action-btn" onclick="toggleNoteInput(${index})">📝 Note</button>
            </div>
            
            <div class="note-input-container" id="note-container-${index}" style="display: none; margin-top: 1rem;">
                <textarea class="note-input" id="note-input-${index}" placeholder="Add your study notes here..." style="width: 100%; padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 8px; resize: vertical; min-height: 80px; font-family: inherit; background: var(--light-gray); color: var(--text-dark);">${examNote}</textarea>
                <button class="action-btn primary" onclick="saveNote(${index})" style="margin-top: 0.5rem; width: 100%;">💾 Save Note</button>
            </div>
        </div>
    `;
    
    return html;
}

// Toggle complete status
function toggleComplete(index) {
    const isCompleted = localStorage.getItem(`exam-${index}-completed`) === 'true';
    localStorage.setItem(`exam-${index}-completed`, !isCompleted);
    renderExams();
    updateStats();
}

// Toggle note input
function toggleNoteInput(index) {
    const container = document.getElementById(`note-container-${index}`);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

// Save note
function saveNote(index) {
    const noteInput = document.getElementById(`note-input-${index}`);
    const note = noteInput.value;
    localStorage.setItem(`exam-${index}-note`, note);
    alert('Note saved! 📝');
}

// Render all exams
function renderExams() {
    // Clear existing exams
    document.getElementById('wa2-list').innerHTML = '';
    document.getElementById('o-level-list').innerHTML = '';
    
    // Sort exams by date
    const sortedExams = [...examsData].sort((a, b) => a.date - b.date);
    
    // Group by category
    sortedExams.forEach((exam, index) => {
        const originalIndex = examsData.findIndex(e => e.name === exam.name && e.date.getTime() === exam.date.getTime());
        const card = createExamCard(exam, originalIndex);
        
        if (exam.category === 'wa2') {
            document.getElementById('wa2-list').innerHTML += card;
        } else if (exam.category === 'o-level') {
            document.getElementById('o-level-list').innerHTML += card;
        }
    });
    
    applyFilters();
}

// Update statistics
function updateStats() {
    const total = examsData.length;
    let urgent = 0, high = 0, planned = 0, completed = 0;
    
    examsData.forEach((exam, index) => {
        const daysRemaining = calculateDaysRemaining(exam.date);
        const isCompleted = localStorage.getItem(`exam-${index}-completed`) === 'true';
        
        if (isCompleted) {
            completed++;
        } else {
            if (daysRemaining <= 3) urgent++;
            else if (daysRemaining <= 7) high++;
            else if (daysRemaining > 7) planned++;
        }
    });
    
    const progressPercent = Math.round((completed / total) * 100);
    
    document.getElementById('totalExams').textContent = total;
    document.getElementById('urgentCount').textContent = urgent;
    document.getElementById('highCount').textContent = high;
    document.getElementById('plannedCount').textContent = planned;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('progressPercent').textContent = progressPercent + '%';
    
    updateNextExam();
}

// Update next exam display
function updateNextExam() {
    let nextExam = null;
    let minDays = Infinity;
    
    examsData.forEach((exam, index) => {
        const isCompleted = localStorage.getItem(`exam-${index}-completed`) === 'true';
        if (!isCompleted) {
            const daysRemaining = calculateDaysRemaining(exam.date);
            if (daysRemaining >= 0 && daysRemaining < minDays) {
                minDays = daysRemaining;
                nextExam = { exam, daysRemaining };
            }
        }
    });
    
    if (nextExam) {
        document.getElementById('nextDaysCount').textContent = nextExam.daysRemaining;
        document.getElementById('nextExamName').textContent = nextExam.exam.name;
        document.getElementById('nextExamDate').textContent = `${formatDate(nextExam.exam.date)}`;
        
        const urgency = getUrgencyLevel(nextExam.daysRemaining);
        const status = getStatusText(nextExam.daysRemaining);
        
        const badge = document.getElementById('nextExamStatus');
        badge.textContent = status;
        badge.className = `urgency-badge ${urgency}`;
    }
}

// Apply filters
function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const cards = document.querySelectorAll('.exam-card');
    
    cards.forEach(card => {
        let shouldShow = true;
        
        if (activeFilter !== 'all') {
            const urgency = card.getAttribute('data-urgency');
            const category = card.getAttribute('data-category');
            
            if (activeFilter === 'urgent' && urgency !== 'urgent') shouldShow = false;
            if (activeFilter === 'wa2' && category !== 'wa2') shouldShow = false;
            if (activeFilter === 'o-level' && category !== 'o-level') shouldShow = false;
            if (activeFilter === 'completed' && urgency !== 'completed') shouldShow = false;
        }
        
        card.classList.toggle('hidden', !shouldShow);
    });
}

// Setup filter buttons
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
}

// Setup dark mode
function setupDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderExams();
    updateStats();
    setupFilterButtons();
    setupDarkMode();
});
