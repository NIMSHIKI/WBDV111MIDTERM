// LOGIN SYSTEM
function login(event) {
    event.preventDefault();
    console.log("Login function called");
    const studentID = document.getElementById("studentID").value;
    const password = document.getElementById("password").value;
    console.log("Student ID:", studentID, "Password:", password);

    if (studentID === "2026-001" && password === "admin") {
        console.log("Login successful");
        localStorage.setItem("studentAuth", "true");
        window.location.href = "dashboard.html";
    } else {
        console.log("Login failed");
        alert("Invalid Student ID or Password");
    }
    return false;
}

// PROTECT PAGES
if (!window.location.pathname.includes("index.html")) {
    if (!localStorage.getItem("studentAuth")) {
        window.location.href = "index.html";
    }
}

// REGISTER COURSE
function registerCourse() {
    document.getElementById("status").innerText = "Successfully Registered!";
}

// TRANSCRIPT TOGGLE
function showTranscript() {
    const t = document.getElementById("transcript");
    if (t) t.style.display = t.style.display === "none" ? "block" : "none";
}

function toggleTranscript() {
    const t = document.getElementById("transcript");
    if (t) t.style.display = t.style.display === "none" ? "block" : "none";
}
 