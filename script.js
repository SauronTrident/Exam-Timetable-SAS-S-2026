// Reference Date: Today's date (auto-updates as days pass)
const REFERENCE_DATE = new Date();

// All exam data
const examsData = [];

function createExamId(exam) {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID();
    }

    return `exam-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Load custom exams from localStorage
function loadCustomExams() {
    const customExams = JSON.parse(localStorage.getItem('customExams')) || [];
    let needsPersist = false;
    customExams.forEach(exam => {
        exam.date = new Date(exam.date);
        if (!exam.id) {
            exam.id = createExamId(exam);
            needsPersist = true;
        }
        examsData.push(exam);
    });

    if (needsPersist) {
        localStorage.setItem('customExams', JSON.stringify(customExams));
    }
}

function setupExamTypeOptions() {
    const examTypeSelect = document.getElementById('examType');
    if (!examTypeSelect) return;

    examTypeSelect.innerHTML = `
        <option value="">-- Select Type --</option>
        <option value="WA1">WA1</option>
        <option value="WA2">WA2</option>
        <option value="WA3">WA3</option>
        <option value="WA4">WA4</option>
        <option value="End-of-Year">End-of-Year</option>
    `;
}

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
    const examId = exam.id || createExamId(exam);
    const isCompleted = localStorage.getItem(`exam-${examId}-completed`) === 'true';
    const examNote = localStorage.getItem(`exam-${examId}-note`) || '';
    
    const progressPercent = Math.max(0, Math.min(100, ((daysRemaining) / 187) * 100));
    
    const html = `
        <div class="exam-card ${urgency} ${isCompleted ? 'completed' : ''}" data-exam-id="${examId}" data-category="${exam.category}" data-urgency="${urgency}">
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
                <button class="action-btn mark-complete-btn" onclick="toggleComplete('${examId}')">
                    ${isCompleted ? '↩️ Undo' : '✓ Done'}
                </button>
                <button class="action-btn" onclick="toggleNoteInput('${examId}')">📝 Note</button>
                <button class="action-btn delete-btn" onclick="deleteExam('${examId}')" title="Delete this exam">🗑️ Delete</button>
            </div>
            
            <div class="note-input-container" id="note-container-${examId}" style="display: none; margin-top: 1rem;">
                <textarea class="note-input" id="note-input-${examId}" placeholder="Add your study notes here..." style="width: 100%; padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 8px; resize: vertical; min-height: 80px; font-family: inherit; background: var(--light-gray); color: var(--text-light);">${examNote}</textarea>
                <button class="action-btn primary" onclick="saveNote('${examId}')" style="margin-top: 0.5rem; width: 100%;">💾 Save Note</button>
            </div>
        </div>
    `;
    
    return html;
}

// Toggle complete status
function toggleComplete(examId) {
    const isCompleted = localStorage.getItem(`exam-${examId}-completed`) === 'true';
    localStorage.setItem(`exam-${examId}-completed`, String(!isCompleted));
    renderExams();
    updateStats();
}

// Toggle note input
function toggleNoteInput(examId) {
    const container = document.getElementById(`note-container-${examId}`);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

// Save note
function saveNote(examId) {
    const noteInput = document.getElementById(`note-input-${examId}`);
    const note = noteInput.value;
    localStorage.setItem(`exam-${examId}-note`, note);
    alert('Note saved! 📝');
}

// Render all exams
function renderExams() {
    // Clear existing exams
    document.getElementById('wa2-list').innerHTML = '';
    document.getElementById('o-level-list').innerHTML = '';
    const customList = document.getElementById('custom-list');
    if (customList) customList.innerHTML = '';
    
    // Sort exams by date
    const sortedExams = [...examsData].sort((a, b) => a.date - b.date);
    
    let hasCustom = false;
    
    // Group by category
    sortedExams.forEach(exam => {
        const card = createExamCard(exam);
        
        if (exam.category === 'wa2') {
            document.getElementById('wa2-list').innerHTML += card;
        } else if (exam.category === 'o-level') {
            document.getElementById('o-level-list').innerHTML += card;
        } else if (exam.category === 'custom') {
            hasCustom = true;
            const customList = document.getElementById('custom-list');
            if (customList) customList.innerHTML += card;
        }
    });
    
    // Show/hide custom category section
    const customCategory = document.getElementById('custom-category');
    if (customCategory) {
        customCategory.style.display = hasCustom ? 'block' : 'none';
    }

    if (sortedExams.length === 0) {
        document.getElementById('wa2-list').innerHTML = '<div class="empty-state">No exams yet. Add one to get started.</div>';
        document.getElementById('o-level-list').innerHTML = '<div class="empty-state">No exams yet. Add one to get started.</div>';
    }
    
    applyFilters();
}

// Update statistics
function updateStats() {
    const total = examsData.length;
    let urgent = 0, high = 0, planned = 0, completed = 0;
    
    examsData.forEach(exam => {
        const daysRemaining = calculateDaysRemaining(exam.date);
        const examId = exam.id || createExamId(exam);
        const isCompleted = localStorage.getItem(`exam-${examId}-completed`) === 'true';
        
        if (isCompleted) {
            completed++;
        } else {
            if (daysRemaining <= 3) urgent++;
            else if (daysRemaining <= 7) high++;
            else if (daysRemaining > 7) planned++;
        }
    });
    
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
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
    
    examsData.forEach(exam => {
        const examId = exam.id || createExamId(exam);
        const isCompleted = localStorage.getItem(`exam-${examId}-completed`) === 'true';
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
        
        let dateDisplay = formatDate(nextExam.exam.date);
        if (nextExam.daysRemaining === 0) dateDisplay = 'Today • ' + dateDisplay;
        else if (nextExam.daysRemaining === 1) dateDisplay = 'Tomorrow • ' + dateDisplay;
        document.getElementById('nextExamDate').textContent = dateDisplay;
        
        const urgency = getUrgencyLevel(nextExam.daysRemaining);
        const status = getStatusText(nextExam.daysRemaining);
        
        const badge = document.getElementById('nextExamStatus');
        badge.textContent = status;
        badge.className = `urgency-badge ${urgency}`;
    } else {
        document.getElementById('nextDaysCount').textContent = '0';
        document.getElementById('nextExamName').textContent = 'No exams added yet';
        document.getElementById('nextExamDate').textContent = 'Add an exam to get started';
        const badge = document.getElementById('nextExamStatus');
        badge.textContent = 'NO EXAMS';
        badge.className = 'urgency-badge planned';
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

// Show add exam modal
function showAddExamForm() {
    document.getElementById('addExamModal').classList.add('active');
}

// Hide add exam modal
function hideAddExamForm() {
    document.getElementById('addExamModal').classList.remove('active');
    document.getElementById('addExamForm').reset();
}

// Add new exam
function addNewExam(event) {
    event.preventDefault();
    
    const name = document.getElementById('examName').value.trim();
    const dateStr = document.getElementById('examDate').value;
    const category = document.getElementById('examCategory').value;
    const type = document.getElementById('examType').value;
    
    if (!name || !dateStr || !category || !type) {
        alert('Please fill in all fields');
        return;
    }
    
    // Parse the date
    const [year, month, day] = dateStr.split('-');
    const newExam = {
        name,
        date: new Date(year, month - 1, day),
        category,
        type,
        id: createExamId({ name, date: new Date(year, month - 1, day), category })
    };
    
    // Add to examsData
    examsData.push(newExam);
    
    // Save to localStorage
    const customExams = JSON.parse(localStorage.getItem('customExams')) || [];
    customExams.push({
        name: newExam.name,
        date: newExam.date.toISOString(),
        category: newExam.category,
        type: newExam.type,
        id: newExam.id
    });
    localStorage.setItem('customExams', JSON.stringify(customExams));
    
    // Refresh UI
    renderExams();
    updateStats();
    hideAddExamForm();
    
    alert(`✅ "${name}" added successfully!`);
}

// Delete exam
function deleteExam(examId) {
    const index = examsData.findIndex(exam => (exam.id || createExamId(exam)) === examId);
    const exam = examsData[index];
    if (!exam) {
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${exam.name}"?`)) {
        return;
    }
    
    // Remove from examsData
    examsData.splice(index, 1);
    
    // Remove from custom exams if it exists there
    const customExams = JSON.parse(localStorage.getItem('customExams')) || [];
    const customIndex = customExams.findIndex(e => (e.id || createExamId({ name: e.name, date: new Date(e.date), category: e.category })) === examId);
    if (customIndex !== -1) {
        customExams.splice(customIndex, 1);
        localStorage.setItem('customExams', JSON.stringify(customExams));
    }
    
    // Remove associated localStorage data
    localStorage.removeItem(`exam-${examId}-completed`);
    localStorage.removeItem(`exam-${examId}-note`);
    
    // Refresh UI
    renderExams();
    updateStats();
    
    alert(`✅ "${exam.name}" deleted successfully!`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupExamTypeOptions();
    loadCustomExams();
    renderExams();
    updateStats();
    setupFilterButtons();
    setupDarkMode();
});
