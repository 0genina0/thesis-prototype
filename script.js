/* === STEP 1: CONFIGURATION === */
// Using the URL and Key you just provided
const MY_SUPABASE_URL = 'https://upvqhxggqlnslxymwzwq.supabase.co'; 
const MY_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdnFoeGdncWxuc2x4eW13endxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTkyNjgsImV4cCI6MjA5MDI3NTI2OH0.S6mIXXY850WpPXHdJ9gjHltEvWi_jncfWVaaEYgpoVw';

// Initialize the database connection
const db = supabase.createClient(MY_SUPABASE_URL, MY_SUPABASE_KEY);

/* === STEP 2: STATE VARIABLES === */
let experimentStart = 0;
let currentParticipant = "";

/* === STEP 3: START EXPERIMENT === */
function startExperiment() {
    const inputField = document.getElementById('username');
    
    if (!inputField || !inputField.value) {
        alert("Please enter a username!");
        return;
    }

    currentParticipant = inputField.value;
    experimentStart = Date.now();

    // UI Transition: Hide Signup, Show ToS
    document.getElementById('signup-screen').style.display = 'none';
    document.getElementById('tos-overlay').style.display = 'flex';
    
    console.log("Experiment started for:", currentParticipant);
}

/* === STEP 4: COMPLETE & SAVE === */
async function completeExperiment() {
    const timeNow = Date.now();
    const duration = (timeNow - experimentStart) / 1000;
    
    const rowToInsert = { 
        username: currentParticipant, 
        tos_time: parseFloat(duration.toFixed(2)) 
    };

    console.log("Attempting to save...", rowToInsert);

    try {
        const { error } = await db
            .from('experiment_results')
            .insert([rowToInsert]);

        if (error) throw error;

        // Success: Show Home Screen
        document.getElementById('tos-overlay').style.display = 'none';
        document.getElementById('home-screen').style.display = 'flex';
        alert("Success! Your data has been recorded.");

    } catch (err) {
        console.error("Supabase Error:", err.message);
        alert("Save failed: " + err.message);
    }
}