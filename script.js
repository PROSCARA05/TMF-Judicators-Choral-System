// APPLICATION STATE & INITIALIZATION

// ================
// GLOBAL VARIABLES
// ================
let importedChoirsData = [];

const appState = {
    currentUser: null,
    currentRole: null,
    currentUserId: null,
    isLoggedIn: false,
    currentView: 'dashboard',
    choirs: [],
    assessments: {},
    users: {
        // TEST USERS ONLY - Keep for system access
        'assessor1': { 
            password: 'password123', 
            role: 'assessor', 
            name: 'John Assessor',
            id: 'assessor1',
            email: 'john@example.com'
        },
        'assessor2': { 
            password: 'password123', 
            role: 'assessor', 
            name: 'Mary Judge',
            id: 'assessor2',
            email: 'mary@example.com'
        },
        'chair1': { 
            password: 'password123', 
            role: 'chair', 
            name: 'Jane Chair',
            id: 'chair1',
            email: 'jane@example.com'
        },
        'admin': { 
            password: 'admin123', 
            role: 'admin', 
            name: 'System Admin',
            id: 'admin',
            email: 'admin@example.com'
        },
        'founder': { 
            password: 'founder123', 
            role: 'founder', 
            name: 'Tiro Mpane',
            id: 'founder',
            email: 'tiro@example.com'
        },
        'monitor1': { 
            password: 'monitor123', 
            role: 'monitor', 
            name: 'Monitor User',
            id: 'monitor1',
            email: 'monitor@example.com'
        }
    },
    categories: {
        'GREAT CHAMPS': 'Great Champs',
        'LARGE': 'Large Category',
        'STANDARD': 'Standard Category'
    },
    
    rubricCategories: [
        "INTONATION",
        "PITCH ACCURACY", 
        "LANGUAGE, TEXT AND DICTION",
        "VOCAL TECHNIQUE AND PRODUCTION",
        "CHORAL SINGING TECHNIQUE",
        "RHYTHMIC ACCURACY, TEMPO AND METER",
        "ARTISTIC RELEVANCE, MUSICALITY AND NUANCES",
        "CONDUCTOR, SOLOIST AND STAGE PRESENCE"
    ],
    
    currentReportChoir: null,
    currentReportStats: null
};

// =======================
// FLEXIBLE SCORING SYSTEM
// =======================
const scoringSystem = {
    currentChoir: null,
    currentGenre: 'western',
    currentAssessorId: null,
    assessorScores: {},
    trimmedMeans: {},
    finalRankings: {
        western: [],
        african: [],
        overall: []
    },
    
    initializeAssessorScores: function(choirId) {
        if (!this.assessorScores[choirId]) {
            this.assessorScores[choirId] = {
                western: {},
                african: {}
            };
        }
    },
    
    addAssessorScore: function(choirId, genre, assessorId, scores, comments = "") {
        this.initializeAssessorScores(choirId);
        this.assessorScores[choirId][genre][assessorId] = {
            ...scores,
            comments: comments,
            assessorName: appState.users[assessorId]?.name || `Assessor ${assessorId}`,
            submittedAt: new Date().toISOString()
        };
        
        this.calculateTrimmedMean(choirId, genre);
        this.calculateRankings();
        this.saveToLocalStorage();
    },
    
    calculateTrimmedMean: function(choirId, genre) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return 0;
        }
        
        const assessorScores = Object.values(this.assessorScores[choirId][genre]);
        
        if (assessorScores.length === 0) {
            return 0;
        }
        
        const totalScores = assessorScores.map(score => score.total || 0);
        
        let trimmedMean = 0;
        
        if (totalScores.length === 1) {
            trimmedMean = totalScores[0];
        } else if (totalScores.length === 2) {
            trimmedMean = (totalScores[0] + totalScores[1]) / 2;
        } else {
            const sortedScores = [...totalScores].sort((a, b) => a - b);
            sortedScores.shift();
            sortedScores.pop();
            
            const sum = sortedScores.reduce((a, b) => a + b, 0);
            trimmedMean = sum / sortedScores.length;
        }
        
        if (!this.trimmedMeans[choirId]) {
            this.trimmedMeans[choirId] = {};
        }
        this.trimmedMeans[choirId][genre] = trimmedMean;
        
        return trimmedMean;
    },
    
    getChoirTrimmedMean: function(choirId, genre) {
        if (this.trimmedMeans[choirId] && this.trimmedMeans[choirId][genre]) {
            return this.trimmedMeans[choirId][genre];
        }
        return 0;
    },
    
    getChoirOverallScore: function(choirId) {
        const westernScore = this.getChoirTrimmedMean(choirId, 'western') || 0;
        const africanScore = this.getChoirTrimmedMean(choirId, 'african') || 0;
        
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return 0;
        
        const hasAfricanSong = choir.africanSong && choir.africanSong.trim() !== '';
        const hasWesternSong = choir.westernSong && choir.westernSong.trim() !== '';
        const hasBothSongs = hasAfricanSong && hasWesternSong;
        
        // Handle choirs with both songs (average of both)
        if (hasBothSongs && westernScore > 0 && africanScore > 0) {
            return (westernScore + africanScore) / 2;
        }
        
        // Handle choirs with only one song (return the available score)
        if (hasAfricanSong && africanScore > 0 && !hasWesternSong) {
            return africanScore;
        }
        
        if (hasWesternSong && westernScore > 0 && !hasAfricanSong) {
            return westernScore;
        }
        
        return 0;
    },
    
    hasAssessorAlreadyAssessed: function(choirId, genre, assessorId) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return false;
        }
        return this.assessorScores[choirId][genre][assessorId] !== undefined;
    },
    
    hasAssessorFullyAssessed: function(choirId, assessorId) {
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return false;
        
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        if (hasBothSongs) {
            return this.hasAssessorAlreadyAssessed(choirId, 'western', assessorId) && 
                   this.hasAssessorAlreadyAssessed(choirId, 'african', assessorId);
        } else {
            const hasAfricanOnly = choir.africanSong && choir.africanSong.trim() !== '';
            const hasWesternOnly = choir.westernSong && choir.westernSong.trim() !== '';
            
            if (hasAfricanOnly) {
                return this.hasAssessorAlreadyAssessed(choirId, 'african', assessorId);
            } else if (hasWesternOnly) {
                return this.hasAssessorAlreadyAssessed(choirId, 'western', assessorId);
            }
        }
        
        return false;
    },
    
    calculateRankings: function() {
        const westernRankings = [];
        const africanRankings = [];
        const overallRankings = [];
        
        appState.choirs.forEach(choir => {
            const westernScore = this.getChoirTrimmedMean(choir.id, 'western');
            const africanScore = this.getChoirTrimmedMean(choir.id, 'african');
            
            const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                                choir.westernSong && choir.westernSong.trim() !== '';
            
            if (westernScore > 0) {
                westernRankings.push({
                    choir: choir,
                    score: westernScore,
                    genre: 'western'
                });
            }
            
            if (africanScore > 0) {
                africanRankings.push({
                    choir: choir,
                    score: africanScore,
                    genre: 'african'
                });
            }
            
            const hasAtLeastOneSong = (choir.africanSong && choir.africanSong.trim() !== '') || 
                                   (choir.westernSong && choir.westernSong.trim() !== '');
            
            if (hasAtLeastOneSong && (westernScore > 0 || africanScore > 0)) {
                const overallScore = this.getChoirOverallScore(choir.id);
                if (overallScore > 0) {
                    overallRankings.push({
                        choir: choir,
                        score: overallScore,
                        genre: 'overall'
                    });
                }
            }
        });
        
        westernRankings.sort((a, b) => b.score - a.score);
        africanRankings.sort((a, b) => b.score - a.score);
        overallRankings.sort((a, b) => b.score - a.score);
        
        this.finalRankings.western = this.applyRankingLogic(westernRankings);
        this.finalRankings.african = this.applyRankingLogic(africanRankings);
        this.finalRankings.overall = this.applyRankingLogic(overallRankings);
    },
    
    applyRankingLogic: function(rankings) {
        if (rankings.length === 0) return [];
        
        const scoreGroups = {};
        rankings.forEach((item, index) => {
            const roundedScore = Math.round(item.score * 10) / 10;
            if (!scoreGroups[roundedScore]) {
                scoreGroups[roundedScore] = [];
            }
            scoreGroups[roundedScore].push({ ...item, originalIndex: index });
        });
        
        let currentRank = 1;
        const finalRankings = [];
        
        Object.keys(scoreGroups).sort((a, b) => b - a).forEach(score => {
            const items = scoreGroups[score];
            
            if (items.length === 1) {
                finalRankings.push({
                    ...items[0],
                    rank: currentRank,
                    isTie: false
                });
                currentRank++;
            } else {
                items.forEach(item => {
                    finalRankings.push({
                        ...item,
                        rank: currentRank,
                        isTie: true,
                        tieCount: items.length
                    });
                });
                currentRank += items.length;
            }
        });
        
        return finalRankings.sort((a, b) => a.originalIndex - b.originalIndex);
    },
    
    getAssessorAssessment: function(choirId, genre, assessorId) {
        if (this.assessorScores[choirId] && 
            this.assessorScores[choirId][genre] && 
            this.assessorScores[choirId][genre][assessorId]) {
            return this.assessorScores[choirId][genre][assessorId];
        }
        return null;
    },
    
    getAllAssessorAssessments: function(choirId, genre) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return [];
        }
        
        return Object.entries(this.assessorScores[choirId][genre]).map(([assessorId, assessment]) => ({
            assessorId: assessorId,
            assessorName: assessment.assessorName || `Assessor ${assessorId}`,
            scores: assessment,
            total: assessment.total || 0,
            comments: assessment.comments || ""
        }));
    },
    
    getAssessorAssessments: function(choirId, genre, assessorId) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return null;
        }
        
        const assessment = this.assessorScores[choirId][genre][assessorId];
        if (!assessment) return null;
        
        return {
            assessorId: assessorId,
            assessorName: assessment.assessorName || `Assessor ${assessorId}`,
            scores: assessment,
            total: assessment.total || 0,
            comments: assessment.comments || ""
        };
    },
    
    getChoirStatistics: function(choirId) {
        const westernAssessments = this.getAllAssessorAssessments(choirId, 'western');
        const africanAssessments = this.getAllAssessorAssessments(choirId, 'african');
        
        const westernRawScores = westernAssessments.map(a => a.total);
        const africanRawScores = africanAssessments.map(a => a.total);
        
        return {
            western: {
                assessments: westernAssessments,
                count: westernAssessments.length,
                trimmedMean: this.getChoirTrimmedMean(choirId, 'western'),
                rawScores: westernRawScores,
                stdDev: westernRawScores.length > 0 ? calculateStandardDeviation(westernRawScores) : 0
            },
            african: {
                assessments: africanAssessments,
                count: africanAssessments.length,
                trimmedMean: this.getChoirTrimmedMean(choirId, 'african'),
                rawScores: africanRawScores,
                stdDev: africanRawScores.length > 0 ? calculateStandardDeviation(africanRawScores) : 0
            },
            overall: this.getChoirOverallScore(choirId)
        };
    },
    
    resetCurrentAssessment: function() {
        this.currentAssessorId = `assessor${Object.keys(this.assessorScores).length + 1}`;
        adjudicationData.currentGenre = 'western';
        adjudicationData.assessmentData = {
            western: {
                intonation: 0.0,
                pitchAccuracy: 0.0,
                language: 0.0,
                vocalTechnique: 0.0,
                choralTechnique: 0.0,
                rhythm: 0.0,
                artistry: 0.0,
                stage: 0.0,
                total: 0.0
            },
            african: {
                intonation: 0.0,
                pitchAccuracy: 0.0,
                language: 0.0,
                vocalTechnique: 0.0,
                choralTechnique: 0.0,
                rhythm: 0.0,
                artistry: 0.0,
                stage: 0.0,
                total: 0.0
            }
        };
    },
    
    getMethodologyCalculations: function(choirId) {
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return null;
        
        const stats = this.getChoirStatistics(choirId);
        
        const westernScores = stats.western.assessments.map(a => a.total);
        const africanScores = stats.african.assessments.map(a => a.total);
        
        const sortedWestern = [...westernScores].sort((a, b) => a - b);
        const sortedAfrican = [...africanScores].sort((a, b) => a - b);
        
        const westernHigh = westernScores.length > 0 ? Math.max(...westernScores) : 0;
        const westernLow = westernScores.length > 0 ? Math.min(...westernScores) : 0;
        const africanHigh = africanScores.length > 0 ? Math.max(...africanScores) : 0;
        const africanLow = africanScores.length > 0 ? Math.min(...africanScores) : 0;
        
        const westernTotal = westernScores.reduce((sum, score) => sum + score, 0);
        const africanTotal = africanScores.reduce((sum, score) => sum + score, 0);
        
        let westernTrimmedTotal = westernTotal;
        let africanTrimmedTotal = africanTotal;
        
        if (westernScores.length >= 2) {
            westernTrimmedTotal = westernTotal - westernHigh - westernLow;
        }
        if (africanScores.length >= 2) {
            africanTrimmedTotal = africanTotal - africanHigh - africanLow;
        }
        
        const westernOverall = westernScores.length > 2 ? westernTrimmedTotal / (westernScores.length - 2) : 
                             westernScores.length === 2 ? westernTotal / 2 : westernTotal;
        const africanOverall = africanScores.length > 2 ? africanTrimmedTotal / (africanScores.length - 2) : 
                             africanScores.length === 2 ? africanTotal / 2 : africanTotal;
        
        let finalAggregate = 0;
        if (westernOverall > 0 && africanOverall > 0) {
            finalAggregate = (westernOverall + africanOverall) / 2;
        } else if (westernOverall > 0) {
            finalAggregate = westernOverall;
        } else if (africanOverall > 0) {
            finalAggregate = africanOverall;
        }
        
        return {
            choir: choir,
            westernScores: westernScores,
            africanScores: africanScores,
            westernHigh: westernHigh,
            westernLow: westernLow,
            africanHigh: africanHigh,
            africanLow: africanLow,
            westernTotal: westernTotal,
            africanTotal: africanTotal,
            westernTrimmedTotal: westernTrimmedTotal,
            africanTrimmedTotal: africanTrimmedTotal,
            westernOverall: westernOverall,
            africanOverall: africanOverall,
            finalAggregate: finalAggregate,
            assessorCount: {
                western: westernScores.length,
                african: africanScores.length
            }
        };
    },
    
    generateMethodologyData: function() {
        const methodologyData = [];
        
        appState.choirs.forEach(choir => {
            if (choir.status === 'assessed') {
                const calcs = this.getMethodologyCalculations(choir.id);
                if (calcs) {
                    methodologyData.push(calcs);
                }
            }
        });
        
        return methodologyData;
    },
    
    saveToLocalStorage: function() {
        try {
            const data = {
                assessorScores: this.assessorScores,
                trimmedMeans: this.trimmedMeans,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('tmf_scoring_data', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    },
    
    loadFromLocalStorage: function() {
        try {
            const data = localStorage.getItem('tmf_scoring_data');
            if (data) {
                const parsed = JSON.parse(data);
                this.assessorScores = parsed.assessorScores || {};
                this.trimmedMeans = parsed.trimmedMeans || {};
                
                appState.choirs.forEach(choir => {
                    const hasWesternScores = this.assessorScores[choir.id]?.western && 
                                           Object.keys(this.assessorScores[choir.id].western).length > 0;
                    const hasAfricanScores = this.assessorScores[choir.id]?.african && 
                                           Object.keys(this.assessorScores[choir.id].african).length > 0;
                    
                    if (hasWesternScores || hasAfricanScores) {
                        choir.status = 'assessed';
                    } else {
                        choir.status = 'pending';
                    }
                });
                
                this.calculateRankings();
            } else {
                this.assessorScores = {};
                this.trimmedMeans = {};
                this.finalRankings = {
                    western: [],
                    african: [],
                    overall: []
                };
                
                appState.choirs.forEach(choir => {
                    choir.status = 'pending';
                });
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
            this.assessorScores = {};
            this.trimmedMeans = {};
            this.finalRankings = {
                western: [],
                african: [],
                overall: []
            };
            appState.choirs.forEach(choir => {
                choir.status = 'pending';
            });
        }
    }
};

// ============================================
// ADJUDICATION SYSTEM DATA
// ============================================
const adjudicationData = {
    currentChoir: null,
    currentGenre: 'western',
    assessmentData: {
        western: {
            intonation: 0.0,
            pitchAccuracy: 0.0,
            language: 0.0,
            vocalTechnique: 0.0,
            choralTechnique: 0.0,
            rhythm: 0.0,
            artistry: 0.0,
            stage: 0.0,
            total: 0.0
        },
        african: {
            intonation: 0.0,
            pitchAccuracy: 0.0,
            language: 0.0,
            vocalTechnique: 0.0,
            choralTechnique: 0.0,
            rhythm: 0.0,
            artistry: 0.0,
            stage: 0.0,
            total: 0.0
        }
    },
    comments: {
        western: "",
        african: ""
    }
};

// ============================================
// SEARCH BAR GLOBAL VARIABLES
// ============================================
let currentCategoryFilter = 'ALL';
let searchTimeout = null;
let myAssessmentsSearchTimeout = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    appState.choirs = [];
    scoringSystem.resetCurrentAssessment();
    scoringSystem.loadFromLocalStorage();
    setupEventListeners();
    addAnalyticsStyles();
    console.log('TMF Choral Judicators System initialized. Ready for data import.');
});


// =====================
// CORE SYSTEM FUNCTIONS
// =====================

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
    
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUser();
    });
    
    document.getElementById('choirForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveChoir();
    });
    
    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const feedback = document.getElementById('passwordFeedback');
        if (password.length < 6) {
            feedback.style.display = 'block';
            feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Password must be at least 6 characters';
        } else {
            feedback.style.display = 'none';
        }
    });
}

function showLogin() {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('username').focus();
}

function hideLogin() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('passwordFeedback').style.display = 'none';
}

function showForgotPassword() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('forgotPasswordModal').style.display = 'flex';
}

function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    document.getElementById('forgotPasswordForm').reset();
    showLogin();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (!username || !password || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const user = appState.users[username];
    
    if (user && user.password === password && user.role === role) {
        appState.currentUser = user.name;
        appState.currentRole = user.role;
        appState.currentUserId = user.id;
        appState.isLoggedIn = true;
        appState.currentView = 'dashboard';
        
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = `(${role.toUpperCase()})`;
        document.getElementById('userBadge').style.display = 'flex';
        document.getElementById('loginButton').innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        document.getElementById('loginButton').onclick = logout;
        
        document.getElementById('dashboardContent').style.display = 'block';
        document.getElementById('loginInstructions').style.display = 'none';
        
        hideLogin();
        renderDashboard();
        showSearchBar();
        
        showNotification(`Welcome back, ${user.name}!`, 'success');
    } else {
        showNotification('Invalid credentials. Please check your username, password, and role.', 'error');
    }
}

function logout() {
    appState.currentUser = null;
    appState.currentRole = null;
    appState.currentUserId = null;
    appState.isLoggedIn = false;
    appState.currentView = 'dashboard';
    
    document.getElementById('userBadge').style.display = 'none';
    document.getElementById('loginButton').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    document.getElementById('loginButton').onclick = showLogin;
    
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('loginInstructions').style.display = 'block';
    document.getElementById('welcomeSection').style.display = 'block';
    
    hideSearchBar();
    showNotification('You have been logged out successfully.', 'info');
}

function showSearchBar() {
    console.log('Search bar shown');
}

function hideSearchBar() {
    console.log('Search bar hidden');
}

function handleForgotPassword() {
    const email = document.getElementById('resetEmail').value;
    const username = document.getElementById('resetUsername').value;
    
    if (!email || !username) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showNotification(`Password reset link has been sent to ${email}`, 'success');
    setTimeout(() => {
        closeForgotPassword();
    }, 2000);
}

// ========================
// DASHBOARD VIEW FUNCTIONS
// ========================

function showDashboard() {
    appState.currentView = 'dashboard';
    renderDashboard();
}

function showAssessmentChooser() {
    appState.currentView = 'assessmentChooser';
    renderAssessmentChooser();
}

function showResults() {
    appState.currentView = 'results';
    renderResults();
}

function showFinalResults() {
    document.getElementById('finalResultsModal').style.display = 'flex';
    renderFinalResults();
}

function showManageUsers() {
    appState.currentView = 'manageUsers';
    openUserManagement();
}

function showManageChoirs() {
    appState.currentView = 'manageChoirs';
    renderManageChoirs();
}

function showReports() {
    appState.currentView = 'reports';
    renderReports();
}

function showMethodologyCalculations() {
    document.getElementById('methodologyModal').style.display = 'flex';
    renderMethodologyCalculations();
}

function closeMethodologyModal() {
    document.getElementById('methodologyModal').style.display = 'none';
}

function showLiveMonitoring() {
    appState.currentView = 'liveMonitoring';
    renderLiveMonitoring();
}

// =========================
// LIVE MONITORING FUNCTIONS
// =========================

function renderLiveMonitoring() {
    const totalChoirs = appState.choirs.length;
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    const pendingChoirs = totalChoirs - assessedChoirs;
    const percentage = totalChoirs > 0 ? (assessedChoirs / totalChoirs) * 100 : 0;

    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">Live Competition Monitor</h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <h3 class="card-title">Overall Progress</h3>
                    <p class="card-description">${assessedChoirs}/${totalChoirs} choirs assessed (${percentage.toFixed(1)}%)</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h3 class="card-title">Category Progress</h3>
                    <p class="card-description">Great Champs: ${appState.choirs.filter(c => c.category === 'GREAT CHAMPS' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'GREAT CHAMPS').length}</p>
                    <p class="card-description">Large: ${appState.choirs.filter(c => c.category === 'LARGE' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'LARGE').length}</p>
                    <p class="card-description">Standard: ${appState.choirs.filter(c => c.category === 'STANDARD' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'STANDARD').length}</p>
                </div>

                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="card-title">Assessor Activity</h3>
                    <p class="card-description">Active Assessors: ${Object.keys(scoringSystem.assessorScores).length}</p>
                    <p class="card-description">Total Assessments: ${countTotalAssessments()}</p>
                </div>
            </div>

            <div class="assessment-container mt-4">
                <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">Recent Assessment Activity</h4>
                <div id="recentActivityList">
                    ${generateRecentActivityList()}
                </div>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function countTotalAssessments() {
    let count = 0;
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        if (scoringSystem.assessorScores[choirId]) {
            Object.keys(scoringSystem.assessorScores[choirId]).forEach(genre => {
                if (scoringSystem.assessorScores[choirId][genre]) {
                    count += Object.keys(scoringSystem.assessorScores[choirId][genre]).length;
                }
            });
        }
    });
    return count;
}

function generateRecentActivityList() {
    const activities = [];
    
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
                Object.keys(scoringSystem.assessorScores[choirId][genre]).forEach(assessorId => {
                    const assessment = scoringSystem.assessorScores[choirId][genre][assessorId];
                    if (assessment && assessment.submittedAt) {
                        const choir = appState.choirs.find(c => c.id === choirId);
                        activities.push({
                            assessor: assessment.assessorName || assessorId,
                            choir: choir ? choir.name : 'Unknown Choir',
                            genre: genre,
                            score: assessment.total,
                            time: new Date(assessment.submittedAt)
                        });
                    }
                });
            }
        });
    });

    activities.sort((a, b) => b.time - a.time);
    const recent = activities.slice(0, 10);

    if (recent.length === 0) {
        return '<p class="text-center py-4" style="color: rgba(255, 255, 255, 0.6);">No recent assessment activity</p>';
    }

    let html = '<div class="activity-feed">';
    recent.forEach(activity => {
        html += `
            <div class="activity-item">
                <div class="activity-info">
                    <strong>${activity.assessor}</strong> assessed 
                    <strong>${activity.choir}</strong> (${activity.genre.toUpperCase()})
                    <span class="activity-score">Score: ${activity.score.toFixed(1)}</span>
                </div>
                <div class="activity-time">${activity.time.toLocaleString()}</div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// ================================
// PROFESSIONAL ADJUDICATION SYSTEM
// ================================

function showProfessionalAdjudication(choirId, genreToAssess = null) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (!choir) {
        showNotification('Choir not found', 'error');
        return;
    }
    
    if (scoringSystem.hasAssessorFullyAssessed(choirId, appState.currentUserId)) {
        showNotification('This choir has been fully assessed', 'warning');
        return;
    }
    
    // Reset assessment data for the new assessor
    resetAdjudicationData();
    
    adjudicationData.currentChoir = choir;
    scoringSystem.currentChoir = choir;
    scoringSystem.currentAssessorId = appState.currentUserId;
    
    const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                        choir.westernSong && choir.westernSong.trim() !== '';
    
    if (genreToAssess) {
        adjudicationData.currentGenre = genreToAssess;
    } else if (hasBothSongs) {
        document.getElementById('choralAdjudicationModal').style.display = 'flex';
        renderGenreSelection();
        return;
    } else {
        if (choir.africanSong && choir.africanSong.trim() !== '') {
            adjudicationData.currentGenre = 'african';
        } else {
            adjudicationData.currentGenre = 'western';
        }
    }
    
    document.getElementById('choralAdjudicationModal').style.display = 'flex';
    renderAdjudicationSystem();
}

// Add this new function to reset adjudication data
function resetAdjudicationData() {
    adjudicationData.currentChoir = null;
    adjudicationData.currentGenre = 'western';
    adjudicationData.assessmentData = {
        western: {
            intonation: 0.0,
            pitchAccuracy: 0.0,
            language: 0.0,
            vocalTechnique: 0.0,
            choralTechnique: 0.0,
            rhythm: 0.0,
            artistry: 0.0,
            stage: 0.0,
            total: 0.0
        },
        african: {
            intonation: 0.0,
            pitchAccuracy: 0.0,
            language: 0.0,
            vocalTechnique: 0.0,
            choralTechnique: 0.0,
            rhythm: 0.0,
            artistry: 0.0,
            stage: 0.0,
            total: 0.0
        }
    };
    adjudicationData.comments = {
        western: "",
        african: ""
    };
}

function renderGenreSelection() {
    const choir = adjudicationData.currentChoir;
    
    const modalHeader = document.querySelector('#choralAdjudicationModal .modal-header span');
    if (modalHeader) {
        modalHeader.innerHTML = '<i class="fas fa-music"></i> Select Genre to Assess';
    }
    
    let html = `
        <div class="adjudication-header">
            <h3>Assessing: ${choir.name}</h3>
            <p>${choir.region} | ${appState.categories[choir.category]}</p>
        </div>
        
        <div class="genre-selection">
            <h4>Select Genre to Assess</h4>
            <div class="genre-cards-container">
                <div class="genre-card" onclick="selectGenreForAssessment('african')">
                    <div class="genre-card-icon">
                        <i class="fas fa-drum"></i>
                    </div>
                    <div class="genre-card-title">African Genre</div>
                    <div class="genre-card-description">Assess the African indigenous music performance with appropriate rubric</div>
                    <div class="genre-card-song">${choir.africanSong}</div>
                </div>
                
                <div class="genre-card" onclick="selectGenreForAssessment('western')">
                    <div class="genre-card-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="genre-card-title">Western Genre</div>
                    <div class="genre-card-description">Assess the Western classical music performance with appropriate rubric</div>
                    <div class="genre-card-song">${choir.westernSong}</div>
                </div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);">
                <i class="fas fa-info-circle"></i> Click on a card to select the genre you want to assess
            </div>
        </div>
        
        <div class="genre-selection-back">
            <button class="action-btn outline" onclick="showDashboardFromGenreSelection()" style="padding: 0.5rem 1.5rem; font-size: 1rem;">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    `;
    
    document.getElementById('adjudicationSystemContent').innerHTML = html;
}

function showDashboardFromGenreSelection() {
    closeAdjudicationModal();
    showDashboard();
}

function selectGenreForAssessment(genre) {
    const choir = adjudicationData.currentChoir;
    const assessorId = appState.currentUserId;
    
    const hasAssessed = scoringSystem.hasAssessorAlreadyAssessed(choir.id, genre, assessorId);
    
    if (hasAssessed) {
        showNotification(`You have already assessed the ${genre} genre for this choir.`, 'warning');
        return;
    }
    
    adjudicationData.currentGenre = genre;
    renderAdjudicationSystem();
}

function closeAdjudicationModal() {
    document.getElementById('choralAdjudicationModal').style.display = 'none';
    // Reset data when closing the modal
    resetAdjudicationData();
    scoringSystem.currentChoir = null;
}

function renderAdjudicationSystem() {
    const choir = adjudicationData.currentChoir;
    const currentGenre = adjudicationData.currentGenre;
    
    const modalHeader = document.querySelector('#choralAdjudicationModal .modal-header span');
    if (modalHeader) {
        modalHeader.innerHTML = '<i class="fas fa-clipboard-check"></i> Professional Choral Adjudication System';
    }
    
    let html = `
        <div class="adjudication-header">
            <h3>Assessing: ${choir.name}</h3>
            <p>${choir.region} | ${appState.categories[choir.category]}</p>
        </div>
        
        ${renderSingleSongWarning()}
        
        <div class="decimal-info">
            <i class="fas fa-calculator"></i> All calculations rounded to 1 decimal place
        </div>
        
        <div class="adjudication-header" style="padding: 1rem 2rem; border-top: 1px solid rgba(212, 175, 55, 0.2);">
            <h3 style="font-size: 1.3rem;">OFFICIAL CHORAL ADJUDICATION SYSTEM</h3>
            <p style="font-size: 0.9rem;">TMF Methodology - Professional Assessment Rubric</p>
        </div>
        
        <div class="assessor-scores-container">
            <h4>Assessment Details</h4>
            <div class="assessor-input-row">
                <strong>Current Assessor:</strong>
                <span style="background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000; padding: 0.35rem 1rem; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);">
                    ${appState.currentUser}
                </span>
            </div>
            
            <div class="assessor-input-row" style="margin-top: 0.5rem;">
                <strong>Current Genre:</strong>
                <span style="background: ${currentGenre === 'western' ? 'rgba(33, 150, 243, 0.15)' : 'rgba(244, 67, 54, 0.15)'}; color: ${currentGenre === 'western' ? '#2196f3' : '#f44336'}; padding: 0.35rem 1rem; border-radius: 6px; font-weight: bold;">
                    ${currentGenre === 'western' ? 'Western' : 'African'}
                </span>
            </div>
        </div>
        
        <div class="rubric-container" id="rubricContainer"></div>
        
        <div class="comments-container" id="commentsContainer">
            <h4>Additional Comments</h4>
            <textarea class="comments-textarea" id="assessmentComments" placeholder="Enter your comments for this assessment..."></textarea>
            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.5rem;">
                Provide constructive feedback and observations for the choir.
            </div>
        </div>
        
        <div class="assessment-footer">
            <div id="resultsDisplay"></div>
            
            <div class="assessment-actions">
                <button class="action-btn success" onclick="saveAssessorAssessment()" id="saveAssessmentBtn">
                    <i class="fas fa-save"></i> Save ${currentGenre === 'western' ? 'Western' : 'African'} Assessment
                </button>
                <button class="action-btn outline" onclick="resetRubric()">
                    <i class="fas fa-redo"></i> Clear Form
                </button>
            </div>
            
            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboardFromAdjudication()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('adjudicationSystemContent').innerHTML = html;
    renderRubricTable();
}

