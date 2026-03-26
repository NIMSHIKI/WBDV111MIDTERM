function showSection(section){

document.getElementById("meals").style.display="none";
document.getElementById("billings").style.display="none";
document.getElementById("plans").style.display="none";

document.getElementById(section).style.display="block";

}


function showNutrients(){

document.getElementById("nutrientsBox").innerHTML =
"FreshBite meals are rich in Protein, Fiber, Vitamins, and Healthy Fats to support a balanced and nutritious lifestyle.";

}

// --- NEW JAVASCRIPT FOR DRAWER ---
    function toggleDrawer() {
        const drawer = document.getElementById('loginDrawer');
        const overlay = document.getElementById('drawerOverlay');
        
        // Toggle the 'active' class on both elements
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    // --- END NEW JAVASCRIPT ---

    // --- 1. NAVIGATION LOGIC ---
    function showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(sec => sec.style.display = 'none');
        
        // Show selected section
        document.getElementById(sectionId).style.display = 'block';
    }

    // --- 2. DRAWER LOGIC ---
    function toggleDrawer() {
        const drawer = document.getElementById('loginDrawer');
        const overlay = document.getElementById('drawerOverlay');
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    // --- 3. LOGIN LOGIC ---
    function handleLogin(event) {
        event.preventDefault(); // Stop form from refreshing page
        
        // Close Drawer
        toggleDrawer();
        
        // Show Notification
        showNotification("Thank you for signing in!", "Signed In");
        
        // Update Header
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('userStatus').style.display = 'inline';
    }

    // --- 4. NOTIFICATION SYSTEM ---
    function showNotification(title, message) {
        const modal = document.getElementById('notificationModal');
        document.getElementById('notifTitle').innerText = title;
        document.getElementById('notifMessage').innerText = message;
        modal.style.display = 'block';
    }

    function closeNotification() {
        document.getElementById('notificationModal').style.display = 'none';
    }

    // --- 5. PURCHASE LOGIC (Triggered when selecting items) ---
    // We add event listeners to all selects to trigger the purchase notif
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            if(this.value !== "none") {
                showNotification("Thank you for purchasing!", "Your order has been confirmed.");
            }
        });
    });

    // Initialize Home
    showSection('home');

    let selectedMeal="";
let selectedBilling="";

function showSection(section){

document.getElementById("home").style.display="none";
document.getElementById("meals").style.display="none";
document.getElementById("billings").style.display="none";
document.getElementById("plans").style.display="none";
document.getElementById("summary").style.display="none";

document.getElementById(section).style.display="block";
}


function showNutrients(){

document.getElementById("nutrientsBox").innerHTML =
"FreshBite meals contain Protein, Fiber, Vitamins, and Healthy Fats that help support a balanced and healthy lifestyle.";

}


function selectMeal(meal){

selectedMeal=meal;

alert("You selected: "+meal);

showSection("billings");

}


function selectBilling(type){

selectedBilling=type;

alert("Payment method selected: "+type);

showSection("plans");

}


function finishOrder(plan){

let message=
"Thank you for choosing FreshBite Prep!\n\n"+
"Meal: "+selectedMeal+"\n"+
"Payment: "+selectedBilling+"\n"+
"Plan: "+plan+"\n\n"+
"Your healthy meal will be prepared and delivered soon!";

alert(message);

document.getElementById("result").innerText=message;

showSection("summary");

}

function showNutrients(){

document.getElementById("nutrientsBox").innerHTML =

"<h3>FreshBite Nutrition Information</h3>" +

"<p><b>Protein:</b> Helps build and repair muscles. Our meals like grilled chicken and salmon provide high-quality protein for strength and energy.</p>" +

"<p><b>Fiber:</b> Supports digestion and helps keep you full longer. Vegetables, quinoa, and whole grains in our meals are rich in fiber.</p>" +

"<p><b>Healthy Fats:</b> Found in salmon, avocado, and olive oil. These fats support heart health and brain function.</p>" +

"<p><b>Vitamins:</b> Fresh vegetables provide essential vitamins such as Vitamin A, Vitamin C, and Vitamin K that help strengthen the immune system.</p>" +

"<p><b>Minerals:</b> Our meals contain important minerals like Iron, Calcium, and Potassium that support bones, muscles, and overall body function.</p>" +

"<p><b>Balanced Calories:</b> FreshBite meals are designed to give balanced calories for energy while helping maintain a healthy lifestyle.</p>" +

"<p><b>Natural Ingredients:</b> We focus on fresh vegetables, lean proteins, and whole grains with less processed ingredients.</p>";

}