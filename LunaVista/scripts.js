document.addEventListener("DOMContentLoaded", function(){

let index = 0;
const slides = document.getElementById("slides");

if(slides){

const totalSlides = slides.children.length;

function showSlide(){
slides.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide(){
index = (index + 1) % totalSlides;
showSlide();
}

setInterval(nextSlide, 3000);

}

});