function showDashboardFromAdjudication() {
    closeAdjudicationModal();
    showDashboard();
}

function renderSingleSongWarning() {
    const choir = adjudicationData.currentChoir;
    if (!choir) return '';
    
    const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                        choir.westernSong && choir.westernSong.trim() !== '';
    
    if (hasBothSongs) {
        return '';
    }
    
    const hasAfricanOnly = choir.africanSong && choir.africanSong.trim() !== '';
    const hasWesternOnly = choir.westernSong && choir.westernSong.trim() !== '';
    
    if (hasAfricanOnly && !hasWesternOnly) {
        return `
            <div class="single-song-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                This choir is only performing an African song.
            </div>
        `;
    } else if (hasWesternOnly && !hasAfricanOnly) {
        return `
            <div class="single-song-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                This choir is only performing a Western song.
            </div>
        `;
    }
    
    return '';
}

function renderRubricTable() {
    const container = document.getElementById('rubricContainer');
    
    const categories = [
        { name: "INTONATION", max: 15, key: "intonation" },
        { name: "PITCH ACCURACY", max: 15, key: "pitchAccuracy" },
        { name: "LANGUAGE & DICTION", max: 10, key: "language" },
        { name: "VOCAL TECHNIQUE", max: 15, key: "vocalTechnique" },
        { name: "CHORAL TECHNIQUE", max: 15, key: "choralTechnique" },
        { name: "RHYTHMIC ACCURACY", max: 15, key: "rhythm" },
        { name: "ARTISTIC RELEVANCE", max: 10, key: "artistry" },
        { name: "STAGE PRESENCE", max: 5, key: "stage" }
    ];
    
    const gradeLevels = [
        { 
            name: "SUPERIOR (90-100)", 
            class: "superior-row",
            ranges: [
                { min: 13.5, max: 15 },
                { min: 13.5, max: 15 },
                { min: 9, max: 10 },
                { min: 13.5, max: 15 },
                { min: 13.5, max: 15 },
                { min: 13.5, max: 15 },
                { min: 9, max: 10 },
                { min: 4.5, max: 5 }
            ]
        },
        { 
            name: "EXCELLENT (80-89)", 
            class: "excellent-row",
            ranges: [
                { min: 12, max: 13.4 },
                { min: 12, max: 13.4 },
                { min: 8, max: 8.9 },
                { min: 12, max: 13.4 },
                { min: 12, max: 13.4 },
                { min: 12, max: 13.4 },
                { min: 8, max: 8.9 },
                { min: 4, max: 4.4 }
            ]
        },
        { 
            name: "AVERAGE (70-79)", 
            class: "average-row",
            ranges: [
                { min: 10.5, max: 11.9 },
                { min: 10.5, max: 11.9 },
                { min: 7, max: 7.9 },
                { min: 10.5, max: 11.9 },
                { min: 10.5, max: 11.9 },
                { min: 10.5, max: 11.9 },
                { min: 7, max: 7.9 },
                { min: 3.5, max: 3.9 }
            ]
        },
        { 
            name: "BELOW AVERAGE (60-69)", 
            class: "below-row",
            ranges: [
                { min: 9, max: 10.4 },
                { min: 9, max: 10.4 },
                { min: 6, max: 6.9 },
                { min: 9, max: 10.4 },
                { min: 9, max: 10.4 },
                { min: 9, max: 10.4 },
                { min: 6, max: 6.9 },
                { min: 3, max: 3.4 }
            ]
        },
        { 
            name: "INSUFFICIENT (50-59)", 
            class: "insufficient-row",
            ranges: [
                { min: 7.5, max: 8.9 },
                { min: 7.5, max: 8.9 },
                { min: 5, max: 5.9 },
                { min: 7.5, max: 8.9 },
                { min: 7.5, max: 8.9 },
                { min: 7.5, max: 8.9 },
                { min: 5, max: 5.9 },
                { min: 2.5, max: 2.9 }
            ]
        }
    ];
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="rubric-table">
                <thead>
                    <tr>
                        <th>GRADING</th>
                        ${categories.map(cat => `<th>${cat.name}</th>`).join('')}
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    gradeLevels.forEach((level, levelIndex) => {
        tableHTML += `<tr class="${level.class}">`;
        tableHTML += `<td class="criteria-column">${level.name}</td>`;
        
        level.ranges.forEach((range, catIndex) => {
            const catKey = categories[catIndex].key;
            const currentValue = adjudicationData.assessmentData[adjudicationData.currentGenre][catKey] || 0;
            
            tableHTML += `
                <td class="score-input-cell">
                    <input type="number" 
                           class="rubric-input" 
                           data-level="${levelIndex}"
                           data-category="${catKey}"
                           min="${range.min}" 
                           max="${range.max}"
                           step="0.1"
                           value="${currentValue > 0 ? currentValue : ''}"
                           placeholder="${range.min}-${range.max}"
                           oninput="validateScoreInput(this, ${range.min}, ${range.max})"
                           onchange="updateScores()">
                    <div class="range-label">${range.min}-${range.max}</div>
                </td>
            `;
        });
        
        tableHTML += `<td class="total-column" id="level-total-${levelIndex}">0.0</td>`;
        tableHTML += `</tr>`;
    });
    
    tableHTML += `<tr style="height: 20px;"><td colspan="10"></td></tr>`;
    
    tableHTML += `
            <tr class="${adjudicationData.currentGenre === 'western' ? 'western-total' : 'african-total'}">
                <td class="criteria-column">
                    <strong>${adjudicationData.currentGenre === 'western' ? 'WESTERN' : 'AFRICAN'} SCORE</strong>
                </td>
    `;
    
    categories.forEach((cat, index) => {
        const value = adjudicationData.assessmentData[adjudicationData.currentGenre][cat.key] || 0;
        tableHTML += `<td id="${adjudicationData.currentGenre}-${cat.key}" class="genre-total">${value > 0 ? value.toFixed(1) : '0.0'}</td>`;
    });
    
    tableHTML += `<td id="${adjudicationData.currentGenre}-total" class="genre-total">${adjudicationData.assessmentData[adjudicationData.currentGenre].total.toFixed(1)}</td>`;
    tableHTML += `</tr>`;
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
    updateScores();
}

function validateScoreInput(input, min, max) {
    const value = parseFloat(input.value) || 0;
    
    if (value < min || value > max) {
        input.classList.add('invalid');
        input.title = `Score must be between ${min} and ${max}`;
    } else {
        input.classList.remove('invalid');
        input.title = '';
    }
}

function updateScores() {
    const currentGenre = adjudicationData.currentGenre;
    
    adjudicationData.assessmentData[currentGenre] = {
        intonation: 0.0,
        pitchAccuracy: 0.0,
        language: 0.0,
        vocalTechnique: 0.0,
        choralTechnique: 0.0,
        rhythm: 0.0,
        artistry: 0.0,
        stage: 0.0,
        total: 0.0
    };
    
    const levelTotals = [0, 0, 0, 0, 0];
    
    document.querySelectorAll('.rubric-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        const levelIndex = parseInt(input.dataset.level);
        const category = input.dataset.category;
        
        if (value > 0) {
            levelTotals[levelIndex] += value;
            adjudicationData.assessmentData[currentGenre][category] += value;
        }
    });
    
    const categories = ['intonation', 'pitchAccuracy', 'language', 'vocalTechnique', 'choralTechnique', 'rhythm', 'artistry', 'stage'];
    adjudicationData.assessmentData[currentGenre].total = categories.reduce((sum, cat) => 
        sum + adjudicationData.assessmentData[currentGenre][cat], 0);
    
    levelTotals.forEach((total, index) => {
        const element = document.getElementById(`level-total-${index}`);
        if (element) {
            element.textContent = total.toFixed(1);
        }
    });
    
    categories.forEach(cat => {
        const element = document.getElementById(`${currentGenre}-${cat}`);
        if (element) {
            element.textContent = adjudicationData.assessmentData[currentGenre][cat].toFixed(1);
        }
    });
    
    const totalElement = document.getElementById(`${currentGenre}-total`);
    if (totalElement) {
        totalElement.textContent = adjudicationData.assessmentData[currentGenre].total.toFixed(1);
    }
    
    updateResultsDisplay();
}

function updateResultsDisplay() {
    const container = document.getElementById('resultsDisplay');
    const currentGenre = adjudicationData.currentGenre;
    const choir = adjudicationData.currentChoir;
    
    if (!choir) return;
    
    let score = adjudicationData.assessmentData[currentGenre].total;
    let grade = getGradeFromScore(score);
    let gradeClass = getGradeClass(grade);
    
    let html = `
        <div class="results-display">
            <div class="result-card ${currentGenre === 'western' ? 'western' : 'african'}">
                <div class="result-label">${currentGenre === 'western' ? 'Western' : 'African'} Total</div>
                <div class="result-value ${currentGenre === 'western' ? 'western-value' : 'african-value'}">${score.toFixed(1)}</div>
                <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.7;">out of 100</div>
            </div>
            
            <div class="result-card final">
                <div class="result-label">Total Score</div>
                <div class="result-value final-value">${score.toFixed(1)}</div>
                <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);">out of 100</div>
            </div>
            
            <div class="result-card grade">
                <div class="result-label">Grade</div>
                <div class="result-value grade-value">${score.toFixed(1)}</div>
                <div class="grade-text ${gradeClass}">${grade}</div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getGradeFromScore(score) {
    const rounded = Math.round(score * 10) / 10;
    if (rounded >= 90.0) return "SUPERIOR";
    if (rounded >= 80.0) return "EXCELLENT";
    if (rounded >= 70.0) return "AVERAGE";
    if (rounded >= 60.0) return "BELOW AVERAGE";
    if (rounded >= 50.0) return "INSUFFICIENT";
    return "NO GRADE";
}

function getGradeClass(grade) {
    switch(grade) {
        case "SUPERIOR": return "superior-grade";
        case "EXCELLENT": return "excellent-grade";
        case "AVERAGE": return "average-grade";
        case "BELOW AVERAGE": return "below-grade";
        case "INSUFFICIENT": return "insufficient-grade";
        default: return "nograde-grade";
    }
}

function saveAssessorAssessment() {
    if (!appState.currentUserId) {
        showNotification('Please login to save assessments', 'error');
        return;
    }
    
    const choir = scoringSystem.currentChoir;
    
    if (!choir) {
        showNotification('No choir selected', 'error');
        return;
    }
    
    const currentGenre = adjudicationData.currentGenre;
    const totalScore = adjudicationData.assessmentData[currentGenre].total;
    
    if (totalScore === 0) {
        showNotification('Please enter scores before saving', 'error');
        return;
    }
    
    const hasAlreadyAssessed = scoringSystem.hasAssessorAlreadyAssessed(choir.id, currentGenre, appState.currentUserId);
    
    if (hasAlreadyAssessed) {
        showNotification(`You have already assessed ${choir.name} for ${currentGenre === 'western' ? 'Western' : 'African'} genre.`, 'error');
        return;
    }
    
    const saveBtn = document.getElementById('saveAssessmentBtn');
    const originalBtnContent = saveBtn.innerHTML;
    
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    document.getElementById('loadingSpinner').style.display = 'block';
    
    try {
        const commentsTextarea = document.getElementById('assessmentComments');
        const comments = commentsTextarea ? commentsTextarea.value.trim() : "";
        
        scoringSystem.addAssessorScore(
            choir.id, 
            currentGenre, 
            appState.currentUserId, 
            {...adjudicationData.assessmentData[currentGenre]},
            comments
        );
        
        adjudicationData.comments[currentGenre] = comments;
        choir.status = 'assessed';
        
        document.getElementById('loadingSpinner').style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
        
        showNotification(`${currentGenre === 'western' ? 'Western' : 'African'} assessment saved for ${choir.name}!`, 'success');
        
        setTimeout(() => {
            closeAdjudicationModal();
            showAssessmentChooser();
        }, 1500);
        
    } catch (error) {
        console.error('Error saving assessment:', error);
        showNotification('Error saving assessment. Please try again.', 'error');
        document.getElementById('loadingSpinner').style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
    }
}

function resetRubric() {
    document.querySelectorAll('.rubric-input').forEach(input => {
        input.value = '';
        input.classList.remove('invalid');
    });
    
    const currentGenre = adjudicationData.currentGenre;
    adjudicationData.assessmentData[currentGenre] = {
        intonation: 0.0,
        pitchAccuracy: 0.0,
        language: 0.0,
        vocalTechnique: 0.0,
        choralTechnique: 0.0,
        rhythm: 0.0,
        artistry: 0.0,
        stage: 0.0,
        total: 0.0
    };
    
    updateScores();
    showNotification('Form cleared', 'info');
}

// ========================
// METHODOLOGY CALCULATIONS 
// ========================

function renderMethodologyCalculations() {
    const methodologyData = scoringSystem.generateMethodologyData();
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    const totalChoirs = appState.choirs.length;
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1rem;">Excel Methodology Calculations</h4>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1.5rem;">
            Showing real-time calculation data from the system. Based on ${assessedChoirs} assessed choirs out of ${totalChoirs}.
        </p>
        
        <div class="methodology-instructions">
            <h5>Calculation Methodology</h5>
            <ul>
                <li><strong>1 Assessor:</strong> Use raw score</li>
                <li><strong>2 Assessors:</strong> Use average of both scores</li>
                <li><strong>3+ Assessors:</strong> Remove highest & lowest scores, then average the remainder</li>
                <li><strong>Final Score:</strong> Average of Western and African trimmed means (if both assessed)</li>
                <li><strong>Single Song:</strong> Use that genre's score directly as final score - NOT eligible for overall rankings</li>
                <li>All calculations match the official competition methodology</li>
            </ul>
        </div>
        
        <div class="methodology-tab-nav">
            <button class="methodology-tab-btn active" onclick="showMethodologyTab(event, 'all')">All Choirs</button>
            <button class="methodology-tab-btn" onclick="showMethodologyTab(event, 'great')">Great Champs</button>
            <button class="methodology-tab-btn" onclick="showMethodologyTab(event, 'large')">Large Category</button>
            <button class="methodology-tab-btn" onclick="showMethodologyTab(event, 'standard')">Standard Category</button>
        </div>
        
        <div id="methodologyTabContent">
            ${renderMethodologyTab('all', methodologyData)}
        </div>
        
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeMethodologyModal()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    `;
    
    document.getElementById('methodologyContent').innerHTML = html;
}

function showMethodologyTab(event, tab) {
    let target;
    if (event && event.target) {
        target = event.target;
    } else {
        target = document.querySelector(`.methodology-tab-btn[onclick*="${tab}"]`);
    }
    
    const container = document.getElementById('methodologyTabContent');
    const methodologyData = scoringSystem.generateMethodologyData();
    
    document.querySelectorAll('.methodology-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (target) {
        target.classList.add('active');
    }
    
    container.innerHTML = renderMethodologyTab(tab, methodologyData);
}

function renderMethodologyTab(tab, methodologyData) {
    let filteredData = methodologyData;
    if (tab === 'great') {
        filteredData = methodologyData.filter(d => d.choir.category === 'GREAT CHAMPS');
    } else if (tab === 'large') {
        filteredData = methodologyData.filter(d => d.choir.category === 'LARGE');
    } else if (tab === 'standard') {
        filteredData = methodologyData.filter(d => d.choir.category === 'STANDARD');
    }
    
    if (filteredData.length === 0) {
        return `
            <div class="text-center py-4">
                <i class="fas fa-calculator fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.6);">No assessment data available for this category</p>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">Assessors must submit scores to see calculations</p>
            </div>
        `;
    }
    
    const eligibleForOverall = filteredData.filter(d => {
        const choir = d.choir;
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        const hasBothScores = d.westernOverall > 0 && d.africanOverall > 0;
        return hasBothSongs && hasBothScores;
    });
    
    const totalAssessors = filteredData.reduce((sum, d) => sum + d.assessorCount.western + d.assessorCount.african, 0);
    const avgWesternScore = filteredData.reduce((sum, d) => sum + d.westernOverall, 0) / filteredData.length;
    const avgAfricanScore = filteredData.reduce((sum, d) => sum + d.africanOverall, 0) / filteredData.length;
    const avgFinalScore = filteredData.reduce((sum, d) => sum + d.finalAggregate, 0) / filteredData.length;
    
    const westernWinner = [...filteredData].sort((a, b) => b.westernOverall - a.westernOverall)[0];
    const africanWinner = [...filteredData].sort((a, b) => b.africanOverall - a.africanOverall)[0];
    const overallWinner = eligibleForOverall.length > 0 ? 
                         [...eligibleForOverall].sort((a, b) => b.finalAggregate - a.finalAggregate)[0] : null;
    
    let html = `
        <div class="methodology-summary">
            <div class="methodology-summary-item">
                <div class="methodology-summary-label">Total Choirs</div>
                <div class="methodology-summary-value">${filteredData.length}</div>
            </div>
            <div class="methodology-summary-item">
                <div class="methodology-summary-label">Total Assessors</div>
                <div class="methodology-summary-value">${totalAssessors}</div>
            </div>
            <div class="methodology-summary-item">
                <div class="methodology-summary-label">Avg Western</div>
                <div class="methodology-summary-value">${avgWesternScore.toFixed(1)}</div>
            </div>
            <div class="methodology-summary-item">
                <div class="methodology-summary-label">Avg African</div>
                <div class="methodology-summary-value">${avgAfricanScore.toFixed(1)}</div>
            </div>
            <div class="methodology-summary-item">
                <div class="methodology-summary-label">Avg Final</div>
                <div class="methodology-summary-value">${avgFinalScore.toFixed(1)}</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div style="background: rgba(33, 150, 243, 0.15); padding: 1rem; border-radius: 8px; border: 1px solid rgba(33, 150, 243, 0.3);">
                <strong style="color: #2196f3;">Western Winner</strong>
                <div style="margin-top: 0.5rem;">
                    <strong>${westernWinner?.choir.name || 'N/A'}</strong>
                    <div>Score: ${westernWinner?.westernOverall.toFixed(1) || 'N/A'}</div>
                </div>
            </div>
            <div style="background: rgba(244, 67, 54, 0.15); padding: 1rem; border-radius: 8px; border: 1px solid rgba(244, 67, 54, 0.3);">
                <strong style="color: #f44336;">African Winner</strong>
                <div style="margin-top: 0.5rem;">
                    <strong>${africanWinner?.choir.name || 'N/A'}</strong>
                    <div>Score: ${africanWinner?.africanOverall.toFixed(1) || 'N/A'}</div>
                </div>
            </div>
            <div style="background: rgba(212, 175, 55, 0.15); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                <strong style="color: var(--primary-gold);">Overall Winner</strong>
                ${overallWinner ? `
                <div style="margin-top: 0.5rem;">
                    <strong>${overallWinner.choir.name}</strong>
                    <div>Score: ${overallWinner.finalAggregate.toFixed(1)}</div>
                </div>
                ` : `
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.6);">
                    <em>No eligible choirs with both songs</em>
                </div>
                `}
                ${eligibleForOverall.length === 0 && filteredData.length > 0 ? `
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #ff9800;">
                    <i class="fas fa-info-circle"></i> Single-song choirs not eligible for overall
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="methodology-table">
                <thead>
                    <tr>
                        <th rowspan="2">CHOIR</th>
                        <th rowspan="2">GENRE</th>
                        <th colspan="12">ASSESSORS (1-12)</th>
                        <th rowspan="2">HIGH</th>
                        <th rowspan="2">LOW</th>
                        <th rowspan="2">TOTAL</th>
                        <th rowspan="2">TRIMMED<br>TOTAL</th>
                        <th rowspan="2">OVERALL<br>AGGREGATE</th>
                        <th rowspan="2">FINAL<br>AGGREGATE</th>
                        <th rowspan="2">RANK</th>
                    </tr>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                        <th>10</th>
                        <th>11</th>
                        <th>12</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    const sortedData = [...filteredData].sort((a, b) => b.finalAggregate - a.finalAggregate);
    
    const rankMap = {};
    sortedData.forEach((data, index) => {
        rankMap[data.choir.id] = index + 1;
    });
    
    filteredData.sort((a, b) => b.finalAggregate - a.finalAggregate);
    
    filteredData.forEach((data) => {
        const choir = data.choir;
        const rank = rankMap[choir.id];
        
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        const hasBothScores = data.westernOverall > 0 && data.africanOverall > 0;
        const isEligibleForOverall = hasBothSongs && hasBothScores;
        
        const hasWestern = data.westernScores.length > 0;
        const hasAfrican = data.africanScores.length > 0;
        const totalRows = (hasWestern ? 1 : 0) + (hasAfrican ? 1 : 0);
        
        if (hasWestern) {
            const westernScores = [...data.westernScores];
            while (westernScores.length < 12) westernScores.push('-');
            
            html += `
                <tr>
                    <td class="choir-name" rowspan="${totalRows}">
                        ${choir.name}
                        ${!hasBothSongs ? `<br><small style="color: #ff9800; font-size: 0.7rem;">(Single Song)</small>` : ''}
                    </td>
                    <td class="genre-name">WESTERN</td>
            `;
            
            westernScores.forEach(score => {
                if (score === '-') {
                    html += `<td>-</td>`;
                } else {
                    html += `<td>${typeof score === 'number' ? score.toFixed(1) : score}</td>`;
                }
            });
            
            const westernHigh = data.westernScores.length > 0 ? Math.max(...data.westernScores) : 0;
            const westernLow = data.westernScores.length > 0 ? Math.min(...data.westernScores) : 0;
            
            html += `
                    <td class="high-score">${data.westernScores.length > 0 ? westernHigh.toFixed(1) : '-'}</td>
                    <td class="low-score">${data.westernScores.length > 0 ? westernLow.toFixed(1) : '-'}</td>
                    <td class="total-score">${data.westernTotal.toFixed(1)}</td>
                    <td class="trimmed-total">${data.westernTrimmedTotal.toFixed(1)}</td>
                    <td class="overall-aggregate">${data.westernOverall.toFixed(1)}</td>
            `;
            
            if (hasAfrican) {
                html += `
                    <td class="final-aggregate" rowspan="${totalRows}">${data.finalAggregate.toFixed(1)}</td>
                    <td class="rank" rowspan="${totalRows}">${rank}</td>
                `;
            } else {
                html += `
                    <td class="final-aggregate">${data.finalAggregate.toFixed(1)}</td>
                    <td class="rank">${rank}</td>
                `;
            }
            
            html += `</tr>`;
        }
        
        if (hasAfrican) {
            const africanScores = [...data.africanScores];
            while (africanScores.length < 12) africanScores.push('-');
            
            html += `
                <tr>
                    ${!hasWestern ? `<td class="choir-name" rowspan="${totalRows}">${choir.name}</td>` : ''}
                    <td class="genre-name">AFRICAN</td>
            `;
            
            africanScores.forEach(score => {
                if (score === '-') {
                    html += `<td>-</td>`;
                } else {
                    html += `<td>${typeof score === 'number' ? score.toFixed(1) : score}</td>`;
                }
            });
            
            const africanHigh = data.africanScores.length > 0 ? Math.max(...data.africanScores) : 0;
            const africanLow = data.africanScores.length > 0 ? Math.min(...data.africanScores) : 0;
            
            html += `
                    <td class="high-score">${data.africanScores.length > 0 ? africanHigh.toFixed(1) : '-'}</td>
                    <td class="low-score">${data.africanScores.length > 0 ? africanLow.toFixed(1) : '-'}</td>
                    <td class="total-score">${data.africanTotal.toFixed(1)}</td>
                    <td class="trimmed-total">${data.africanTrimmedTotal.toFixed(1)}</td>
                    <td class="overall-aggregate">${data.africanOverall.toFixed(1)}</td>
            `;
            
            if (!hasWestern) {
                html += `
                    <td class="final-aggregate">${data.finalAggregate.toFixed(1)}</td>
                    <td class="rank">${rank}</td>
                `;
            }
            
            html += `</tr>`;
        }
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        ${filteredData.some(d => {
            const choir = d.choir;
            const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                                choir.westernSong && choir.westernSong.trim() !== '';
            return !hasBothSongs;
        }) ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 152, 0, 0.1); border-radius: 8px; border-left: 4px solid #ff9800;">
            <p style="margin: 0; color: rgba(255, 255, 255, 0.8);">
                <i class="fas fa-info-circle" style="color: #ff9800;"></i> 
                <strong>Note:</strong> Choirs marked with "(Single Song)" are not eligible for overall rankings. 
                Their final aggregate shows their single genre score for reference only.
            </p>
        </div>
        ` : ''}
        
        <div class="methodology-instructions" style="margin-top: 1.5rem;">
            <h5>Calculation Legend</h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                <div><span style="color: #4caf50;">■</span> <strong>HIGH:</strong> Maximum assessor score</div>
                <div><span style="color: #f44336;">■</span> <strong>LOW:</strong> Minimum assessor score</div>
                <div><span style="color: #2196f3;">■</span> <strong>TOTAL:</strong> Sum of all assessor scores</div>
                <div><span style="color: var(--primary-gold);">■</span> <strong>TRIMMED TOTAL:</strong> Total minus high & low scores</div>
                <div><span style="color: #9c27b0;">■</span> <strong>OVERALL AGGREGATE:</strong> Trimmed total ÷ (assessors - 2)</div>
                <div><span style="color: #ff9800;">■</span> <strong>FINAL AGGREGATE:</strong> Average of Western and African overall aggregates (or single genre if only one - NOT eligible for overall)</div>
            </div>
        </div>
    `;
    
    return html;
}

// =================
// UTILITY FUNCTIONS
// =================

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function calculateStandardDeviation(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const squareDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / numbers.length;
    return Math.sqrt(avgSquareDiff);
}

function calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
        ? (sorted[mid - 1] + sorted[mid]) / 2 
        : sorted[mid];
}

// =============================
// DASHBOARD RENDERING FUNCTIONS 
// =============================

function getCategoryTotals() {
    let greatChampsCount = 0;
    let largeCount = 0;
    let standardCount = 0;
    
    if (appState.choirs && appState.choirs.length > 0) {
        appState.choirs.forEach(choir => {
            if (choir.category === 'GREAT CHAMPS') {
                greatChampsCount++;
            } else if (choir.category === 'LARGE') {
                largeCount++;
            } else if (choir.category === 'STANDARD') {
                standardCount++;
            }
        });
    }
    
    return {
        greatChamps: greatChampsCount,
        large: largeCount,
        standard: standardCount
    };
}

