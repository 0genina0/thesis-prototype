/* =========================================
   THESIS EXPERIMENT: SOCIALSTUDY
   =========================================
*/

// 1. CONFIGURATION
const MY_SUPABASE_URL = 'https://upvqhxggqlnslxymwzwq.supabase.co'; 
const MY_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdnFoeGdncWxuc2x4eW13endxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTkyNjgsImV4cCI6MjA5MDI3NTI2OH0.S6mIXXY850WpPXHdJ9gjHltEvWi_jncfWVaaEYgpoVw';

// Initialize Supabase
const db = supabase.createClient(MY_SUPABASE_URL, MY_SUPABASE_KEY);

// 2. STATE VARIABLES
let experimentStart = 0;
let currentParticipant = "";

/* STEP 3: NAVIGATION - LANDING TO SIGNUP
   Triggered when user clicks "Create Account" on the first page
*/
window.showSignup = function() {
    document.getElementById('landing-screen').style.display = 'none';
    document.getElementById('signup-screen').style.display = 'flex';
};

/* STEP 4: START EXPERIMENT 
   Triggered when user clicks "Sign Up" on the second page
*/
window.startExperiment = function() {
    const inputField = document.getElementById('username');
    
    if (!inputField || !inputField.value) {
        alert("Please enter a username to continue.");
        return;
    }

    // Capture identity and start the timer
    currentParticipant = inputField.value;
    experimentStart = Date.now(); 

    // UI Transition: Move to ToS Overlay
    document.getElementById('signup-screen').style.display = 'none';
    document.getElementById('tos-overlay').style.display = 'flex';
    
    console.log("Timer started for:", currentParticipant);
};

/* STEP 5: COMPLETE & SAVE 
   Triggered when user clicks "I Agree"
*/
window.completeExperiment = async function() {
    // 1. Calculate time spent (Duration)
    const timeNow = Date.now();
    const duration = (timeNow - experimentStart) / 1000;
    
    const rowToInsert = { 
        username: currentParticipant, 
        tos_time: parseFloat(duration.toFixed(2)) 
    };

    console.log("Saving result...", rowToInsert);

    try {
        // 2. Insert into Supabase
        const { error } = await db
            .from('experiment_results')
            .insert([rowToInsert]);

        if (error) throw error;

        // Inside completeExperiment, after error check:
document.body.style.overflowY = "auto"; // Ensure they can scroll the feed

        // 3. SUCCESSFUL REDIRECT LOGIC
        
        // Hide experiment UI
        document.getElementById('tos-overlay').style.display = 'none';
        document.getElementById('signup-screen').style.display = 'none';
        document.getElementById('landing-screen').style.display = 'none';

        // Change background to "App Mode" (Grey/White)
        document.body.style.backgroundColor = "#f0f2f5";

        // Show the Social Feed Home Screen
        const home = document.getElementById('home-screen');
        if (home) {
            home.style.display = 'flex'; 
        }

        console.log("Redirected to Feed. Experiment Complete.");

    } catch (err) {
        console.error("Supabase Error:", err.message);
        alert("Database error: " + err.message);
    }
};