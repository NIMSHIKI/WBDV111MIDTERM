
document.addEventListener("DOMContentLoaded", function(){

// RESERVATION FORM ALERT

let form = document.getElementById("bookingForm");

if(form){
form.addEventListener("submit", function(e){
e.preventDefault();
alert("Reservation Successful! Thank you for booking at Luna Vista Resort.");
})
}
});

    document.addEventListener('DOMContentLoaded', function() {
        // 1. Get the form element
        const form = document.getElementById('bookingForm');

        // 2. Listen for the 'submit' event
        form.addEventListener('submit', function(event) {
            
            // 3. Prevent the page from reloading
            event.preventDefault();

            // 4. (Optional) Show a success message
            alert('Reservation Successful!');

            // 5. Reset the form (clears all inputs)
            form.reset();
        });
    });

            // --- 1. SLIDER LOGIC ---
            let slideIndex = 0;
            showSlides();

            function showSlides() {
                let i;
                let slides = document.getElementsByClassName("slide");
                
                // Hide all slides
                for (i = 0; i < slides.length; i++) {
                    slides[i].classList.remove("active");
                }
                
                slideIndex++;
                if (slideIndex > slides.length) {slideIndex = 1}
                
                // Show the current slide
                slides[slideIndex-1].classList.add("active");
                
                // Change image every 3 seconds
                setTimeout(showSlides, 3000); 
            }

            // --- 2. FORM RESET LOGIC ---
            document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('bookingForm');

                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    alert('Reservation Successful!');
                    form.reset();
                });
            });
    