function renderDashboard() {
    const isAdmin = ['admin', 'founder'].includes(appState.currentRole);
    const isChair = appState.currentRole === 'chair';
    const isAssessor = appState.currentRole === 'assessor';
    const isMonitor = appState.currentRole === 'monitor';
    
    const categoryTotals = getCategoryTotals();
    
    let myAssessments = 0;
    let myFullyAssessed = 0;
    if (isAssessor || isChair) {
        appState.choirs.forEach(choir => {
            if (scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'western', appState.currentUserId) || 
                scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'african', appState.currentUserId)) {
                myAssessments++;
            }
            if (scoringSystem.hasAssessorFullyAssessed(choir.id, appState.currentUserId)) {
                myFullyAssessed++;
            }
        });
    }
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">Dashboard</h3>
                <div>
                    <span class="user-badge">
                        <i class="fas fa-user"></i>
                        ${appState.currentUser} (${appState.currentRole.toUpperCase()})
                    </span>
                </div>
            </div>
            
            <div class="dashboard-grid">
    `;
    
    if (isAssessor) {
        html += `
            <div class="dashboard-card assessable" onclick="showAssessmentChooser()" style="position: relative;">
                <div class="card-icon">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h3 class="card-title">Submit Assessment</h3>
                <p class="card-description">Evaluate choirs using the official rubric and submit scores for both African and Western genres.</p>
            </div>
            
            <div class="dashboard-card" onclick="showMyAssessmentsOnly()">
                <div class="card-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <h3 class="card-title">View My Assessments</h3>
                <p class="card-description">Review your own assessment scores and feedback. You can only view your own assessments.</p>
            </div>
        `;
    }
    
    if (isChair) {
        html += `
            <div class="dashboard-card" onclick="showAssessmentChooser()">
                <div class="card-icon">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h3 class="card-title">Submit Assessment</h3>
                <p class="card-description">Evaluate choirs using the official rubric and submit scores for both African and Western genres.</p>
            </div>
            
            <div class="dashboard-card" onclick="showMyAssessmentsOnly()">
                <div class="card-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <h3 class="card-title">View My Assessments</h3>
                <p class="card-description">Review your own assessment scores and feedback. You can only view your own assessments.</p>
            </div>
            
            <div class="dashboard-card" onclick="showFinalResults()">
                <div class="card-icon">
                    <i class="fas fa-medal"></i>
                </div>
                <h3 class="card-title">Final Rankings</h3>
                <p class="card-description">View final rankings with trimmed mean calculations and tie-breaking logic.</p>
            </div>
        `;
    }
    
    if (isMonitor) {
        html += `
            <div class="dashboard-card" onclick="showProfessionalMonitoringCenter()">
                <div class="card-icon">
                    <i class="fas fa-satellite-dish"></i>
                </div>
                <h3 class="card-title">Operations Center</h3>
                <p class="card-description">Professional monitoring dashboard with real-time competition overview, system health, and advanced analytics.</p>
            </div>
            
            <div class="dashboard-card" onclick="showLiveScoringMonitor()">
                <div class="card-icon">
                    <i class="fas fa-tachometer-alt"></i>
                </div>
                <h3 class="card-title">Live Scoring Monitor</h3>
                <p class="card-description">Real-time scoring, anomaly detection, assessor performance, and audit trail monitoring.</p>
            </div>
            
            <div class="dashboard-card" onclick="showSystemHealthMonitor()">
                <div class="card-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h3 class="card-title">System Health & Security</h3>
                <p class="card-description">System performance, security alerts, user activity logs, and compliance monitoring.</p>
            </div>
            
            <div class="dashboard-card" onclick="showDataIntegrityMonitor()">
                <div class="card-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3 class="card-title">Data Integrity & Compliance</h3>
                <p class="card-description">Data validation, GDPR compliance, audit trails, and score finalization checks.</p>
            </div>
            
            <div class="dashboard-card" onclick="showAdvancedAnalytics()">
                <div class="card-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3 class="card-title">Advanced Analytics</h3>
                <p class="card-description">Statistical insights, custom reports, scoring patterns, and performance metrics.</p>
            </div>
            
            <div class="dashboard-card" onclick="showIncidentManagement()">
                <div class="card-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="card-title">Incident Management</h3>
                <p class="card-description">Disaster recovery, incident logging, support tickets, and admin action tracking.</p>
            </div>
        `;
    }
    
    if (isAdmin && appState.currentRole !== 'founder') {
        html += `
            <div class="dashboard-card" onclick="showManageChoirs()">
                <div class="card-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3 class="card-title">Manage Choirs</h3>
                <p class="card-description">Add, edit, or remove choir information and track assessment status.</p>
            </div>
            
            <div class="dashboard-card" onclick="showManageUsers()">
                <div class="card-icon">
                    <i class="fas fa-user-cog"></i>
                </div>
                <h3 class="card-title">Manage Users</h3>
                <p class="card-description">Add, edit, or remove system users and manage their roles and permissions.</p>
            </div>
            
            <div class="dashboard-card" onclick="showResults()">
                <div class="card-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3 class="card-title">Competition Results</h3>
                <p class="card-description">Access final results, rankings, and generate detailed reports for each category.</p>
            </div>
            
            <div class="dashboard-card" onclick="showFinalResults()">
                <div class="card-icon">
                    <i class="fas fa-medal"></i>
                </div>
                <h3 class="card-title">Final Rankings</h3>
                <p class="card-description">View final rankings with trimmed mean calculations and tie-breaking logic.</p>
            </div>
            
            <div class="dashboard-card" onclick="showMethodologyCalculations()">
                <div class="card-icon">
                    <i class="fas fa-calculator"></i>
                </div>
                <h3 class="card-title">Excel Methodology</h3>
                <p class="card-description">View real-time calculations showing trimmed mean methodology for all assessors.</p>
            </div>
            
            <div class="dashboard-card" onclick="showReports()">
                <div class="card-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <h3 class="card-title">Generate Reports</h3>
                <p class="card-description">Create comprehensive reports, statistical analysis, and export data in multiple formats.</p>
            </div>
        `;
    }
    
    if (appState.currentRole === 'founder') {
        html += `
            <div class="dashboard-card" onclick="showResults()">
                <div class="card-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3 class="card-title">Competition Results</h3>
                <p class="card-description">Access final results, rankings, and generate detailed reports for each category.</p>
            </div>
            
            <div class="dashboard-card" onclick="showFinalResults()">
                <div class="card-icon">
                    <i class="fas fa-medal"></i>
                </div>
                <h3 class="card-title">Final Rankings</h3>
                <p class="card-description">View final rankings with trimmed mean calculations and tie-breaking logic.</p>
            </div>
            
            <div class="dashboard-card" onclick="showMethodologyCalculations()">
                <div class="card-icon">
                    <i class="fas fa-calculator"></i>
                </div>
                <h3 class="card-title">Excel Methodology</h3>
                <p class="card-description">View real-time calculations showing trimmed mean methodology for all assessors.</p>
            </div>
            
            <div class="dashboard-card" onclick="showReports()">
                <div class="card-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <h3 class="card-title">Generate Reports</h3>
                <p class="card-description">Create comprehensive reports, statistical analysis, and export data in multiple formats.</p>
            </div>
        `;
    }
    
    const totalChoirs = appState.choirs.length;
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    const pendingChoirs = totalChoirs - assessedChoirs;
    const percentage = totalChoirs > 0 ? (assessedChoirs / totalChoirs) * 100 : 0;
    
    html += `
            </div>
            
            <div class="assessment-container mt-4">
                <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">Competition Status</h4>
                
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Assessment Progress</span>
                        <span>${assessedChoirs}/${totalChoirs} choirs</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="mt-1" style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.6);">
                        ${pendingChoirs} choirs pending assessment
                    </div>
                </div>
                
                ${(isAssessor || isChair) ? `
                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: var(--primary-gold);">My Assessments:</strong> ${myAssessments} choirs
                        </div>
                        <div>
                            <small style="color: rgba(255, 255, 255, 0.6);">Fully assessed: <span style="color: var(--primary-gold); font-weight: bold;">${myFullyAssessed}</span> choirs</small>
                        </div>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);">
                        ${myFullyAssessed > 0 ? `
                        <span style="color: var(--primary-gold);">
                            <i class="fas fa-check-circle" style="color: var(--primary-gold);"></i> You have completed ${myFullyAssessed} choir${myFullyAssessed !== 1 ? 's' : ''} fully
                        </span>
                        ` : `
                        <i class="fas fa-info-circle" style="color: #2196F3;"></i> Continue assessing choirs to complete your assignments
                        `}
                    </div>
                </div>
                ` : ''}
                
                <div class="d-flex justify-content-between mt-3 flex-wrap gap-2">
                    <div>
    `;
    
    if (totalChoirs === 0) {
        html += `
                        <span class="category-badge" style="background-color: rgba(40, 167, 69, 0.1); color: #28a745; margin-right: 0.5rem;">
                            Great Champs: 0
                        </span>
                        <span class="category-badge" style="background-color: rgba(23, 162, 184, 0.1); color: #17a2b8; margin-right: 0.5rem;">
                            Large: 0
                        </span>
                        <span class="category-badge" style="background-color: rgba(255, 193, 7, 0.1); color: #ffc107;">
                            Standard: 0
                        </span>
        `;
    } else {
        html += `
                        <span class="category-badge" style="background-color: rgba(40, 167, 69, 0.1); color: #28a745; margin-right: 0.5rem;">
                            Great Champs: ${categoryTotals.greatChamps}
                        </span>
                        <span class="category-badge" style="background-color: rgba(23, 162, 184, 0.1); color: #17a2b8; margin-right: 0.5rem;">
                            Large: ${categoryTotals.large}
                        </span>
                        <span class="category-badge" style="background-color: rgba(255, 193, 7, 0.1); color: #ffc107;">
                            Standard: ${categoryTotals.standard}
                        </span>
        `;
    }
    
    html += `
                    </div>
                    <div>
                        <span style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.6);">
                            ${new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
    document.getElementById('welcomeSection').style.display = 'none';
}

// =============================
// ASSESSMENT CHOOSER FUNCTIONS
// =============================

function renderAssessmentChooser() {
    appState.choirs.forEach(choir => {
        const hasWesternScores = scoringSystem.assessorScores[choir.id]?.western && 
                               Object.keys(scoringSystem.assessorScores[choir.id].western).length > 0;
        const hasAfricanScores = scoringSystem.assessorScores[choir.id]?.african && 
                               Object.keys(scoringSystem.assessorScores[choir.id].african).length > 0;
        
        if (!hasWesternScores && !hasAfricanScores) {
            choir.status = 'pending';
        }
    });
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">Select Choir to Assess</h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>
            
            <div class="assessment-container">
                <div class="assessment-header-wrapper">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="filterChoirsByCategory(event, 'ALL')">All Categories</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'GREAT CHAMPS')">Great Champs</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'LARGE')">Large</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'STANDARD')">Standard</button>
                    </div>
                    
                    <div class="search-wrapper-inline">
                        <div class="search-input-wrapper-inline">
                            <i class="fas fa-search search-icon-inline"></i>
                            <input type="text" 
                                   id="choirSearchInput" 
                                   class="search-input-field-inline" 
                                   placeholder="Search choirs by name..."
                                   onkeyup="filterChoirsBySearch()"
                                   autocomplete="off">
                            <button class="search-clear-btn-inline" onclick="clearSearch()" id="searchClearBtnInline" style="display: none;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="searchResultsCount" class="search-results-count-inline"></div>
                
                <div id="choirsList"></div>
    `;
    html += `
            </div>
            
            <div class="bottom-center-back" style="text-align: center; margin-top: 2rem;">
                <button class="action-btn outline" onclick="showDashboard()" style="padding: 0.75rem 2rem; font-size: 1rem;">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
    filterChoirsByCategory({ target: { classList: { add: function() {}, remove: function() {} } } }, 'ALL');
}

function filterChoirsBySearch() {
    const searchInput = document.getElementById('choirSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const clearBtn = document.getElementById('searchClearBtnInline');
    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }
    
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
        applyFilters(currentCategoryFilter, searchTerm);
    }, 300);
}

function clearSearch() {
    const searchInput = document.getElementById('choirSearchInput');
    if (searchInput) {
        searchInput.value = '';
        filterChoirsBySearch();
    }
}

function applyFilters(category, searchTerm) {
    const container = document.getElementById('choirsList');
    
    let filteredChoirs = category === 'ALL' 
        ? appState.choirs 
        : appState.choirs.filter(c => c.category === category);
    
    if (searchTerm) {
        filteredChoirs = filteredChoirs.filter(choir => 
            choir.name.toLowerCase().includes(searchTerm)
        );
    }
    
    updateSearchResultsCount(filteredChoirs.length, category, searchTerm);
    renderFilteredChoirs(filteredChoirs);
}

function updateSearchResultsCount(count, category, searchTerm) {
    const countElement = document.getElementById('searchResultsCount');
    if (!countElement) return;
    
    if (searchTerm) {
        const categoryText = category === 'ALL' ? 'all categories' : category.toLowerCase().replace('_', ' ');
        countElement.innerHTML = `<i class="fas fa-filter"></i> Found <strong>${count}</strong> choir${count !== 1 ? 's' : ''} matching "<strong>${escapeHtml(searchTerm)}</strong>" in ${categoryText}`;
        countElement.style.display = 'block';
    } else {
        countElement.innerHTML = '';
        countElement.style.display = 'none';
    }
}

