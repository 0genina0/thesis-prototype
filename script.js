// This prevents the "Duplicate Variable" error
if (typeof db === 'undefined') {

    /* === CONFIGURATION === */
    // I extracted your project ID from your key: upvqhggeqlnslxymwzwq
    const MY_SUPABASE_URL = 'https://upvqhggeqlnslxymwzwq.supabase.co'; 
    const MY_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdnFoeGdncWxuc2x4eW13endxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTkyNjgsImV4cCI6MjA5MDI3NTI2OH0.S6mIXXY850WpPXHdJ9gjHltEvWi_jncfWVaaEYgpoVw';

    // Initialize Supabase
    const db = supabase.createClient(MY_SUPABASE_URL, MY_SUPABASE_KEY);

    /* === STATE VARIABLES === */
    var experimentStart = 0;
    var currentParticipant = "";

    /* === FUNCTIONS === */
    window.startExperiment = function() {
        const inputField = document.getElementById('username');
        
        if (!inputField || !inputField.value) {
            alert("Please enter a username!");
            return;
        }

        currentParticipant = inputField.value;
        experimentStart = Date.now();

        // UI Transition
        document.getElementById('signup-screen').style.display = 'none';
        document.getElementById('tos-overlay').style.display = 'flex';
        
        console.log("Experiment started for:", currentParticipant);
    };

    window.completeExperiment = async function() {
        const timeNow = Date.now();
        const duration = (timeNow - experimentStart) / 1000;
        
        const rowToInsert = { 
            username: currentParticipant, 
            tos_time: parseFloat(duration.toFixed(2)) 
        };

        console.log("Saving to Supabase...", rowToInsert);

        try {
            const { error } = await db
                .from('experiment_results')
                .insert([rowToInsert]);

            if (error) throw error;

            // Redirect to Home
            document.getElementById('tos-overlay').style.display = 'none';
            document.getElementById('home-screen').style.display = 'flex';
            alert("Success! Your time of " + rowToInsert.tos_time + "s has been recorded for the thesis.");

        } catch (err) {
            console.error("Supabase Error:", err.message);
            alert("Save failed: " + err.message + ". Make sure your table is named 'experiment_results' and RLS policies are set to allow Insert.");
        }
    };
}