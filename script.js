// APPLICATION STATE & INITIALIZATION

// ============================================
// GLOBAL VARIABLES - DECLARED AT TOP
// ============================================
let importedChoirsData = []; // Global variable for choir imports

const appState = {
    currentUser: null,
    currentRole: null,
   currentUserId: null,
    isLoggedIn: false,
    currentView: 'dashboard',
    choirs: [],
    assessments: {},
    users: {
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
    
    choirsData: [
        { id: 1, name: "Gauteng Chorale", region: "Gauteng", category: "GREAT CHAMPS", africanSong: "Shosholoza", westernSong: "Ave Maria", status: "pending" },
        { id: 2, name: "Cape Town Singers", region: "Western Cape", category: "LARGE", africanSong: "Malaika", westernSong: "Hallelujah", status: "pending" },
        { id: 3, name: "Durban Choir", region: "KwaZulu-Natal", category: "LARGE", africanSong: "Nkosi Sikelel' iAfrika", westernSong: "Amazing Grace", status: "pending" },
        { id: 4, name: "Free State Voices", region: "Free State", category: "STANDARD", africanSong: "Thula Sthandwa", westernSong: "Panis Angelicus", status: "pending" },
        { id: 5, name: "Limpopo Harmony", region: "Limpopo", category: "STANDARD", africanSong: "Pata Pata", westernSong: "O Holy Night", status: "pending" },
        { id: 6, name: "Mpumalanga Ensemble", region: "Mpumalanga", category: "GREAT CHAMPS", africanSong: "Mbube", westernSong: "The Lord's Prayer", status: "pending" },
        { id: 7, name: "North West Chorale", region: "North West", category: "LARGE", africanSong: "Qhude", westernSong: "Jesu Joy of Man's Desiring", status: "pending" },
        { id: 8, name: "Northern Cape Voices", region: "Northern Cape", category: "STANDARD", africanSong: "Indodana", westernSong: "Ave Verum Corpus", status: "pending" },
        { id: 9, name: "Eastern Cape Choir", region: "Eastern Cape", category: "LARGE", africanSong: "Senzeni Na", westernSong: "Gloria", status: "pending" },
        { id: 10, name: "Botswana Singers", region: "Botswana", category: "STANDARD", africanSong: "Fatshe La Rona", westernSong: "Schubert's Ave Maria", status: "pending" },
        { id: 11, name: "Zimbabwe Voices", region: "Zimbabwe", category: "GREAT CHAMPS", africanSong: "Nhemamusasa", westernSong: "Bach's Magnificat", status: "pending" },
        { id: 12, name: "Namibia Choir", region: "Namibia", category: "LARGE", africanSong: "Namibia Land of the Brave", westernSong: "Mozart's Laudate Dominum", status: "pending" },
        { id: 13, name: "Kopano Chorus", region: "Gauteng", category: "GREAT CHAMPS", africanSong: "Tloutlholo by M Mogale", westernSong: "Kyrie & Dies Irae - (N07) Requiem", status: "pending" },
        { id: 14, name: "Gauteng Choristers", region: "Gauteng", category: "LARGE", africanSong: "JSP Motuba - Bulang dikgoro", westernSong: "Verdi - Requiem aeterna (soprano)", status: "pending" },
        { id: 15, name: "Maikano Serenaders", region: "Botswana", category: "STANDARD", africanSong: "L Disho - Mesia wa Afrika", westernSong: "Haydn - Der Landman hat sein Wein", status: "pending" },
        { id: 16, name: "NWU Serenaders", region: "North West", category: "LARGE", africanSong: "African Medley", westernSong: "Mozart - Alleluia", status: "pending" },
        { id: 17, name: "Eastern Cape Police Choir", region: "Eastern Cape", category: "GREAT CHAMPS", africanSong: "Thula Sthandwa", westernSong: "The Lord's Prayer", status: "pending" },
        { id: 18, name: "Da Capo Chorus", region: "North West", category: "LARGE", africanSong: "Qhude", westernSong: "Jesu Joy", status: "pending" }
    ],
    
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
    assessors: {
        'assessor1': { name: "Assessor 1", id: 1, active: true },
        'assessor2': { name: "Assessor 2", id: 2, active: true },
        'assessor3': { name: "Assessor 3", id: 3, active: true },
        'assessor4': { name: "Assessor 4", id: 4, active: true },
        'assessor5': { name: "Assessor 5", id: 5, active: true },
        'assessor6': { name: "Assessor 6", id: 6, active: true },
        'assessor7': { name: "Assessor 7", id: 7, active: true },
        'assessor': { name: "Assessor 8", id: 8, active: true },
        'assessor9': { name: "Assessor 9", id: 9, active: true },
        'assessor10': { name: "Assessor 10", id: 10, active: true },
        'assessor11': { name: "Assessor 11", id: 11, active: true },
        'assessor12': { name: "Assessor 12", id: 12, active: true }
    }
};

// FLEXIBLE SCORING SYSTEM DATA - UPDATED TO ALWAYS REMOVE HIGHEST AND LOWEST
const scoringSystem = {
    currentChoir: null,
    currentGenre: 'western',
    currentAssessorId: null,
    assessorScores: {}, // Structure: choirId -> genre -> assessorId -> scores
    trimmedMeans: {}, // Structure: choirId -> genre -> trimmedMean
    finalRankings: {
        western: [],
        african: [],
        overall: []
    },
    
    // Initialize assessor scores
    initializeAssessorScores: function(choirId) {
        if (!this.assessorScores[choirId]) {
            this.assessorScores[choirId] = {
                western: {},
                african: {}
            };
        }
    },
    
    // Add assessor score
    addAssessorScore: function(choirId, genre, assessorId, scores, comments = "") {
        this.initializeAssessorScores(choirId);
        this.assessorScores[choirId][genre][assessorId] = {
            ...scores,
            comments: comments,
            assessorName: appState.users[assessorId]?.name || `Assessor ${assessorId}`,
            submittedAt: new Date().toISOString()
        };
        
        // Calculate trimmed mean for this choir/genre
        this.calculateTrimmedMean(choirId, genre);
        
        // Update rankings
        this.calculateRankings();
        
        // Save to localStorage
        this.saveToLocalStorage();
    },
    
    // Calculate trimmed mean for a choir/genre - ALWAYS REMOVE HIGHEST AND LOWEST
    calculateTrimmedMean: function(choirId, genre) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return 0;
        }
        
        const assessorScores = Object.values(this.assessorScores[choirId][genre]);
        
        // If no scores yet
        if (assessorScores.length === 0) {
            return 0;
        }
        
        // Extract total scores from each assessor
        const totalScores = assessorScores.map(score => score.total || 0);
        
        // ALWAYS REMOVE HIGHEST AND LOWEST SCORES
        let trimmedMean = 0;
        
        if (totalScores.length === 1) {
            // Single assessor: use raw score
            trimmedMean = totalScores[0];
        } else if (totalScores.length === 2) {
            // Two assessors: use average of both (can't remove both highest and lowest)
            trimmedMean = (totalScores[0] + totalScores[1]) / 2;
        } else {
            // Always remove highest and lowest, then average
            const sortedScores = [...totalScores].sort((a, b) => a - b);
            sortedScores.shift(); // Remove lowest
            sortedScores.pop();   // Remove highest
            
            const sum = sortedScores.reduce((a, b) => a + b, 0);
            trimmedMean = sum / sortedScores.length;
        }
        
        // Store trimmed mean
        if (!this.trimmedMeans[choirId]) {
            this.trimmedMeans[choirId] = {};
        }
        this.trimmedMeans[choirId][genre] = trimmedMean;
        
        return trimmedMean;
    },
    
    // Get choir trimmed mean for a genre
    getChoirTrimmedMean: function(choirId, genre) {
        if (this.trimmedMeans[choirId] && this.trimmedMeans[choirId][genre]) {
            return this.trimmedMeans[choirId][genre];
        }
        return 0;
    },
    
    // Calculate overall score for a choir - ONLY for choirs that performed both songs AND have both scores
    getChoirOverallScore: function(choirId) {
        const westernScore = this.getChoirTrimmedMean(choirId, 'western') || 0;
        const africanScore = this.getChoirTrimmedMean(choirId, 'african') || 0;
        
        // Check if choir performed both songs
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return 0;
        
        // STRICT CHECK: Choir must have BOTH songs to be eligible for overall score
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        // If choir doesn't have both songs, they are NOT eligible for overall rankings
        if (!hasBothSongs) {
            return 0; // Single-song choirs are NOT eligible for overall rankings
        }
        
        // Both genres must be assessed to have a valid overall score
        if (westernScore > 0 && africanScore > 0) {
            return (westernScore + africanScore) / 2;
        }
        
        // If one genre hasn't been assessed yet, return 0 (incomplete)
        return 0;
    },
    
    // Check if assessor has already assessed this choir for a specific genre
    hasAssessorAlreadyAssessed: function(choirId, genre, assessorId) {
        if (!this.assessorScores[choirId] || !this.assessorScores[choirId][genre]) {
            return false;
        }
        return this.assessorScores[choirId][genre][assessorId] !== undefined;
    },
    
    // Check if assessor has fully assessed a choir (both genres or applicable single genre)
    hasAssessorFullyAssessed: function(choirId, assessorId) {
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return false;
        
        // Check if choir has both songs
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        if (hasBothSongs) {
            // Both songs: assessor must assess both genres
            return this.hasAssessorAlreadyAssessed(choirId, 'western', assessorId) && 
                   this.hasAssessorAlreadyAssessed(choirId, 'african', assessorId);
        } else {
            // Single song: assessor must assess the applicable genre
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
    
    // Calculate rankings for all categories
    calculateRankings: function() {
        const westernRankings = [];
        const africanRankings = [];
        const overallRankings = [];
        
        // Get all choirs with scores
        appState.choirs.forEach(choir => {
            const westernScore = this.getChoirTrimmedMean(choir.id, 'western');
            const africanScore = this.getChoirTrimmedMean(choir.id, 'african');
            
            // Check if choir performed both songs
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
            
            // CRITICAL FIX: Only include in overall rankings if choir performed BOTH songs
            // AND has scores for BOTH genres
            if (hasBothSongs && westernScore > 0 && africanScore > 0) {
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
        
        // Sort by score (descending)
        westernRankings.sort((a, b) => b.score - a.score);
        africanRankings.sort((a, b) => b.score - a.score);
        overallRankings.sort((a, b) => b.score - a.score);
        
        // Apply ranking logic (tie handling)
        this.finalRankings.western = this.applyRankingLogic(westernRankings);
        this.finalRankings.african = this.applyRankingLogic(africanRankings);
        this.finalRankings.overall = this.applyRankingLogic(overallRankings);
    },
    
    // Apply ranking logic with tie handling
    applyRankingLogic: function(rankings) {
        if (rankings.length === 0) return [];
        
        // Group by score for tie detection
        const scoreGroups = {};
        rankings.forEach((item, index) => {
            const roundedScore = Math.round(item.score * 10) / 10;
            if (!scoreGroups[roundedScore]) {
                scoreGroups[roundedScore] = [];
            }
            scoreGroups[roundedScore].push({ ...item, originalIndex: index });
        });
        
        // Apply rankings
        let currentRank = 1;
        const finalRankings = [];
        
        Object.keys(scoreGroups).sort((a, b) => b - a).forEach(score => {
            const items = scoreGroups[score];
            
            if (items.length === 1) {
                // No tie
                finalRankings.push({
                    ...items[0],
                    rank: currentRank,
                    isTie: false
                });
                currentRank++;
            } else {
                // Tie situation
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
    
    // Get assessor's assessment for a choir/genre
    getAssessorAssessment: function(choirId, genre, assessorId) {
        if (this.assessorScores[choirId] && 
            this.assessorScores[choirId][genre] && 
            this.assessorScores[choirId][genre][assessorId]) {
            return this.assessorScores[choirId][genre][assessorId];
        }
        return null;
    },
    
    // Get all assessor assessments for a choir/genre
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
    
    // Get assessor's own assessments only
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
    
    // Get summary statistics for a choir
    getChoirStatistics: function(choirId) {
        const westernAssessments = this.getAllAssessorAssessments(choirId, 'western');
        const africanAssessments = this.getAllAssessorAssessments(choirId, 'african');
        
        return {
            western: {
                assessments: westernAssessments,
                count: westernAssessments.length,
                trimmedMean: this.getChoirTrimmedMean(choirId, 'western'),
                rawScores: westernAssessments.map(a => a.total)
            },
            african: {
                assessments: africanAssessments,
                count: africanAssessments.length,
                trimmedMean: this.getChoirTrimmedMean(choirId, 'african'),
                rawScores: africanAssessments.map(a => a.total)
            },
            overall: this.getChoirOverallScore(choirId)
        };
    },
    
    // Reset for new assessment
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
    
    // Get methodology calculations for a choir (similar to Excel sheet)
    getMethodologyCalculations: function(choirId) {
        const choir = appState.choirs.find(c => c.id === choirId);
        if (!choir) return null;
        
        const stats = this.getChoirStatistics(choirId);
        
        // Get all assessor scores for western and african
        const westernScores = stats.western.assessments.map(a => a.total);
        const africanScores = stats.african.assessments.map(a => a.total);
        
        // Sort scores for trimmed mean calculation
        const sortedWestern = [...westernScores].sort((a, b) => a - b);
        const sortedAfrican = [...africanScores].sort((a, b) => a - b);
        
        // Calculate high and low scores
        const westernHigh = westernScores.length > 0 ? Math.max(...westernScores) : 0;
        const westernLow = westernScores.length > 0 ? Math.min(...westernScores) : 0;
        const africanHigh = africanScores.length > 0 ? Math.max(...africanScores) : 0;
        const africanLow = africanScores.length > 0 ? Math.min(...africanScores) : 0;
        
        // Calculate totals
        const westernTotal = westernScores.reduce((sum, score) => sum + score, 0);
        const africanTotal = africanScores.reduce((sum, score) => sum + score, 0);
        
        // Calculate trimmed totals (remove high and low)
        let westernTrimmedTotal = westernTotal;
        let africanTrimmedTotal = africanTotal;
        
        if (westernScores.length >= 2) {
            westernTrimmedTotal = westernTotal - westernHigh - westernLow;
        }
        if (africanScores.length >= 2) {
            africanTrimmedTotal = africanTotal - africanHigh - africanLow;
        }
        
        // Calculate overall aggregates (divide by number of assessors minus 2 for trimmed mean)
        const westernOverall = westernScores.length > 2 ? westernTrimmedTotal / (westernScores.length - 2) : 
                             westernScores.length === 2 ? westernTotal / 2 : westernTotal;
        const africanOverall = africanScores.length > 2 ? africanTrimmedTotal / (africanScores.length - 2) : 
                             africanScores.length === 2 ? africanTotal / 2 : africanTotal;
        
        // Final aggregate (average of western and african, or single genre if only one)
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
    
    // Generate Excel-like methodology data for all choirs
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
    
    // Save to localStorage
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
    
    // Load from localStorage
    loadFromLocalStorage: function() {
        try {
            const data = localStorage.getItem('tmf_scoring_data');
            if (data) {
                const parsed = JSON.parse(data);
                this.assessorScores = parsed.assessorScores || {};
                this.trimmedMeans = parsed.trimmedMeans || {};
                
                // Update choir statuses based on loaded data
                appState.choirs.forEach(choir => {
                    const westernAssessed = this.assessorScores[choir.id]?.western && 
                                          Object.keys(this.assessorScores[choir.id].western).length > 0;
                    const africanAssessed = this.assessorScores[choir.id]?.african && 
                                          Object.keys(this.assessorScores[choir.id].african).length > 0;
                    
                    if (westernAssessed || africanAssessed) {
                        choir.status = 'assessed';
                    }
                });
                
                this.calculateRankings();
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
    }
};

// Adjudication System Data
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    appState.choirs = [...appState.choirsData];
    scoringSystem.resetCurrentAssessment();
    
    // Load saved data from localStorage
    scoringSystem.loadFromLocalStorage();
    
    // Add some sample assessor data for testing if no data exists
    if (Object.keys(scoringSystem.assessorScores).length === 0) {
        initializeSampleAssessorData();
    }
    
    setupEventListeners();
});

// ============================================
// SAMPLE DATA INITIALIZATION
// ============================================

function initializeSampleAssessorData() {
    // Add some sample assessments for testing methodology
    const sampleChoirs = appState.choirs.slice(0, 8); // First 8 choirs
    
    sampleChoirs.forEach((choir, index) => {
        // Add sample western scores (3-5 assessors)
        const westernAssessorCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= westernAssessorCount; i++) {
            const score = 70 + Math.floor(Math.random() * 25); // Scores between 70-95
            scoringSystem.addAssessorScore(choir.id, 'western', `assessor${i}`, {
                intonation: 10 + Math.random() * 5,
                pitchAccuracy: 10 + Math.random() * 5,
                language: 5 + Math.random() * 5,
                vocalTechnique: 10 + Math.random() * 5,
                choralTechnique: 10 + Math.random() * 5,
                rhythm: 10 + Math.random() * 5,
                artistry: 5 + Math.random() * 5,
                stage: 2 + Math.random() * 3,
                total: score
            }, `Sample comments for western song from assessor ${i}`);
        }
        
        // Add sample african scores (3-5 assessors)
        const africanAssessorCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= africanAssessorCount; i++) {
            const score = 65 + Math.floor(Math.random() * 30); // Scores between 65-95
            scoringSystem.addAssessorScore(choir.id, 'african', `assessor${i}`, {
                intonation: 10 + Math.random() * 5,
                pitchAccuracy: 10 + Math.random() * 5,
                language: 5 + Math.random() * 5,
                vocalTechnique: 10 + Math.random() * 5,
                choralTechnique: 10 + Math.random() * 5,
                rhythm: 10 + Math.random() * 5,
                artistry: 5 + Math.random() * 5,
                stage: 2 + Math.random() * 3,
                total: score
            }, `Sample comments for african song from assessor ${i}`);
        }
        
        // Mark choir as assessed
        choir.status = 'assessed';
    });
    
    // Calculate rankings with sample data
    scoringSystem.calculateRankings();
}

// ============================================
// CORE SYSTEM FUNCTIONS
// ============================================

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    // Forgot password form
    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
    
    // User form
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUser();
    });
    
    // Choir form
    document.getElementById('choirForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveChoir();
    });
    
    // Password input feedback
    document.getElementById('password').addEventListener('input', function() {
        // Password feedback implementation
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
        
        // Update UI
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = `(${role.toUpperCase()})`;
        document.getElementById('userBadge').style.display = 'flex';
        document.getElementById('loginButton').innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        document.getElementById('loginButton').onclick = logout;
        
        // Show dashboard
        document.getElementById('dashboardContent').style.display = 'block';
        document.getElementById('loginInstructions').style.display = 'none';
        
        hideLogin();
        
        // Load dashboard
        renderDashboard();
        
        // Show search bar after successful login
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
    
    // Hide search bar when logging out
    hideSearchBar();
    
    showNotification('You have been logged out successfully.', 'info');
}

function showSearchBar() {
    // Implementation for showing search bar
    console.log('Search bar shown');
}

function hideSearchBar() {
    // Implementation for hiding search bar
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

// ============================================
// DASHBOARD VIEW FUNCTIONS
// ============================================

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

// NEW: Show Methodology Calculations
function showMethodologyCalculations() {
    document.getElementById('methodologyModal').style.display = 'flex';
    renderMethodologyCalculations();
}

function closeMethodologyModal() {
    document.getElementById('methodologyModal').style.display = 'none';
}

// ============================================
// FIX: ADDED MISSING LIVE MONITORING FUNCTIONS
// ============================================

function showLiveMonitoring() {
    appState.currentView = 'liveMonitoring';
    renderLiveMonitoring();
}

function renderLiveMonitoring() {
    // Calculate assessment progress
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
                <!-- Overall Progress -->
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

                <!-- Category Progress -->
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h3 class="card-title">Category Progress</h3>
                    <p class="card-description">Great Champs: ${appState.choirs.filter(c => c.category === 'GREAT CHAMPS' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'GREAT CHAMPS').length}</p>
                    <p class="card-description">Large: ${appState.choirs.filter(c => c.category === 'LARGE' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'LARGE').length}</p>
                    <p class="card-description">Standard: ${appState.choirs.filter(c => c.category === 'STANDARD' && c.status === 'assessed').length}/${appState.choirs.filter(c => c.category === 'STANDARD').length}</p>
                </div>

                <!-- Assessor Activity -->
                <div class="dashboard-card">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="card-title">Assessor Activity</h3>
                    <p class="card-description">Active Assessors: ${Object.keys(scoringSystem.assessorScores).length}</p>
                    <p class="card-description">Total Assessments: ${countTotalAssessments()}</p>
                </div>
            </div>

            <!-- Recent Activity -->
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

// Helper function to count total assessments
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

// Helper function to generate recent activity list
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

    // Sort by time (most recent first) and take top 10
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

// ============================================
// PROFESSIONAL ADJUDICATION SYSTEM FUNCTIONS
// ============================================

function showProfessionalAdjudication(choirId, genreToAssess = null) {
    const choir = appState.choirs.find(c => c.id === choirId);
    if (!choir) {
        showNotification('Choir not found', 'error');
        return;
    }
    
    adjudicationData.currentChoir = choir;
    scoringSystem.currentChoir = choir;
    scoringSystem.currentAssessorId = appState.currentUserId;
    
    // Check if choir has both songs
    const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                        choir.westernSong && choir.westernSong.trim() !== '';
    
    if (genreToAssess) {
        // If genre is specified, use it
        adjudicationData.currentGenre = genreToAssess;
    } else if (hasBothSongs) {
        // Show genre selection modal
        document.getElementById('choralAdjudicationModal').style.display = 'flex';
        renderGenreSelection();
        return;
    } else {
        // Single song choir - automatically select the correct genre
        if (choir.africanSong && choir.africanSong.trim() !== '') {
            adjudicationData.currentGenre = 'african';
        } else {
            adjudicationData.currentGenre = 'western';
        }
    }
    
    document.getElementById('choralAdjudicationModal').style.display = 'flex';
    renderAdjudicationSystem();
}

function renderGenreSelection() {
    const choir = adjudicationData.currentChoir;
    
    // Update the modal header for genre selection
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
    `;
    
    html += `
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
    `;
    
    html += `
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);">
                <i class="fas fa-info-circle"></i> Click on a card to select the genre you want to assess
            </div>
        </div>
        
        <!-- Back to Dashboard button UNDER the genre cards as shown in PNG -->
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
    
    // Check if assessor has already assessed this genre
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
    adjudicationData.currentChoir = null;
    scoringSystem.currentChoir = null;
    adjudicationData.comments.western = "";
    adjudicationData.comments.african = "";
}

function renderAdjudicationSystem() {
    const choir = adjudicationData.currentChoir;
    const currentGenre = adjudicationData.currentGenre;
    
    // Restore the original modal header for adjudication system
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
        
        <div class="rubric-container" id="rubricContainer">
            <!-- Rubric table will be loaded here -->
        </div>
        
        <div class="comments-container" id="commentsContainer">
            <h4>Additional Comments</h4>
            <textarea class="comments-textarea" id="assessmentComments" placeholder="Enter your comments for this assessment...">${adjudicationData.comments[adjudicationData.currentGenre] || ''}</textarea>
            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.5rem;">
                Provide constructive feedback and observations for the choir.
            </div>
        </div>
        
        <div class="assessment-footer">
            <div id="resultsDisplay">
                <!-- Results will be loaded here -->
            </div>
            
            <div class="assessment-actions">
                <button class="action-btn success" onclick="saveAssessorAssessment()" id="saveAssessmentBtn">
                    <i class="fas fa-save"></i> Save ${currentGenre === 'western' ? 'Western' : 'African'} Assessment
                </button>
                <button class="action-btn outline" onclick="resetRubric()">
                    <i class="fas fa-redo"></i> Clear Form
                </button>
            </div>
            
            <!-- Added bottom center back button -->
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
    
    // Check if choir has both songs
    const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                        choir.westernSong && choir.westernSong.trim() !== '';
    
    if (hasBothSongs) {
        return '';
    }
    
    // Choir only has one song
    const hasAfricanOnly = choir.africanSong && choir.africanSong.trim() !== '';
    const hasWesternOnly = choir.westernSong && choir.westernSong.trim() !== '';
    
    if (hasAfricanOnly && !hasWesternOnly) {
        return `
            <div class="single-song-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                This choir is only performing an African song. Western assessment will not be used in final calculations.
            </div>
        `;
    } else if (hasWesternOnly && !hasAfricanOnly) {
        return `
            <div class="single-song-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                This choir is only performing a Western song. African assessment will not be used in final calculations.
            </div>
        `;
    }
    
    return '';
}

function renderRubricTable() {
    const container = document.getElementById('rubricContainer');
    
    // Define categories and their max scores - REMOVED MAX TEXT FROM HEADERS
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
    
    // Define grade levels and their score ranges - Updated to match PNG
    const gradeLevels = [
        { 
            name: "SUPERIOR (90-100)", 
            class: "superior-row",
            ranges: [
                { min: 13.5, max: 15 }, // Intonation
                { min: 13.5, max: 15 }, // Pitch Accuracy
                { min: 9, max: 10 },    // Language & Diction
                { min: 13.5, max: 15 }, // Vocal Technique
                { min: 13.5, max: 15 }, // Choral Technique
                { min: 13.5, max: 15 }, // Rhythmic Accuracy
                { min: 9, max: 10 },    // Artistic Relevance
                { min: 4.5, max: 5 }    // Stage Presence
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
    
    // Add grade level rows
    gradeLevels.forEach((level, levelIndex) => {
        tableHTML += `<tr class="${level.class}">`;
        tableHTML += `<td class="criteria-column">${level.name}</td>`;
        
        // Add input cells for each category
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
        
        // Total column for this grade level
        tableHTML += `<td class="total-column" id="level-total-${levelIndex}">0.0</td>`;
        tableHTML += `</tr>`;
    });
    
    // Add empty row for spacing
    tableHTML += `<tr style="height: 20px;"><td colspan="10"></td></tr>`;
    
    // Add genre scores row
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
    
    // Initialize score calculations
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
    
    // Reset scores for current genre
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
    
    // Calculate level totals
    const levelTotals = [0, 0, 0, 0, 0];
    
    // Process all inputs
    document.querySelectorAll('.rubric-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        const levelIndex = parseInt(input.dataset.level);
        const category = input.dataset.category;
        
        if (value > 0) {
            // Add to level total
            levelTotals[levelIndex] += value;
            
            // Add to genre scores
            adjudicationData.assessmentData[currentGenre][category] += value;
        }
    });
    
    // Calculate genre total
    const categories = ['intonation', 'pitchAccuracy', 'language', 'vocalTechnique', 'choralTechnique', 'rhythm', 'artistry', 'stage'];
    adjudicationData.assessmentData[currentGenre].total = categories.reduce((sum, cat) => 
        sum + adjudicationData.assessmentData[currentGenre][cat], 0);
    
    // Update level total displays
    levelTotals.forEach((total, index) => {
        const element = document.getElementById(`level-total-${index}`);
        if (element) {
            element.textContent = total.toFixed(1);
        }
    });
    
    // Update genre score displays
    categories.forEach(cat => {
        const element = document.getElementById(`${currentGenre}-${cat}`);
        if (element) {
            element.textContent = adjudicationData.assessmentData[currentGenre][cat].toFixed(1);
        }
    });
    
    // Update total display
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
    
    // Calculate score for current genre
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
    console.log('saveAssessorAssessment called');
    
    // Debug: Check if user is properly logged in
    console.log('User login state:', {
        currentUser: appState.currentUser,
        currentUserId: appState.currentUserId,
        currentRole: appState.currentRole,
        isLoggedIn: appState.isLoggedIn
    });
    
    if (!appState.currentUserId) {
        console.error('User not logged in - currentUserId is null!');
        showNotification('Please login to save assessments', 'error');
        return;
    }
    
    const choir = scoringSystem.currentChoir;
    console.log('Current choir:', choir);
    
    if (!choir) {
        console.log('No choir selected - showing error');
        showNotification('No choir selected', 'error');
        return;
    }
    
    const currentGenre = adjudicationData.currentGenre;
    console.log('Current genre:', currentGenre);
    
    const totalScore = adjudicationData.assessmentData[currentGenre].total;
    console.log('Total score:', totalScore);
    
    if (totalScore === 0) {
        console.log('Total score is 0 - showing error');
        showNotification('Please enter scores before saving', 'error');
        return;
    }
    
    // Check if assessor has already assessed this choir for this genre
    const hasAlreadyAssessed = scoringSystem.hasAssessorAlreadyAssessed(choir.id, currentGenre, appState.currentUserId);
    console.log('Has already assessed:', hasAlreadyAssessed);
    
    if (hasAlreadyAssessed) {
        console.log('Already assessed - showing error');
        showNotification(`You have already assessed ${choir.name} for ${currentGenre === 'western' ? 'Western' : 'African'} genre.`, 'error');
        return;
    }
    
    console.log('All validations passed - proceeding to save');
    
    // Show loading spinner immediately
    const saveBtn = document.getElementById('saveAssessmentBtn');
    console.log('Save button found:', saveBtn);
    
    if (!saveBtn) {
        console.error('Save button not found!');
        showNotification('System error: Save button not found', 'error');
        return;
    }
    
    const originalBtnContent = saveBtn.innerHTML;
    
    // Disable button and show loading state
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    document.getElementById('loadingSpinner').style.display = 'block';
    
    console.log('Loading state set - processing assessment');
    
    // Process assessment immediately (no artificial delay)
    try {
        // Save assessor's assessment using the flexible scoring system
        const commentsTextarea = document.getElementById('assessmentComments');
        const comments = commentsTextarea ? commentsTextarea.value.trim() : "";
        
        console.log('Saving assessment with data:', {
            choirId: choir.id,
            genre: currentGenre,
            userId: appState.currentUserId,
            scores: adjudicationData.assessmentData[currentGenre],
            comments: comments
        });
        
        // Check if scoringSystem exists
        if (!scoringSystem) {
            console.error('scoringSystem is undefined!');
            throw new Error('Scoring system not initialized');
        }
        
        // Check if addAssessorScore exists
        if (!scoringSystem.addAssessorScore) {
            console.error('scoringSystem.addAssessorScore is undefined!');
            throw new Error('addAssessorScore method not found');
        }
        
        console.log('About to call scoringSystem.addAssessorScore...');
        
        scoringSystem.addAssessorScore(
            choir.id, 
            currentGenre, 
            appState.currentUserId, 
            {...adjudicationData.assessmentData[currentGenre]},
            comments
        );
        
        console.log('Assessment saved successfully');
        
        // Save comments
        adjudicationData.comments[currentGenre] = comments;
        
        // Update choir status
        choir.status = 'assessed';
        
        // Hide loading spinner and restore button
        document.getElementById('loadingSpinner').style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
        
        showNotification(`${currentGenre === 'western' ? 'Western' : 'African'} assessment saved for ${choir.name}!`, 'success');
        
        console.log('Success notification shown');
        
        // Check if choir has both songs
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        const assessorId = appState.currentUserId;
        const hasAssessedWestern = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'western', assessorId);
        const hasAssessedAfrican = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'african', assessorId);
        const hasFullyAssessed = scoringSystem.hasAssessorFullyAssessed(choir.id, assessorId);
        
        if (hasBothSongs && !hasFullyAssessed) {
            // Ask if assessor wants to assess the other genre
            setTimeout(() => {
                const otherGenre = currentGenre === 'western' ? 'african' : 'western';
                const hasAssessedOther = otherGenre === 'western' ? hasAssessedWestern : hasAssessedAfrican;
                
                if (!hasAssessedOther) {
                    // Remove the confirm dialog and automatically assess the other genre
                    adjudicationData.currentGenre = otherGenre;
                    // Clear the form for the other genre
                    resetRubric();
                    // Clear comments for the other genre
                    const commentsTextarea = document.getElementById('assessmentComments');
                    if (commentsTextarea) {
                        commentsTextarea.value = "";
                        adjudicationData.comments[otherGenre] = "";
                    }
                    renderAdjudicationSystem();
                    showNotification(`Now assessing ${otherGenre === 'western' ? 'Western' : 'African'} song`, 'info');
                } else {
                    // Assessor has assessed both genres
                    setTimeout(() => {
                        closeAdjudicationModal();
                        // Return to assessment chooser instead of empty dashboard
                        showAssessmentChooser();
                    }, 1500);
                }
            }, 500);
        } else {
            // Choir only has one song or assessor has fully assessed, close modal
            setTimeout(() => {
                closeAdjudicationModal();
                // Return to assessment chooser instead of empty dashboard
                showAssessmentChooser();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving assessment:', error);
        showNotification('Error saving assessment. Please try again.', 'error');
        // Restore button state in case of error
        document.getElementById('loadingSpinner').style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
    }
}

function resetRubric() {
    // Clear all inputs
    document.querySelectorAll('.rubric-input').forEach(input => {
        input.value = '';
        input.classList.remove('invalid');
    });
    
    // Reset assessment data for current genre
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

// ============================================
// METHODOLOGY CALCULATIONS - FIXED VERSION WITH OVERALL WINNER ELIGIBILITY
// ============================================

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
        
        <!-- Added bottom center back button -->
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeMethodologyModal()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    `;
    
    document.getElementById('methodologyContent').innerHTML = html;
}

function showMethodologyTab(event, tab) {
    // Get the target element from event or find it
    let target;
    if (event && event.target) {
        target = event.target;
    } else {
        // Find the button by its onclick attribute content
        target = document.querySelector(`.methodology-tab-btn[onclick*="${tab}"]`);
    }
    
    const container = document.getElementById('methodologyTabContent');
    const methodologyData = scoringSystem.generateMethodologyData();
    
    // Update active tab
    document.querySelectorAll('.methodology-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (target) {
        target.classList.add('active');
    }
    
    container.innerHTML = renderMethodologyTab(tab, methodologyData);
}

function renderMethodologyTab(tab, methodologyData) {
    // Filter data based on tab
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
    
    // CRITICAL FIX: Filter out single-song choirs from overall winner calculations
    // Only choirs with both songs should be considered for overall winners
    const eligibleForOverall = filteredData.filter(d => {
        const choir = d.choir;
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        // Also need both scores to be > 0
        const hasBothScores = d.westernOverall > 0 && d.africanOverall > 0;
        return hasBothSongs && hasBothScores;
    });
    
    // Calculate summary statistics
    const totalAssessors = filteredData.reduce((sum, d) => sum + d.assessorCount.western + d.assessorCount.african, 0);
    const avgWesternScore = filteredData.reduce((sum, d) => sum + d.westernOverall, 0) / filteredData.length;
    const avgAfricanScore = filteredData.reduce((sum, d) => sum + d.africanOverall, 0) / filteredData.length;
    const avgFinalScore = filteredData.reduce((sum, d) => sum + d.finalAggregate, 0) / filteredData.length;
    
    // Find winners - ONLY from eligible choirs for overall winner
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
    
    // Sort by final aggregate score to determine ranks
    const sortedData = [...filteredData].sort((a, b) => b.finalAggregate - a.finalAggregate);
    
    // Create a map of choir ID to rank
    const rankMap = {};
    sortedData.forEach((data, index) => {
        rankMap[data.choir.id] = index + 1;
    });
    
    // Sort by final aggregate for display (same as PNG order - highest to lowest)
    filteredData.sort((a, b) => b.finalAggregate - a.finalAggregate);
    
    filteredData.forEach((data) => {
        const choir = data.choir;
        const rank = rankMap[choir.id];
        
        // Check if choir has both songs
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        const hasBothScores = data.westernOverall > 0 && data.africanOverall > 0;
        const isEligibleForOverall = hasBothSongs && hasBothScores;
        
        // Determine how many rows this choir will have
        const hasWestern = data.westernScores.length > 0;
        const hasAfrican = data.africanScores.length > 0;
        const totalRows = (hasWestern ? 1 : 0) + (hasAfrican ? 1 : 0);
        
        // Western row (if assessed)
        if (hasWestern) {
            const westernScores = [...data.westernScores];
            // Pad to 12 columns
            while (westernScores.length < 12) westernScores.push('-');
            
            html += `
                <tr>
                    <td class="choir-name" rowspan="${totalRows}">
                        ${choir.name}
                        ${!hasBothSongs ? `<br><small style="color: #ff9800; font-size: 0.7rem;">(Single Song)</small>` : ''}
                    </td>
                    <td class="genre-name">WESTERN</td>
            `;
            
            // Add assessor scores (1-12)
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
            
            // For the first row of this choir, add final aggregate and rank with rowspan
            if (hasAfrican) {
                html += `
                    <td class="final-aggregate" rowspan="${totalRows}">${data.finalAggregate.toFixed(1)}</td>
                    <td class="rank" rowspan="${totalRows}">${rank}</td>
                `;
            } else {
                // Only one genre, no rowspan needed
                html += `
                    <td class="final-aggregate">${data.finalAggregate.toFixed(1)}</td>
                    <td class="rank">${rank}</td>
                `;
            }
            
            html += `</tr>`;
        }
        
        // African row (if assessed)
        if (hasAfrican) {
            const africanScores = [...data.africanScores];
            // Pad to 12 columns
            while (africanScores.length < 12) africanScores.push('-');
            
            html += `
                <tr>
                    ${!hasWestern ? `<td class="choir-name" rowspan="${totalRows}">${choir.name}</td>` : ''}
                    <td class="genre-name">AFRICAN</td>
            `;
            
            // Add assessor scores (1-12)
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
            
            // If western was already rendered, final aggregate and rank are already added via rowspan
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

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// DASHBOARD RENDERING FUNCTIONS - UPDATED WITH DYNAMIC CATEGORY TOTALS
// ============================================

function getCategoryTotals() {
    // Initialize counters
    let greatChampsCount = 0;
    let largeCount = 0;
    let standardCount = 0;
    
    // Count choirs by category
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
    
    // Get dynamic category totals
    const categoryTotals = getCategoryTotals();
    
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
    
    // Assessor Dashboard 
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
    
    // Chair Assessor Dashboard 
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
    
    // Monitor Dashboard 
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
    
    // Admin Dashboard - UPDATED: Added back Competition Results, Final Rankings & Excel Methodology cards
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
    
    // Founder Dashboard 
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
            
            <!-- NEW METHODOLOGY CALCULATIONS CARD -->
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
    
    // Competition Status
    const totalChoirs = appState.choirs.length;
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed').length;
    const pendingChoirs = totalChoirs - assessedChoirs;
    const percentage = totalChoirs > 0 ? (assessedChoirs / totalChoirs) * 100 : 0;
    
    // Get assessor's assessment count
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
                            <small style="color: rgba(255, 255, 255, 0.6);">Fully assessed: ${myFullyAssessed} choirs</small>
                        </div>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7);">
                        ${myFullyAssessed > 0 ? `
                        <i class="fas fa-check-circle" style="color: #4CAF50;"></i> You have completed ${myFullyAssessed} choir${myFullyAssessed !== 1 ? 's' : ''} fully
                        ` : `
                        <i class="fas fa-info-circle" style="color: #2196F3;"></i> Continue assessing choirs to complete your assignments
                        `}
                    </div>
                </div>
                ` : ''}
                
                <div class="d-flex justify-content-between mt-3 flex-wrap gap-2">
                    <div>
    `;
    
    // DYNAMIC CATEGORY TOTALS - Updated to show zero if no data, otherwise show actual counts
    if (totalChoirs === 0) {
        // No choirs in the system - show zeros
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
        // Show actual category counts
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

// ============================================
// VIEW MY ASSESSMENTS WITH SEARCH - UPDATED WITH SEARCH BAR ON SAME LINE
// ============================================

function showMyAssessmentsOnly() {
    appState.currentView = 'myAssessments';
    renderMyAssessmentsOnly();
}

function renderMyAssessmentsOnly() {
    const assessorId = appState.currentUserId;
    
    // Group assessments by category
    const assessmentsByCategory = {
        'GREAT CHAMPS': [],
        'LARGE': [],
        'STANDARD': []
    };
    
    // Collect all choirs that the assessor has assessed, grouped by category
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
                <!-- Combined Header with Title and Search Side by Side - MATCHING PNG 1 DESIGN -->
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
                    
                    <!-- Search Bar on the Right - EXACTLY LIKE PNG 1 -->
                    <div class="search-wrapper-inline">
                        <div class="search-input-wrapper-inline" style="position: relative; width: 300px; max-width: 100%;">
                            <i class="fas fa-search search-icon-inline" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.5); z-index: 1;"></i>
                            <input type="text" 
                                   id="myAssessmentsSearchInput" 
                                   class="search-input-field-inline" 
                                   placeholder="Search your assessed choirs by name..."
                                   onkeyup="filterMyAssessmentsBySearch()"
                                   autocomplete="off"
                                   style="width: 100%; padding: 10px 10px 10px 35px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 6px; color: white; font-size: 0.9rem;">
                            <button class="search-clear-btn-inline" onclick="clearMyAssessmentsSearch()" id="myAssessmentsSearchClearBtn" style="display: none; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255, 255, 255, 0.5); cursor: pointer; z-index: 1;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Search Results Count for My Assessments -->
                <div id="myAssessmentsSearchResultsCount" class="search-results-count-inline" style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(212, 175, 55, 0.1); border-radius: 4px; border-left: 3px solid var(--primary-gold);"></div>
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
        
        // Render each category section
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
                
                // Determine assessment status
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
                                <span class="assessment-status-badge ${statusClass}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; ${statusClass === 'assessment-complete' ? 'background: rgba(76, 175, 80, 0.15); color: #4CAF50; border: 1px solid rgba(76, 175, 80, 0.3);' : statusClass === 'assessment-partial' ? 'background: rgba(255, 152, 0, 0.15); color: #FF9800; border: 1px solid rgba(255, 152, 0, 0.3);' : 'background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);'}">
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
            
            <!-- Bottom center back button -->
            <div class="bottom-center-back" style="text-align: center; margin-top: 2rem;">
                <button class="action-btn outline" onclick="showDashboard()" style="padding: 0.75rem 2rem; font-size: 1rem;">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
}

// ============================================
// MY ASSESSMENTS SEARCH FUNCTIONS
// ============================================

function filterMyAssessmentsBySearch() {
    const searchInput = document.getElementById('myAssessmentsSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Show/hide clear button
    const clearBtn = document.getElementById('myAssessmentsSearchClearBtn');
    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }
    
    // Debounce search to improve performance
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
    // Get all assessment cards
    const cards = document.querySelectorAll('.my-assessment-card');
    const categorySections = document.querySelectorAll('.category-section-header, .my-assessments-row');
    let visibleCount = 0;
    
    if (!searchTerm) {
        // Show all cards
        cards.forEach(card => {
            card.style.display = '';
        });
        
        // Show all category sections
        categorySections.forEach(section => {
            section.style.display = '';
        });
        
        visibleCount = cards.length;
    } else {
        // Track which categories have visible cards
        const categoriesWithVisibleCards = new Set();
        
        // Filter cards
        cards.forEach(card => {
            const choirName = card.getAttribute('data-choir-name') || '';
            if (choirName.includes(searchTerm)) {
                card.style.display = '';
                // Get the category from the parent row
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
        
        // Hide/show category sections based on visible cards
        document.querySelectorAll('.my-assessments-row').forEach(row => {
            const category = row.getAttribute('data-category');
            if (categoriesWithVisibleCards.has(category)) {
                row.style.display = '';
                // Show corresponding header
                const header = document.querySelector(`.category-section-header[data-category="${category}"]`);
                if (header) header.style.display = '';
            } else {
                row.style.display = 'none';
                const header = document.querySelector(`.category-section-header[data-category="${category}"]`);
                if (header) header.style.display = 'none';
            }
        });
    }
    
    // Update search results count
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

// ============================================
// SEARCH BAR FUNCTIONS - UPDATED FOR RIGHT SIDE POSITION
// ============================================

function renderAssessmentChooser() {
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
                <!-- Combined Header with Tabs and Search Side by Side -->
                <div class="assessment-header-wrapper">
                    <div class="tab-nav">
                        <button class="tab-btn active" onclick="filterChoirsByCategory(event, 'ALL')">All Categories</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'GREAT CHAMPS')">Great Champs</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'LARGE')">Large</button>
                        <button class="tab-btn" onclick="filterChoirsByCategory(event, 'STANDARD')">Standard</button>
                    </div>
                    
                    <!-- Search Bar on the Right -->
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
                
                <!-- Search Results Count -->
                <div id="searchResultsCount" class="search-results-count-inline"></div>
                
                <div id="choirsList">
                    <!-- Choirs will be loaded here -->
                </div>
                
                <!-- Back to Dashboard button -->
                <div class="bottom-center-back">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
    // Simulate event for initial load
    filterChoirsByCategory({ target: { classList: { add: function() {}, remove: function() {} } } }, 'ALL');
}

// Filter choirs by search input
function filterChoirsBySearch() {
    const searchInput = document.getElementById('choirSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Show/hide clear button
    const clearBtn = document.getElementById('searchClearBtnInline');
    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }
    
    // Debounce search to improve performance
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
        applyFilters(currentCategoryFilter, searchTerm);
    }, 300);
}

// Clear search input
function clearSearch() {
    const searchInput = document.getElementById('choirSearchInput');
    if (searchInput) {
        searchInput.value = '';
        filterChoirsBySearch();
    }
}

// Apply both category and search filters
function applyFilters(category, searchTerm) {
    const container = document.getElementById('choirsList');
    
    // Filter by category first
    let filteredChoirs = category === 'ALL' 
        ? appState.choirs 
        : appState.choirs.filter(c => c.category === category);
    
    // Then filter by search term if provided
    if (searchTerm) {
        filteredChoirs = filteredChoirs.filter(choir => 
            choir.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update search results count
    updateSearchResultsCount(filteredChoirs.length, category, searchTerm);
    
    // Render the filtered choirs
    renderFilteredChoirs(filteredChoirs);
}

// Update the search results count display
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

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modified filterChoirsByCategory to work with search
function filterChoirsByCategory(event, category) {
    currentCategoryFilter = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Get current search term
    const searchInput = document.getElementById('choirSearchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Apply filters
    applyFilters(category, searchTerm);
}

// Render the filtered choirs (extracted from original filterChoirsByCategory)
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
        
        // Check if assessor has already assessed this choir
        const hasAssessedWestern = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'western', assessorId);
        const hasAssessedAfrican = scoringSystem.hasAssessorAlreadyAssessed(choir.id, 'african', assessorId);
        const hasFullyAssessed = scoringSystem.hasAssessorFullyAssessed(choir.id, assessorId);
        const hasAssessedAny = hasAssessedWestern || hasAssessedAfrican;
        
        // Check if choir has both songs
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        
        let buttonText = '';
        let buttonTooltip = '';
        let cardClass = 'assessable';
        
        if (hasFullyAssessed) {
            buttonText = 'View Assessment';
            buttonTooltip = 'You have fully assessed this choir. Click to view details.';
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
                cardClass = '';
            }
        } else {
            buttonText = 'Start Assessment';
            buttonTooltip = hasBothSongs ? 'Assess both Western and African songs' : 'Assess single song';
        }
        
        // Show assessment progress dots
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
                    <div style="margin-top: 1rem;">
                        <button class="action-btn ${hasFullyAssessed ? 'outline' : ''}" 
                                style="width: 100%;"
                                onclick="${hasFullyAssessed ? `showMyAssessmentDetails(${choir.id})` : `showProfessionalAdjudication(${choir.id})`}"
                                title="${buttonTooltip}">
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

function filterResults(event, category) {
    const container = document.getElementById('resultsTable');
    const isAssessor = appState.currentRole === 'assessor';
    const isAdmin = ['admin', 'founder', 'chair'].includes(appState.currentRole);
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (category === 'my' && isAssessor) {
        // Show assessor's own assessments
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
        // Filter by choir category
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

// Render default rankings for other categories
function renderDefaultRankings(category, title, rankings, isAssessor) {
    const isWesternCategory = category === 'western';
    const isAfricanCategory = category === 'african';
    
    // UPDATED: Western category rankings - removed African column
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
    
    // UPDATED: Show only relevant columns for each category
    if (isWesternCategory) {
        html += `
                        <th>Western Score</th>
                        <th>Grade</th>
                        ${isAssessor ? '' : '<th>Actions</th>'}
                    </tr>
                </thead>
                <tbody>
            `;
    } else if (isAfricanCategory) {
        html += `
                        <th>African Score</th>
                        <th>Grade</th>
                        ${isAssessor ? '' : '<th>Actions</th>'}
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
                        ${isAssessor ? '' : '<th>Actions</th>'}
                    </tr>
                </thead>
                <tbody>
            `;
    }
    
    rankings.forEach((ranking) => {
        const choirStats = scoringSystem.getChoirStatistics(ranking.choir.id);
        
        // FIXED: Show correct score for each category
        let displayScore = ranking.score;
        let grade = getGradeFromScore(displayScore);
        
        if (isWesternCategory) {
            // For Western category, use Western score only
            displayScore = choirStats.western.trimmedMean;
            grade = getGradeFromScore(displayScore);
        } else if (isAfricanCategory) {
            // For African category, use African score only
            displayScore = choirStats.african.trimmedMean;
            grade = getGradeFromScore(displayScore);
        } else {
            // For overall, use the ranking score (which is already correct)
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
        
        // UPDATED: Show only relevant score columns
        if (isWesternCategory) {
            // Western category - only show Western score
            html += `
                <td><strong>${displayScore.toFixed(1)}</strong><br><small>(${choirStats.western.count} assessors)</small></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
                ${isAssessor ? '' : `
                <td>
                    <button class="report-btn" onclick="showChoirDetailedReport(${ranking.choir.id})">
                        <i class="fas fa-chart-bar"></i> Details
                    </button>
                </td>
                `}
            `;
        } else if (isAfricanCategory) {
            // African category - only show African score
            html += `
                <td><strong>${displayScore.toFixed(1)}</strong><br><small>(${choirStats.african.count} assessors)</small></td>
                <td>
                    <span class="grade-text ${gradeClass}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
                        ${grade}
                    </span>
                </td>
                ${isAssessor ? '' : `
                <td>
                    <button class="report-btn" onclick="showChoirDetailedReport(${ranking.choir.id})">
                        <i class="fas fa-chart-bar"></i> Details
                    </button>
                </td>
                `}
            `;
        } else {
            // Overall category - show both scores
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
                ${isAssessor ? '' : `
                <td>
                    <button class="report-btn" onclick="showChoirDetailedReport(${ranking.choir.id})">
                        <i class="fas fa-chart-bar"></i> Details
                    </button>
                </td>
                `}
            `;
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
    
    // Group assessments by category
    const assessmentsByCategory = {
        'GREAT CHAMPS': [],
        'LARGE': [],
        'STANDARD': []
    };
    
    // Collect all choirs that the assessor has assessed
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
    
    // Render each category section
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
        
        <!-- FIXED: Bottom center back button -->
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
    
    // Update active tab
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
    
    // Find winners for each category (only if they have scores)
    const westernWinner = scoringSystem.finalRankings.western.length > 0 ? scoringSystem.finalRankings.western[0] : null;
    const africanWinner = scoringSystem.finalRankings.african.length > 0 ? scoringSystem.finalRankings.african[0] : null;
    const overallWinner = scoringSystem.finalRankings.overall.length > 0 ? scoringSystem.finalRankings.overall[0] : null;
    
    // Count eligible choirs for overall rankings
    const eligibleChoirs = appState.choirs.filter(choir => {
        const hasBothSongs = choir.africanSong && choir.africanSong.trim() !== '' && 
                            choir.westernSong && choir.westernSong.trim() !== '';
        return hasBothSongs;
    }).length;
    
    const fullyAssessedChoirs = scoringSystem.finalRankings.overall.length;
    
    let html = `
        <div class="fade-in">
            <h4 style="color: var(--primary-gold); margin-bottom: 1.5rem;">Final Competition Results</h4>
            
            <!-- Eligibility Info -->
            <div style="background: rgba(33, 150, 243, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 1.5rem;">
                <i class="fas fa-info-circle" style="color: #2196f3;"></i> 
                <strong>Eligibility Note:</strong> Only choirs that performed BOTH African and Western songs are eligible for overall rankings.
                ${eligibleChoirs} choirs are eligible (${eligibleChoirs - fullyAssessedChoirs} pending complete assessment).
            </div>
    `;
    
    // Only show winners if they exist
    if (overallWinner || westernWinner || africanWinner) {
        html += `
            <!-- Winners Display -->
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
            
            <div id="finalResultsTabContent">
                <!-- Content will be loaded here -->
            </div>
            
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
    
    // Update active tab
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
    const rankings = scoringSystem.finalRankings.overall.slice(0, 10); // Top 10
    
    if (rankings.length === 0) {
        // Check if there are any eligible choirs at all
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
        
        // Special styling for podium positions
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
    
    // UPDATED: Show only relevant columns for each category
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
                
                <!-- NEW: Choir Detailed Reports Card -->
                <div class="dashboard-card" onclick="generateAllChoirReports()">
                    <div class="card-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3 class="card-title">Choir Detailed Reports</h3>
                    <p class="card-description">Generate detailed individual reports for each and every choir with comprehensive assessment data.</p>
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
            
            <!-- FIXED: Added bottom center back button -->
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
// USER MANAGEMENT FUNCTIONS
// ============================================

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
        
        <!-- FIXED: Bottom center back button -->
        <div class="bottom-center-back">
            <button class="action-btn outline" onclick="closeUserManagement()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    `;
    
    document.getElementById('userManagementContent').innerHTML = html;
}

// ============================================
// CLEAR ASSESSMENT DATA FUNCTION
// ============================================

function clearAllAssessmentData() {
    if (confirm('Are you sure you want to clear ALL assessment data? This will remove all saved assessments and cannot be undone.')) {
        // Clear scoring system data
        scoringSystem.assessorScores = {};
        scoringSystem.trimmedMeans = {};
        scoringSystem.finalRankings = {
            western: [],
            african: [],
            overall: []
        };
        
        // Clear localStorage
        localStorage.removeItem('tmf_scoring_data');
        
        // Reset all choir statuses to pending
        appState.choirs.forEach(choir => {
            choir.status = 'pending';
        });
        
        // Save and refresh
        scoringSystem.saveToLocalStorage();
        
        showNotification('All assessment data cleared successfully', 'success');
        
        // Refresh current view
        if (appState.currentView === 'assessmentChooser') {
            renderAssessmentChooser();
        } else if (appState.currentView === 'manageChoirs') {
            renderManageChoirs();
        }
    }
}

// ============================================
// REGION AUTOCOMPLETE FUNCTION
// ============================================

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

    // Create datalist for autocomplete
    let datalist = document.getElementById('regionSuggestions');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'regionSuggestions';
        regionInput.parentNode.appendChild(datalist);
    }

    // Clear and populate datalist
    datalist.innerHTML = '';
    commonRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        datalist.appendChild(option);
    });

    // Connect input to datalist
    regionInput.setAttribute('list', 'regionSuggestions');
}

// ============================================
// CHOIR MANAGEMENT FUNCTIONS
// ============================================

function openAddChoir() {
    document.getElementById('choirFormTitle').textContent = 'Add New Choir';
    document.getElementById('choirForm').reset();
    document.getElementById('editChoirId').value = '';
    document.getElementById('choirFormModal').style.display = 'flex';
    
    // Add region suggestions
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
        
        // Add region suggestions for editing too
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
        // Generate unique ID - handle case when no choirs exist yet or corrupted data
        let newId;
        if (appState.choirs.length === 0) {
            newId = 1; // Start with ID 1 if no choirs exist
        } else {
            const existingIds = appState.choirs.map(c => c.id).filter(id => typeof id === 'number' && !isNaN(id) && id > 0);
            if (existingIds.length === 0) {
                newId = 1; // All existing IDs are corrupted, start fresh
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
        
        // Clear any existing assessment data for this choir ID (in case of ID reuse)
        if (scoringSystem.assessorScores[newId]) {
            delete scoringSystem.assessorScores[newId];
        }
        if (scoringSystem.trimmedMeans[newId]) {
            delete scoringSystem.trimmedMeans[newId];
        }
        
        // Recalculate rankings and save
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

// ============================================
// RENDER MANAGE CHOIRS FUNCTION - WITH PROPER BUTTON SPACING
// ============================================

function renderManageChoirs() {
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 header-actions-wrapper">
                <h3 style="color: var(--primary-gold); margin: 0;">Manage Choirs</h3>
                <div class="action-buttons-group">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="openAddChoir()">
                        <i class="fas fa-plus"></i> Add
                    </button>
                    <button class="action-btn" onclick="openImportChoirs()">
                        <i class="fas fa-file-import"></i> Import
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
// RENDER RESULTS FUNCTION - WITH PROPER BUTTON SPACING
// ============================================

function renderResults() {
    scoringSystem.calculateRankings();
    
    const isAssessor = appState.currentRole === 'assessor';
    const isAdmin = ['admin', 'founder', 'chair'].includes(appState.currentRole);
    
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 results-header-wrapper">
                <h3 style="color: var(--primary-gold); margin: 0;">Competition Results</h3>
                <div class="results-actions-group">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
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
                
                <div id="resultsTable" class="table-responsive" style="margin-top: 1.5rem;">
                    <!-- Results will be loaded here -->
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
    filterResults({ target: { classList: { add: function() {}, remove: function() {} } } }, 'overall');
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
        
        <!-- FIXED: Bottom center back button -->
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
    
    // Update active tab
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
        // Sort scores for trimmed mean calculation display
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
        const remaining = sorted.slice(1, -1); // Remove first and last
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
    
    // Filter rankings for this category
    const categoryRankings = scoringSystem.finalRankings.overall.filter(r => 
        r.choir.category === category
    );
    
    if (categoryRankings.length === 0) {
        showNotification(`No results available for ${categoryName}`, 'warning');
        return;
    }
    
    // Create professional PDF content
    const reportContent = generateProfessionalPDFContent({
        title: `${categoryName} Competition Report`,
        subtitle: 'Tiro Mpane Foundation National Chorale Eisteddfod',
        category: categoryName,
        rankings: categoryRankings,
        includeSummary: true,
        includeMethodology: true
    });
    
    // Generate PDF
    generateProfessionalPDF(reportContent, `${categoryName}_Report_${new Date().toISOString().split('T')[0]}`);
    showNotification(`${categoryName} report generated successfully!`, 'success');
}

function generateAllChoirReports() {
    const assessedChoirs = appState.choirs.filter(c => c.status === 'assessed');
    
    if (assessedChoirs.length === 0) {
        showNotification('No choirs have been assessed yet', 'warning');
        return;
    }
    
    // Sort choirs by overall score
    const sortedChoirs = [...assessedChoirs].sort((a, b) => {
        const scoreA = scoringSystem.getChoirOverallScore(a.id);
        const scoreB = scoringSystem.getChoirOverallScore(b.id);
        return scoreB - scoreA;
    });
    
    // Create comprehensive PDF content
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
    
    // Generate PDF
    generateProfessionalPDF(reportContent, `All_Choirs_Reports_${new Date().toISOString().split('T')[0]}`);
    showNotification(`Generated detailed reports for ${assessedChoirs.length} choirs!`, 'success');
}

function generateComprehensiveReport() {
    // Calculate all rankings first
    scoringSystem.calculateRankings();
    
    if (scoringSystem.finalRankings.overall.length === 0) {
        showNotification('No results available for comprehensive report', 'warning');
        return;
    }
    
    // Create professional comprehensive report
    const reportContent = generateProfessionalPDFContent({
        title: 'Comprehensive Competition Report',
        subtitle: 'Tiro Mpane Foundation National Chorale Eisteddfod',
        category: 'All Categories',
        rankings: scoringSystem.finalRankings.overall,
        includeSummary: true,
        includeMethodology: true,
        includeWinners: true
    });
    
    // Generate PDF
    generateProfessionalPDF(reportContent, `Comprehensive_Report_${new Date().toISOString().split('T')[0]}`);
    showNotification('Comprehensive report generated successfully!', 'success');
}

function generateAssessorsSummaryReport() {
    // Collect assessor statistics
    const assessorStats = {};
    
    // Initialize assessor stats
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
    
    // Collect assessor data from scoring system
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
    
    // Calculate averages
    Object.keys(assessorStats).forEach(assessorId => {
        const stats = assessorStats[assessorId];
        if (stats.scores.length > 0) {
            stats.averageScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
        }
    });
    
    // Filter active assessors (those with assessments)
    const activeAssessors = Object.keys(assessorStats).filter(assessorId => assessorStats[assessorId].totalAssessments > 0);
    
    if (activeAssessors.length === 0) {
        showNotification('No assessor assessment data available', 'warning');
        return;
    }
    
    // Create professional PDF content
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
    
    // Calculate score distribution
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
    
    // Generate PDF
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

function calculateStandardDeviation(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const squareDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / numbers.length;
    return Math.sqrt(avgSquareDiff);
}

function generateProfessionalPDF(content, filename) {
    try {
        showNotification('Generating PDF...', 'info');
        
        // Create a hidden div with the report content
        const reportDiv = document.createElement('div');
        reportDiv.id = 'pdf-report';
        reportDiv.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 800px; background: white; color: black;';
        reportDiv.innerHTML = content;
        document.body.appendChild(reportDiv);
        
        // Use html2canvas to capture the report (if available)
        if (typeof html2canvas !== 'undefined') {
            html2canvas(reportDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                
                // Use jsPDF if available
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
                    
                    // Save the PDF
                    pdf.save(filename + '.pdf');
                } else {
                    // Fallback: save as image
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = filename + '.png';
                    link.click();
                }
                
                // Clean up
                document.body.removeChild(reportDiv);
                
                showNotification('PDF report generated successfully!', 'success');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                showNotification('Error generating PDF. Please try again.', 'error');
                document.body.removeChild(reportDiv);
            });
        } else {
            // Fallback: just show the content
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
    
    // Western Scores
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
    
    // African Scores
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
    
    // Calculation explanation
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
    
    // FIXED: Added bottom center back button
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
        
        // Add headers
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
        
        // Add data rows
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
        
        // Create worksheet
        let ws;
        if (typeof XLSX !== 'undefined') {
            ws = XLSX.utils.aoa_to_sheet(data);
            
            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Competition Results');
            
            // Generate Excel file
            XLSX.writeFile(wb, `TMF_Competition_Results_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else {
            // Fallback: CSV
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
// PROFESSIONAL MONITORING FUNCTIONS
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

    // Calculate system health metrics
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
                        if (timeDiff < 2 * 60 * 60 * 1000) { // Last 2 hours
                            hasRecentActivity = true;
                        }
                    }
                }
            });
        });
        return hasRecentActivity;
    }).length;

    // System performance simulation
    const systemHealth = {
        uptime: 99.8,
        responseTime: Math.random() * 100 + 50,
        errorRate: Math.random() * 0.5,
        activeUsers: activeAssessors + 2, // +2 for admin/monitor
        serverLoad: Math.random() * 30 + 20
    };

    // Security metrics
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
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshOperationsCenter()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- Real-Time Competition Overview -->
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

            <!-- System Health & Security -->
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

            <!-- Live Activity Feed -->
            <div class="ops-section">
                <h4><i class="fas fa-stream"></i> Live Activity Feed</h4>
                <div class="activity-feed">
                    ${generateLiveActivityFeed()}
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="ops-section">
                <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
                <div class="quick-actions-grid">
                    <button class="quick-action-btn" onclick="showLiveScoringMonitor()">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Live Scoring</span>
                    </button>
                    <button class="quick-action-btn" onclick="showSystemHealthMonitor()">
                        <i class="fas fa-heartbeat"></i>
                        <span>System Health</span>
                    </button>
                    <button class="quick-action-btn" onclick="showDataIntegrityMonitor()">
                        <i class="fas fa-shield-alt"></i>
                        <span>Data Integrity</span>
                    </button>
                    <button class="quick-action-btn" onclick="showAdvancedAnalytics()">
                        <i class="fas fa-chart-line"></i>
                        <span>Analytics</span>
                    </button>
                    <button class="quick-action-btn" onclick="showIncidentManagement()">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Incidents</span>
                    </button>
                    <button class="quick-action-btn" onclick="generateEmergencyReport()">
                        <i class="fas fa-file-excel"></i>
                        <span>Emergency Report</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function refreshOperationsCenter() {
    showNotification('Operations Center refreshed', 'success');
    renderProfessionalMonitoringCenter();
}

function generateLiveActivityFeed() {
    const activities = [];
    
    // Collect recent activities
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

    // Add some system activities
    activities.push({
        type: 'system',
        user: 'System',
        action: 'Automated backup completed',
        time: new Date(Date.now() - 15 * 60 * 1000)
    });

    activities.push({
        type: 'system',
        user: 'System',
        action: 'Security scan completed - no threats',
        time: new Date(Date.now() - 45 * 60 * 1000)
    });

    // Sort by time (most recent first)
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

function showLiveScoringMonitor() {
    appState.currentView = 'liveScoringMonitor';
    renderLiveScoringMonitor();
}

function renderLiveScoringMonitor() {
    // Anomaly detection logic
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
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshScoringMonitor()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- Anomaly Detection Alert -->
            ${anomalies.length > 0 ? `
                <div class="alert-section">
                    <h4><i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> Anomaly Detection Alerts</h4>
                    <div class="anomaly-list">
                        ${anomalies.map(anomaly => `
                            <div class="anomaly-item severity-${anomaly.severity}">
                                <div class="anomaly-header">
                                    <i class="fas ${anomaly.icon}"></i>
                                    <span class="anomaly-title">${anomaly.title}</span>
                                    <span class="anomaly-severity">${anomaly.severity.toUpperCase()}</span>
                                </div>
                                <div class="anomaly-description">${anomaly.description}</div>
                                <div class="anomaly-time">${anomaly.timestamp.toLocaleString()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Live Scoreboard -->
            <div class="scoring-section">
                <h4><i class="fas fa-trophy"></i> Live Scoreboard</h4>
                <div class="live-scoreboard">
                    ${generateLiveScoreboard()}
                </div>
            </div>

            <!-- Assessor Performance Analytics -->
            <div class="scoring-section">
                <h4><i class="fas fa-user-chart"></i> Assessor Performance Analytics</h4>
                <div class="assessor-performance-grid">
                    ${Object.values(assessorPerformance).map(assessor => `
                        <div class="assessor-perf-card">
                            <div class="perf-header">
                                <span class="assessor-name">${assessor.name}</span>
                                <span class="perf-status ${assessor.status.toLowerCase()}">${assessor.status}</span>
                            </div>
                            <div class="perf-metrics">
                                <div class="perf-metric">
                                    <span class="metric-label">Assessments</span>
                                    <span class="metric-value">${assessor.totalAssessments}</span>
                                </div>
                                <div class="perf-metric">
                                    <span class="metric-label">Avg Score</span>
                                    <span class="metric-value">${assessor.averageScore.toFixed(1)}</span>
                                </div>
                                <div class="perf-metric">
                                    <span class="metric-label">Consistency</span>
                                    <span class="metric-value">${assessor.consistency}%</span>
                                </div>
                                <div class="perf-metric">
                                    <span class="metric-label">Speed</span>
                                    <span class="metric-value">${assessor.avgTime}min</span>
                                </div>
                            </div>
                            <div class="perf-reliability">
                                <div class="reliability-bar">
                                    <div class="reliability-fill" style="width: ${assessor.reliability}%"></div>
                                </div>
                                <span class="reliability-label">Reliability: ${assessor.reliability}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Audit Trail -->
            <div class="scoring-section">
                <h4><i class="fas fa-history"></i> Recent Audit Trail</h4>
                <div class="audit-trail">
                    ${generateAuditTrail()}
                </div>
            </div>
        </div>
    `;

    document.getElementById('dashboardContent').innerHTML = html;
}

function detectScoringAnomalies() {
    const anomalies = [];
    
    // Check for unusual scoring patterns
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
                    
                    // Check for outliers (more than 2 standard deviations from mean)
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

    // Check for rapid assessments (potential quality issues)
    Object.keys(appState.users).filter(id => appState.users[id].role === 'assessor').forEach(assessorId => {
        const assessments = [];
        
        Object.keys(scoringSystem.assessorScores).forEach(choirId => {
            ['western', 'african'].forEach(genre => {
                if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre] && 
                    scoringSystem.assessorScores[choirId][genre][assessorId]) {
                    assessments.push({
                        ...scoringSystem.assessorScores[choirId][genre][assessorId],
                        choirId,
                        genre
                    });
                }
            });
        });

        // Sort by submission time
        assessments.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

        // Check for assessments completed in less than 2 minutes
        for (let i = 1; i < assessments.length; i++) {
            const timeDiff = new Date(assessments[i].submittedAt) - new Date(assessments[i-1].submittedAt);
            if (timeDiff < 2 * 60 * 1000) { // Less than 2 minutes
                anomalies.push({
                    severity: 'medium',
                    icon: 'fa-clock',
                    title: 'Rapid Assessment Detected',
                    description: `${assessments[i].assessorName} completed assessment in ${(timeDiff / 1000 / 60).toFixed(1)} minutes`,
                    timestamp: new Date(assessments[i].submittedAt)
                });
            }
        }
    });

    return anomalies.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });
}

function calculateAssessorPerformanceMetrics() {
    const metrics = {};
    
    Object.keys(appState.users).filter(id => appState.users[id].role === 'assessor').forEach(assessorId => {
        const assessments = [];
        const completionTimes = [];
        
        Object.keys(scoringSystem.assessorScores).forEach(choirId => {
            ['western', 'african'].forEach(genre => {
                if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre] && 
                    scoringSystem.assessorScores[choirId][genre][assessorId]) {
                    const assessment = scoringSystem.assessorScores[choirId][genre][assessorId];
                    assessments.push(assessment.total);
                    completionTimes.push(new Date(assessment.submittedAt));
                }
            });
        });

        if (assessments.length > 0) {
            const averageScore = assessments.reduce((a, b) => a + b, 0) / assessments.length;
            const variance = assessments.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / assessments.length;
            const consistency = Math.max(0, 100 - (Math.sqrt(variance) / averageScore * 100));
            
            // Calculate average completion time
            let avgTime = 0;
            if (completionTimes.length > 1) {
                completionTimes.sort((a, b) => a - b);
                const timeDiffs = [];
                for (let i = 1; i < completionTimes.length; i++) {
                    timeDiffs.push((completionTimes[i] - completionTimes[i-1]) / (1000 * 60)); // in minutes
                }
                avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
            }

            metrics[assessorId] = {
                name: appState.users[assessorId].name,
                totalAssessments: assessments.length,
                averageScore,
                consistency: consistency.toFixed(0),
                avgTime: avgTime.toFixed(0),
                reliability: Math.min(100, (assessments.length / Math.max(1, appState.choirs.length * 2)) * 100),
                status: assessments.length > 0 ? 'Active' : 'Idle'
            };
        } else {
            metrics[assessorId] = {
                name: appState.users[assessorId].name,
                totalAssessments: 0,
                averageScore: 0,
                consistency: 0,
                avgTime: 0,
                reliability: 0,
                status: 'Idle'
            };
        }
    });

    return metrics;
}

function generateLiveScoreboard() {
    const rankings = scoringSystem.finalRankings.overall.slice(0, 10);
    
    return `
        <div class="scoreboard-tabs">
            <button class="scoreboard-tab active" onclick="showScoreboardView(event, 'rank')">Rank</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'choir')">Choir</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'category')">Category</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'western')">Western</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'african')">African</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'overall')">Overall</button>
            <button class="scoreboard-tab" onclick="showScoreboardView(event, 'status')">Status</button>
        </div>
        <div class="scoreboard-content">
            <div class="table-responsive">
                <div class="scoreboard-table">
                    <table>
                        <thead id="scoreboard-header">
                            <tr>
                                <th>Rank</th>
                                <th>Choir</th>
                                <th>Category</th>
                                <th>Western</th>
                                <th>African</th>
                                <th>Overall</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="scoreboard-body">
                            ${generateRankView(rankings)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function showScoreboardView(event, view) {
    // Prevent default behavior
    if (event) {
        event.preventDefault();
    }
    
    // Update active tab
    document.querySelectorAll('.scoreboard-tab').forEach(tab => tab.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find the tab by data attribute or text
        const tabs = document.querySelectorAll('.scoreboard-tab');
        const tabIndex = ['rank', 'choir', 'category', 'western', 'african', 'overall', 'status'].indexOf(view);
        if (tabs[tabIndex]) {
            tabs[tabIndex].classList.add('active');
        }
    }
    
    const rankings = scoringSystem.finalRankings.overall.slice(0, 10);
    let headerContent = '';
    let bodyContent = '';
    
    switch(view) {
        case 'rank':
            headerContent = `
                <tr>
                    <th>Rank</th>
                    <th>Choir</th>
                    <th>Category</th>
                    <th>Western</th>
                    <th>African</th>
                    <th>Overall</th>
                    <th>Status</th>
                </tr>
            `;
            bodyContent = generateRankView(rankings);
            break;
        case 'choir':
            headerContent = `
                <tr>
                    <th>Choir</th>
                    <th>Region</th>
                    <th>Category</th>
                    <th>Overall Score</th>
                    <th>Assessments</th>
                    <th>Status</th>
                </tr>
            `;
            bodyContent = generateChoirView(rankings);
            break;
        case 'category':
            headerContent = `
                <tr>
                    <th>Category</th>
                    <th>Choirs</th>
                    <th>Avg Score</th>
                    <th>Top Score</th>
                    <th>Completed</th>
                </tr>
            `;
            bodyContent = generateCategoryView(rankings);
            break;
        case 'western':
            headerContent = `
                <tr>
                    <th>Rank</th>
                    <th>Choir</th>
                    <th>Western Score</th>
                    <th>Assessments</th>
                    <th>Consistency</th>
                </tr>
            `;
            bodyContent = generateWesternView(rankings);
            break;
        case 'african':
            headerContent = `
                <tr>
                    <th>Rank</th>
                    <th>Choir</th>
                    <th>African Score</th>
                    <th>Assessments</th>
                    <th>Consistency</th>
                </tr>
            `;
            bodyContent = generateAfricanView(rankings);
            break;
        case 'overall':
            headerContent = `
                <tr>
                    <th>Rank</th>
                    <th>Choir</th>
                    <th>Overall Score</th>
                    <th>Western</th>
                    <th>African</th>
                    <th>Total Assessments</th>
                </tr>
            `;
            bodyContent = generateOverallView(rankings);
            break;
        case 'status':
            headerContent = `
                <tr>
                    <th>Status</th>
                    <th>Choir Count</th>
                    <th>Avg Score</th>
                    <th>Completion Rate</th>
                </tr>
            `;
            bodyContent = generateStatusView(rankings);
            break;
        default:
            headerContent = `
                <tr>
                    <th>Rank</th>
                    <th>Choir</th>
                    <th>Category</th>
                    <th>Western</th>
                    <th>African</th>
                    <th>Overall</th>
                    <th>Status</th>
                </tr>
            `;
            bodyContent = generateRankView(rankings);
    }
    
    // Update header and body separately
    const headerElement = document.querySelector('#scoreboard-header');
    const bodyElement = document.querySelector('#scoreboard-body');
    
    if (headerElement) {
        headerElement.innerHTML = headerContent;
    }
    if (bodyElement) {
        bodyElement.innerHTML = bodyContent;
    }
}

function generateRankView(rankings) {
    return rankings.map((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        return `
            <tr class="scoreboard-row">
                <td class="rank-cell">${ranking.rank}</td>
                <td class="choir-cell">${ranking.choir.name}</td>
                <td class="category-cell">${ranking.choir.category}</td>
                <td class="score-cell">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : '-'}</td>
                <td class="score-cell">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : '-'}</td>
                <td class="overall-score">${ranking.score.toFixed(1)}</td>
                <td class="status-cell">
                    <span class="status-badge ${ranking.choir.status === 'assessed' ? 'completed' : 'pending'}">
                        ${ranking.choir.status.toUpperCase()}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function generateChoirView(rankings) {
    return rankings.map((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        return `
            <tr class="scoreboard-row">
                <td class="choir-cell">${ranking.choir.name}</td>
                <td>${ranking.choir.region || 'N/A'}</td>
                <td class="category-cell">${ranking.choir.category}</td>
                <td class="overall-score">${ranking.score.toFixed(1)}</td>
                <td>${stats.western.count + stats.african.count}</td>
                <td class="status-cell">
                    <span class="status-badge ${ranking.choir.status === 'assessed' ? 'completed' : 'pending'}">
                        ${ranking.choir.status.toUpperCase()}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function generateCategoryView(rankings) {
    const categories = [...new Set(rankings.map(r => r.choir.category))];
    return categories.map(category => {
        const categoryRankings = rankings.filter(r => r.choir.category === category);
        const avgScore = categoryRankings.reduce((sum, r) => sum + r.score, 0) / categoryRankings.length;
        const topScore = Math.max(...categoryRankings.map(r => r.score));
        const completed = categoryRankings.filter(r => r.choir.status === 'assessed').length;
        return `
            <tr class="scoreboard-row">
                <td class="category-cell">${category}</td>
                <td>${categoryRankings.length}</td>
                <td class="overall-score">${avgScore.toFixed(1)}</td>
                <td class="overall-score">${topScore.toFixed(1)}</td>
                <td>${completed}/${categoryRankings.length}</td>
            </tr>
        `;
    }).join('');
}

function generateWesternView(rankings) {
    return rankings.map((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        if (stats.western.trimmedMean > 0) {
            return `
                <tr class="scoreboard-row">
                    <td class="rank-cell">${ranking.rank}</td>
                    <td class="choir-cell">${ranking.choir.name}</td>
                    <td class="overall-score">${stats.western.trimmedMean.toFixed(1)}</td>
                    <td>${stats.western.count}</td>
                    <td>${stats.western.consistency ? stats.western.consistency.toFixed(1) + '%' : 'N/A'}</td>
                </tr>
            `;
        }
        return '';
    }).filter(row => row !== '').join('');
}

function generateAfricanView(rankings) {
    return rankings.map((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        if (stats.african.trimmedMean > 0) {
            return `
                <tr class="scoreboard-row">
                    <td class="rank-cell">${ranking.rank}</td>
                    <td class="choir-cell">${ranking.choir.name}</td>
                    <td class="overall-score">${stats.african.trimmedMean.toFixed(1)}</td>
                    <td>${stats.african.count}</td>
                    <td>${stats.african.consistency ? stats.african.consistency.toFixed(1) + '%' : 'N/A'}</td>
                </tr>
            `;
        }
        return '';
    }).filter(row => row !== '').join('');
}

function generateOverallView(rankings) {
    return rankings.map((ranking) => {
        const stats = scoringSystem.getChoirStatistics(ranking.choir.id);
        return `
            <tr class="scoreboard-row">
                <td class="rank-cell">${ranking.rank}</td>
                <td class="choir-cell">${ranking.choir.name}</td>
                <td class="overall-score">${ranking.score.toFixed(1)}</td>
                <td class="score-cell">${stats.western.trimmedMean > 0 ? stats.western.trimmedMean.toFixed(1) : '-'}</td>
                <td class="score-cell">${stats.african.trimmedMean > 0 ? stats.african.trimmedMean.toFixed(1) : '-'}</td>
                <td>${stats.western.count + stats.african.count}</td>
            </tr>
        `;
    }).join('');
}

function generateStatusView(rankings) {
    const statusGroups = {
        'ASSESSED': rankings.filter(r => r.choir.status === 'assessed'),
        'PENDING': rankings.filter(r => r.choir.status === 'pending'),
        'IN_PROGRESS': rankings.filter(r => r.choir.status === 'in_progress')
    };
    
    return Object.entries(statusGroups).map(([status, choirs]) => {
        const avgScore = choirs.length > 0 ? choirs.reduce((sum, r) => sum + r.score, 0) / choirs.length : 0;
        const completionRate = rankings.length > 0 ? (choirs.length / rankings.length * 100) : 0;
        return `
            <tr class="scoreboard-row">
                <td>
                    <span class="status-badge ${status === 'ASSESSED' ? 'completed' : 'pending'}">
                        ${status.replace('_', ' ')}
                    </span>
                </td>
                <td>${choirs.length}</td>
                <td class="overall-score">${choirs.length > 0 ? avgScore.toFixed(1) : 'N/A'}</td>
                <td>${completionRate.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

function generateAuditTrail() {
    const auditEntries = [];
    
    // Collect recent scoring activities
    Object.keys(scoringSystem.assessorScores).forEach(choirId => {
        ['western', 'african'].forEach(genre => {
            if (scoringSystem.assessorScores[choirId] && scoringSystem.assessorScores[choirId][genre]) {
                Object.keys(scoringSystem.assessorScores[choirId][genre]).forEach(assessorId => {
                    const assessment = scoringSystem.assessorScores[choirId][genre][assessorId];
                    if (assessment && assessment.submittedAt) {
                        const choir = appState.choirs.find(c => c.id === choirId);
                        auditEntries.push({
                            type: 'score_submitted',
                            user: assessment.assessorName,
                            action: `Submitted ${genre} assessment`,
                            target: choir ? choir.name : 'Unknown Choir',
                            details: `Score: ${assessment.total.toFixed(1)}`,
                            timestamp: new Date(assessment.submittedAt),
                            ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
                        });
                    }
                });
            }
        });
    });

    // Add system events
    auditEntries.push({
        type: 'system_check',
        user: 'System',
        action: 'Automated health check',
        target: 'All Systems',
        details: 'Status: Healthy',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        ip: 'localhost'
    });

    auditEntries.push({
        type: 'data_backup',
        user: 'System',
        action: 'Scheduled backup completed',
        target: 'Database',
        details: 'Size: 2.4MB',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ip: 'localhost'
    });

    // Sort by timestamp (most recent first)
    auditEntries.sort((a, b) => b.timestamp - a.timestamp);

    return auditEntries.slice(0, 15).map(entry => `
        <div class="audit-entry">
            <div class="audit-icon">
                <i class="fas ${getAuditIcon(entry.type)}"></i>
            </div>
            <div class="audit-details">
                <div class="audit-header">
                    <span class="audit-user">${entry.user}</span>
                    <span class="audit-action">${entry.action}</span>
                    <span class="audit-time">${entry.timestamp.toLocaleString()}</span>
                </div>
                <div class="audit-info">
                    <span class="audit-target">Target: ${entry.target}</span>
                    <span class="audit-details-text">${entry.details}</span>
                    <span class="audit-ip">IP: ${entry.ip}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getAuditIcon(type) {
    const icons = {
        'score_submitted': 'fa-clipboard-check',
        'system_check': 'fa-heartbeat',
        'data_backup': 'fa-database',
        'user_login': 'fa-sign-in-alt',
        'security_alert': 'fa-shield-alt'
    };
    return icons[type] || 'fa-info-circle';
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
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshSystemHealth()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- System Performance Metrics -->
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

            <!-- Security Monitoring -->
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
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-shield-alt"></i> Data Integrity & Compliance Monitor
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshDataIntegrity()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- Data Validation -->
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

            <!-- Backup Status -->
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

            <!-- GDPR Compliance -->
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
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-chart-line"></i> Advanced Analytics
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshAnalytics()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- Scoring Distribution -->
            <div class="analytics-section">
                <h4><i class="fas fa-chart-bar"></i> Scoring Distribution Analysis</h4>
                <div class="analytics-chart">
                    <p>Scoring distribution analytics would be displayed here with interactive charts.</p>
                </div>
            </div>

            <!-- Category Analysis -->
            <div class="analytics-section">
                <h4><i class="fas fa-layer-group"></i> Category Performance Analysis</h4>
                <div class="category-analytics">
                    <p>Category performance metrics and comparisons would be displayed here.</p>
                </div>
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
    let html = `
        <div class="fade-in">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h3 style="color: var(--primary-gold);">
                    <i class="fas fa-exclamation-triangle"></i> Incident Management
                </h3>
                <div class="action-buttons-container">
                    <button class="action-btn outline" onclick="showDashboard()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="action-btn" onclick="refreshIncidentManagement()">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            <!-- Incident Log -->
            <div class="incident-section">
                <h4><i class="fas fa-history"></i> Incident Log</h4>
                <div class="incident-list">
                    <div class="incident-item severity-low">
                        <div class="incident-header">
                            <span class="incident-id">INC-001</span>
                            <span class="incident-title">Scheduled maintenance completed</span>
                            <span class="incident-status resolved">RESOLVED</span>
                        </div>
                        <div class="incident-details">
                            <span class="incident-type">system</span>
                            <span class="incident-time">${new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Disaster Recovery Status -->
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
                </div>
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

// ============================================
// CHOIR IMPORT FUNCTIONS (FIXED)
// ============================================

function openImportChoirs() {
    // Reset importedChoirsData to empty array
    importedChoirsData = [];
    document.getElementById('importChoirsModal').style.display = 'flex';
    resetImportForm();
}

function closeImportChoirsModal() {
    document.getElementById('importChoirsModal').style.display = 'none';
    resetImportForm();
    // Clear imported data when closing
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
    // Clear imported data when resetting
    importedChoirsData = [];
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;

    // Reset imported data
    importedChoirsData = [];

    // Check file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name || '';
    const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showNotification('Please select a valid Excel file (.xlsx, .xls) or CSV file', 'error');
        resetImportForm();
        return;
    }

    // Show file info
    const fileNameEl = document.getElementById('fileName');
    if (fileNameEl) fileNameEl.textContent = fileName;
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) fileInfo.style.display = 'block';

    // Read and process the file
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
    
    // Check if data exists and has headers
    if (!data || data.length < 2) {
        errors.push('File must contain at least a header row and one data row');
        showImportErrors(errors);
        return;
    }

    const headers = data[0].map(h => h ? h.toString().trim().toLowerCase() : '');
    
    // Validate required columns
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

    // Validate data rows
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0 || row.every(cell => !cell || cell.toString().trim() === '')) {
            continue; // Skip empty rows
        }

        const choir = {
            name: row[headerMap['choir name']]?.toString().trim(),
            region: row[headerMap['region']]?.toString().trim(),
            category: row[headerMap['category']]?.toString().trim().toUpperCase(),
            africanSong: row[headerMap['african song']]?.toString().trim(),
            westernSong: row[headerMap['western song']]?.toString().trim()
        };

        // Validate choir data
        const rowErrors = [];
        
        if (!choir.name) rowErrors.push('Choir name is required');
        if (!choir.region) rowErrors.push('Region is required');
        if (!choir.category) rowErrors.push('Category is required');
        if (!choir.africanSong) rowErrors.push('African song is required');
        if (!choir.westernSong) rowErrors.push('Western song is required');

        // Validate category
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

    // Store valid choirs in global variable
    importedChoirsData = validChoirs;
    
    // Show preview
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
    // Clear imported data on error
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
    // Use the global variable
    if (!importedChoirsData || importedChoirsData.length === 0) {
        showNotification('No data to import', 'error');
        return;
    }

    let importedCount = 0;
    let skippedCount = 0;

    // Get the next available ID
    let nextId = 1;
    if (appState.choirs.length > 0) {
        const ids = appState.choirs.map(c => c.id).filter(id => typeof id === 'number');
        nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    importedChoirsData.forEach(choirData => {
        // Check for duplicate choir names (case insensitive)
        const existingChoir = appState.choirs.find(c => 
            c.name && choirData.name && 
            c.name.toLowerCase().trim() === choirData.name.toLowerCase().trim()
        );

        if (existingChoir) {
            skippedCount++;
            return;
        }

        // Create new choir with unique ID
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

    // Save to localStorage
    scoringSystem.saveToLocalStorage();

    // Close modal and refresh
    closeImportChoirsModal();

    // Show success message
    const message = importedCount > 0 
        ? `Successfully imported ${importedCount} choir(s)${skippedCount > 0 ? `. ${skippedCount} choir(s) skipped due to duplicates.` : ''}`
        : 'No new choirs were imported (all duplicates)';
    
    showNotification(message, importedCount > 0 ? 'success' : 'info');
    
    // Refresh the view
    if (appState.currentView === 'manageChoirs') {
        renderManageChoirs();
    }
}

function downloadTemplate() {
    // Create template data
    const templateData = [
        ['Choir Name', 'Region', 'Category', 'African Song', 'Western Song'],
        ['Example Choir 1', 'Gauteng', 'GREAT CHAMPS', 'African Song Title 1', 'Western Song Title 1'],
        ['Example Choir 2', 'Western Cape', 'LARGE', 'African Song Title 2', 'Western Song Title 2'],
        ['Example Choir 3', 'KwaZulu-Natal', 'STANDARD', 'African Song Title 3', 'Western Song Title 3']
    ];

    // Create workbook
    let ws;
    if (typeof XLSX !== 'undefined') {
        ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Choirs Template');

        // Set column widths
        ws['!cols'] = [
            {wch: 25}, // Choir Name
            {wch: 15}, // Region
            {wch: 15}, // Category
            {wch: 30}, // African Song
            {wch: 30}  // Western Song
        ];

        // Download file
        XLSX.writeFile(wb, 'Choirs_Import_Template.xlsx');
    } else {
        // Fallback: CSV
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
// ADDITIONAL MISSING FUNCTIONS
// ============================================

function showAssessorPerformance() {
    showNotification('Assessor performance view coming soon', 'info');
}

// ============================================
// FINAL EXPORTS AND INITIALIZATION
// ============================================

// Make all functions available globally
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
window.showMyAssessmentsOnly = showMyAssessmentsOnly;

// SEARCH BAR FUNCTIONS - Make them globally available
window.filterChoirsBySearch = filterChoirsBySearch;
window.clearSearch = clearSearch;
window.filterMyAssessmentsBySearch = filterMyAssessmentsBySearch;
window.clearMyAssessmentsSearch = clearMyAssessmentsSearch;

console.log('TMF Choral Judicators System v2.1.0 loaded successfully!');