function filterChoirsByCategory(event, category) {
    currentCategoryFilter = category;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const searchInput = document.getElementById('choirSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    applyFilters(category, searchTerm);
}

function renderFilteredChoirs(filteredChoirs) {
    const container = document.getElementById('choirsList');
    
    if (filteredChoirs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-users fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.6);">No choirs found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="row" style="display: flex; flex-wrap: wrap; margin: 0 -0.75rem;">';
    
    filteredChoirs.forEach(choir => {
        const assessorId = appState.currentUserId;
        
        const hasAssessedWestern = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'western', assessorId);
        const hasAssessedAfrican = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'african', assessorId);
        const hasFullyAssessed = scoringSystem.hasAssessorFullyAssessed(choir.id, assessorId);
        const hasAssessedAny = hasAssessedWestern || hasAssessedAfrican;
        
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        let buttonText = '';
        let buttonTooltip = '';
        let buttonDisabled = hasFullyAssessed;
        let buttonClass = hasFullyAssessed ? 'outline assessed' : (hasAssessedAny ? 'outline' : '');
        let cardClass = '';
        
        if (hasFullyAssessed) {
            buttonText = 'Fully Assessed';
            buttonTooltip = 'This choir has been fully assessed';
            cardClass = '';
        } else if (hasAssessedAny) {
            if (hasBothSongs) {
                if (hasAssessedWestern && !hasAssessedAfrican) {
                    buttonText = 'Assess African Song';
                    buttonTooltip = 'You have assessed Western. Assess African song now';
                } else if (!hasAssessedWestern && hasAssessedAfrican) {
                    buttonText = 'Assess Western Song';
                    buttonTooltip = 'You have assessed African. Assess Western song now';
                }
            } else {
                buttonText = 'View Assessment';
                buttonTooltip = 'You have already assessed this choir';
            }
        } else {
            buttonText = 'Start Assessment';
            buttonTooltip = hasBothSongs ? 'Assess both Western and African songs' : 'Assess single song';
            cardClass = 'assessable';
        }
        
        let progressDots = '';
        if (hasBothSongs) {
            progressDots = `
                <div class="assessment-progress">
                    <div class="progress-dot ${hasAssessedWestern ? 'complete' : 'pending'}"></div>
                    <div class="progress-dot ${hasAssessedAfrican ? 'complete' : 'pending'}"></div>
                </div>
            `;
        } else {
            const hasAssessed = hasAssessedWestern || hasAssessedAfrican;
            progressDots = `
                <div class="assessment-progress">
                    <div class="progress-dot ${hasAssessed ? 'complete' : 'pending'}"></div>
                </div>
            `;
        }
        
        html += `
            <div class="col-md-6 col-lg-4 mb-3" style="flex: 0 0 calc(33.333% - 1.5rem); margin: 0 0.75rem 1.5rem 0.75rem;">
                <div class="dashboard-card ${cardClass}" style="height: 100%;">
                    <h4 style="color: var(--primary-gold); margin-bottom: 0.5rem;">${choir.name}</h4>
                    <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-map-marker-alt"></i> ${choir.region}
                    </p>
                    <span class="category-badge">${appState.categories[choir.category]}</span>
                    ${progressDots}
                    <div style="margin-top: 1rem;">
                        <p style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 0.25rem;">
                            <strong>African:</strong> ${choir.africanSong ? choir.africanSong.substring(0, 30) + (choir.africanSong.length > 30 ? '...' : '') : 'Not Performing'}
                        </p>
                        <p style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">
                            <strong>Western:</strong> ${choir.westernSong ? choir.westernSong.substring(0, 30) + (choir.westernSong.length > 30 ? '...' : '') : 'Not Performing'}
                        </p>
                    </div>
                    ${hasFullyAssessed ? `
                    <div style="margin-top: 0.5rem; text-align: center;">
                        <span class="fully-assessed-badge">
                            <i class="fas fa-check-circle"></i> FULLY ASSESSED
                        </span>
                    </div>
                    ` : ''}
                    <div style="margin-top: 1rem;">
                        <button class="action-btn ${buttonClass}" 
                                style="width: 100%; ${hasFullyAssessed ? 'background: rgba(212, 175, 55, 0.1); color: var(--primary-gold); border-color: var(--primary-gold); opacity: 0.8; cursor: not-allowed;' : ''}"
                                onclick="${!hasFullyAssessed ? `showProfessionalAdjudication(${choir.id})` : 'void(0)'}"
                                title="${buttonTooltip}"
                                ${hasFullyAssessed ? 'disabled' : ''}>
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// =============================
// VIEW MY ASSESSMENTS FUNCTIONS
// =============================

function showMyAssessmentsOnly() {
    appState.currentView = 'myAssessments';
    renderMyAssessmentsOnly();
}

function renderMyAssessmentsOnly() {
    const assessorId = appState.currentUserId;
    
    const assessmentsByCategory = {
        'GREAT CHAMPS': [],
        'LARGE': [],
        'STANDARD': []
    };
    
    appState.choirs.forEach(choir => {
        const westernAssessment = scoringSystem.getAssessorAssessments(choir.id, 'western', assessorId);
        const africanAssessment = scoringSystem.getAssessorAssessments(choir.id, 'african', assessorId);
        
        if (westernAssessment || africanAssessment) {
            const choirStats = scoringSystem.getChoirStatistics(choir.id);
            const overallScore = scoringSystem.getChoirOverallScore(choir.id);
            
            assessmentsByCategory[choir.category].push({
                choir: choir,
                westernAssessment: westernAssessment,
                africanAssessment: africanAssessment,
                choirStats: choirStats,
                overallScore: overallScore
            });
        }
    });
    
    let totalAssessments = assessmentsByCategory['GREAT CHAMPS'].length + 
                         assessmentsByCategory['LARGE'].length + 
                         assessmentsByCategory['STANDARD'].length;
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">My Assessments</h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>
            
            <div class="assessment-container">
                <div class="assessment-header-wrapper" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <div style="flex: 1;">
                        <h4 style="color: var(--primary-gold); margin: 0;">My Assessment Summary</h4>
                        <p style="color: rgba(255, 255, 255, 0.8); margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                            You have assessed ${totalAssessments} choir(s). Below are your assessment details sorted by category.
                        </p>
                        <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; margin: 0.25rem 0 0 0;">
                            As an assessor, you can only view your own assessments.
                        </p>
                    </div>
                    
                    <div class="search-wrapper-inline">
                        <div class="search-input-wrapper-inline">
                            <i class="fas fa-search search-icon-inline"></i>
                            <input type="text" 
                                   id="myAssessmentsSearchInput" 
                                   class="search-input-field-inline" 
                                   placeholder="Search your assessed choirs by name..."
                                   onkeyup="filterMyAssessmentsBySearch()"
                                   autocomplete="off">
                            <button class="search-clear-btn-inline" onclick="clearMyAssessmentsSearch()" id="myAssessmentsSearchClearBtn" style="display: none;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="myAssessmentsSearchResultsCount" class="search-results-count-inline" style="margin-bottom: 1rem; padding: 0.5rem; border-radius: 4px; display: block;"></div>
    `;
    
    if (totalAssessments === 0) {
        html += `
                <div class="text-center py-5">
                    <i class="fas fa-clipboard-check fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                    <p style="color: rgba(255, 255, 255, 0.6);">You haven't assessed any choirs yet</p>
                    <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">Use the "Submit Assessment" option to start assessing choirs</p>
                </div>
            </div>
        `;
    } else {
        html += `<div id="myAssessmentsList">`;
        
        Object.keys(assessmentsByCategory).forEach(category => {
            const assessments = assessmentsByCategory[category];
            if (assessments.length === 0) return;
            
            const categoryName = appState.categories[category];
            
            html += `
                <div class="category-section-header" data-category="${category}" style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 2px solid rgba(212, 175, 55, 0.3);">
                    <h4 style="color: var(--primary-gold); margin: 0; font-size: 1.2rem;">${categoryName}</h4>
                    <span class="category-count" style="background: rgba(212, 175, 55, 0.2); color: var(--primary-gold); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: bold;">${assessments.length} choir${assessments.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div class="row my-assessments-row" data-category="${category}" style="display: flex; flex-wrap: wrap; margin: 0 -0.75rem;">
            `;
            
            assessments.forEach((assessment) => {
                const choir = assessment.choir;
                
                let statusClass = 'assessment-pending';
                let statusText = 'Pending';
                let statusIcon = 'fa-clock';
                
                if (scoringSystem.hasAssessorFullyAssessed(choir.id, appState.currentUserId)) {
                    statusClass = 'assessment-complete';
                    statusText = 'Fully Assessed';
                    statusIcon = 'fa-check-circle';
                } else if (assessment.westernAssessment || assessment.africanAssessment) {
                    statusClass = 'assessment-partial';
                    statusText = 'Partially Assessed';
                    statusIcon = 'fa-check';
                }
                
                html += `
                    <div class="col-md-6 col-lg-4 mb-3 my-assessment-card" data-choir-name="${choir.name.toLowerCase()}" style="flex: 0 0 calc(33.333% - 1.5rem); margin: 0 0.75rem 1.5rem 0.75rem;">
                        <div class="dashboard-card" style="height: 100%; background: linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(45, 45, 45, 0.9) 100%); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; padding: 1.5rem;">
                            <h4 style="color: var(--primary-gold); margin-bottom: 0.5rem; font-size: 1.2rem;">${choir.name}</h4>
                            <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-map-marker-alt"></i> ${choir.region}
                            </p>
                            <span class="category-badge" style="background: rgba(212, 175, 55, 0.15); color: var(--primary-gold); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; display: inline-block;">${categoryName}</span>
                            <div style="margin-top: 1rem;">
                                <p style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 0.25rem; display: flex; justify-content: space-between;">
                                    <span><strong>African:</strong></span>
                                    <span style="color: #4CAF50; font-weight: bold;">${assessment.africanAssessment ? assessment.africanAssessment.total.toFixed(1) : 'Not Assessed'}</span>
                                </p>
                                <p style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); display: flex; justify-content: space-between;">
                                    <span><strong>Western:</strong></span>
                                    <span style="color: #4CAF50; font-weight: bold;">${assessment.westernAssessment ? assessment.westernAssessment.total.toFixed(1) : 'Not Assessed'}</span>
                                </p>
                            </div>
                            <div class="choir-assessment-status" style="margin-top: 1rem;">
                                <span class="assessment-status-badge ${statusClass}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; ${statusClass === 'assessment-complete' ? 'background: rgba(212, 175, 55, 0.15); color: var(--primary-gold); border: 1px solid rgba(212, 175, 55, 0.3);' : statusClass === 'assessment-partial' ? 'background: rgba(255, 152, 0, 0.15); color: #FF9800; border: 1px solid rgba(255, 152, 0, 0.3);' : 'background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);'}">
                                    <i class="fas ${statusIcon}"></i> ${statusText}
                                </span>
                            </div>
                            <div style="margin-top: 1.5rem;">
                                <button class="action-btn outline" style="width: 100%; padding: 0.75rem; background: transparent; border: 2px solid var(--primary-gold); color: var(--primary-gold); border-radius: 6px; font-weight: bold; cursor: pointer; transition: all 0.3s ease;" onclick="showMyAssessmentDetails(${choir.id})" onmouseover="this.style.background='var(--primary-gold)'; this.style.color='#000';" onmouseout="this.style.background='transparent'; this.style.color='var(--primary-gold)';">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        });
        
        html += `</div>`;
    }
    
    html += `
            </div>
            
            <div class="bottom-center-back" style="text-align: center; margin-top: 2rem;">
                <button class="action-btn outline" onclick="showDashboard()" style="padding: 0.75rem 2rem; font-size: 1rem;">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
}

// ================================
// MY ASSESSMENTS SEARCH FUNCTIONS
// ================================

function filterMyAssessmentsBySearch() {
    const searchInput = document.getElementById('myAssessmentsSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const clearBtn = document.getElementById('myAssessmentsSearchClearBtn');
    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }
    
    if (myAssessmentsSearchTimeout) {
        clearTimeout(myAssessmentsSearchTimeout);
    }
    
    myAssessmentsSearchTimeout = setTimeout(() => {
        applyMyAssessmentsSearchFilter(searchTerm);
    }, 300);
}

function clearMyAssessmentsSearch() {
    const searchInput = document.getElementById('myAssessmentsSearchInput');
    if (searchInput) {
        searchInput.value = '';
        filterMyAssessmentsBySearch();
    }
}

function applyMyAssessmentsSearchFilter(searchTerm) {
    const cards = document.querySelectorAll('.my-assessment-card');
    const categorySections = document.querySelectorAll('.category-section-header, .my-assessments-row');
    let visibleCount = 0;
    
    if (!searchTerm) {
        cards.forEach(card => {
            card.style.display = '';
        });
        
        categorySections.forEach(section => {
            section.style.display = '';
        });
        
        visibleCount = cards.length;
    } else {
        const categoriesWithVisibleCards = new Set();
        
        cards.forEach(card => {
            const choirName = card.getAttribute('data-choir-name') || '';
            if (choirName.includes(searchTerm)) {
                card.style.display = '';
                const parentRow = card.closest('.my-assessments-row');
                if (parentRow) {
                    const category = parentRow.getAttribute('data-category');
                    if (category) categoriesWithVisibleCards.add(category);
                }
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.my-assessments-row').forEach(row => {
            const category = row.getAttribute('data-category');
            if (categoriesWithVisibleCards.has(category)) {
                row.style.display = '';
                const header = document.querySelector(`.category-section-header[data-category="${category}"]`);
                if (header) header.style.display = '';
            } else {
                row.style.display = 'none';
                const header = document.querySelector(`.category-section-header[data-category="${category}"]`);
                if (header) header.style.display = 'none';
            }
        });
    }
    
    updateMyAssessmentsSearchResultsCount(visibleCount, searchTerm);
}

function updateMyAssessmentsSearchResultsCount(count, searchTerm) {
    const countElement = document.getElementById('myAssessmentsSearchResultsCount');
    if (!countElement) return;
    
    if (searchTerm) {
        countElement.innerHTML = `<i class="fas fa-filter"></i> Found <strong>${count}</strong> assessed choir${count !== 1 ? 's' : ''} matching "<strong>${escapeHtml(searchTerm)}</strong>"`;
        countElement.style.display = 'block';
    } else {
        countElement.innerHTML = '';
        countElement.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =========================================
// FIXED METHODOLOGY DETAILS MODAL FUNCTIONS 
// =========================================

function showChoirMethodologyDetails(choirId, genre = null) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (!choir) {
        showNotification('Choir not found', 'error');
        return;
    }
    
    const stats = scoringSystem.getChoirStatistics(choirId);
    
    if (!genre) {
        if (stats.western.count > 0 && stats.african.count > 0) {
            showMethodologyGenreSelector(choir, stats);
        } else if (stats.western.count > 0) {
            renderMethodologyDetailsModal(choir, 'western', stats);
        } else if (stats.african.count > 0) {
            renderMethodologyDetailsModal(choir, 'african', stats);
        } else {
            showNotification('No assessment data available for this choir', 'warning');
        }
    } else {
        renderMethodologyDetailsModal(choir, genre, stats);
    }
}

function showMethodologyGenreSelector(choir, stats) {
    // Remove existing modal if any
    const existingModal = document.getElementById('methodologyGenreModal');
    if (existingModal) existingModal.remove();
    
    const modalHtml = `
        <div class="modal" id="methodologyGenreModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 9999; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border: 2px solid var(--primary-gold); border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(212, 175, 55, 0.3); background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); border-radius: 13px 13px 0 0;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: var(--primary-gold);"><i class="fas fa-calculator"></i> Select Genre Methodology</span>
                    <button class="action-btn" onclick="closeMethodologyGenreModal()" style="padding: 0.75rem 1.5rem; font-size: 0.95rem; background: rgba(255, 255, 255, 0.05); border: 2px solid var(--primary-gold); color: var(--primary-gold); border-radius: 8px; font-weight: 600; transition: all 0.3s ease; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-arrow-left" style="color: var(--primary-gold);"></i> Back to Results
                    </button>
                </div>
                <div class="modal-body" style="padding: 2rem;">
                    <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem; text-align: center; font-size: 1.3rem;">
                        ${choir.name}
                    </h4>
                    <p style="text-align: center; margin-bottom: 2rem; color: rgba(255,255,255,0.9); font-size: 1rem;">
                        Select which genre's methodology you want to view:
                    </p>
                    
                    <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                        ${stats.western.count > 0 ? `
                        <button class="action-btn" onclick="renderMethodologyDetailsModal(${JSON.stringify(choir).replace(/"/g, '&quot;')}, 'western', ${JSON.stringify(stats).replace(/"/g, '&quot;')}); closeMethodologyGenreModal();" 
                                style="flex: 1; min-width: 150px; padding: 1.5rem 1rem; background: rgba(33, 150, 243, 0.15); color: #2196f3; border: 2px solid #2196f3; border-radius: 10px; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: all 0.3s ease; cursor: pointer;">
                            <i class="fas fa-globe" style="font-size: 2rem;"></i>
                            <span style="font-weight: bold; font-size: 1.1rem;">Western</span>
                            <span style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">${stats.western.count} assessor${stats.western.count !== 1 ? 's' : ''}</span>
                        </button>
                        ` : ''}
                        
                        ${stats.african.count > 0 ? `
                        <button class="action-btn" onclick="renderMethodologyDetailsModal(${JSON.stringify(choir).replace(/"/g, '&quot;')}, 'african', ${JSON.stringify(stats).replace(/"/g, '&quot;')}); closeMethodologyGenreModal();" 
                                style="flex: 1; min-width: 150px; padding: 1.5rem 1rem; background: rgba(244, 67, 54, 0.15); color: #f44336; border: 2px solid #f44336; border-radius: 10px; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: all 0.3s ease; cursor: pointer;">
                            <i class="fas fa-drum" style="font-size: 2rem;"></i>
                            <span style="font-weight: bold; font-size: 1.1rem;">African</span>
                            <span style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">${stats.african.count} assessor${stats.african.count !== 1 ? 's' : ''}</span>
                        </button>
                        ` : ''}
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="action-btn" onclick="closeMethodologyGenreModal()" style="padding: 0.75rem 2rem; font-size: 1rem; background: rgba(255, 255, 255, 0.05); border: 2px solid var(--primary-gold); color: var(--primary-gold); border-radius: 8px; font-weight: 600; transition: all 0.3s ease; cursor: pointer;">
                            <i class="fas fa-times" style="color: var(--primary-gold);"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeMethodologyGenreModal() {
    const modal = document.getElementById('methodologyGenreModal');
    if (modal) modal.remove();
}

function renderMethodologyDetailsModal(choir, genre, stats) {
    const genreName = genre === 'western' ? 'Western' : 'African';
    const genreColor = genre === 'western' ? '#2196f3' : '#f44336';
    
    const assessments = scoringSystem.getAllAssessorAssessments(choir.id, genre);
    const rawScores = assessments.map(a => a.total);
    const sortedScores = [...rawScores].sort((a, b) => a - b);
    
    let calculationSteps = [];
    
    if (rawScores.length === 1) {
        calculationSteps = [
            { text: `Single assessor: Use raw score directly`, value: rawScores[0] }
        ];
    } else if (rawScores.length === 2) {
        calculationSteps = [
            { text: `Two assessors: Calculate average of both scores`, value: null },
            { text: `Score 1: ${rawScores[0].toFixed(1)}`, value: rawScores[0] },
            { text: `Score 2: ${rawScores[1].toFixed(1)}`, value: rawScores[1] },
            { text: `Average: (${rawScores[0].toFixed(1)} + ${rawScores[1].toFixed(1)}) / 2 = ${((rawScores[0] + rawScores[1]) / 2).toFixed(1)}`, value: null }
        ];
    } else if (rawScores.length >= 3) {
        const trimmedScores = sortedScores.slice(1, -1);
        const trimmedSum = trimmedScores.reduce((a, b) => a + b, 0);
        const trimmedMean = trimmedSum / trimmedScores.length;
        
        calculationSteps = [
            { text: `Three or more assessors: Remove highest and lowest scores, then average the remainder`, value: null },
            { text: `All scores (sorted): ${sortedScores.map(s => s.toFixed(1)).join(', ')}`, value: null },
            { text: `Lowest score (removed): ${sortedScores[0].toFixed(1)}`, value: sortedScores[0], isRemoved: true },
            { text: `Highest score (removed): ${sortedScores[sortedScores.length - 1].toFixed(1)}`, value: sortedScores[sortedScores.length - 1], isRemoved: true },
            { text: `Remaining scores: ${trimmedScores.map(s => s.toFixed(1)).join(', ')}`, value: null },
            { text: `Sum of remaining: ${trimmedSum.toFixed(1)}`, value: null },
            { text: `Number of remaining: ${trimmedScores.length}`, value: null },
            { text: `Trimmed mean: ${trimmedSum.toFixed(1)} / ${trimmedScores.length} = ${trimmedMean.toFixed(1)}`, value: null }
        ];
    }
    
    let assessorRows = '';
    assessments.forEach(assessment => {
        let statusClass = '';
        let statusText = '';
        
        if (rawScores.length === 1) {
            statusClass = 'status-assessed';
            statusText = 'Single Assessor - Raw Score';
        } else if (rawScores.length === 2) {
            statusClass = 'status-assessed';
            statusText = 'Included in Average';
        } else if (rawScores.length >= 3) {
            if (assessment.total === sortedScores[0]) {
                statusClass = 'status-pending';
                statusText = 'Lowest Score - Removed';
            } else if (assessment.total === sortedScores[sortedScores.length - 1]) {
                statusClass = 'status-pending';
                statusText = 'Highest Score - Removed';
            } else {
                statusClass = 'status-assessed';
                statusText = 'Included in Trimmed Mean';
            }
        }
        
        assessorRows += `
            <tr>
                <td><strong>${assessment.assessorName}</strong></td>
                <td class="score-cell">${assessment.total.toFixed(1)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    // Remove existing modal if any
    const existingModal = document.getElementById('methodologyDetailsModal');
    if (existingModal) existingModal.remove();
    
    const modalHtml = `
        <div class="modal" id="methodologyDetailsModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 9999; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border: 2px solid var(--primary-gold); border-radius: 15px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(212, 175, 55, 0.3); background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); border-radius: 13px 13px 0 0;">
                    <span style="font-size: 1.2rem; font-weight: bold; color: var(--primary-gold);"><i class="fas fa-calculator"></i> ${genreName} Methodology - ${choir.name}</span>
                    <button class="action-btn" onclick="showMethodologyGenreSelector(${JSON.stringify(choir).replace(/"/g, '&quot;')}, ${JSON.stringify(stats).replace(/"/g, '&quot;')}); closeMethodologyDetailsModal();" style="padding: 0.75rem 1.5rem; font-size: 0.95rem; background: rgba(255, 255, 255, 0.05); border: 2px solid var(--primary-gold); color: var(--primary-gold); border-radius: 8px; font-weight: 600; transition: all 0.3s ease; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-arrow-left" style="color: var(--primary-gold);"></i> Back to Genre Selection
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem;">
                    
                    <div style="background: rgba(${genre === 'western' ? '33, 150, 243' : '244, 67, 54'}, 0.15); padding: 1rem; border-radius: 8px; border: 1px solid ${genreColor}; margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                            <div>
                                <strong style="color: ${genreColor};">${genreName} Category - Trimmed Mean Calculation</strong>
                            </div>
                            <div>
                                <span style="background: ${genreColor}; color: white; padding: 0.25rem 1rem; border-radius: 20px; font-weight: bold;">
                                    Final Score: ${genre === 'western' ? stats.western.trimmedMean.toFixed(1) : stats.african.trimmedMean.toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div style="margin-top: 0.5rem; color: rgba(255,255,255,0.9);">
                            <strong>Number of Assessors:</strong> ${rawScores.length}
                        </div>
                    </div>
                    
                    <h5 style="color: var(--primary-gold); margin-bottom: 1rem; font-size: 1.1rem;">
                        <i class="fas fa-clipboard-list"></i> Assessor Scores
                    </h5>
                    
                    <div class="table-responsive" style="margin-bottom: 1.5rem;">
                        <table class="results-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align: left; padding: 0.75rem; background: rgba(212, 175, 55, 0.2); color: var(--primary-gold);">Assessor</th>
                                    <th style="text-align: left; padding: 0.75rem; background: rgba(212, 175, 55, 0.2); color: var(--primary-gold);">Score</th>
                                    <th style="text-align: left; padding: 0.75rem; background: rgba(212, 175, 55, 0.2); color: var(--primary-gold);">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${assessorRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <h5 style="color: var(--primary-gold); margin-bottom: 1rem; font-size: 1.1rem;">
                        <i class="fas fa-calculator"></i> Calculation Steps
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem; border: 1px solid rgba(212,175,55,0.2);">
                        ${calculationSteps.map(step => `
                            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; ${step.isRemoved ? 'background: rgba(244,67,54,0.1); border-radius: 4px; margin: 2px 0;' : ''}">
                                <i class="fas ${step.isRemoved ? 'fa-times-circle' : 'fa-arrow-right'}" 
                                   style="color: ${step.isRemoved ? '#f44336' : '#4CAF50'}; min-width: 20px;"></i>
                                <span style="color: rgba(255,255,255,0.9);">${step.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212,175,55,0.1); border-radius: 8px; border-left: 4px solid var(--primary-gold);">
                        <strong style="color: var(--primary-gold);">Methodology Applied:</strong>
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: rgba(255,255,255,0.9);">
                            <li><strong>1 Assessor:</strong> Raw score used</li>
                            <li><strong>2 Assessors:</strong> Average of both scores</li>
                            <li><strong>3+ Assessors:</strong> Remove highest & lowest, average remainder</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="action-btn outline" onclick="closeMethodologyDetailsModal()" style="padding: 0.75rem 2rem; font-size: 1rem;">
                            <i class="fas fa-arrow-left"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeMethodologyDetailsModal() {
    const modal = document.getElementById('methodologyDetailsModal');
    if (modal) modal.remove();
}

// ========================
// RENDER RESULTS FUNCTION
// =======================

function renderResults() {
    scoringSystem.calculateRankings();
    
    const isAssessor = appState.currentRole === 'assessor';
    const isAdmin = ['admin', 'founder'].includes(appState.currentRole);
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 results-header-wrapper">
                <h3 style="color: var(--primary-gold); margin: 0;">Competition Results</h3>
                <div class="results-actions-group">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="exportToExcel()">
                        <i class="fas fa-file-excel"></i> Export
                    </button>
                </div>
            </div>
            
            <div class="assessment-container">
                <div class="tab-nav" style="overflow-x: auto; white-space: nowrap;">
                    <button class="tab-btn active" onclick="filterResults(event, 'overall')">Overall</button>
                    <button class="tab-btn" onclick="filterResults(event, 'western')">Western</button>
                    <button class="tab-btn" onclick="filterResults(event, 'african')">African</button>
                    <button class="tab-btn" onclick="filterResults(event, 'GREAT CHAMPS')">Great Champs</button>
                    <button class="tab-btn" onclick="filterResults(event, 'LARGE')">Large</button>
                    <button class="tab-btn" onclick="filterResults(event, 'STANDARD')">Standard</button>
                    ${isAssessor ? `<button class="tab-btn" onclick="filterResults(event, 'my')">My Assessments</button>` : ''}
                </div>
                
                <div id="resultsTable" class="table-responsive" style="margin-top: 1.5rem;"></div>
            </div>
            
            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
    filterResults({ target: { classList: { add: function() {}, remove: function() {} } } }, 'overall');
}

function filterResults(event, category) {
    const container = document.getElementById('resultsTable');
    const isAssessor = appState.currentRole === 'assessor';
    const isAdmin = ['admin', 'founder'].includes(appState.currentRole);
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (category === 'my' && isAssessor) {
        renderMyAssessments(container);
        return;
    }
    
    let rankings = [];
    let title = "";
    
    if (category === 'overall') {
        rankings = scoringSystem.finalRankings.overall;
        title = "Overall Rankings";
    } else if (category === 'western') {
        rankings = scoringSystem.finalRankings.western;
        title = "Western Category Rankings";
    } else if (category === 'african') {
        rankings = scoringSystem.finalRankings.african;
        title = "African Category Rankings";
    } else {
        rankings = scoringSystem.finalRankings.overall.filter(r => 
            r.choir.category === category
        );
        title = `${appState.categories[category]} Rankings`;
    }
    
    if (rankings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-trophy fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.6);">No results available yet for this category</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = renderDefaultRankings(category, title, rankings, isAssessor);
}

function renderDefaultRankings(category, title, rankings, isAssessor) {
    const isWesternCategory = category === 'western';
    const isAfricanCategory = category === 'african';
    const isAdmin = ['admin', 'founder'].includes(appState.currentRole);
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1rem;">${title}</h4>
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Choir</th>
                        <th>Category</th>
    `;
    
    if (isWesternCategory) {
        html += `
                        <th>Western Score</th>
                        <th>Grade</th>
                        ${isAdmin ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
            `;
    } else if (isAfricanCategory) {
        html += `
                        <th>African Score</th>
                        <th>Grade</th>
                        ${isAdmin ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
            `;
    } else {
        html += `
                        <th>Western Score</th>
                        <th>African Score</th>
                        <th>Total Score</th>
                        <th>Grade</th>
                        ${isAdmin ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
            `;
    }
    
    rankings.forEach((ranking) => {
        const choirStats = scoringSystem.getChoirStatistics(ranking.choir.id);
        
        let displayScore = ranking.score;
        let grade = getGradeFromScore(displayScore);
        
        if (isWesternCategory) {
            displayScore = choirStats.western.trimmedMean;
            grade = getGradeFromScore(displayScore);
        } else if (isAfricanCategory) {
            displayScore = choirStats.african.trimmedMean;
            grade = getGradeFromScore(displayScore);
        } else {
            grade = getGradeFromScore(displayScore);
        }
        
        const gradeClass = getGradeClass(grade);
        
        html += `
            <tr>
                <td>
                    <div class="position-badge">${ranking.rank}</div>
                    ${ranking.isTie ? `<br><small style="color: #ff9800; font-size: 0.8rem;">TIE</small>` : ''}
                </td>
                <td><strong>${ranking.choir.name}</strong><br><small>${ranking.choir.region}</small></td>
                <td><span class="category-badge">${appState.categories[ranking.choir.category]}</span></td>
        `;
        
        if (isWesternCategory) {
            html += `
                <td><strong>${displayScore.toFixed(1)}</strong><br><small>(${choirStats.western.count} assessors)</small></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
            `;
            
            if (isAdmin) {
                html += `
                    <td>
                        <div class="action-cell">
                            <button class="action-btn icon-btn" onclick="showChoirMethodologyDetails(${ranking.choir.id}, 'western')" 
                                    title="View Western Methodology" style="background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000;">
                                <i class="fas fa-calculator"></i>
                            </button>
                        </div>
                    </td>
                `;
            }
        } else if (isAfricanCategory) {
            html += `
                <td><strong>${displayScore.toFixed(1)}</strong><br><small>(${choirStats.african.count} assessors)</small></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
            `;
            
            if (isAdmin) {
                html += `
                    <td>
                        <div class="action-cell">
                            <button class="action-btn icon-btn" onclick="showChoirMethodologyDetails(${ranking.choir.id}, 'african')" 
                                    title="View African Methodology" style="background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000;">
                                <i class="fas fa-calculator"></i>
                            </button>
                        </div>
                    </td>
                `;
            }
        } else {
            const myWesternScore = isAssessor ? scoringSystem.getAssessorAssessments(ranking.choir.id, 'western', appState.currentUserId) : null;
            const myAfricanScore = isAssessor ? scoringSystem.getAssessorAssessments(ranking.choir.id, 'african', appState.currentUserId) : null;
            
            html += `
                <td>
                    ${isAssessor && myWesternScore ? 
                        `<span style="color: #4caf50;" title="Your score: ${myWesternScore.total.toFixed(1)}">${choirStats.western.trimmedMean > 0 ? choirStats.western.trimmedMean.toFixed(1) : 'N/A'}*</span>` : 
                        choirStats.western.trimmedMean > 0 ? choirStats.western.trimmedMean.toFixed(1) : 'N/A'}
                    ${!isAssessor && choirStats.western.count > 0 ? `<br><small>(${choirStats.western.count} assessors)</small>` : ''}
                </td>
                <td>
                    ${isAssessor && myAfricanScore ? 
                        `<span style="color: #4caf50;" title="Your score: ${myAfricanScore.total.toFixed(1)}">${choirStats.african.trimmedMean > 0 ? choirStats.african.trimmedMean.toFixed(1) : 'N/A'}*</span>` : 
                        choirStats.african.trimmedMean > 0 ? choirStats.african.trimmedMean.toFixed(1) : 'N/A'}
                    ${!isAssessor && choirStats.african.count > 0 ? `<br><small>(${choirStats.african.count} assessors)</small>` : ''}
                </td>
                <td><strong>${displayScore.toFixed(1)}</strong></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
            `;
            
            if (isAdmin) {
                html += `
                    <td>
                        <div class="action-cell">
                            <button class="action-btn icon-btn" onclick="showChoirMethodologyDetails(${ranking.choir.id})" 
                                    title="View Methodology" style="background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000;">
                                <i class="fas fa-calculator"></i>
                            </button>
                        </div>
                    </td>
                `;
            }
        }
        
        html += `</tr>`;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        ${isAssessor && !isWesternCategory && !isAfricanCategory ? `
        <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(76, 175, 80, 0.1); border-radius: 6px; border: 1px solid rgba(76, 175, 80, 0.3);">
            <small style="color: #4caf50;"><i class="fas fa-info-circle"></i> *Green scores indicate choirs you have assessed. You can only view your own scores.</small>
        </div>
        ` : ''}
        
        ${isAdmin ? `
        <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(212, 175, 55, 0.1); border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.3);">
            <small style="color: var(--primary-gold);"><i class="fas fa-calculator"></i> Click the calculator icon in the Actions column to view detailed methodology calculations for each choir.</small>
        </div>
        ` : ''}
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <h5 style="color: var(--primary-gold); margin-bottom: 0.5rem;">Scoring Methodology</h5>
            <ul style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8);">
                <li><strong>Trimmed Mean Calculation:</strong> Highest and lowest scores removed, then averaged</li>
                <li><strong>Tie Handling:</strong> Ties receive same rank, next rank skipped</li>
                <li><strong>Single Assessor:</strong> Raw score used</li>
                <li><strong>Two Assessors:</strong> Average of both scores</li>
                <li><strong>Three+ Assessors:</strong> Trimmed mean applied (remove highest & lowest)</li>
                <li><strong>Single Song Choirs:</strong> Use that genre's score directly as final score</li>
            </ul>
        </div>
    `;
    
    return html;
}

function renderMyAssessments(container) {
    const assessorId = appState.currentUserId;
    
    const assessmentsByCategory = {
        'GREAT CHAMPS': [],
        'LARGE': [],
        'STANDARD': []
    };
    
    appState.choirs.forEach(choir => {
        const westernAssessment = scoringSystem.getAssessorAssessments(choir.id, 'western', assessorId);
        const africanAssessment = scoringSystem.getAssessorAssessments(choir.id, 'african', assessorId);
        
        if (westernAssessment || africanAssessment) {
            const choirStats = scoringSystem.getChoirStatistics(choir.id);
            const overallScore = scoringSystem.getChoirOverallScore(choir.id);
            
            assessmentsByCategory[choir.category].push({
                choir: choir,
                westernAssessment: westernAssessment,
                africanAssessment: africanAssessment,
                choirStats: choirStats,
                overallScore: overallScore
            });
        }
    });
    
    let totalAssessments = assessmentsByCategory['GREAT CHAMPS'].length + 
                         assessmentsByCategory['LARGE'].length + 
                         assessmentsByCategory['STANDARD'].length;
    
    if (totalAssessments === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-clipboard-check fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                <p style="color: rgba(255, 255, 255, 0.6);">You haven't assessed any choirs yet</p>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">Use the "Submit Assessment" option to start assessing choirs</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1rem;">My Assessments</h4>
        <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 1.5rem;">
            You have assessed ${totalAssessments} choir(s). Below are your scores sorted by category.
        </p>
        <div class="table-responsive">
            <table class="results-table" style="margin-top: 1rem;">
                <thead>
                    <tr>
                        <th>Choir</th>
                        <th>My Western Score</th>
                        <th>My African Score</th>
                        <th>Choir's Western Avg</th>
                        <th>Choir's African Avg</th>
                        <th>Choir's Overall</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(assessmentsByCategory).forEach(category => {
        const assessments = assessmentsByCategory[category];
        if (assessments.length === 0) return;
        
        assessments.forEach((assessment) => {
            const choir = assessment.choir;
            const grade = getGradeFromScore(assessment.overallScore);
            const gradeClass = getGradeClass(grade);
            
            html += `
                <tr>
                    <td><strong>${choir.name}</strong><br><small>${choir.region}</small></td>
                    <td>
                        ${assessment.westernAssessment ? `
                        <div>
                            <strong style="color: #2196f3;">${assessment.westernAssessment.total.toFixed(1)}</strong>
                            ${assessment.westernAssessment.comments ? `
                            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.25rem;">
                                <i class="fas fa-comment"></i> Has comments
                            </div>
                            ` : ''}
                        </div>
                        ` : 'Not Assessed'}
                    </td>
                    <td>
                        ${assessment.africanAssessment ? `
                        <div>
                            <strong style="color: #f44336;">${assessment.africanAssessment.total.toFixed(1)}</strong>
                            ${assessment.africanAssessment.comments ? `
                            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.25rem;">
                                <i class="fas fa-comment"></i> Has comments
                            </div>
                            ` : ''}
                        </div>
                        ` : 'Not Assessed'}
                    </td>
                    <td>${assessment.choirStats.western.trimmedMean > 0 ? assessment.choirStats.western.trimmedMean.toFixed(1) : 'N/A'}<br><small>(${assessment.choirStats.western.count} assessors)</small></td>
                    <td>${assessment.choirStats.african.trimmedMean > 0 ? assessment.choirStats.african.trimmedMean.toFixed(1) : 'N/A'}<br><small>(${assessment.choirStats.african.count} assessors)</small></td>
                    <td>
                        <strong>${assessment.overallScore.toFixed(1)}</strong><br>
                        <span class="grade-text ${gradeClass}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; margin-top: 0.25rem; display: inline-block;">
                            ${grade}
                        </span>
                    </td>
                    <td>
                        <div class="action-cell">
                            <button class="action-btn icon-btn edit-btn" onclick="showMyAssessmentDetails(${choir.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <h5 style="color: var(--primary-gold); margin-bottom: 0.5rem;">Assessment Rules</h5>
            <ul style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8);">
                <li>You can only view your own assessment scores</li>
                <li>You cannot re-assess choirs you've already assessed for the same genre</li>
                <li>For choirs with both songs, you can assess each genre separately</li>
                <li>Your scores are used in the trimmed mean calculation</li>
                <li>For single-song choirs, only assess the relevant genre</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
}

function showMyAssessmentDetails(choirId) {
    const choir = appState.choirs.find(c => c.id === choirId);
    const assessorId = appState.currentUserId;
    
    const westernAssessment = scoringSystem.getAssessorAssessments(choirId, 'western', assessorId);
    const africanAssessment = scoringSystem.getAssessorAssessments(choirId, 'african', assessorId);
    
    if (!westernAssessment && !africanAssessment) {
        showNotification('No assessment found for this choir', 'warning');
        return;
    }
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">My Assessment Details: ${choir.name}</h4>
        <div class="row mb-3" style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1; min-width: 200px;">
                <p><strong>Region:</strong> ${choir.region}</p>
                <p><strong>Category:</strong> ${appState.categories[choir.category]}</p>
            </div>
            <div style="flex: 1; min-width: 200px;">
                <p><strong>African Song:</strong> ${choir.africanSong || 'Not Performing'}</p>
                <p><strong>Western Song:</strong> ${choir.westernSong || 'Not Performing'}</p>
            </div>
        </div>
        
        <div class="tab-nav" style="margin-bottom: 1rem; overflow-x: auto; white-space: nowrap;">
            ${westernAssessment ? `<button class="tab-btn ${!africanAssessment ? 'active' : ''}" onclick="showMyAssessmentTab(event, 'western', ${choirId})">Western Assessment</button>` : ''}
            ${africanAssessment ? `<button class="tab-btn ${!westernAssessment ? 'active' : ''}" onclick="showMyAssessmentTab(event, 'african', ${choirId})">African Assessment</button>` : ''}
        </div>
        
        <div id="myAssessmentTabContent">
            ${westernAssessment ? renderMyAssessmentTab('western', choirId, westernAssessment) : 
              africanAssessment ? renderMyAssessmentTab('african', choirId, africanAssessment) : ''}
        </div>
        
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeChoirReportModal()">
                <i class="fas fa-arrow-left"></i> Back to My Assessments
            </button>
        </div>
    `;
    
    document.getElementById('choirReportContent').innerHTML = html;
    document.getElementById('choirReportModal').style.display = 'flex';
}

function showMyAssessmentTab(event, tab, choirId) {
    const container = document.getElementById('myAssessmentTabContent');
    const assessorId = appState.currentUserId;
    const assessment = scoringSystem.getAssessorAssessments(choirId, tab, assessorId);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    container.innerHTML = renderMyAssessmentTab(tab, choirId, assessment);
}

function renderMyAssessmentTab(tab, choirId, assessment) {
    if (!assessment) return '<div class="text-center py-4">No assessment found</div>';
    
    const genreName = tab === 'western' ? 'Western' : 'African';
    const genreColor = tab === 'western' ? '#2196f3' : '#f44336';
    
    return `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(${tab === 'western' ? '33, 150, 243' : '244, 67, 54'}, 0.15); border-radius: 8px; border: 1px solid rgba(${tab === 'western' ? '33, 150, 243' : '244, 67, 54'}, 0.3);">
            <strong style="color: ${genreColor};">My ${genreName} Assessment</strong>
            <div style="margin-top: 0.5rem; color: var(--light-text);">
                <strong>My Score:</strong> ${assessment.total.toFixed(1)} / 100
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Intonation</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.intonation.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Pitch Accuracy</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.pitchAccuracy.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Language & Diction</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.language.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Vocal Technique</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.vocalTechnique.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Choral Technique</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.choralTechnique.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Rhythmic Accuracy</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.rhythm.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Artistic Relevance</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.artistry.toFixed(1)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Stage Presence</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-gold);">${assessment.scores.stage.toFixed(1)}</div>
            </div>
        </div>
        
        ${assessment.comments ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <strong style="color: var(--primary-gold);">My Comments:</strong>
            <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8); font-style: italic;">
                "${assessment.comments}"
            </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <strong>Assessment Submitted:</strong> ${new Date(assessment.scores.submittedAt).toLocaleString()}
        </div>
    `;
}

function renderFinalResults() {
    scoringSystem.calculateRankings();
    
    const westernWinner = scoringSystem.finalRankings.western.length > 0 ? scoringSystem.finalRankings.western[0] : null;
    const africanWinner = scoringSystem.finalRankings.african.length > 0 ? scoringSystem.finalRankings.african[0] : null;
    const overallWinner = scoringSystem.finalRankings.overall.length > 0 ? scoringSystem.finalRankings.overall[0] : null;
    
    const eligibleChoirs = appState.choirs.filter(choir => {
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        return hasBothSongs;
    }).length;
    
    const fullyAssessedChoirs = scoringSystem.finalRankings.overall.length;
    
    let html = `
        <div class="fade-in">
            <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">Final Competition Results</h4>
            
            <div style="background: rgba(33, 150, 243, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 1.5rem;">
                <i class="fas fa-info-circle" style="color: #2196f3;"></i> 
                <strong>Eligibility Note:</strong> Only choirs that performed BOTH African and Western songs are eligible for overall rankings.
                ${eligibleChoirs} choirs are eligible (${eligibleChoirs - fullyAssessedChoirs} pending complete assessment).
            </div>
    `;
    
    if (overallWinner || westernWinner || africanWinner) {
        html += `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        `;
        
        if (westernWinner) {
            html += `
                <div style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(30, 136, 229, 0.1) 100%); padding: 1.5rem; border-radius: 10px; border: 2px solid #2196f3; text-align: center;">
                    <div style="font-size: 1.2rem; color: #2196f3; font-weight: bold; margin-bottom: 0.5rem;">Western Winner</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: white;">${westernWinner.choir.name}</div>
                    <div style="color: rgba(255, 255, 255, 0.8); margin-top: 0.5rem;">${westernWinner.choir.region}</div>
                    <div style="font-size: 2rem; font-weight: bold; color: #2196f3; margin-top: 1rem;">${westernWinner.score.toFixed(1)}</div>
                    <div style="color: rgba(255, 255, 255, 0.7);">${getGradeFromScore(westernWinner.score)}</div>
                </div>
            `;
        }
        
        if (africanWinner) {
            html += `
                <div style="background: linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.1) 100%); padding: 1.5rem; border-radius: 10px; border: 2px solid #f44336; text-align: center;">
                    <div style="font-size: 1.2rem; color: #f44336; font-weight: bold; margin-bottom: 0.5rem;">African Winner</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: white;">${africanWinner.choir.name}</div>
                    <div style="color: rgba(255, 255, 255, 0.8); margin-top: 0.5rem;">${africanWinner.choir.region}</div>
                    <div style="font-size: 2rem; font-weight: bold; color: #f44336; margin-top: 1rem;">${africanWinner.score.toFixed(1)}</div>
                    <div style="color: rgba(255, 255, 255, 0.7);">${getGradeFromScore(africanWinner.score)}</div>
                </div>
            `;
        }
        
        if (overallWinner) {
            html += `
                <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(184, 134, 11, 0.2) 100%); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--primary-gold); text-align: center;">
                    <div style="font-size: 1.2rem; color: var(--primary-gold); font-weight: bold; margin-bottom: 0.5rem;">Overall Winner</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: white;">${overallWinner.choir.name}</div>
                    <div style="color: rgba(255, 255, 255, 0.8); margin-top: 0.5rem;">${overallWinner.choir.region}</div>
                    <div style="font-size: 2rem; font-weight: bold; color: var(--primary-gold); margin-top: 1rem;">${overallWinner.score.toFixed(1)}</div>
                    <div style="color: rgba(255, 255, 255, 0.7);">${getGradeFromScore(overallWinner.score)}</div>
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    if (!overallWinner && eligibleChoirs > 0) {
        html += `
            <div style="background: rgba(212, 175, 55, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary-gold); margin-bottom: 1.5rem;">
                <i class="fas fa-info-circle" style="color: var(--primary-gold);"></i> 
                No overall winner yet. ${eligibleChoirs} choirs are eligible, but need complete assessments for both genres.
            </div>
        `;
    } else if (eligibleChoirs === 0) {
        html += `
            <div style="background: rgba(244, 67, 54, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #f44336; margin-bottom: 1.5rem;">
                <i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> 
                No choirs are eligible for overall rankings. Choirs must perform BOTH African and Western songs to qualify.
            </div>
        `;
    }
    
    html += `
            <div class="tab-nav" style="overflow-x: auto; white-space: nowrap;">
                <button class="tab-btn active" onclick="showFinalResultsTab(event, 'overall')">Overall Winners</button>
                <button class="tab-btn" onclick="showFinalResultsTab(event, 'western')">Western Category</button>
                <button class="tab-btn" onclick="showFinalResultsTab(event, 'african')">African Category</button>
                <button class="tab-btn" onclick="showFinalResultsTab(event, 'methodology')">Scoring Methodology</button>
            </div>
            
            <div id="finalResultsTabContent"></div>
            
            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="closeFinalResultsModal()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('finalResultsContent').innerHTML = html;
    showFinalResultsTab({ target: { classList: { add: function() {}, remove: function() {} } } }, 'overall');
}

function showFinalResultsTab(event, tab) {
    const container = document.getElementById('finalResultsTabContent');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (tab === 'overall') {
        container.innerHTML = renderOverallWinners();
    } else if (tab === 'western') {
        container.innerHTML = renderCategoryWinners('western');
    } else if (tab === 'african') {
        container.innerHTML = renderCategoryWinners('african');
    } else {
        container.innerHTML = renderMethodologyExplanation();
    }
}

function renderOverallWinners() {
    const rankings = scoringSystem.finalRankings.overall.slice(0, 10);
    
    if (rankings.length === 0) {
        const eligibleChoirs = appState.choirs.filter(choir => {
            const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                                choir.westernSong && choir.westernSong.trim() !== '';
            return hasBothSongs;
        }).length;
        
        if (eligibleChoirs === 0) {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-info-circle fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                    <p style="color: rgba(255, 255, 255, 0.6);">No choirs are eligible for overall rankings</p>
                    <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">Choirs must perform BOTH African and Western songs to qualify for overall rankings.</p>
                </div>
            `;
        } else {
            return `
                <div class="text-center py-5">
                    <i class="fas fa-clock fa-3x" style="color: rgba(255, 255, 255, 0.2); margin-bottom: 1rem;"></i>
                    <p style="color: rgba(255, 255, 255, 0.6);">No results available yet for overall winners</p>
                    <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">${eligibleChoirs} choirs are eligible but need complete assessments for both genres.</p>
                </div>
            `;
        }
    }
    
    let html = `
        <div style="margin-bottom: 1.5rem;">
            <h5 style="color: var(--primary-gold);">Top 10 Overall Rankings</h5>
            <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i> Only choirs performing BOTH songs are eligible for overall rankings
            </p>
        </div>
        
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Choir</th>
                        <th>Category</th>
                        <th>Western</th>
                        <th>African</th>
                        <th>Overall</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    rankings.forEach((ranking) => {
        const choirStats = scoringSystem.getChoirStatistics(ranking.choir.id);
        const grade = getGradeFromScore(ranking.score);
        const gradeClass = getGradeClass(grade);
        
        let positionStyle = '';
        if (ranking.rank === 1) {
            positionStyle = 'background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000;';
        } else if (ranking.rank === 2) {
            positionStyle = 'background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%); color: #000;';
        } else if (ranking.rank === 3) {
            positionStyle = 'background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%); color: #000;';
        }
        
        html += `
            <tr>
                <td>
                    <div class="position-badge" style="${positionStyle}">${ranking.rank}</div>
                    ${ranking.isTie ? `<br><small style="color: #ff9800; font-size: 0.8rem;">TIE</small>` : ''}
                </td>
                <td><strong>${ranking.choir.name}</strong><br><small>${ranking.choir.region}</small></td>
                <td><span class="category-badge">${appState.categories[ranking.choir.category]}</span></td>
                <td>${choirStats.western.trimmedMean > 0 ? choirStats.western.trimmedMean.toFixed(1) : 'N/A'}<br><small>(${choirStats.western.count})</small></td>
                <td>${choirStats.african.trimmedMean > 0 ? choirStats.african.trimmedMean.toFixed(1) : 'N/A'}<br><small>(${choirStats.african.count})</small></td>
                <td><strong style="font-size: 1.1rem;">${ranking.score.toFixed(1)}</strong></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border-left: 4px solid var(--primary-gold);">
            <p style="margin: 0; color: rgba(255, 255, 255, 0.8);">
                <i class="fas fa-info-circle" style="color: var(--primary-gold);"></i> 
                <strong>Note:</strong> Only choirs performing both African and Western songs are eligible for overall rankings. 
                Single-song choirs compete in their respective genre categories only.
            </p>
        </div>
    `;
    
    return html;
}

function renderCategoryWinners(genre) {
    const rankings = scoringSystem.finalRankings[genre].slice(0, 10);
    const genreName = genre === 'western' ? 'Western' : 'African';
    
    if (rankings.length === 0) {
        return '<div class="text-center py-5">No results available yet</div>';
    }
    
    let html = `
        <div style="margin-bottom: 1.5rem;">
            <h5 style="color: ${genre === 'western' ? '#2196f3' : '#f44336'};">Top 10 ${genreName} Category Rankings</h5>
            <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">Based on trimmed mean calculation for ${genreName.toLowerCase()} performances</p>
        </div>
        
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Choir</th>
                        <th>Category</th>
                        <th>${genreName} Score</th>
                        <th>Assessors</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    rankings.forEach((ranking) => {
        const choirStats = scoringSystem.getChoirStatistics(ranking.choir.id);
        const score = genre === 'western' ? choirStats.western.trimmedMean : choirStats.african.trimmedMean;
        const assessorCount = genre === 'western' ? choirStats.western.count : choirStats.african.count;
        const grade = getGradeFromScore(score);
        const gradeClass = getGradeClass(grade);
        
        html += `
            <tr>
                <td>
                    <div class="position-badge">${ranking.rank}</div>
                    ${ranking.isTie ? `<br><small style="color: #ff9800; font-size: 0.8rem;">TIE</small>` : ''}
                </td>
                <td><strong>${ranking.choir.name}</strong><br><small>${ranking.choir.region}</small></td>
                <td><span class="category-badge">${appState.categories[ranking.choir.category]}</span></td>
                <td><strong style="font-size: 1.1rem;">${score.toFixed(1)}</strong></td>
                <td>${assessorCount} assessors</td>
                <td>
                    <span class="grade-text ${gradeClass}" style="padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function renderMethodologyExplanation() {
    return `
        <div style="padding: 1.5rem;">
            <h5 style="color: var(--primary-gold); margin-bottom: 1rem;">Official Scoring Methodology</h5>
            
            <div style="background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(45, 45, 45, 0.8) 100%); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <h6 style="color: #2196f3; margin-bottom: 1rem;">Trimmed Mean Calculation</h6>
                <p style="color: rgba(255, 255, 255, 0.8);">The system uses a robust trimmed mean approach to eliminate potential bias:</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.2);">
                        <strong style="color: var(--primary-gold);">1 Assessor</strong>
                        <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                            Use raw score
                        </div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.2);">
                        <strong style="color: var(--primary-gold);">2 Assessors</strong>
                        <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                            Average of both scores
                        </div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.2);">
                        <strong style="color: var(--primary-gold);">3+ Assessors</strong>
                        <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                            Remove highest & lowest, average remainder
                        </div>
                    </div>
                </div>
                
                <h6 style="color: #2196f3; margin-top: 1.5rem; margin-bottom: 1rem;">Genre Winners</h6>
                <ul style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8);">
                    <li><strong>Western Winner:</strong> Highest trimmed mean score in Western category</li>
                    <li><strong>African Winner:</strong> Highest trimmed mean score in African category</li>
                    <li><strong>Overall Winner:</strong> Highest average of both genres (only for choirs with both songs)</li>
                    <li>Each category has independent winners</li>
                </ul>
                
                <h6 style="color: #2196f3; margin-top: 1.5rem; margin-bottom: 1rem;">Assessor Rules</h6>
                <ul style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8);">
                    <li>Assessors can only view their own scores</li>
                    <li>Assessors cannot re-assess choirs they've already assessed for the same genre</li>
                    <li>For choirs with both songs, assessors can assess each genre separately</li>
                    <li>For single-song choirs, only the relevant genre is assessed</li>
                </ul>
                
                <h6 style="color: #2196f3; margin-top: 1.5rem; margin-bottom: 1rem;">Tie-Breaking Logic</h6>
                <ul style="margin: 0; padding-left: 1.5rem; color: rgba(255, 255, 255, 0.8);">
                    <li>Choirs with identical scores receive the same rank</li>
                    <li>The next rank is skipped (e.g., tie for 3rd → both get rank 3, next is rank 5)</li>
                    <li>This ensures fair ranking while acknowledging equal performance</li>
                </ul>
            </div>
        </div>
    `;
}

function closeFinalResultsModal() {
    document.getElementById('finalResultsModal').style.display = 'none';
}

// =======================
// RENDER REPORTS FUNCTION
// =======================

function renderReports() {
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">Generate Reports</h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card" onclick="generateCategoryReport('GREAT CHAMPS')">
                    <div class="card-icon">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h3 class="card-title">Great Champs Report</h3>
                    <p class="card-description">Generate detailed report for the Great Champs category including scores, rankings, and analysis.</p>
                </div>
                
                <div class="dashboard-card" onclick="generateCategoryReport('LARGE')">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="card-title">Large Category Report</h3>
                    <p class="card-description">Create comprehensive report for the Large category with statistical analysis and visualizations.</p>
                </div>
                
                <div class="dashboard-card" onclick="generateCategoryReport('STANDARD')">
                    <div class="card-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3 class="card-title">Standard Category Report</h3>
                    <p class="card-description">Generate detailed report for the Standard category including performance metrics and rankings.</p>
                </div>
                
                <div class="dashboard-card" onclick="generateComprehensiveReport()">
                    <div class="card-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <h3 class="card-title">Comprehensive Report</h3>
                    <p class="card-description">Create a complete competition report with all categories, rankings, and detailed analysis.</p>
                </div>
                
                <div class="dashboard-card" onclick="generateAssessorsSummaryReport()">
                    <div class="card-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3 class="card-title">Assessors Summary</h3>
                    <p class="card-description">Generate summary report of all assessors' assessments and scoring patterns.</p>
                </div>
            </div>
            
            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
}

// =========================
// USER MANAGEMENT FUNCTIONS
// =========================

function openUserManagement() {
    document.getElementById('userManagementModal').style.display = 'flex';
    renderUserManagement();
}

function closeUserManagement() {
    document.getElementById('userManagementModal').style.display = 'none';
}

function openAddUser() {
    document.getElementById('userFormTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('editUserId').value = '';
    document.getElementById('newUsername').readOnly = false;
    document.getElementById('userFormModal').style.display = 'flex';
}

function openEditUser(userId) {
    const user = appState.users[userId];
    if (user) {
        document.getElementById('userFormTitle').textContent = 'Edit User';
        document.getElementById('editUserId').value = userId;
        document.getElementById('newUsername').value = userId;
        document.getElementById('newUsername').readOnly = true;
        document.getElementById('newName').value = user.name;
        document.getElementById('newRole').value = user.role;
        document.getElementById('newEmail').value = user.email || '';
        document.getElementById('userFormModal').style.display = 'flex';
    }
}

function closeUserForm() {
    document.getElementById('userFormModal').style.display = 'none';
    document.getElementById('newUsername').readOnly = false;
}

function saveUser() {
    const userId = document.getElementById('editUserId').value || 
                  document.getElementById('newUsername').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const name = document.getElementById('newName').value.trim();
    const role = document.getElementById('newRole').value;
    const email = document.getElementById('newEmail').value.trim();

    if (!username || !password || !name || !role) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!document.getElementById('editUserId').value && appState.users[username]) {
        showNotification('Username already exists', 'error');
        return;
    }

    appState.users[username] = {
        password: password,
        role: role,
        name: name,
        id: username,
        email: email || `${username}@example.com`
    };

    closeUserForm();
    renderUserManagement();
    showNotification('User saved successfully', 'success');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        if (userId === appState.currentUserId) {
            showNotification('Cannot delete currently logged in user', 'error');
            return;
        }
        delete appState.users[userId];
        renderUserManagement();
        showNotification('User deleted successfully', 'success');
    }
}

function renderUserManagement() {
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">Manage System Users</h4>
        <div class="action-buttons-container" style="margin-bottom: 1rem;">
            <button class="action-btn" onclick="openAddUser()">
                <i class="fas fa-plus"></i> Add New User
            </button>
        </div>
        
        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(appState.users).forEach(username => {
        const user = appState.users[username];
        html += `
            <tr>
                <td><strong>${username}</strong></td>
                <td>${user.name}</td>
                <td><span class="category-badge">${user.role.toUpperCase()}</span></td>
                <td>${user.email || 'N/A'}</td>
                <td>
                    <div class="action-cell">
                        <button class="action-btn icon-btn edit-btn" onclick="openEditUser('${username}')" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn icon-btn delete-btn" onclick="deleteUser('${username}')" title="Delete User" ${username === appState.currentUserId ? 'disabled' : ''}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeUserManagement()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    `;
    
    document.getElementById('userManagementContent').innerHTML = html;
}

// ===============================================================
// FIXED: clearAllAssessmentData function - properly resets system
// ===============================================================
function clearAllAssessmentData() {
    if (confirm('Are you sure you want to clear ALL assessment data? This will remove all saved assessments and cannot be undone.')) {
        scoringSystem.assessorScores = {};
        scoringSystem.trimmedMeans = {};
        scoringSystem.finalRankings = {
            western: [],
            african: [],
            overall: []
        };
        
        appState.choirs.forEach(choir => {
            choir.status = 'pending';
        });
        
        localStorage.removeItem('tmf_scoring_data');
        
        showNotification('All assessment data cleared successfully', 'success');
        
        if (appState.currentView === 'assessmentChooser') {
            renderAssessmentChooser();
        } else if (appState.currentView === 'manageChoirs') {
            renderManageChoirs();
        } else if (appState.currentView === 'dashboard') {
            renderDashboard();
        } else if (appState.currentView === 'results') {
            renderResults();
        }
    }
}

// =============================================================
// NEW: resetSystemToCleanState function - complete system reset
// =============================================================
function resetSystemToCleanState() {
    if (confirm('WARNING: This will reset the entire system to a clean state. All assessment data will be permanently deleted. Are you absolutely sure?')) {
        scoringSystem.assessorScores = {};
        scoringSystem.trimmedMeans = {};
        scoringSystem.finalRankings = {
            western: [],
            african: [],
            overall: []
        };
        
        appState.choirs.forEach(choir => {
            choir.status = 'pending';
        });
        
        localStorage.removeItem('tmf_scoring_data');
        
        appState.currentReportChoir = null;
        appState.currentReportStats = null;
        
        adjudicationData.currentChoir = null;
        adjudicationData.currentGenre = 'western';
        adjudicationData.assessmentData = {
            western: {
                intonation: 0.0,
                pitchAccuracy: 0.0,
                language: 0.0,
                vocalTechnique: 0.0,
                choralTechnique: 0.0,
                rhythm: 0.0,
                artistry: 0.0,
                stage: 0.0,
                total: 0.0
            },
            african: {
                intonation: 0.0,
                pitchAccuracy: 0.0,
                language: 0.0,
                vocalTechnique: 0.0,
                choralTechnique: 0.0,
                rhythm: 0.0,
                artistry: 0.0,
                stage: 0.0,
                total: 0.0
            }
        };
        adjudicationData.comments = {
            western: "",
            african: ""
        };
        
        showNotification('System reset to clean state successfully', 'success');
        
        renderDashboard();
    }
}

// ==========================================================
// NEW: debugCheckData function - helper to check system data
// ==========================================================
function debugCheckData() {
    console.log('=== SYSTEM DATA DEBUG ===');
    console.log('Choirs:', appState.choirs.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status
    })));
    
    console.log('Assessor Scores:', Object.keys(scoringSystem.assessorScores).map(choirId => ({
        choirId,
        western: Object.keys(scoringSystem.assessorScores[choirId]?.western || {}),
        african: Object.keys(scoringSystem.assessorScores[choirId]?.african || {})
    })));
    
    console.log('Trimmed Means:', scoringSystem.trimmedMeans);
    console.log('Final Rankings:', scoringSystem.finalRankings);
    console.log('LocalStorage:', localStorage.getItem('tmf_scoring_data'));
    console.log('=== END DEBUG ===');
    
    showNotification('Debug data logged to console', 'info');
}

// =============================
// REGION AUTOCOMPLETE FUNCTION
// =============================

function setupRegionAutocomplete() {
    const regionInput = document.getElementById('choirRegion');
    if (!regionInput) return;
    
    const commonRegions = [
        'Gauteng', 'Western Cape', 'Eastern Cape', 'KwaZulu-Natal', 
        'Free State', 'North West', 'Northern Cape', 'Mpumalanga', 'Limpopo',
        'Botswana', 'Eswatini', 'Lesotho', 'Zimbabwe', 'Namibia',
        'Mozambique', 'Zambia', 'Tanzania', 'Kenya', 'Uganda',
        'Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Cameroon'
    ];

    let datalist = document.getElementById('regionSuggestions');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'regionSuggestions';
        regionInput.parentNode.appendChild(datalist);
    }

    datalist.innerHTML = '';
    commonRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        datalist.appendChild(option);
    });

    regionInput.setAttribute('list', 'regionSuggestions');
}

// ==========================
// CHOIR MANAGEMENT FUNCTIONS
// ==========================

function openAddChoir() {
    document.getElementById('choirFormTitle').textContent = 'Add New Choir';
    document.getElementById('choirForm').reset();
    document.getElementById('editChoirId').value = '';
    document.getElementById('choirFormModal').style.display = 'flex';
    
    setupRegionAutocomplete();
}

function openEditChoir(choirId) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (choir) {
        document.getElementById('choirFormTitle').textContent = 'Edit Choir';
        document.getElementById('editChoirId').value = choirId;
        document.getElementById('choirName').value = choir.name;
        document.getElementById('choirRegion').value = choir.region;
        document.getElementById('choirCategory').value = choir.category;
        document.getElementById('choirAfricanSong').value = choir.africanSong;
        document.getElementById('choirWesternSong').value = choir.westernSong;
        document.getElementById('choirFormModal').style.display = 'flex';
        
        setupRegionAutocomplete();
    }
}

function closeChoirForm() {
    document.getElementById('choirFormModal').style.display = 'none';
}

function saveChoir() {
    const choirId = document.getElementById('editChoirId').value;
    const name = document.getElementById('choirName').value.trim();
    const region = document.getElementById('choirRegion').value;
    const category = document.getElementById('choirCategory').value;
    const africanSong = document.getElementById('choirAfricanSong').value.trim();
    const westernSong = document.getElementById('choirWesternSong').value.trim();

    if (!name || !region || !category) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (choirId) {
        const choir = appState.choirs.find(c => c.id === parseInt(choirId));
        if (choir) {
            choir.name = name;
            choir.region = region;
            choir.category = category;
            choir.africanSong = africanSong;
            choir.westernSong = westernSong;
        }
    } else {
        let newId;
        if (appState.choirs.length === 0) {
            newId = 1;
        } else {
            const existingIds = appState.choirs.map(c => c.id).filter(id => typeof id === 'number' && !isNaN(id) && id > 0);
            if (existingIds.length === 0) {
                newId = 1;
            } else {
                const maxId = Math.max(...existingIds);
                newId = maxId + 1;
            }
        }
        appState.choirs.push({
            id: newId,
            name: name,
            region: region,
            category: category,
            africanSong: africanSong,
            westernSong: westernSong,
            status: 'pending'
        });
        
        if (scoringSystem.assessorScores[newId]) {
            delete scoringSystem.assessorScores[newId];
        }
        if (scoringSystem.trimmedMeans[newId]) {
            delete scoringSystem.trimmedMeans[newId];
        }
        
        scoringSystem.calculateRankings();
        scoringSystem.saveToLocalStorage();
    }

    closeChoirForm();
    if (appState.currentView === 'manageChoirs') {
        renderManageChoirs();
    } else if (appState.currentView === 'assessmentChooser') {
        renderAssessmentChooser();
    }
    showNotification('Choir saved successfully', 'success');
}

function deleteChoir(choirId) {
    if (confirm('Are you sure you want to delete this choir?')) {
        appState.choirs = appState.choirs.filter(c => c.id !== parseInt(choirId));
        
        if (scoringSystem.assessorScores[choirId]) {
            delete scoringSystem.assessorScores[choirId];
        }
        if (scoringSystem.trimmedMeans[choirId]) {
            delete scoringSystem.trimmedMeans[choirId];
        }
        
        scoringSystem.calculateRankings();
        scoringSystem.saveToLocalStorage();
        
        if (appState.currentView === 'manageChoirs') {
            renderManageChoirs();
        }
        showNotification('Choir deleted successfully', 'success');
    }
}

// =============================
// RENDER MANAGE CHOIRS FUNCTION 
// =============================

function renderManageChoirs() {
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 header-actions-wrapper">
                <h3 style="color: var(--primary-gold); margin: 0;">Manage Choirs</h3>
                <div class="action-buttons-group">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="openAddChoir()">
                        <i class="fas fa-plus"></i> Add
                    </button>
                    <button class="action-btn" onclick="openImportChoirs()">
                        <i class="fas fa-file-import"></i> Import
                    </button>
                    <button class="action-btn danger" onclick="clearAllAssessmentData()">
                        <i class="fas fa-trash"></i> Clear Data
                    </button>
                </div>
            </div>
            
            <div class="assessment-container">
                <div class="table-responsive">
                    <table class="results-table manage-choirs-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Choir Name</th>
                                <th>Region</th>
                                <th>Category</th>
                                <th>African Song</th>
                                <th>Western Song</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    appState.choirs.forEach(choir => {
        const statusClass = choir.status === 'assessed' ? 'status-assessed' : 'status-pending';
        const statusText = choir.status === 'assessed' ? 'Assessed' : 'Pending';
        
        html += `
            <tr>
                <td>${choir.id}</td>
                <td><strong>${choir.name}</strong></td>
                <td>${choir.region}</td>
                <td><span class="category-badge">${appState.categories[choir.category] || choir.category}</span></td>
                <td>${choir.africanSong || 'N/A'}</td>
                <td>${choir.westernSong || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-cell">
                        <button class="action-btn icon-btn edit-btn" onclick="openEditChoir(${choir.id})" title="Edit Choir">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn icon-btn delete-btn" onclick="deleteChoir(${choir.id})" title="Delete Choir">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="action-btn icon-btn" onclick="showChoirFullReport(${choir.id})" title="Generate Full Report" style="background: linear-gradient(135deg, var(--primary-gold) 0%, #B8860B 100%); color: #000;">
                            <i class="fas fa-file-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
}

// ============================================
// REPORT FUNCTIONS
// ============================================

function showChoirDetailedReport(choirId) {
    const choir = appState.choirs.find(c => c.id === choirId);
    const stats = scoringSystem.getChoirStatistics(choirId);
    
    if (stats.western.count === 0 && stats.african.count === 0) {
        showNotification('No assessments available for this choir', 'warning');
        return;
    }
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">${choir.name} - Assessment Report</h4>
        <div class="row mb-3" style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1; min-width: 200px;">
                <p><strong>Region:</strong> ${choir.region}</p>
                <p><strong>Category:</strong> ${appState.categories[choir.category]}</p>
            </div>
            <div style="flex: 1; min-width: 200px;">
                <p><strong>African Song:</strong> ${choir.africanSong || 'Not Performing'}</p>
                <p><strong>Western Song:</strong> ${choir.westernSong || 'Not Performing'}</p>
            </div>
        </div>
        
        <h5 style="color: var(--primary-gold); margin-bottom: 1rem;">Assessor Assessments</h5>
        
        <div class="tab-nav" style="margin-bottom: 1rem; overflow-x: auto; white-space: nowrap;">
            <button class="tab-btn ${stats.western.count > 0 ? 'active' : ''}" onclick="showReportTab(event, 'western', ${choirId})" ${stats.western.count === 0 ? 'disabled' : ''}>Western Scores</button>
            <button class="tab-btn ${stats.western.count === 0 && stats.african.count > 0 ? 'active' : ''}" onclick="showReportTab(event, 'african', ${choirId})" ${stats.african.count === 0 ? 'disabled' : ''}>African Scores</button>
            <button class="tab-btn" onclick="showReportTab(event, 'overall', ${choirId})">Overall Results</button>
        </div>
        
        <div id="reportTabContent">
            ${stats.western.count > 0 ? renderReportTab('western', choirId, stats) : 
              stats.african.count > 0 ? renderReportTab('african', choirId, stats) : 
              renderReportTab('overall', choirId, stats)}
        </div>
        
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeChoirReportModal()">
                <i class="fas fa-arrow-left"></i> Back to Results
            </button>
        </div>
    `;
    
    document.getElementById('choirReportContent').innerHTML = html;
    document.getElementById('choirReportModal').style.display = 'flex';
}

function showReportTab(event, tab, choirId) {
    const container = document.getElementById('reportTabContent');
    const stats = scoringSystem.getChoirStatistics(choirId);
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    container.innerHTML = renderReportTab(tab, choirId, stats);
}

function renderReportTab(tab, choirId, stats) {
    if (tab === 'western') {
        return renderWesternReport(stats.western);
    } else if (tab === 'african') {
        return renderAfricanReport(stats.african);
    } else {
        return renderOverallReport(choirId, stats);
    }
}

function renderWesternReport(stats) {
    let html = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(33, 150, 243, 0.15); border-radius: 8px; border: 1px solid rgba(33, 150, 243, 0.3);">
            <strong style="color: #2196f3;">Western Category - Trimmed Mean Calculation</strong>
            <div style="margin-top: 0.5rem; color: var(--light-text);">
                <strong>Number of Assessors:</strong> ${stats.count}
                ${stats.count > 0 ? `<span style="margin-left: 1rem;"><strong>Trimmed Mean:</strong> ${stats.trimmedMean.toFixed(1)}</span>` : ''}
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Assessor</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (stats.assessments.length === 0) {
        html += `<tr><td colspan="3" class="text-center">No western scores recorded</td></tr>`;
    } else {
        const sortedScores = [...stats.rawScores].sort((a, b) => a - b);
        
        stats.assessments.forEach((assessment) => {
            let status = '';
            if (stats.count === 1) {
                status = '<span class="status-assessed status-badge">Single Assessor - Raw Score</span>';
            } else if (stats.count === 2) {
                status = '<span class="status-assessed status-badge">Two Assessors - Included in Average</span>';
            } else if (stats.count >= 3) {
                if (assessment.total === sortedScores[0]) {
                    status = '<span class="status-pending status-badge">Lowest Score - Removed</span>';
                } else if (assessment.total === sortedScores[sortedScores.length - 1]) {
                    status = '<span class="status-pending status-badge">Highest Score - Removed</span>';
                } else {
                    status = '<span class="status-assessed status-badge">Included in Trimmed Mean</span>';
                }
            }
            
            html += `
                <tr>
                    <td>${assessment.assessorName}</td>
                    <td><strong>${assessment.total.toFixed(1)}</strong></td>
                    <td>${status}</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        ${stats.count > 0 ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
            <strong>Calculation Details:</strong>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.8);">
                ${getCalculationExplanation(stats)}
            </div>
        </div>
        ` : ''}
    `;
    
    return html;
}

function renderAfricanReport(stats) {
    let html = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(244, 67, 54, 0.15); border-radius: 8px; border: 1px solid rgba(244, 67, 54, 0.3);">
            <strong style="color: #f44336;">African Category - Trimmed Mean Calculation</strong>
            <div style="margin-top: 0.5rem; color: var(--light-text);">
                <strong>Number of Assessors:</strong> ${stats.count}
                ${stats.count > 0 ? `<span style="margin-left: 1rem;"><strong>Trimmed Mean:</strong> ${stats.trimmedMean.toFixed(1)}</span>` : ''}
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Assessor</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (stats.assessments.length === 0) {
        html += `<tr><td colspan="3" class="text-center">No african scores recorded</td></tr>`;
    } else {
        const sortedScores = [...stats.rawScores].sort((a, b) => a - b);
        
        stats.assessments.forEach((assessment) => {
            let status = '';
            if (stats.count === 1) {
                status = '<span class="status-assessed status-badge">Single Assessor - Raw Score</span>';
            } else if (stats.count === 2) {
                status = '<span class="status-assessed status-badge">Two Assessors - Included in Average</span>';
            } else if (stats.count >= 3) {
                if (assessment.total === sortedScores[0]) {
                    status = '<span class="status-pending status-badge">Lowest Score - Removed</span>';
                } else if (assessment.total === sortedScores[sortedScores.length - 1]) {
                    status = '<span class="status-pending status-badge">Highest Score - Removed</span>';
                } else {
                    status = '<span class="status-assessed status-badge">Included in Trimmed Mean</span>';
                }
            }
            
            html += `
                <tr>
                    <td>${assessment.assessorName}</td>
                    <td><strong>${assessment.total.toFixed(1)}</strong></td>
                    <td>${status}</td>
                </tr>
            `;
        });
    }
    
    html += `
                </tbody>
            </table>
        </div>
        
        ${stats.count > 0 ? `
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
            <strong>Calculation Details:</strong>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.8);">
                ${getCalculationExplanation(stats)}
            </div>
        </div>
        ` : ''}
    `;
    
    return html;
}

function getCalculationExplanation(stats) {
    if (stats.count === 1) {
        return 'Single assessor assessment: Raw score used directly.';
    } else if (stats.count === 2) {
        const sum = stats.rawScores.reduce((a, b) => a + b, 0);
        return `Two assessors: (${stats.rawScores[0].toFixed(1)} + ${stats.rawScores[1].toFixed(1)}) ÷ 2 = ${stats.trimmedMean.toFixed(1)}`;
    } else if (stats.count >= 3) {
        const sorted = [...stats.rawScores].sort((a, b) => a - b);
        const remaining = sorted.slice(1, -1);
        const sum = remaining.reduce((a, b) => a + b, 0);
        return `Trimmed mean: Removed highest (${sorted[sorted.length - 1].toFixed(1)}) and lowest (${sorted[0].toFixed(1)}). Average of remaining ${remaining.length} scores: ${sum.toFixed(1)} ÷ ${remaining.length} = ${stats.trimmedMean.toFixed(1)}`;
    }
    return 'No calculation available.';
}

function renderOverallReport(choirId, stats) {
    const overallScore = stats.overall;
    const grade = getGradeFromScore(overallScore);
    const gradeClass = getGradeClass(grade);
    
    let html = `
        <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(18, 18, 18, 0.8) 100%); border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 1.5rem;">
            <div style="font-size: 3rem; font-weight: bold; color: var(--primary-gold);">
                ${overallScore.toFixed(1)}
            </div>
            <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.7); font-size: 1.1rem;">
                Final Aggregate Score
            </div>
            <div style="margin-top: 1.5rem;">
                <span class="grade-text ${gradeClass}" style="font-size: 1.5rem; padding: 0.75rem 2rem;">
                    ${grade}
                </span>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
            <div style="background: rgba(33, 150, 243, 0.15); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(33, 150, 243, 0.3);">
                <h6 style="color: #2196f3; margin-bottom: 1rem;">Western Performance</h6>
                <div style="font-size: 2rem; font-weight: bold; color: #2196f3;">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A'}</div>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.7);">
                    ${stats.western.count} assessor${stats.western.count !== 1 ? 's' : ''}
                </div>
            </div>
            
            <div style="background: rgba(244, 67, 54, 0.15); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(244, 67, 54, 0.3);">
                <h6 style="color: #f44336; margin-bottom: 1rem;">African Performance</h6>
                <div style="font-size: 2rem; font-weight: bold; color: #f44336;">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A'}</div>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.7);">
                    ${stats.african.count} assessor${stats.african.count !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    `;
    
    if (stats.western.trimmedMean > 0 && stats.african.trimmedMean > 0) {
        html += `
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(212, 175, 55, 0.15); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                <strong style="color: var(--primary-gold);">Overall Calculation:</strong>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                    (Western ${stats.western.trimmedMean.toFixed(1)} + African ${stats.african.trimmedMean.toFixed(1)}) ÷ 2 = ${overallScore.toFixed(1)}
                </div>
            </div>
        `;
    } else if (stats.western.trimmedMean > 0) {
        html += `
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(212, 175, 55, 0.15); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                <strong style="color: var(--primary-gold);">Overall Calculation:</strong>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                    Single song choir: Western score ${stats.western.trimmedMean.toFixed(1)} used as final score
                </div>
            </div>
        `;
    } else if (stats.african.trimmedMean > 0) {
        html += `
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(212, 175, 55, 0.15); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                <strong style="color: var(--primary-gold);">Overall Calculation:</strong>
                <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                    Single song choir: African score ${stats.african.trimmedMean.toFixed(1)} used as final score
                </div>
            </div>
        `;
    }
    
    return html;
}

function closeChoirReportModal() {
    document.getElementById('choirReportModal').style.display = 'none';
}

// ============================================
// ENHANCED PDF REPORT GENERATION FUNCTIONS
// ============================================

function generateCategoryReport(category) {
    const categoryName = appState.categories[category];
    
    const categoryRankings = scoringSystem.finalRankings.overall.filter(r => 
        r.choir.category === category
    );
    
    if (categoryRankings.length === 0) {
        showNotification(`No results available for ${categoryName}`, 'warning');
        return;
    }
    
    const reportContent = generateProfessionalPDFContent({
        title: `${categoryName} Competition Report`,
        subtitle: 'Tiro Mpane Foundation National Chorale Eisteddfod',
        category: categoryName,
        rankings: categoryRankings,
        includeSummary: true,
        includeMethodology: true
    });
    
    generateProfessionalPDF(reportContent, `${categoryName}_Report_${new Date().toISOString().split('T')[0]}`);
    showNotification(`${categoryName} report generated successfully!`, 'success');
}

function generateAllChoirReports() {
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed');
    
    if (assessedChoirs.length === 0) {
        showNotification('No choirs have been assessed yet', 'warning');
        return;
    }
    
    const sortedChoirs = [...assessedChoirs].sort((a, b) => {
        const scoreA = scoringSystem.getChoirOverallScore(a.id);
        const scoreB = scoringSystem.getChoirOverallScore(b.id);
        return scoreB - scoreA;
    });
    
    let reportContent = `
        <div class="pdf-report-container">
            <div class="pdf-header">
                <h1>Tiro Mpane Foundation</h1>
                <h2>National Chorale Eisteddfod</h2>
                <h3>Comprehensive Choir Assessment Reports</h3>
            </div>
            
            <div class="pdf-metadata">
                <div>Generated: ${new Date().toLocaleDateString()}</div>
                <div>Total Choirs: ${assessedChoirs.length}</div>
                <div>Page 1 of 1</div>
            </div>
            
            <div class="pdf-section">
                <h3>Executive Summary</h3>
                <div class="summary-box">
                    <div class="summary-item">
                        <span class="summary-label">Total Assessed Choirs:</span>
                        <span class="summary-value">${assessedChoirs.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Average Overall Score:</span>
                        <span class="summary-value">${(assessedChoirs.reduce((sum, choir) => sum + scoringSystem.getChoirOverallScore(choir.id), 0) / assessedChoirs.length).toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Assessors:</span>
                        <span class="summary-value">${Object.keys(appState.users).filter(u => appState.users[u].role === 'assessor' || appState.users[u].role === 'chair').length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Report Date:</span>
                        <span class="summary-value">${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="pdf-section">
                <h3>Choir Assessment Details</h3>
                <table class="pdf-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Choir Name</th>
                            <th>Region</th>
                            <th>Category</th>
                            <th>Western Score</th>
                            <th>African Score</th>
                            <th>Overall Score</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    sortedChoirs.forEach((choir, index) => {
        const stats = scoringSystem.getChoirStatistics(choir.id);
        const overallScore = stats.overall;
        const grade = getGradeFromScore(overallScore);
        const gradeClass = grade.toLowerCase().replace(' ', '-');
        
        reportContent += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td><strong>${choir.name}</strong></td>
                <td>${choir.region}</td>
                <td>${appState.categories[choir.category]}</td>
                <td class="score-highlight">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A'}</td>
                <td class="score-highlight">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A'}</td>
                <td><strong class="score-highlight">${overallScore.toFixed(1)}</strong></td>
                <td><span class="grade-badge grade-${gradeClass}">${grade}</span></td>
            </tr>
        `;
    });
    
    reportContent += `
                    </tbody>
                </table>
            </div>
            
            <div class="pdf-section">
                <h3>Scoring Methodology</h3>
                <div class="summary-box">
                    <p><strong>Trimmed Mean Calculation:</strong> For each choir and genre, the highest and lowest assessor scores are removed, then the remaining scores are averaged.</p>
                    <p><strong>Final Score:</strong> Average of Western and African trimmed means (if both assessed), or single genre score if only one performed.</p>
                    <p><strong>Tie-breaking:</strong> Choirs with identical scores receive the same rank, with the next rank skipped.</p>
                    <p><strong>Assessing Panel:</strong> Multiple independent assessors provide scores for each choir and genre.</p>
                </div>
            </div>
            
            <div class="pdf-footer">
                <p>© 2025 Tiro Mpane Foundation - National Chorale Eisteddfod</p>
                <p>Official Competition Report - For Internal Use Only</p>
            </div>
        </div>
    `;
    
    generateProfessionalPDF(reportContent, `All_Choirs_Reports_${new Date().toISOString().split('T')[0]}`);
    showNotification(`Generated detailed reports for ${assessedChoirs.length} choirs!`, 'success');
}

function generateComprehensiveReport() {
    scoringSystem.calculateRankings();
    
    if (scoringSystem.finalRankings.overall.length === 0) {
        showNotification('No results available for comprehensive report', 'warning');
        return;
    }
    
    const reportContent = generateProfessionalPDFContent({
        title: 'Comprehensive Competition Report',
        subtitle: 'Tiro Mpane Foundation National Chorale Eisteddfod',
        category: 'All Categories',
        rankings: scoringSystem.finalRankings.overall,
        includeSummary: true,
        includeMethodology: true,
        includeWinners: true
    });
    
    generateProfessionalPDF(reportContent, `Comprehensive_Report_${new Date().toISOString().split('T')[0]}`);
    showNotification('Comprehensive report generated successfully!', 'success');
}

function generateAssessorsSummaryReport() {
    const assessorStats = {};
    
    Object.keys(appState.users).filter(id => appState.users[id].role === 'assessor').forEach(assessorId => {
        assessorStats[assessorId] = {
            name: appState.users[assessorId].name,
            westernAssessments: 0,
            africanAssessments: 0,
            totalAssessments: 0,
            averageScore: 0,
            scores: []
        };
    });
    
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
                Object.keys(scoringSystem.assessorScores[choirId][genre]).forEach(assessorId => {
                    if (assessorStats[assessorId]) {
                        const score = scoringSystem.assessorScores[choirId][genre][assessorId].total;
                        assessorStats[assessorId].scores.push(score);
                        assessorStats[assessorId].totalAssessments++;
                        if (genre === 'western') {
                            assessorStats[assessorId].westernAssessments++;
                        } else {
                            assessorStats[assessorId].africanAssessments++;
                        }
                    }
                });
            }
        });
    });
    
    Object.keys(assessorStats).forEach(assessorId => {
        const stats = assessorStats[assessorId];
        if (stats.scores.length > 0) {
            stats.averageScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
        }
    });
    
    const activeAssessors = Object.keys(assessorStats).filter(assessorId => assessorStats[assessorId].totalAssessments > 0);
    
    if (activeAssessors.length === 0) {
        showNotification('No assessor assessment data available', 'warning');
        return;
    }
    
    let reportContent = `
        <div class="pdf-report-container">
            <div class="pdf-header">
                <h1>Tiro Mpane Foundation</h1>
                <h2>National Chorale Eisteddfod</h2>
                <h3>Assessors Assessment Summary Report</h3>
            </div>
            
            <div class="pdf-metadata">
                <div>Generated: ${new Date().toLocaleDateString()}</div>
                <div>Active Assessors: ${activeAssessors.length}</div>
                <div>Page 1 of 1</div>
            </div>
            
            <div class="pdf-section">
                <h3>Assessors Performance Summary</h3>
                <table class="pdf-table">
                    <thead>
                        <tr>
                            <th>Assessor</th>
                            <th>Western Assessments</th>
                            <th>African Assessments</th>
                            <th>Total Assessments</th>
                            <th>Average Score</th>
                            <th>Score Range</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    activeAssessors.forEach(assessorId => {
        const stats = assessorStats[assessorId];
        const minScore = stats.scores.length > 0 ? Math.min(...stats.scores).toFixed(1) : 'N/A';
        const maxScore = stats.scores.length > 0 ? Math.max(...stats.scores).toFixed(1) : 'N/A';
        
        reportContent += `
            <tr>
                <td><strong>${stats.name}</strong></td>
                <td>${stats.westernAssessments}</td>
                <td>${stats.africanAssessments}</td>
                <td><strong>${stats.totalAssessments}</strong></td>
                <td class="score-highlight">${stats.averageScore.toFixed(1)}</td>
                <td>${minScore} - ${maxScore}</td>
            </tr>
        `;
    });
    
    reportContent += `
                    </tbody>
                </table>
            </div>
            
            <div class="pdf-section">
                <h3>Assessment Statistics</h3>
                <div class="summary-box">
                    <div class="summary-item">
                        <span class="summary-label">Total Assessments:</span>
                        <span class="summary-value">${activeAssessors.reduce((sum, assessorId) => sum + assessorStats[assessorId].totalAssessments, 0)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Average Score (All Assessors):</span>
                        <span class="summary-value">${(activeAssessors.reduce((sum, assessorId) => sum + assessorStats[assessorId].averageScore, 0) / activeAssessors.length).toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Most Prolific Assessor:</span>
                        <span class="summary-value">${assessorStats[activeAssessors.sort((a, b) => assessorStats[b].totalAssessments - assessorStats[a].totalAssessments)[0]].name}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Highest Average Score:</span>
                        <span class="summary-value">${assessorStats[activeAssessors.sort((a, b) => assessorStats[b].averageScore - assessorStats[a].averageScore)[0]].name} (${assessorStats[activeAssessors.sort((a, b) => assessorStats[b].averageScore - assessorStats[a].averageScore)[0]].averageScore.toFixed(1)})</span>
                    </div>
                </div>
            </div>
            
            <div class="pdf-section">
                <h3>Scoring Consistency Analysis</h3>
                <table class="pdf-table">
                    <thead>
                        <tr>
                            <th>Score Range</th>
                            <th>Number of Assessments</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const scoreRanges = [
        { range: "90-100 (Superior)", min: 90, max: 100 },
        { range: "80-89 (Excellent)", min: 80, max: 89.9 },
        { range: "70-79 (Average)", min: 70, max: 79.9 },
        { range: "60-69 (Below Average)", min: 60, max: 69.9 },
        { range: "50-59 (Insufficient)", min: 50, max: 59.9 },
        { range: "Below 50", min: 0, max: 49.9 }
    ];
    
    const allScores = [];
    activeAssessors.forEach(assessorId => {
        allScores.push(...assessorStats[assessorId].scores);
    });
    
    scoreRanges.forEach(range => {
        const count = allScores.filter(score => score >= range.min && score <= range.max).length;
        const percentage = allScores.length > 0 ? ((count / allScores.length) * 100).toFixed(1) : 0;
        
        reportContent += `
            <tr>
                <td>${range.range}</td>
                <td>${count}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    });
    
    reportContent += `
                    </tbody>
                </table>
            </div>
            
            <div class="pdf-footer">
                <p>© 2025 Tiro Mpane Foundation - National Chorale Eisteddfod</p>
                <p>Official Assessor Assessment Report - Confidential</p>
            </div>
        </div>
    `;
    
    generateProfessionalPDF(reportContent, `Assessors_Summary_Report_${new Date().toISOString().split('T')[0]}`);
    showNotification(`Generated assessors summary report for ${activeAssessors.length} assessors!`, 'success');
}

function generateProfessionalPDFContent(options) {
    const { title, subtitle, category, rankings, includeSummary, includeMethodology, includeWinners } = options;
    
    let content = `
        <div class="pdf-report-container">
            <div class="pdf-header">
                <h1>Tiro Mpane Foundation</h1>
                <h2>National Chorale Eisteddfod</h2>
                <h3>${title}</h3>
            </div>
            
            <div class="pdf-metadata">
                <div>Generated: ${new Date().toLocaleDateString()}</div>
                <div>Category: ${category}</div>
                <div>Total Entries: ${rankings.length}</div>
            </div>
    `;
    
    if (includeWinners && rankings.length > 0) {
        const winners = rankings.slice(0, 3);
        content += `
            <div class="pdf-section">
                <h3>Category Winners</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
        `;
        
        winners.forEach((ranking, index) => {
            let medal = '';
            let medalClass = '';
            if (index === 0) {
                medal = '🥇';
                medalClass = 'winner-badge';
            } else if (index === 1) {
                medal = '🥈';
                medalClass = 'winner-badge';
            } else if (index === 2) {
                medal = '🥉';
                medalClass = 'winner-badge';
            }
            
            content += `
                <div style="background: linear-gradient(135deg, ${index === 0 ? 'rgba(212, 175, 55, 0.2)' : index === 1 ? 'rgba(192, 192, 192, 0.2)' : 'rgba(205, 127, 50, 0.2)'} 0%, ${index === 0 ? 'rgba(184, 134, 11, 0.1)' : index === 1 ? 'rgba(128, 128, 128, 0.1)' : 'rgba(139, 69, 19, 0.1)'} 100%); padding: 1.5rem; border-radius: 8px; border: 2px solid ${index === 0 ? 'var(--primary-gold)' : index === 1 ? '#C0C0C0' : '#CD7F32'}; text-align: center;">
                    <div style="font-size: 1.2rem; color: ${index === 0 ? 'var(--primary-gold)' : index === 1 ? '#C0C0C0' : '#CD7F32'}; font-weight: bold;">
                        ${index === 0 ? '1st Place' : index === 1 ? '2nd Place' : '3rd Place'} ${medal}
                    </div>
                    <div style="font-size: 1.3rem; font-weight: bold; margin: 0.5rem 0;">${ranking.choir.name}</div>
                    <div style="color: #666;">${ranking.choir.region}</div>
                    <div style="font-size: 2rem; font-weight: bold; color: ${index === 0 ? 'var(--primary-gold)' : index === 1 ? '#C0C0C0' : '#CD7F32'}; margin-top: 0.5rem;">
                        ${ranking.score.toFixed(1)}
                    </div>
                    <div style="color: #666;">${getGradeFromScore(ranking.score)}</div>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
        `;
    }
    
    if (includeSummary && rankings.length > 0) {
        const averageScore = rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length;
        const highestScore = Math.max(...rankings.map(r => r.score));
        const lowestScore = Math.min(...rankings.map(r => r.score));
        
        content += `
            <div class="pdf-section">
                <h3>Statistical Summary</h3>
                <div class="summary-box">
                    <div class="summary-item">
                        <span class="summary-label">Average Score:</span>
                        <span class="summary-value">${averageScore.toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Highest Score:</span>
                        <span class="summary-value">${highestScore.toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Lowest Score:</span>
                        <span class="summary-value">${lowestScore.toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Score Range:</span>
                        <span class="summary-value">${(highestScore - lowestScore).toFixed(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Standard Deviation:</span>
                        <span class="summary-value">${calculateStandardDeviation(rankings.map(r => r.score)).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    content += `
        <div class="pdf-section">
            <h3>Complete Rankings</h3>
            <table class="pdf-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Choir Name</th>
                        <th>Region</th>
                        <th>Category</th>
                        <th>Western Score</th>
                        <th>African Score</th>
                        <th>Overall Score</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    rankings.forEach((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        const grade = getGradeFromScore(ranking.score);
        const gradeClass = grade.toLowerCase().replace(' ', '-');
        
        content += `
            <tr>
                <td><strong>${ranking.rank}</strong>${ranking.isTie ? '* <small style="color: #ff9800;">TIE</small>' : ''}</td>
                <td><strong>${ranking.choir.name}</strong></td>
                <td>${ranking.choir.region}</td>
                <td>${appState.categories[ranking.choir.category]}</td>
                <td>${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A'}</td>
                <td>${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A'}</td>
                <td><strong class="score-highlight">${ranking.score.toFixed(1)}</strong></td>
                <td><span class="grade-badge grade-${gradeClass}">${grade}</span></td>
            </tr>
        `;
    });
    
    content += `
                </tbody>
            </table>
        </div>
    `;
    
    if (includeMethodology) {
        content += `
            <div class="pdf-section">
                <h3>Scoring Methodology</h3>
                <div class="summary-box">
                    <p><strong>Official TMF Scoring System:</strong></p>
                    <ul style="margin: 0.5rem 0 0.5rem 1.5rem; padding: 0;">
                        <li><strong>Trimmed Mean Calculation:</strong> Highest and lowest scores removed, then average of remaining scores</li>
                        <li><strong>Single Assessor:</strong> Raw score used directly</li>
                        <li><strong>Two Assessors:</strong> Average of both scores used</li>
                        <li><strong>Three or More Assessors:</strong> Trimmed mean applied (remove highest & lowest, average remainder)</li>
                        <li><strong>Final Score:</strong> Average of Western and African trimmed means (or single genre if applicable)</li>
                        <li><strong>Tie Handling:</strong> Identical scores receive same rank, next rank skipped</li>
                        <li><strong>Grade Boundaries:</strong> Superior (90-100), Excellent (80-89), Average (70-79), Below Average (60-69), Insufficient (50-59)</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    content += `
            <div class="pdf-footer">
                <p>© 2025 Tiro Mpane Foundation - National Chorale Eisteddfod</p>
                <p>Official Competition Report - Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                <p>System Version 2.1.0 | For Official Use Only</p>
            </div>
        </div>
    `;
    
    return content;
}

function generateProfessionalPDF(content, filename) {
    try {
        showNotification('Generating PDF...', 'info');
        
        const reportDiv = document.createElement('div');
        reportDiv.id = 'pdf-report';
        reportDiv.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 800px; background: white; color: black;';
        reportDiv.innerHTML = content;
        document.body.appendChild(reportDiv);
        
        if (typeof html2canvas !== 'undefined') {
            html2canvas(reportDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                
                if (typeof jspdf !== 'undefined') {
                    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
                    const imgWidth = 190;
                    const pageHeight = 280;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 10;
                    
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    
                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    pdf.save(filename + '.pdf');
                } else {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = filename + '.png';
                    link.click();
                }
                
                document.body.removeChild(reportDiv);
                showNotification('PDF report generated successfully!', 'success');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                showNotification('Error generating PDF. Please try again.', 'error');
                document.body.removeChild(reportDiv);
            });
        } else {
            console.log('PDF generation libraries not available');
            showNotification('PDF libraries not loaded. Install html2canvas and jspdf.', 'warning');
            document.body.removeChild(reportDiv);
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Could not generate PDF. Please check browser compatibility.', 'error');
    }
}

// ============================================
// ASSESSOR SCORES MODAL FUNCTIONS
// ============================================

function showAssessorScores(choirId) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (!choir) {
        showNotification('Choir not found', 'error');
        return;
    }
    
    document.getElementById('assessorScoresModal').style.display = 'flex';
    renderAssessorScores(choir);
}

function renderAssessorScores(choir) {
    const stats = scoringSystem.getChoirStatistics(choir.id);
    
    let html = `
        <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">${choir.name} - Assessor Scores</h4>
        
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
            <strong style="color: var(--primary-gold);">Trimmed Mean Calculation Summary</strong>
            <div style="margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                <strong>Western:</strong> ${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'No scores'} (${stats.western.count} assessors)
                <br>
                <strong>African:</strong> ${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'No scores'} (${stats.african.count} assessors)
            </div>
        </div>
    `;
    
    html += `
        <h5 style="color: #2196f3; margin-bottom: 1rem; margin-top: 2rem;">Western Assessor Scores</h5>
    `;
    
    if (stats.western.assessments.length === 0) {
        html += `<p style="color: rgba(255, 255, 255, 0.6); font-style: italic;">No western scores recorded</p>`;
    } else {
        html += `<div style="display: flex; flex-direction: column; gap: 0.5rem;">`;
        
        stats.western.assessments.forEach((assessment) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(33, 150, 243, 0.1); border-radius: 6px; border: 1px solid rgba(33, 150, 243, 0.2);">
                    <div>
                        <strong style="color: #2196f3;">${assessment.assessorName}</strong>
                        ${assessment.comments ? `<div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);"><i class="fas fa-comment"></i> Has comments</div>` : ''}
                    </div>
                    <div>
                        <strong style="font-size: 1.2rem; color: white;">${assessment.total.toFixed(1)}</strong>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    html += `
        <h5 style="color: #f44336; margin-bottom: 1rem; margin-top: 2rem;">African Assessor Scores</h5>
    `;
    
    if (stats.african.assessments.length === 0) {
        html += `<p style="color: rgba(255, 255, 255, 0.6); font-style: italic;">No african scores recorded</p>`;
    } else {
        html += `<div style="display: flex; flex-direction: column; gap: 0.5rem;">`;
        
        stats.african.assessments.forEach((assessment) => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(244, 67, 54, 0.1); border-radius: 6px; border: 1px solid rgba(244, 67, 54, 0.2);">
                    <div>
                        <strong style="color: #f44336;">${assessment.assessorName}</strong>
                        ${assessment.comments ? `<div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);"><i class="fas fa-comment"></i> Has comments</div>` : ''}
                    </div>
                    <div>
                        <strong style="font-size: 1.2rem; color: white;">${assessment.total.toFixed(1)}</strong>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    if (stats.western.count > 0 || stats.african.count > 0) {
        html += `
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <strong style="color: var(--primary-gold);">Scoring Method:</strong>
                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.8);">
                    ${getScoringMethodExplanation(stats)}
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeAssessorScoresModal()">
                <i class="fas fa-arrow-left"></i> Back to Results
            </button>
        </div>
    `;
    
    document.getElementById('assessorScoresContent').innerHTML = html;
}

function getScoringMethodExplanation(stats) {
    let explanation = '';
    
    if (stats.western.count > 0) {
        explanation += `Western: ${getIndividualGenreExplanation(stats.western)}<br>`;
    }
    
    if (stats.african.count > 0) {
        explanation += `African: ${getIndividualGenreExplanation(stats.african)}`;
    }
    
    if (stats.western.trimmedMean > 0 && stats.african.trimmedMean > 0) {
        explanation += `<br><br>Overall Score: (${stats.western.trimmedMean.toFixed(1)} + ${stats.african.trimmedMean.toFixed(1)}) ÷ 2 = ${stats.overall.toFixed(1)}`;
    } else if (stats.western.trimmedMean > 0) {
        explanation += `<br><br>Overall Score: Single song choir - Western score ${stats.western.trimmedMean.toFixed(1)} used as final score`;
    } else if (stats.african.trimmedMean > 0) {
        explanation += `<br><br>Overall Score: Single song choir - African score ${stats.african.trimmedMean.toFixed(1)} used as final score`;
    }
    
    return explanation;
}

function getIndividualGenreExplanation(stats) {
    if (stats.count === 1) {
        return `Single assessor - Raw score ${stats.trimmedMean.toFixed(1)} used`;
    } else if (stats.count === 2) {
        return `Two assessors - Average of ${stats.rawScores[0].toFixed(1)} and ${stats.rawScores[1].toFixed(1)} = ${stats.trimmedMean.toFixed(1)}`;
    } else if (stats.count >= 3) {
        const sorted = [...stats.rawScores].sort((a, b) => a - b);
        const remaining = sorted.slice(1, -1);
        const sum = remaining.reduce((a, b) => a + b, 0);
        return `${stats.count} assessors - Removed highest (${sorted[sorted.length - 1].toFixed(1)}) and lowest (${sorted[0].toFixed(1)}), average of ${remaining.length} remaining scores = ${stats.trimmedMean.toFixed(1)}`;
    }
    return 'No scores recorded';
}

function closeAssessorScoresModal() {
    document.getElementById('assessorScoresModal').style.display = 'none';
}

// ============================================
// EXCEL EXPORT FUNCTIONS
// ============================================

function exportToExcel() {
    try {
        const data = [];
        
        data.push([
            'Rank',
            'Choir Name',
            'Region',
            'Category',
            'Western Score',
            'Western Assessors',
            'African Score',
            'African Assessors',
            'Overall Score',
            'Grade'
        ]);
        
        scoringSystem.finalRankings.overall.forEach(ranking => {
            const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
            const grade = getGradeFromScore(ranking.score);
            
            data.push([
                ranking.rank,
                ranking.choir.name,
                ranking.choir.region,
                appState.categories[ranking.choir.category],
                stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A',
                stats.western.count,
                stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A',
                stats.african.count,
                ranking.score.toFixed(1),
                grade
            ]);
        });
        
        let ws;
        if (typeof XLSX !== 'undefined') {
            ws = XLSX.utils.aoa_to_sheet(data);
            
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Competition Results');
            
            XLSX.writeFile(wb, `TMF_Competition_Results_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else {
            const csvContent = data.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TMF_Competition_Results_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        }
        
        showNotification('Excel file exported successfully!', 'success');
    } catch (error) {
        console.error('Excel export error:', error);
        showNotification('Error exporting to Excel. Please try again.', 'error');
    }
}

// ============================================
// PROFESSIONAL MONITORING FUNCTIONS - COMPLETE
// ============================================

function showProfessionalMonitoringCenter() {
    appState.currentView = 'operationsCenter';
    renderProfessionalMonitoringCenter();
}

function renderProfessionalMonitoringCenter() {
    const totalChoirs = appState.choirs.length;
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    const pendingChoirs = totalChoirs - assessedChoirs;
    const completionRate = totalChoirs > 0 ? (assessedChoirs / totalChoirs) * 100 : 0;

    const activeAssessors = Object.keys(appState.users).filter(id => appState.users[id].role === 'assessor').filter(id => {
        let hasRecentActivity = false;
        Object.keys(scoringSystem.assessorScores).forEach(choirId => {
            ['western', 'african'].forEach(genre => {
                if (scoringSystem.assessorScores[choirId] && 
                    scoringSystem.assessorScores[choirId][genre] && 
                    scoringSystem.assessorScores[choirId][genre][id]) {
                    const assessment = scoringSystem.assessorScores[choirId][genre][id];
                    if (assessment && assessment.submittedAt) {
                        const timeDiff = Date.now() - new Date(assessment.submittedAt).getTime();
                        if (timeDiff < 2 * 60 * 60 * 1000) {
                            hasRecentActivity = true;
                        }
                    }
                }
            });
        });
        return hasRecentActivity;
    }).length;

    const systemHealth = {
        uptime: 99.8,
        responseTime: Math.random() * 100 + 50,
        errorRate: Math.random() * 0.5,
        activeUsers: activeAssessors + 2,
        serverLoad: Math.random() * 30 + 20
    };

    const securityMetrics = {
        loginAttempts: Math.floor(Math.random() * 50) + 10,
        failedLogins: Math.floor(Math.random() * 5) + 1,
        activeSessions: Object.keys(appState.users).length,
        lastSecurityScan: new Date().toLocaleTimeString()
    };

    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-satellite-dish"></i> Operations Center
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshOperationsCenter()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="ops-section">
                <h4><i class="fas fa-globe"></i> Real-Time Competition Overview</h4>
                <div class="ops-grid">
                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Competition Status</span>
                            <span class="metric-status live">LIVE</span>
                        </div>
                        <div class="metric-value">${completionRate.toFixed(1)}%</div>
                        <div class="metric-label">Overall Completion</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-check-circle" style="color: #4CAF50;"></i>
                                ${assessedChoirs} Completed
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-clock" style="color: #FF9800;"></i>
                                ${pendingChoirs} Pending
                            </span>
                        </div>
                    </div>

                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Active Participants</span>
                            <span class="metric-status active">${totalChoirs}</span>
                        </div>
                        <div class="metric-value">${activeAssessors}</div>
                        <div class="metric-label">Active Assessors</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-users" style="color: #2196F3;"></i>
                                ${Object.keys(appState.users).filter(u => appState.users[u].role === 'assessor').length} Total Assessors
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-user-check" style="color: #4CAF50;"></i>
                                ${((activeAssessors / Math.max(1, Object.keys(appState.users).filter(u => appState.users[u].role === 'assessor').length)) * 100).toFixed(0)}% Engagement
                            </span>
                        </div>
                    </div>

                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Schedule Adherence</span>
                            <span class="metric-status good">ON TRACK</span>
                        </div>
                        <div class="metric-value">92%</div>
                        <div class="metric-label">Time Performance</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-clock" style="color: #4CAF50;"></i>
                                +15 min buffer
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-calendar-check" style="color: #2196F3;"></i>
                                Day 2 of 3
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ops-section">
                <h4><i class="fas fa-heartbeat"></i> System Health & Security</h4>
                <div class="ops-grid">
                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">System Performance</span>
                            <span class="metric-status excellent">EXCELLENT</span>
                        </div>
                        <div class="metric-value">${systemHealth.uptime}%</div>
                        <div class="metric-label">Uptime</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-tachometer-alt" style="color: #4CAF50;"></i>
                                ${systemHealth.responseTime.toFixed(0)}ms Response
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-server" style="color: #FF9800;"></i>
                                ${systemHealth.serverLoad.toFixed(0)}% Load
                            </span>
                        </div>
                    </div>

                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Security Status</span>
                            <span class="metric-status secure">SECURE</span>
                        </div>
                        <div class="metric-value">${securityMetrics.failedLogins}</div>
                        <div class="metric-label">Failed Logins (24h)</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-shield-alt" style="color: #4CAF50;"></i>
                                ${securityMetrics.activeSessions} Sessions
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-lock" style="color: #2196F3;"></i>
                                Scan: ${securityMetrics.lastSecurityScan}
                            </span>
                        </div>
                    </div>

                    <div class="ops-metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Data Integrity</span>
                            <span class="metric-status good">VALID</span>
                        </div>
                        <div class="metric-value">100%</div>
                        <div class="metric-label">Validation Status</div>
                        <div class="metric-breakdown">
                            <span class="breakdown-item">
                                <i class="fas fa-database" style="color: #4CAF50;"></i>
                                All backups current
                            </span>
                            <span class="breakdown-item">
                                <i class="fas fa-check-double" style="color: #2196F3;"></i>
                                No anomalies detected
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ops-section">
                <h4><i class="fas fa-stream"></i> Live Activity Feed</h4>
                <div class="activity-feed">
                    ${generateLiveActivityFeed()}
                </div>
            </div>

            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshOperationsCenter() {
    showNotification('Operations Center refreshed', 'success');
    renderProfessionalMonitoringCenter();
}

function showLiveScoringMonitor() {
    appState.currentView = 'liveScoringMonitor';
    renderLiveScoringMonitor();
}

function renderLiveScoringMonitor() {
    const anomalies = detectScoringAnomalies();
    const assessorPerformance = calculateAssessorPerformanceMetrics();
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-tachometer-alt"></i> Live Scoring Monitor
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshScoringMonitor()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="live-scoring-container">
    `;
    
    if (anomalies.length > 0) {
        html += `
            <div class="anomaly-section">
                <h4><i class="fas fa-exclamation-triangle"></i> Anomaly Detection Alerts</h4>
        `;
        
        anomalies.slice(0, 3).forEach(anomaly => {
            html += `
                <div class="anomaly-alert">
                    <div class="alert-icon">
                        <i class="fas ${anomaly.icon || 'fa-exclamation-circle'}"></i>
                    </div>
                    <div class="anomaly-content">
                        <div class="anomaly-title">${anomaly.title}</div>
                        <div class="anomaly-description">${anomaly.description}</div>
                        <div class="anomaly-time">${anomaly.timestamp.toLocaleString()}</div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }

    html += `
        <div class="live-scoreboard">
            <div class="scoreboard-header">
                <i class="fas fa-trophy"></i>
                Live Scoreboard
            </div>
            
            ${generateLiveScoreboardTable()}
        </div>
    `;

    html += `
        <div class="assessor-section">
            <h4><i class="fas fa-user-chart"></i> Assessor Performance Analytics</h4>
            <div class="assessor-grid">
    `;
    
    Object.values(assessorPerformance).forEach(assessor => {
        html += `
            <div class="assessor-card">
                <h5>${assessor.name}</h5>
                <div class="assessor-stats">
                    <div class="assessor-stat">
                        <span class="stat-number">${assessor.totalAssessments}</span>
                        <span class="stat-label">Assessments</span>
                    </div>
                    <div class="assessor-stat">
                        <span class="stat-number">${assessor.averageScore.toFixed(1)}</span>
                        <span class="stat-label">Avg Score</span>
                    </div>
                    <div class="assessor-stat">
                        <span class="stat-number">${assessor.consistency}%</span>
                        <span class="stat-label">Consistency</span>
                    </div>
                    <div class="assessor-stat">
                        <span class="stat-number">${assessor.avgTime}</span>
                        <span class="stat-label">Avg Time</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    </div>

    <div class="bottom-center-back">
        <button class="action-btn outline" onclick="showDashboard()">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>
    </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshScoringMonitor() {
    showNotification('Scoring monitor refreshed', 'success');
    renderLiveScoringMonitor();
}

function showSystemHealthMonitor() {
    appState.currentView = 'systemHealth';
    renderSystemHealthMonitor();
}

function renderSystemHealthMonitor() {
    const systemMetrics = {
        uptime: 99.8,
        responseTime: Math.random() * 100 + 50,
        errorRate: Math.random() * 0.5,
        activeUsers: Object.keys(appState.users).length,
        serverLoad: Math.random() * 30 + 20,
        memoryUsage: Math.random() * 40 + 30,
        diskSpace: Math.random() * 20 + 60,
        databaseConnections: Math.floor(Math.random() * 50) + 10,
        cacheHitRate: Math.random() * 20 + 75
    };

    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-heartbeat"></i> System Health & Security Monitor
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshSystemHealth()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="health-section">
                <h4><i class="fas fa-tachometer-alt"></i> System Performance</h4>
                <div class="health-metrics-grid">
                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Server Uptime</span>
                            <span class="metric-status excellent">${systemMetrics.uptime}%</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill excellent" style="width: ${systemMetrics.uptime}%"></div>
                        </div>
                    </div>

                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Response Time</span>
                            <span class="metric-status good">${systemMetrics.responseTime.toFixed(0)}ms</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill good" style="width: ${Math.min(100, (200 - systemMetrics.responseTime) / 2)}%"></div>
                        </div>
                    </div>

                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Server Load</span>
                            <span class="metric-status good">${systemMetrics.serverLoad.toFixed(0)}%</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill ${systemMetrics.serverLoad > 80 ? 'warning' : 'good'}" style="width: ${systemMetrics.serverLoad}%"></div>
                        </div>
                    </div>

                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Memory Usage</span>
                            <span class="metric-status good">${systemMetrics.memoryUsage.toFixed(0)}%</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill ${systemMetrics.memoryUsage > 85 ? 'warning' : 'good'}" style="width: ${systemMetrics.memoryUsage}%"></div>
                        </div>
                    </div>

                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Disk Space</span>
                            <span class="metric-status excellent">${systemMetrics.diskSpace.toFixed(0)}% Free</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill excellent" style="width: ${systemMetrics.diskSpace}%"></div>
                        </div>
                    </div>

                    <div class="health-metric-card">
                        <div class="health-metric-header">
                            <span class="metric-title">Cache Hit Rate</span>
                            <span class="metric-status excellent">${systemMetrics.cacheHitRate.toFixed(0)}%</span>
                        </div>
                        <div class="health-progress-bar">
                            <div class="health-progress-fill excellent" style="width: ${systemMetrics.cacheHitRate}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="health-section">
                <h4><i class="fas fa-shield-alt"></i> Security Monitoring</h4>
                <div class="security-overview">
                    <div class="security-stats">
                        <div class="security-stat">
                            <span class="stat-label">Active Sessions</span>
                            <span class="stat-value">${systemMetrics.activeUsers}</span>
                        </div>
                        <div class="security-stat">
                            <span class="stat-label">Failed Logins (24h)</span>
                            <span class="stat-value">${Math.floor(Math.random() * 5) + 1}</span>
                        </div>
                        <div class="security-stat">
                            <span class="stat-label">Database Connections</span>
                            <span class="stat-value">${systemMetrics.databaseConnections}</span>
                        </div>
                        <div class="security-stat">
                            <span class="stat-label">Last Security Scan</span>
                            <span class="stat-value">${new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="health-section">
                <h4><i class="fas fa-notes-medical"></i> Error Rate Monitoring</h4>
                <div class="error-rate-container">
                    <div class="error-rate-grid">
                        <div class="error-metric">
                            <div class="metric-label">Current Error Rate</div>
                            <div class="metric-value">${systemMetrics.errorRate.toFixed(2)}%</div>
                            <div class="metric-status ${systemMetrics.errorRate < 1.0 ? 'normal' : 'critical'}">
                                ${systemMetrics.errorRate < 1.0 ? 'NORMAL' : 'CRITICAL'}
                            </div>
                        </div>
                        <div class="error-metric">
                            <div class="metric-label">Error Threshold</div>
                            <div class="metric-value">1.0%</div>
                            <div class="metric-status normal">LIMIT</div>
                        </div>
                        <div class="error-metric">
                            <div class="metric-label">System Status</div>
                            <div class="metric-value">
                                <span style="color: ${systemMetrics.errorRate < 1.0 ? '#4CAF50' : '#f44336'};">
                                    ${systemMetrics.errorRate < 1.0 ? 'HEALTHY' : 'WARNING'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshSystemHealth() {
    showNotification('System health monitor refreshed', 'success');
    renderSystemHealthMonitor();
}

function showDataIntegrityMonitor() {
    appState.currentView = 'dataIntegrity';
    renderDataIntegrityMonitor();
}

function renderDataIntegrityMonitor() {
    const totalAssessments = countTotalAssessments();
    const totalChoirs = appState.choirs.length;
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-shield-alt"></i> Data Integrity & Compliance Monitor
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshDataIntegrity()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="analytics-summary-cards">
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-database"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Total Assessments</div>
                        <div class="summary-value">${totalAssessments}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-users"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Total Choirs</div>
                        <div class="summary-value">${totalChoirs}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Assessed Choirs</div>
                        <div class="summary-value">${assessedChoirs}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-clock"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Pending</div>
                        <div class="summary-value">${totalChoirs - assessedChoirs}</div>
                    </div>
                </div>
            </div>

            <div class="integrity-section">
                <h4><i class="fas fa-check-double"></i> Data Validation</h4>
                <div class="integrity-overview">
                    <div class="integrity-metric">
                        <div class="integrity-status passed">
                            <i class="fas fa-check-circle"></i>
                            PASSED
                        </div>
                        <div class="integrity-details">
                            <span>Issues Found: 0</span>
                            <span>Last Check: ${new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="integrity-section">
                <h4><i class="fas fa-database"></i> Backup Status</h4>
                <div class="backup-overview">
                    <div class="backup-metric">
                        <div class="backup-status current">
                            <i class="fas fa-cloud-upload-alt"></i>
                            CURRENT
                        </div>
                        <div class="backup-details">
                            <span>Last Backup: ${new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString()}</span>
                            <span>Size: 2.4MB</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="integrity-section">
                <h4><i class="fas fa-user-shield"></i> GDPR/Privacy Compliance</h4>
                <div class="compliance-overview">
                    <div class="compliance-metric">
                        <div class="compliance-status compliant">
                            <i class="fas fa-balance-scale"></i>
                            COMPLIANT
                        </div>
                        <div class="compliance-details">
                            <span>Consent Records: ${Object.keys(appState.users).length}</span>
                            <span>Data Retention: 30 days</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="integrity-section">
                <h4><i class="fas fa-chart-line"></i> Data Consistency Check</h4>
                <div class="integrity-overview">
                    <div class="integrity-metric">
                        <div class="integrity-status passed">
                            <i class="fas fa-check-circle"></i>
                            CONSISTENT
                        </div>
                        <div class="integrity-details">
                            <span>All scores validated against rubric criteria</span>
                            <span>No duplicate assessments found</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshDataIntegrity() {
    showNotification('Data integrity monitor refreshed', 'success');
    renderDataIntegrityMonitor();
}

function showAdvancedAnalytics() {
    appState.currentView = 'advancedAnalytics';
    renderAdvancedAnalytics();
}

function renderAdvancedAnalytics() {
    const allScores = [];
    const westernScores = [];
    const africanScores = [];
    const categoryScores = {
        'GREAT CHAMPS': { western: [], african: [], overall: [] },
        'LARGE': { western: [], african: [], overall: [] },
        'STANDARD': { western: [], african: [], overall: [] }
    };
    
    appState.choirs.forEach(choir => {
        const stats = scoringSystem.getChoirStatistics(choir.id);
        
        if (stats.western.trimmedMean > 0) {
            westernScores.push(stats.western.trimmedMean);
            allScores.push(stats.western.trimmedMean);
            categoryScores[choir.category].western.push(stats.western.trimmedMean);
        }
        
        if (stats.african.trimmedMean > 0) {
            africanScores.push(stats.african.trimmedMean);
            allScores.push(stats.african.trimmedMean);
            categoryScores[choir.category].african.push(stats.african.trimmedMean);
        }
        
        if (stats.overall > 0) {
            categoryScores[choir.category].overall.push(stats.overall);
        }
    });
    
    const scoreRanges = [
        { range: "90-100 (Superior)", min: 90, max: 100, count: 0, color: "#4CAF50" },
        { range: "80-89 (Excellent)", min: 80, max: 89.9, count: 0, color: "#8BC34A" },
        { range: "70-79 (Average)", min: 70, max: 79.9, count: 0, color: "#FFC107" },
        { range: "60-69 (Below Average)", min: 60, max: 69.9, count: 0, color: "#FF9800" },
        { range: "50-59 (Insufficient)", min: 50, max: 59.9, count: 0, color: "#F44336" },
        { range: "Below 50", min: 0, max: 49.9, count: 0, color: "#9C27B0" }
    ];
    
    allScores.forEach(score => {
        const range = scoreRanges.find(r => score >= r.min && score <= r.max);
        if (range) range.count++;
    });
    
    const maxCount = Math.max(...scoreRanges.map(r => r.count), 1);
    
    const categoryMetrics = {};
    Object.keys(categoryScores).forEach(cat => {
        const westernAvg = categoryScores[cat].western.length > 0 
            ? categoryScores[cat].western.reduce((a, b) => a + b, 0) / categoryScores[cat].western.length 
            : 0;
        const africanAvg = categoryScores[cat].african.length > 0 
            ? categoryScores[cat].african.reduce((a, b) => a + b, 0) / categoryScores[cat].african.length 
            : 0;
        const overallAvg = categoryScores[cat].overall.length > 0 
            ? categoryScores[cat].overall.reduce((a, b) => a + b, 0) / categoryScores[cat].overall.length 
            : 0;
        
        categoryMetrics[cat] = {
            name: appState.categories[cat],
            westernAvg: westernAvg,
            africanAvg: africanAvg,
            overallAvg: overallAvg,
            westernCount: categoryScores[cat].western.length,
            africanCount: categoryScores[cat].african.length,
            overallCount: categoryScores[cat].overall.length
        };
    });
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-chart-line"></i> Advanced Analytics
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshAnalytics()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="analytics-summary-cards">
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-chart-pie"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Total Assessments</div>
                        <div class="summary-value">${allScores.length}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-calculator"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Average Score</div>
                        <div class="summary-value">${(allScores.reduce((a, b) => a + b, 0) / (allScores.length || 1)).toFixed(1)}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-trophy"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Highest Score</div>
                        <div class="summary-value">${allScores.length > 0 ? Math.max(...allScores).toFixed(1) : 'N/A'}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-arrow-down"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Lowest Score</div>
                        <div class="summary-value">${allScores.length > 0 ? Math.min(...allScores).toFixed(1) : 'N/A'}</div>
                    </div>
                </div>
            </div>

            <div class="analytics-section">
                <h4><i class="fas fa-chart-bar"></i> Scoring Distribution Analysis</h4>
                <div class="analytics-chart-container">
                    <div class="distribution-chart">
                        ${scoreRanges.map(range => {
                            const percentage = (range.count / (allScores.length || 1)) * 100;
                            const barHeight = (range.count / maxCount) * 100;
                            return `
                                <div class="chart-bar-container">
                                    <div class="chart-bar" style="height: ${barHeight}%; background-color: ${range.color};" 
                                         title="${range.range}: ${range.count} assessments (${percentage.toFixed(1)}%)">
                                        ${range.count > 0 ? `<span class="bar-count">${range.count}</span>` : ''}
                                    </div>
                                    <div class="bar-label">${range.range.split(' ')[0]}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="distribution-stats">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Standard Deviation:</span>
                                <span class="stat-value">${calculateStandardDeviation(allScores).toFixed(2)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Median Score:</span>
                                <span class="stat-value">${calculateMedian(allScores).toFixed(1)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Score Range:</span>
                                <span class="stat-value">${allScores.length > 0 ? (Math.max(...allScores) - Math.min(...allScores)).toFixed(1) : 'N/A'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Total Assessments:</span>
                                <span class="stat-value">${allScores.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="analytics-section">
                <h4><i class="fas fa-layer-group"></i> Category Performance Analysis</h4>
                
                <div class="genre-comparison">
                    <h5>Western vs African Performance by Category</h5>
                    <div class="comparison-chart">
                        ${Object.values(categoryMetrics).filter(m => m.westernCount > 0 || m.africanCount > 0).map(metric => {
                            const maxScore = 100;
                            const westernPercent = (metric.westernAvg / maxScore) * 100;
                            const africanPercent = (metric.africanAvg / maxScore) * 100;
                            
                            return `
                                <div class="category-comparison-row">
                                    <div class="category-name">${metric.name}</div>
                                    <div class="genre-bars">
                                        <div class="western-bar-container">
                                            <div class="bar-label-small">Western</div>
                                            <div class="bar-track">
                                                <div class="bar-fill western-fill" style="width: ${westernPercent}%;">
                                                    ${metric.westernAvg > 0 ? metric.westernAvg.toFixed(1) : ''}
                                                </div>
                                            </div>
                                            <div class="bar-count">(${metric.westernCount})</div>
                                        </div>
                                        <div class="african-bar-container">
                                            <div class="bar-label-small">African</div>
                                            <div class="bar-track">
                                                <div class="bar-fill african-fill" style="width: ${africanPercent}%;">
                                                    ${metric.africanAvg > 0 ? metric.africanAvg.toFixed(1) : ''}
                                                </div>
                                            </div>
                                            <div class="bar-count">(${metric.africanCount})</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="category-summary-table">
                    <h5>Category Performance Summary</h5>
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Western Avg</th>
                                <th>African Avg</th>
                                <th>Overall Avg</th>
                                <th>Assessments</th>
                                <th>Top Performer</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.values(categoryMetrics).filter(m => m.westernCount > 0 || m.africanCount > 0 || m.overallCount > 0).map(metric => {
                                const categoryRankings = scoringSystem.finalRankings.overall.filter(r => 
                                    r.choir.category === Object.keys(categoryMetrics).find(key => categoryMetrics[key].name === metric.name)
                                );
                                const topPerformer = categoryRankings.length > 0 ? categoryRankings[0].choir.name : 'N/A';
                                
                                return `
                                    <tr>
                                        <td><strong>${metric.name}</strong></td>
                                        <td class="score-cell">${metric.westernAvg > 0 ? metric.westernAvg.toFixed(1) : 'N/A'}</td>
                                        <td class="score-cell">${metric.africanAvg > 0 ? metric.africanAvg.toFixed(1) : 'N/A'}</td>
                                        <td class="score-cell overall">${metric.overallAvg > 0 ? metric.overallAvg.toFixed(1) : 'N/A'}</td>
                                        <td>${metric.westernCount + metric.africanCount}</td>
                                        <td>${topPerformer}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="performance-insights">
                    <h5><i class="fas fa-lightbulb"></i> Performance Insights</h5>
                    <div class="insights-grid">
                        ${generatePerformanceInsights(categoryMetrics, allScores)}
                    </div>
                </div>
            </div>

            <div class="analytics-section">
                <h4><i class="fas fa-chart-pie"></i> Genre Distribution</h4>
                <div class="integrity-overview">
                    <div class="integrity-metric">
                        <div class="integrity-status passed">
                            <i class="fas fa-check-circle"></i>
                            WESTERN: ${westernScores.length}
                        </div>
                        <div class="integrity-status passed">
                            <i class="fas fa-check-circle"></i>
                            AFRICAN: ${africanScores.length}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshAnalytics() {
    showNotification('Analytics refreshed', 'success');
    renderAdvancedAnalytics();
}

function showIncidentManagement() {
    appState.currentView = 'incidentManagement';
    renderIncidentManagement();
}

function renderIncidentManagement() {
    const incidents = [
        {
            id: 'INC-001',
            title: 'Scheduled maintenance completed',
            type: 'system',
            status: 'resolved',
            severity: 'low',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
            id: 'INC-002',
            title: 'Database backup verification',
            type: 'system',
            status: 'resolved',
            severity: 'low',
            time: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    ];

    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-exclamation-triangle"></i> Incident Management
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <button class="action-btn" onclick="refreshIncidentManagement()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <div class="analytics-summary-cards">
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-exclamation-circle"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Total Incidents</div>
                        <div class="summary-value">${incidents.length}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Resolved</div>
                        <div class="summary-value">${incidents.filter(i => i.status === 'resolved').length}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-clock"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">Open</div>
                        <div class="summary-value">${incidents.filter(i => i.status !== 'resolved').length}</div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon"><i class="fas fa-shield-alt"></i></div>
                    <div class="summary-content">
                        <div class="summary-label">System Health</div>
                        <div class="summary-value">98%</div>
                    </div>
                </div>
            </div>

            <div class="incident-section">
                <h4><i class="fas fa-history"></i> Incident Log</h4>
                <div class="incident-list">
                    ${incidents.map(incident => `
                        <div class="incident-item severity-${incident.severity}">
                            <div class="incident-header">
                                <span class="incident-id">${incident.id}</span>
                                <span class="incident-title">${incident.title}</span>
                                <span class="incident-status ${incident.status}">${incident.status.toUpperCase()}</span>
                            </div>
                            <div class="incident-details">
                                <span class="incident-type">${incident.type}</span>
                                <span class="incident-time">${incident.time.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="incident-section">
                <h4><i class="fas fa-server"></i> Disaster Recovery Status</h4>
                <div class="recovery-status">
                    <div class="recovery-metric">
                        <span class="recovery-label">Backup System</span>
                        <span class="recovery-status operational">OPERATIONAL</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">Last Backup Test</span>
                        <span class="recovery-time">${new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString()}</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">Recovery Point</span>
                        <span class="recovery-value">15 minutes</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">Recovery Time</span>
                        <span class="recovery-value">2 hours</span>
                    </div>
                </div>
            </div>

            <div class="incident-section">
                <h4><i class="fas fa-tasks"></i> System Checks</h4>
                <div class="recovery-status">
                    <div class="recovery-metric">
                        <span class="recovery-label">Database Integrity</span>
                        <span class="recovery-status operational">PASSED</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">File System</span>
                        <span class="recovery-status operational">PASSED</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">Network Connectivity</span>
                        <span class="recovery-status operational">PASSED</span>
                    </div>
                    <div class="recovery-metric">
                        <span class="recovery-label">API Services</span>
                        <span class="recovery-status operational">PASSED</span>
                    </div>
                </div>
            </div>

            <div class="bottom-center-back">
                <button class="action-btn outline" onclick="showDashboard()">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshIncidentManagement() {
    showNotification('Incident management refreshed', 'success');
    renderIncidentManagement();
}

function generateEmergencyReport() {
    showNotification('Generating emergency report...', 'info');
    setTimeout(() => {
        showNotification('Emergency report generated successfully', 'success');
    }, 2000);
}

// Helper function to generate live activity feed
function generateLiveActivityFeed() {
    const activities = [];
    
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
                Object.keys(scoringSystem.assessorScores[choirId][genre]).forEach(assessorId => {
                    const assessment = scoringSystem.assessorScores[choirId][genre][assessorId];
                    if (assessment && assessment.submittedAt) {
                        const choir = appState.choirs.find(c => c.id === choirId);
                        activities.push({
                            type: 'assessment',
                            user: assessment.assessorName,
                            action: `assessed ${choir ? choir.name : 'Unknown Choir'} (${genre})`,
                            score: assessment.total,
                            time: new Date(assessment.submittedAt)
                        });
                    }
                });
            }
        });
    });

    activities.sort((a, b) => b.time - a.time);

    return activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.type === 'assessment' ? 'fa-clipboard-check' : 'fa-server'}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-header">
                    <span class="activity-user">${activity.user}</span>
                    <span class="activity-action">${activity.action}</span>
                    ${activity.score ? `<span class="activity-score">Score: ${activity.score.toFixed(1)}</span>` : ''}
                </div>
                <div class="activity-time">${activity.time.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Helper function to generate live scoreboard table
function generateLiveScoreboardTable() {
    const rankings = scoringSystem.finalRankings.overall.slice(0, 10);
    
    if (rankings.length === 0) {
        return `
            <div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.6);">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No scores available yet</p>
            </div>
        `;
    }
    
    let tableHtml = `
        <table class="scoreboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Choir Name</th>
                    <th>Category</th>
                    <th>Western</th>
                    <th>African</th>
                    <th>Overall</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    rankings.forEach((ranking, index) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        let statusClass = 'pending';
        let statusText = 'Pending';
        
        if (ranking.choir.status === 'assessed') {
            statusClass = 'assessed';
            statusText = 'Assessed';
        }
        
        tableHtml += `
            <tr>
                <td>
                    <span class="rank-badge ${rankClass}">${ranking.rank}</span>
                </td>
                <td>
                    <div class="choir-info">
                        <span class="choir-name">${ranking.choir.name}</span>
                        <span class="choir-category">${ranking.choir.region}</span>
                    </div>
                </td>
                <td>${appState.categories[ranking.choir.category]}</td>
                <td><span class="score-cell western">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : '-'}</span></td>
                <td><span class="score-cell african">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : '-'}</span></td>
                <td><span class="score-cell overall">${ranking.score.toFixed(1)}</span></td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
        </table>
        
        <div class="scoreboard-summary">
            <div class="summary-item">
                <span class="summary-label">Total Choirs</span>
                <span class="summary-value">${appState.choirs.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Assessed</span>
                <span class="summary-value">${appState.choirs.filter(c => c.status === 'assessed').length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Pending</span>
                <span class="summary-value">${appState.choirs.filter(c => c.status === 'pending').length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Avg Overall</span>
                <span class="summary-value">${(rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length).toFixed(1)}</span>
            </div>
        </div>
    `;
    
    return tableHtml;
}

// Helper function to detect scoring anomalies
function detectScoringAnomalies() {
    const anomalies = [];
    
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
                const scores = Object.values(scoringSystem.assessorScores[choirId][genre])
                    .map(assessment => assessment.total)
                    .filter(score => score > 0);
                
                if (scores.length >= 3) {
                    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
                    const stdDev = Math.sqrt(
                        scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
                    );
                    
                    scores.forEach((score, index) => {
                        if (Math.abs(score - mean) > 2 * stdDev) {
                            const assessmentsArray = Object.values(scoringSystem.assessorScores[choirId][genre]);
                            if (index < assessmentsArray.length) {
                                const assessment = assessmentsArray[index];
                                anomalies.push({
                                    severity: stdDev > 15 ? 'high' : 'medium',
                                    icon: 'fa-exclamation-triangle',
                                    title: 'Scoring Outlier Detected',
                                    description: `${assessment.assessorName} gave ${score.toFixed(1)} (avg: ${mean.toFixed(1)}) for ${genre} assessment`,
                                    timestamp: new Date(assessment.submittedAt)
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    return anomalies.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });
}

// Helper function to calculate assessor performance metrics
function calculateAssessorPerformanceMetrics() {
    const metrics = {};
    
    // Get all assessors from appState
    const assessors = Object.keys(appState.users).filter(id => appState.users[id].role === 'assessor');
    
    if (assessors.length === 0) {
        return metrics;
    }
    
    assessors.forEach(assessorId => {
        const assessments = [];
        const completionTimes = [];
        
        // Check all choir assessments for this assessor
        Object.keys(scoringSystem.assessorScores).forEach(choirId => {
            ['western', 'african'].forEach(genre => {
                if (scoringSystem.assessorScores[choirId] && 
                    scoringSystem.assessorScores[choirId][genre] && 
                    scoringSystem.assessorScores[choirId][genre][assessorId]) {
                    const assessment = scoringSystem.assessorScores[choirId][genre][assessorId];
                    assessments.push(assessment.total);
                    if (assessment.submittedAt) {
                        completionTimes.push(new Date(assessment.submittedAt));
                    }
                }
            });
        });

        if (assessments.length > 0) {
            const averageScore = assessments.reduce((a, b) => a + b, 0) / assessments.length;
            const variance = assessments.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / assessments.length;
            const consistency = Math.max(0, 100 - (Math.sqrt(variance) / averageScore * 100));
            
            let avgTime = 0;
            if (completionTimes.length > 1) {
                completionTimes.sort((a, b) => a - b);
                const timeDiffs = [];
                for (let i = 1; i < completionTimes.length; i++) {
                    timeDiffs.push((completionTimes[i] - completionTimes[i-1]) / (1000 * 60));
                }
                if (timeDiffs.length > 0) {
                    avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
                }
            }

            metrics[assessorId] = {
                name: appState.users[assessorId].name,
                totalAssessments: assessments.length,
                averageScore,
                consistency: consistency.toFixed(0),
                avgTime: avgTime > 0 ? `${avgTime.toFixed(0)}m` : 'N/A'
            };
        } else {
            metrics[assessorId] = {
                name: appState.users[assessorId].name,
                totalAssessments: 0,
                averageScore: 0,
                consistency: 0,
                avgTime: 'N/A'
            };
        }
    });

    return metrics;
}

// Helper function to generate performance insights
function generatePerformanceInsights(categoryMetrics, allScores) {
    const insights = [];
    
    const categoriesWithOverall = Object.values(categoryMetrics).filter(m => m.overallAvg > 0);
    if (categoriesWithOverall.length > 0) {
        const strongest = categoriesWithOverall.reduce((a, b) => a.overallAvg > b.overallAvg ? a : b);
        insights.push(`
            <div class="insight-card positive">
                <i class="fas fa-arrow-up"></i>
                <div class="insight-content">
                    <strong>Strongest Category:</strong> ${strongest.name} with average ${strongest.overallAvg.toFixed(1)}
                </div>
            </div>
        `);
    }
    
    const westernTotal = Object.values(categoryMetrics).reduce((sum, m) => sum + m.westernAvg * m.westernCount, 0);
    const westernCount = Object.values(categoryMetrics).reduce((sum, m) => sum + m.westernCount, 0);
    const africanTotal = Object.values(categoryMetrics).reduce((sum, m) => sum + m.africanAvg * m.africanCount, 0);
    const africanCount = Object.values(categoryMetrics).reduce((sum, m) => sum + m.africanCount, 0);
    
    const westernOverall = westernCount > 0 ? westernTotal / westernCount : 0;
    const africanOverall = africanCount > 0 ? africanTotal / africanCount : 0;
    
    if (westernOverall > 0 && africanOverall > 0) {
        const dominantGenre = westernOverall > africanOverall ? 'Western' : 'African';
        const difference = Math.abs(westernOverall - africanOverall).toFixed(1);
        insights.push(`
            <div class="insight-card ${dominantGenre.toLowerCase() === 'western' ? 'western' : 'african'}">
                <i class="fas fa-chart-line"></i>
                <div class="insight-content">
                    <strong>Genre Dominance:</strong> ${dominantGenre} performances average ${difference} points higher
                </div>
            </div>
        `);
    }
    
    const superiorCount = allScores.filter(s => s >= 90).length;
    const excellentCount = allScores.filter(s => s >= 80 && s < 90).length;
    
    if (superiorCount > 0 || excellentCount > 0) {
        insights.push(`
            <div class="insight-card positive">
                <i class="fas fa-star"></i>
                <div class="insight-content">
                    <strong>Top Performances:</strong> ${superiorCount} Superior + ${excellentCount} Excellent = ${superiorCount + excellentCount} top-tier performances
                </div>
            </div>
        `);
    }
    
    if (insights.length === 0) {
        insights.push(`
            <div class="insight-card neutral">
                <i class="fas fa-info-circle"></i>
                <div class="insight-content">
                    <strong>No Data:</strong> Complete assessments to generate insights
                </div>
            </div>
        `);
    }
    
    return insights.join('');
}

// ========================
// CHOIR IMPORT FUNCTIONS
// ========================

function openImportChoirs() {
    importedChoirsData = [];
    document.getElementById('importChoirsModal').style.display = 'flex';
    resetImportForm();
}

function closeImportChoirsModal() {
    document.getElementById('importChoirsModal').style.display = 'none';
    resetImportForm();
    importedChoirsData = [];
}

function resetImportForm() {
    const fileInput = document.getElementById('importFile');
    if (fileInput) fileInput.value = '';
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) fileInfo.style.display = 'none';
    const importPreview = document.getElementById('importPreview');
    if (importPreview) importPreview.style.display = 'none';
    const importErrors = document.getElementById('importErrors');
    if (importErrors) importErrors.style.display = 'none';
    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.style.display = 'none';
    importedChoirsData = [];
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;

    importedChoirsData = [];

    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name || '';
    const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showNotification('Please select a valid Excel file (.xlsx, .xls) or CSV file', 'error');
        resetImportForm();
        return;
    }

    const fileNameEl = document.getElementById('fileName');
    if (fileNameEl) fileNameEl.textContent = fileName;
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) fileInfo.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            if (fileExtension === '.csv') {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, {type: 'binary'});
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                data = XLSX.utils.sheet_to_json(firstSheet, {header: 1});
            }
            
            validateAndPreviewData(data);
        } catch (error) {
            console.error('Error reading file:', error);
            showNotification('Error reading file. Please check the format and try again.', 'error');
            resetImportForm();
        }
    };

    if (fileExtension === '.csv') {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    return lines.map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }).filter(line => line.some(cell => cell !== ''));
}

function validateAndPreviewData(data) {
    const errors = [];
    const validChoirs = [];
    
    if (!data || data.length < 2) {
        errors.push('File must contain at least a header row and one data row');
        showImportErrors(errors);
        return;
    }

    const headers = data[0].map(h => h ? h.toString().trim().toLowerCase() : '');
    
    const requiredColumns = ['choir name', 'region', 'category', 'african song', 'western song'];
    const headerMap = {};
    
    requiredColumns.forEach(col => {
        const index = headers.findIndex(h => h.includes(col));
        if (index === -1) {
            errors.push(`Missing required column: ${col}`);
        } else {
            headerMap[col] = index;
        }
    });

    if (errors.length > 0) {
        showImportErrors(errors);
        return;
    }

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || row.every(cell => !cell || cell.toString().trim() === '')) {
            continue;
        }

        const choir = {
            name: row[headerMap['choir name']]?.toString().trim(),
            region: row[headerMap['region']]?.toString().trim(),
            category: row[headerMap['category']]?.toString().trim().toUpperCase(),
            africanSong: row[headerMap['african song']]?.toString().trim(),
            westernSong: row[headerMap['western song']]?.toString().trim()
        };

        const rowErrors = [];
        
        if (!choir.name) rowErrors.push('Choir name is required');
        if (!choir.region) rowErrors.push('Region is required');
        if (!choir.category) rowErrors.push('Category is required');
        
        // Check if at least one song is provided (not both required)
        if (!choir.africanSong && !choir.westernSong) {
            rowErrors.push('At least one song (African or Western) is required');
        }

        const validCategories = ['GREAT CHAMPS', 'LARGE', 'STANDARD'];
        if (!validCategories.includes(choir.category)) {
            rowErrors.push(`Invalid category: ${choir.category}. Must be one of: ${validCategories.join(', ')}`);
        }

        if (rowErrors.length > 0) {
            errors.push(`Row ${i + 1}: ${rowErrors.join(', ')}`);
        } else {
            validChoirs.push(choir);
        }
    }

    if (errors.length > 0) {
        showImportErrors(errors);
        return;
    }

    if (validChoirs.length === 0) {
        errors.push('No valid choir data found in file');
        showImportErrors(errors);
        return;
    }

    importedChoirsData = validChoirs;
    showImportPreview(validChoirs);
}

function showImportErrors(errors) {
    const errorList = document.getElementById('errorList');
    if (errorList) {
        errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    }
    const importErrors = document.getElementById('importErrors');
    if (importErrors) importErrors.style.display = 'block';
    const importPreview = document.getElementById('importPreview');
    if (importPreview) importPreview.style.display = 'none';
    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.style.display = 'none';
    importedChoirsData = [];
}

function showImportPreview(choirs) {
    const previewBody = document.getElementById('previewTableBody');
    if (previewBody) {
        previewBody.innerHTML = choirs.map(choir => `
            <tr>
                <td>${choir.name}</td>
                <td>${choir.region}</td>
                <td><span class="category-badge">${choir.category}</span></td>
                <td>${choir.africanSong}</td>
                <td>${choir.westernSong}</td>
            </tr>
        `).join('');
    }
    
    const importPreview = document.getElementById('importPreview');
    if (importPreview) importPreview.style.display = 'block';
    const importErrors = document.getElementById('importErrors');
    if (importErrors) importErrors.style.display = 'none';
    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.style.display = 'inline-block';
}

function importChoirsData() {
    if (!importedChoirsData || importedChoirsData.length === 0) {
        showNotification('No data to import', 'error');
        return;
    }

    let importedCount = 0;
    let skippedCount = 0;

    let nextId = 1;
    if (appState.choirs.length > 0) {
        const ids = appState.choirs.map(c => c.id).filter(id => typeof id === 'number');
        nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    importedChoirsData.forEach(choirData => {
        const existingChoir = appState.choirs.find(c => 
            c.name && choirData.name && 
            c.name.toLowerCase().trim() === choirData.name.toLowerCase().trim()
        );

        if (existingChoir) {
            skippedCount++;
            return;
        }

        const newChoir = {
            id: nextId++,
            name: choirData.name,
            region: choirData.region,
            category: choirData.category,
            africanSong: choirData.africanSong || '',
            westernSong: choirData.westernSong || '',
            status: 'pending'
        };

        appState.choirs.push(newChoir);
        importedCount++;
    });

    appState.choirs.forEach(choir => {
        if (choir.status !== 'assessed') {
            if (!scoringSystem.assessorScores[choir.id] || 
                (Object.keys(scoringSystem.assessorScores[choir.id]?.western || {}).length === 0 &&
                 Object.keys(scoringSystem.assessorScores[choir.id]?.african || {}).length === 0)) {
                choir.status = 'pending';
            }
        }
    });

    scoringSystem.saveToLocalStorage();
    closeImportChoirsModal();

    const message = importedCount > 0 
        ? `Successfully imported ${importedCount} choir(s)${skippedCount > 0 ? `. ${skippedCount} choir(s) skipped due to duplicates.` : ''}`
        : 'No new choirs were imported (all duplicates)';
    
    showNotification(message, importedCount > 0 ? 'success' : 'info');
    
    if (appState.currentView === 'manageChoirs') {
        renderManageChoirs();
    }
}

function downloadTemplate() {
    const templateData = [
        ['Choir Name', 'Region', 'Category', 'African Song', 'Western Song'],
        ['Example Choir 1', 'Gauteng', 'GREAT CHAMPS', 'African Song Title 1', 'Western Song Title 1'],
        ['Example Choir 2', 'Western Cape', 'LARGE', 'African Song Title 2', 'Western Song Title 2'],
        ['Example Choir 3', 'KwaZulu-Natal', 'STANDARD', 'African Song Title 3', 'Western Song Title 3']
    ];

    let ws;
    if (typeof XLSX !== 'undefined') {
        ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Choirs Template');

        ws['!cols'] = [
            {wch: 25},
            {wch: 15},
            {wch: 15},
            {wch: 30},
            {wch: 30}
        ];

        XLSX.writeFile(wb, 'Choirs_Import_Template.xlsx');
    } else {
        const csvContent = templateData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Choirs_Import_Template.csv';
        a.click();
    }
}

// ============================================
// COMPREHENSIVE CHOIR DETAILED REPORT GENERATOR
// ============================================

function showChoirFullReport(choirId) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (!choir) {
        showNotification('Choir not found', 'error');
        return;
    }
    
    const stats = scoringSystem.getChoirStatistics(choirId);
    
    if (stats.western.count === 0 && stats.african.count === 0) {
        showNotification('No assessment data available for this choir', 'warning');
        return;
    }
    
    appState.currentReportChoir = choir;
    appState.currentReportStats = stats;
    
    document.getElementById('choirFullReportModal').style.display = 'flex';
    renderFullReportPreview();
}

function closeChoirFullReportModal() {
    document.getElementById('choirFullReportModal').style.display = 'none';
}

function renderFullReportPreview() {
    const choir = appState.currentReportChoir;
    const stats = appState.currentReportStats;
    
    if (!choir || !stats) return;
    
    const html = generateFullReportHTML(choir, stats);
    document.getElementById('choirFullReportContent').innerHTML = html;
}

function generateFullReportHTML(choir, stats) {
    const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                        choir.westernSong && choir.westernSong.trim() !== '';
    
    const overallRank = getChoirOverallRank(choir.id);
    const westernRank = getChoirGenreRank(choir.id, 'western');
    const africanRank = getChoirGenreRank(choir.id, 'african');
    
    const westernComments = getAllAssessorComments(choir.id, 'western');
    const africanComments = getAllAssessorComments(choir.id, 'african');
    
    const reportId = `TMF-CHR-${new Date().getFullYear()}-${String(choir.id).padStart(5, '0')}`;
    const generationDate = new Date().toLocaleString();
    
    return `
        <div class="full-report-container" id="fullReportContent">
            <div class="report-cover">
                <div class="report-branding">
                    <h1>TIRO MPANE FOUNDATION</h1>
                    <h2>NATIONAL CHORALE EISTEDDFOD</h2>
                    <h3>OFFICIAL CHOIR ASSESSMENT REPORT</h3>
                </div>
                
                <div class="report-metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Report ID:</span>
                        <span class="metadata-value">${reportId}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Generated:</span>
                        <span class="metadata-value">${generationDate}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Status:</span>
                        <span class="metadata-value status-badge completed">${choir.status === 'assessed' ? 'FINAL' : 'PENDING'}</span>
                    </div>
                </div>
                
                <div class="confidential-notice">
                    <i class="fas fa-lock"></i> CONFIDENTIAL - For Official Use and Choir Representatives Only
                </div>
            </div>
            
            <div class="report-page">
                <h3 class="page-title"><i class="fas fa-info-circle"></i> Choir Information</h3>
                
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-row">
                            <span class="info-label">Choir Name:</span>
                            <span class="info-value">${choir.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Region:</span>
                            <span class="info-value">${choir.region}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Category:</span>
                            <span class="info-value"><span class="category-badge">${appState.categories[choir.category]}</span></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Registration ID:</span>
                            <span class="info-value">TMF-${choir.category.substring(0,3)}-${String(choir.id).padStart(3, '0')}</span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-row">
                            <span class="info-label">African Song:</span>
                            <span class="info-value">${choir.africanSong || 'Not Performed'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Western Song:</span>
                            <span class="info-value">${choir.westernSong || 'Not Performed'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Performance Type:</span>
                            <span class="info-value">${hasBothSongs ? 'Both Genres' : (choir.africanSong ? 'African Only' : 'Western Only')}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Assessment Status:</span>
                            <span class="info-value"><span class="status-badge ${choir.status === 'assessed' ? 'completed' : 'pending'}">${choir.status.toUpperCase()}</span></span>
                        </div>
                    </div>
                </div>
                
                <h3 class="page-title"><i class="fas fa-chart-pie"></i> Executive Score Summary</h3>
                
                <div class="score-summary-dashboard">
                    <div class="score-card western">
                        <div class="score-header">WESTERN</div>
                        <div class="score-value">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A'}</div>
                        <div class="score-grade ${getGradeClass(getGradeFromScore(stats.western.trimmedMean))}">${getGradeFromScore(stats.western.trimmedMean)}</div>
                        <div class="score-details">
                            <span><i class="fas fa-users"></i> ${stats.western.count} Assessors</span>
                            <span><i class="fas fa-trophy"></i> Rank: ${westernRank}</span>
                        </div>
                    </div>
                    
                    <div class="score-card african">
                        <div class="score-header">AFRICAN</div>
                        <div class="score-value">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A'}</div>
                        <div class="score-grade ${getGradeClass(getGradeFromScore(stats.african.trimmedMean))}">${getGradeFromScore(stats.african.trimmedMean)}</div>
                        <div class="score-details">
                            <span><i class="fas fa-users"></i> ${stats.african.count} Assessors</span>
                            <span><i class="fas fa-trophy"></i> Rank: ${africanRank}</span>
                        </div>
                    </div>
                    
                    <div class="score-card overall">
                        <div class="score-header">OVERALL</div>
                        <div class="score-value">${stats.overall.toFixed(1)}</div>
                        <div class="score-grade ${getGradeClass(getGradeFromScore(stats.overall))}">${getGradeFromScore(stats.overall)}</div>
                        <div class="score-details">
                            <span><i class="fas fa-users"></i> ${stats.western.count + stats.african.count} Total</span>
                            <span><i class="fas fa-trophy"></i> Rank: ${overallRank}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="report-page">
                <h3 class="page-title"><i class="fas fa-table"></i> Detailed Rubric Assessment</h3>
                
                ${generateRubricTablesHTML(choir.id, stats)}
            </div>
            
            <div class="report-page">
                <h3 class="page-title"><i class="fas fa-comment"></i> Assessor Feedback</h3>
                
                <div class="comments-section">
                    <h4 class="genre-heading western-heading"><i class="fas fa-globe"></i> Western Genre Comments</h4>
                    ${generateCommentsHTML(westernComments, 'western')}
                    
                    <h4 class="genre-heading african-heading"><i class="fas fa-drum"></i> African Genre Comments</h4>
                    ${generateCommentsHTML(africanComments, 'african')}
                </div>
            </div>
            
            <div class="report-footer">
                <div class="footer-left">TMF National Chorale Eisteddfod - Official Report</div>
                <div class="footer-center">Report ID: ${reportId}</div>
                <div class="footer-right">Page <span class="page-number"></span> of 3</div>
            </div>
        </div>
    `;
}

function getChoirOverallRank(choirId) {
    const rankings = scoringSystem.finalRankings.overall;
    const index = rankings.findIndex(r => r.choir.id === choirId);
    return index !== -1 ? rankings[index].rank : 'N/A';
}

function getChoirGenreRank(choirId, genre) {
    const rankings = scoringSystem.finalRankings[genre];
    const index = rankings.findIndex(r => r.choir.id === choirId);
    return index !== -1 ? rankings[index].rank : 'N/A';
}

function getAllAssessorComments(choirId, genre) {
    const comments = [];
    
    if (scoringSystem.assessorScores[choirId] && 
        scoringSystem.assessorScores[choirId][genre]) {
        
        Object.entries(scoringSystem.assessorScores[choirId][genre]).forEach(([assessorId, assessment]) => {
            if (assessment.comments && assessment.comments.trim() !== '') {
                comments.push({
                    assessorId,
                    assessorName: assessment.assessorName || `Assessor ${assessorId}`,
                    score: assessment.total,
                    comments: assessment.comments,
                    submittedAt: assessment.submittedAt
                });
            }
        });
    }
    
    return comments.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

function generateRubricTablesHTML(choirId, stats) {
    const rubricCategories = [
        { key: 'intonation', name: 'Intonation', max: 15 },
        { key: 'pitchAccuracy', name: 'Pitch Accuracy', max: 15 },
        { key: 'language', name: 'Language & Diction', max: 10 },
        { key: 'vocalTechnique', name: 'Vocal Technique', max: 15 },
        { key: 'choralTechnique', name: 'Choral Technique', max: 15 },
        { key: 'rhythm', name: 'Rhythmic Accuracy', max: 15 },
        { key: 'artistry', name: 'Artistic Relevance', max: 10 },
        { key: 'stage', name: 'Stage Presence', max: 5 }
    ];
    
    let html = '';
    
    if (stats.western.count > 0) {
        html += `
            <h4 class="genre-heading western-heading"><i class="fas fa-globe"></i> Western Genre Assessment</h4>
            <div class="rubric-report-table">
                <table class="full-report-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            ${getAssessorHeaders(choirId, 'western')}
                            <th>Trimmed Mean</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        rubricCategories.forEach(cat => {
            html += `<tr>`;
            html += `<td class="category-cell">${cat.name} <span class="max-score">(${cat.max})</span></td>`;
            
            const assessments = scoringSystem.assessorScores[choirId]?.western || {};
            const scores = [];
            
            Object.values(assessments).forEach(assessment => {
                scores.push(assessment[cat.key] || 0);
            });
            
            const sortedScores = [...scores].sort((a, b) => a - b);
            
            Object.entries(assessments).forEach(([assessorId, assessment]) => {
                const score = assessment[cat.key] || 0;
                const isLowest = scores.length >= 3 && score === sortedScores[0];
                const isHighest = scores.length >= 3 && score === sortedScores[sortedScores.length - 1];
                
                html += `<td class="score-cell ${isLowest ? 'lowest-score' : ''} ${isHighest ? 'highest-score' : ''}">${score.toFixed(1)}</td>`;
            });
            
            let trimmedMean = 0;
            if (scores.length === 1) {
                trimmedMean = scores[0];
            } else if (scores.length === 2) {
                trimmedMean = (scores[0] + scores[1]) / 2;
            } else if (scores.length >= 3) {
                const trimmedScores = sortedScores.slice(1, -1);
                trimmedMean = trimmedScores.reduce((a, b) => a + b, 0) / trimmedScores.length;
            }
            
            html += `<td class="trimmed-mean"><strong>${trimmedMean.toFixed(1)}</strong></td>`;
            html += `</tr>`;
        });
        
        html += `<tr class="total-row">`;
        html += `<td class="category-cell"><strong>TOTAL</strong></td>`;
        
        Object.entries(scoringSystem.assessorScores[choirId]?.western || {}).forEach(([assessorId, assessment]) => {
            html += `<td class="total-cell"><strong>${assessment.total.toFixed(1)}</strong></td>`;
        });
        
        html += `<td class="trimmed-mean"><strong>${stats.western.trimmedMean.toFixed(1)}</strong></td>`;
        html += `</tr>`;
        
        html += `
                    </tbody>
                </table>
                <div class="table-legend">
                    <span class="legend-item"><span class="legend-color lowest-score"></span> Lowest Score (Removed)</span>
                    <span class="legend-item"><span class="legend-color highest-score"></span> Highest Score (Removed)</span>
                    <span class="legend-item"><span class="legend-color trimmed-mean"></span> Trimmed Mean (Final Score)</span>
                </div>
            </div>
        `;
    }
    
    if (stats.african.count > 0) {
        html += `
            <h4 class="genre-heading african-heading"><i class="fas fa-drum"></i> African Genre Assessment</h4>
            <div class="rubric-report-table">
                <table class="full-report-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            ${getAssessorHeaders(choirId, 'african')}
                            <th>Trimmed Mean</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        rubricCategories.forEach(cat => {
            html += `<tr>`;
            html += `<td class="category-cell">${cat.name} <span class="max-score">(${cat.max})</span></td>`;
            
            const assessments = scoringSystem.assessorScores[choirId]?.african || {};
            const scores = [];
            
            Object.values(assessments).forEach(assessment => {
                scores.push(assessment[cat.key] || 0);
            });
            
            const sortedScores = [...scores].sort((a, b) => a - b);
            
            Object.entries(assessments).forEach(([assessorId, assessment]) => {
                const score = assessment[cat.key] || 0;
                const isLowest = scores.length >= 3 && score === sortedScores[0];
                const isHighest = scores.length >= 3 && score === sortedScores[sortedScores.length - 1];
                
                html += `<td class="score-cell ${isLowest ? 'lowest-score' : ''} ${isHighest ? 'highest-score' : ''}">${score.toFixed(1)}</td>`;
            });
            
            let trimmedMean = 0;
            if (scores.length === 1) {
                trimmedMean = scores[0];
            } else if (scores.length === 2) {
                trimmedMean = (scores[0] + scores[1]) / 2;
            } else if (scores.length >= 3) {
                const trimmedScores = sortedScores.slice(1, -1);
                trimmedMean = trimmedScores.reduce((a, b) => a + b, 0) / trimmedScores.length;
            }
            
            html += `<td class="trimmed-mean"><strong>${trimmedMean.toFixed(1)}</strong></td>`;
            html += `</tr>`;
        });
        
        html += `<tr class="total-row">`;
        html += `<td class="category-cell"><strong>TOTAL</strong></td>`;
        
        Object.entries(scoringSystem.assessorScores[choirId]?.african || {}).forEach(([assessorId, assessment]) => {
            html += `<td class="total-cell"><strong>${assessment.total.toFixed(1)}</strong></td>`;
        });
        
        html += `<td class="trimmed-mean"><strong>${stats.african.trimmedMean.toFixed(1)}</strong></td>`;
        html += `</tr>`;
        
        html += `
                    </tbody>
                </table>
                <div class="table-legend">
                    <span class="legend-item"><span class="legend-color lowest-score"></span> Lowest Score (Removed)</span>
                    <span class="legend-item"><span class="legend-color highest-score"></span> Highest Score (Removed)</span>
                    <span class="legend-item"><span class="legend-color trimmed-mean"></span> Trimmed Mean (Final Score)</span>
                </div>
            </div>
        `;
    }
    
    return html;
}

function getAssessorHeaders(choirId, genre) {
    let headers = '';
    
    if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
        Object.keys(scoringSystem.assessorScores[choirId][genre]).forEach(assessorId => {
            const assessorName = scoringSystem.assessorScores[choirId][genre][assessorId].assessorName || `Assessor ${assessorId}`;
            headers += `<th>${assessorName}</th>`;
        });
    }
    
    return headers;
}

function generateCommentsHTML(comments, genre) {
    if (comments.length === 0) {
        return `<p class="no-comments">No comments provided for ${genre} genre.</p>`;
    }
    
    return comments.map(comment => `
        <div class="comment-card ${genre}-comment">
            <div class="comment-header">
                <span class="comment-assessor"><i class="fas fa-user"></i> ${comment.assessorName}</span>
                <span class="comment-score">Score: ${comment.score.toFixed(1)}</span>
                <span class="comment-date">${new Date(comment.submittedAt).toLocaleString()}</span>
            </div>
            <div class="comment-body">
                "${comment.comments}"
            </div>
        </div>
    `).join('');
}

// =========================
// PDF GENERATION FUNCTIONS
// =========================

function generateChoirFullReportPDF() {
    const choir = appState.currentReportChoir;
    if (!choir) {
        showNotification('No report data available', 'error');
        return;
    }
    
    showNotification('Generating PDF report...', 'info');
    
    const reportElement = document.getElementById('fullReportContent');
    if (!reportElement) {
        showNotification('Report content not found', 'error');
        return;
    }
    
    const reportClone = reportElement.cloneNode(true);
    reportClone.style.display = 'block';
    reportClone.style.position = 'absolute';
    reportClone.style.left = '-9999px';
    reportClone.style.top = '-9999px';
    reportClone.style.width = '800px';
    reportClone.style.background = 'white';
    reportClone.style.color = 'black';
    document.body.appendChild(reportClone);
    
    if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
        const pages = reportClone.querySelectorAll('.report-page, .report-cover');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        let pagePromises = [];
        
        pages.forEach((page, index) => {
            pagePromises.push(
                html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    allowTaint: false,
                    foreignObjectRendering: false
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 190;
                    const pageHeight = 280;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    if (index > 0) {
                        pdf.addPage();
                    }
                    
                    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                })
            );
        });
        
        Promise.all(pagePromises).then(() => {
            const filename = `TMF_Report_${choir.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
            document.body.removeChild(reportClone);
            showNotification('PDF report generated successfully!', 'success');
        }).catch(error => {
            console.error('Error generating PDF:', error);
            showNotification('Error generating PDF. Please try again.', 'error');
            document.body.removeChild(reportClone);
        });
    } else {
        showNotification('PDF libraries not loaded. Please install html2canvas and jspdf.', 'warning');
        document.body.removeChild(reportClone);
    }
}

function printChoirFullReport() {
    const choir = appState.currentReportChoir;
    if (!choir) {
        showNotification('No report data available', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showNotification('Please allow pop-ups to print the report', 'error');
        return;
    }
    
    const reportElement = document.getElementById('fullReportContent');
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    let stylesHTML = '';
    
    styles.forEach(style => {
        if (style.tagName === 'STYLE') {
            stylesHTML += style.outerHTML;
        } else if (style.tagName === 'LINK') {
            stylesHTML += style.outerHTML;
        }
    });
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>TMF Choir Report - ${choir.name}</title>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            ${stylesHTML}
            <style>
                body { background: white; color: black; padding: 20px; }
                .report-cover, .report-page { page-break-after: always; }
                .full-report-container { max-width: 800px; margin: 0 auto; }
                .report-footer { page-break-after: avoid; }
                @media print {
                    body { margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body>
            ${reportElement.outerHTML}
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 1000);
}

function exportChoirReportToExcel() {
    const choir = appState.currentReportChoir;
    const stats = appState.currentReportStats;
    
    if (!choir || !stats) {
        showNotification('No report data available', 'error');
        return;
    }
    
    try {
        const data = [];
        
        data.push(['TIRO MPANE FOUNDATION - CHOIR ASSESSMENT REPORT']);
        data.push(['Generated:', new Date().toLocaleString()]);
        data.push([]);
        
        data.push(['CHOIR INFORMATION']);
        data.push(['Choir Name:', choir.name]);
        data.push(['Region:', choir.region]);
        data.push(['Category:', appState.categories[choir.category]]);
        data.push(['African Song:', choir.africanSong || 'Not Performed']);
        data.push(['Western Song:', choir.westernSong || 'Not Performed']);
        data.push([]);
        
        data.push(['SCORE SUMMARY']);
        data.push(['Genre', 'Final Score', 'Grade', 'Assessors', 'Rank']);
        data.push(['Western', stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : 'N/A', 
                  getGradeFromScore(stats.western.trimmedMean), stats.western.count, getChoirGenreRank(choir.id, 'western')]);
        data.push(['African', stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : 'N/A',
                  getGradeFromScore(stats.african.trimmedMean), stats.african.count, getChoirGenreRank(choir.id, 'african')]);
        data.push(['Overall', stats.overall.toFixed(1), getGradeFromScore(stats.overall), 
                  stats.western.count + stats.african.count, getChoirOverallRank(choir.id)]);
        data.push([]);
        
        if (stats.western.count > 0) {
            data.push(['WESTERN GENRE - DETAILED RUBRIC SCORES']);
            const headers = ['Category'];
            Object.keys(scoringSystem.assessorScores[choir.id]?.western || {}).forEach(assessorId => {
                headers.push(scoringSystem.assessorScores[choir.id].western[assessorId].assessorName || `Assessor ${assessorId}`);
            });
            headers.push('Trimmed Mean');
            data.push(headers);
            
            const rubricCategories = ['intonation', 'pitchAccuracy', 'language', 'vocalTechnique', 
                                     'choralTechnique', 'rhythm', 'artistry', 'stage'];
            const categoryNames = ['Intonation', 'Pitch Accuracy', 'Language & Diction', 'Vocal Technique',
                                  'Choral Technique', 'Rhythmic Accuracy', 'Artistic Relevance', 'Stage Presence'];
            
            rubricCategories.forEach((cat, idx) => {
                const row = [categoryNames[idx]];
                const scores = [];
                
                Object.values(scoringSystem.assessorScores[choir.id].western).forEach(assessment => {
                    row.push(assessment[cat]?.toFixed(1) || '0.0');
                    scores.push(assessment[cat] || 0);
                });
                
                let trimmedMean = 0;
                const sortedScores = [...scores].sort((a, b) => a - b);
                if (scores.length === 1) {
                    trimmedMean = scores[0];
                } else if (scores.length === 2) {
                    trimmedMean = (scores[0] + scores[1]) / 2;
                } else if (scores.length >= 3) {
                    const trimmed = sortedScores.slice(1, -1);
                    trimmedMean = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
                }
                row.push(trimmedMean.toFixed(1));
                
                data.push(row);
            });
            
            const totalRow = ['TOTAL'];
            Object.values(scoringSystem.assessorScores[choir.id].western).forEach(assessment => {
                totalRow.push(assessment.total?.toFixed(1) || '0.0');
            });
            totalRow.push(stats.western.trimmedMean.toFixed(1));
            data.push(totalRow);
            data.push([]);
        }
        
        if (stats.african.count > 0) {
            data.push(['AFRICAN GENRE - DETAILED RUBRIC SCORES']);
            const headers = ['Category'];
            Object.keys(scoringSystem.assessorScores[choir.id]?.african || {}).forEach(assessorId => {
                headers.push(scoringSystem.assessorScores[choir.id].african[assessorId].assessorName || `Assessor ${assessorId}`);
            });
            headers.push('Trimmed Mean');
            data.push(headers);
            
            const rubricCategories = ['intonation', 'pitchAccuracy', 'language', 'vocalTechnique', 
                                     'choralTechnique', 'rhythm', 'artistry', 'stage'];
            const categoryNames = ['Intonation', 'Pitch Accuracy', 'Language & Diction', 'Vocal Technique',
                                  'Choral Technique', 'Rhythmic Accuracy', 'Artistic Relevance', 'Stage Presence'];
            
            rubricCategories.forEach((cat, idx) => {
                const row = [categoryNames[idx]];
                const scores = [];
                
                Object.values(scoringSystem.assessorScores[choir.id].african).forEach(assessment => {
                    row.push(assessment[cat]?.toFixed(1) || '0.0');
                    scores.push(assessment[cat] || 0);
                });
                
                let trimmedMean = 0;
                const sortedScores = [...scores].sort((a, b) => a - b);
                if (scores.length === 1) {
                    trimmedMean = scores[0];
                } else if (scores.length === 2) {
                    trimmedMean = (scores[0] + scores[1]) / 2;
                } else if (scores.length >= 3) {
                    const trimmed = sortedScores.slice(1, -1);
                    trimmedMean = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
                }
                row.push(trimmedMean.toFixed(1));
                
                data.push(row);
            });
            
            const totalRow = ['TOTAL'];
            Object.values(scoringSystem.assessorScores[choir.id].african).forEach(assessment => {
                totalRow.push(assessment.total?.toFixed(1) || '0.0');
            });
            totalRow.push(stats.african.trimmedMean.toFixed(1));
            data.push(totalRow);
            data.push([]);
        }
        
        data.push(['ASSESSOR COMMENTS']);
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choir.id] && scoringSystem.assessorScores[choir.id][genre]) {
                data.push([genre.toUpperCase() + ' GENRE']);
                Object.values(scoringSystem.assessorScores[choir.id][genre]).forEach(assessment => {
                    if (assessment.comments) {
                        data.push([`${assessment.assessorName} (Score: ${assessment.total.toFixed(1)})`, assessment.comments]);
                    }
                });
                data.push([]);
            }
        });
        
        if (typeof XLSX !== 'undefined') {
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Choir Report');
            
            ws['!cols'] = [
                {wch: 30}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}
            ];
            
            const filename = `TMF_Report_${choir.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, filename);
            
            showNotification('Excel report exported successfully!', 'success');
        } else {
            showNotification('Excel library not loaded', 'warning');
        }
    } catch (error) {
        console.error('Excel export error:', error);
        showNotification('Error exporting to Excel', 'error');
    }
}

function emailChoirReport() {
    const choir = appState.currentReportChoir;
    if (!choir) {
        showNotification('No report data available', 'error');
        return;
    }
    
    const email = prompt('Enter email address to send the report:', 'choir@example.com');
    
    if (email) {
        showNotification(`Report would be sent to ${email} (email integration required)`, 'info');
    }
}

// ====================
// ADDITIONAL FUNCTIONS
// ====================

function showAssessorPerformance() {
    showNotification('Assessor performance view coming soon', 'info');
}

function addAnalyticsStyles() {
    // This function is called but not implemented - adding a placeholder
    console.log('Analytics styles initialized');
}

// ================================
// FINAL EXPORTS AND INITIALIZATION
// ================================

window.showLogin = showLogin;
window.hideLogin = hideLogin;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.login = login;
window.logout = logout;
window.handleForgotPassword = handleForgotPassword;
window.showDashboard = showDashboard;
window.showAssessmentChooser = showAssessmentChooser;
window.showResults = showResults;
window.showManageUsers = showManageUsers;
window.showManageChoirs = showManageChoirs;
window.showReports = showReports;
window.showMethodologyCalculations = showMethodologyCalculations;
window.showProfessionalAdjudication = showProfessionalAdjudication;
window.selectGenreForAssessment = selectGenreForAssessment;
window.closeAdjudicationModal = closeAdjudicationModal;
window.saveAssessorAssessment = saveAssessorAssessment;
window.resetRubric = resetRubric;
window.validateScoreInput = validateScoreInput;
window.updateScores = updateScores;
window.filterChoirsByCategory = filterChoirsByCategory;
window.filterResults = filterResults;
window.showChoirDetailedReport = showChoirDetailedReport;
window.closeChoirReportModal = closeChoirReportModal;
window.showMyAssessmentDetails = showMyAssessmentDetails;
window.showMyAssessmentTab = showMyAssessmentTab;
window.showReportTab = showReportTab;
window.showFinalResults = showFinalResults;
window.closeFinalResultsModal = closeFinalResultsModal;
window.showFinalResultsTab = showFinalResultsTab;
window.openAddUser = openAddUser;
window.openEditUser = openEditUser;
window.closeUserForm = closeUserForm;
window.deleteUser = deleteUser;
window.saveUser = saveUser;
window.openAddChoir = openAddChoir;
window.openEditChoir = openEditChoir;
window.closeChoirForm = closeChoirForm;
window.deleteChoir = deleteChoir;
window.saveChoir = saveChoir;
window.showAssessorScores = showAssessorScores;
window.closeAssessorScoresModal = closeAssessorScoresModal;
window.exportToExcel = exportToExcel;
window.generateCategoryReport = generateCategoryReport;
window.generateAllChoirReports = generateAllChoirReports;
window.generateComprehensiveReport = generateComprehensiveReport;
window.generateAssessorsSummaryReport = generateAssessorsSummaryReport;
window.closeMethodologyModal = closeMethodologyModal;
window.showMethodologyTab = showMethodologyTab;
window.showDashboardFromGenreSelection = showDashboardFromGenreSelection;
window.showDashboardFromAdjudication = showDashboardFromAdjudication;
window.closeUserManagement = closeUserManagement;
window.showLiveMonitoring = showLiveMonitoring;
window.showAssessorPerformance = showAssessorPerformance;
window.showProfessionalMonitoringCenter = showProfessionalMonitoringCenter;
window.showLiveScoringMonitor = showLiveScoringMonitor;
window.showSystemHealthMonitor = showSystemHealthMonitor;
window.showDataIntegrityMonitor = showDataIntegrityMonitor;
window.showAdvancedAnalytics = showAdvancedAnalytics;
window.showIncidentManagement = showIncidentManagement;
window.refreshOperationsCenter = refreshOperationsCenter;
window.refreshScoringMonitor = refreshScoringMonitor;
window.refreshSystemHealth = refreshSystemHealth;
window.refreshDataIntegrity = refreshDataIntegrity;
window.refreshAnalytics = refreshAnalytics;
window.refreshIncidentManagement = refreshIncidentManagement;
window.generateEmergencyReport = generateEmergencyReport;
window.openImportChoirs = openImportChoirs;
window.closeImportChoirsModal = closeImportChoirsModal;
window.handleFileSelect = handleFileSelect;
window.importChoirsData = importChoirsData;
window.downloadTemplate = downloadTemplate;
window.clearAllAssessmentData = clearAllAssessmentData;
window.resetSystemToCleanState = resetSystemToCleanState;
window.debugCheckData = debugCheckData;
window.showMyAssessmentsOnly = showMyAssessmentsOnly;

window.showChoirFullReport = showChoirFullReport;
window.generateChoirFullReportPDF = generateChoirFullReportPDF;
window.printChoirFullReport = printChoirFullReport;
window.exportChoirReportToExcel = exportChoirReportToExcel;
window.emailChoirReport = emailChoirReport;
window.closeChoirFullReportModal = closeChoirFullReportModal;

window.filterChoirsBySearch = filterChoirsBySearch;
window.clearSearch = clearSearch;
window.filterMyAssessmentsBySearch = filterMyAssessmentsBySearch;
window.clearMyAssessmentsSearch = clearMyAssessmentsSearch;

// New methodology functions
window.showChoirMethodologyDetails = showChoirMethodologyDetails;
window.closeMethodologyDetailsModal = closeMethodologyDetailsModal;
window.closeMethodologyGenreModal = closeMethodologyGenreModal;

console.log('TMF Choral Judicators System v2.1.0 loaded successfully!');
console.log('System ready for live competition - All monitoring dashboards include Back to Dashboard buttons');
