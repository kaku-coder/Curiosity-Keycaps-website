let middletext = document.querySelector(".middle-text");

const messages = [
  "Free same or next day dispatch available.",
  "Check Inbox Or Spam Folder For Tracking",
  "COD Service Attracts Additional Fee. Read Instructions.",
  "Multiple Payment Options Available",
  "All Instock Items",
];

let currentIndex = 0;

function changeMessage() {
  currentIndex = (currentIndex + 1) % messages.length;
  middletext.innerText = messages[currentIndex];

  // Set timeout for the next message change
  setTimeout(changeMessage, 5000);
}

// Initial change after 5 seconds
setTimeout(changeMessage, 5000);

// add event listener to right arrow
let rightArrow = document.querySelector(".right-arrow");
rightArrow.addEventListener("click", () => {
  currentIndex++;
  console.log(currentIndex);
  if (currentIndex >= messages.length) {
    currentIndex = 0;
  }
  middletext.innerText = messages[currentIndex];
});
let leftarrow = document.querySelector(".left-arrow");
leftarrow.addEventListener("click", () => {
  currentIndex--;
  console.log(currentIndex);
  if (currentIndex < 0) {
    currentIndex = messages.length - 1;
  }
  middletext.innerText = messages[currentIndex];
});

// now add addEventListener on text arrow
// Add event listeners to all text arrows
let textArrows = document.querySelectorAll(".text i");
textArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    arrow.classList.toggle("rotate");
  });
});

// Get all slides
let slides = document.querySelectorAll(".slide");
let index = 0;
let slideInterval;

// Function to show current slide
function showSlide() {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove("active"));
    // Add active class to current slide
    slides[index].classList.add("active");
    updateActiveDot();
}

// Function to move to next slide
function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide();
}

// Function to move to previous slide
function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide();
}

// Start the slideshow
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 3000);
}

// Stop the slideshow
function stopSlideshow() {
    clearInterval(slideInterval);
}

// Initialize
showSlide();
startSlideshow();

// Add event listeners for navigation
document.querySelector(".ri-arrow-left-s-fill").addEventListener("click", () => {
    stopSlideshow();
    prevSlide();
    startSlideshow();
});

document.querySelector(".ri-arrow-right-s-fill").addEventListener("click", () => {
    stopSlideshow();
    nextSlide();
    startSlideshow();
});

// Add click functionality to dots
document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
        stopSlideshow();
        index = parseInt(dot.getAttribute('data-slide'));
        showSlide();
        updateActiveDot();
        startSlideshow();
    });});

// Function to update active dot
function updateActiveDot() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active-dot');
        } else {
            dot.classList.remove('active-dot');
        }
    });
}

// Play/Pause functionality
const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");
let isPlaying = true;

function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        startSlideshow();
        pauseButton.style.display = "block";
        playButton.style.display = "none";
    } else {
        stopSlideshow();
        pauseButton.style.display = "none";
        playButton.style.display = "block";
    }
}

// Add click event to both play and pause buttons
playButton.addEventListener("click", togglePlayPause);
pauseButton.addEventListener("click", togglePlayPause);

// Initialize button states
pauseButton.style.display = "block";
playButton.style.display = "none";

// Product Image Hover Effect
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(image => {
        const original = image.getAttribute('data-original');
        const hover = image.getAttribute('data-hover');
        
        if (!original || !hover) return;
        
        // Set initial background
        image.style.backgroundImage = `url(${original})`;
        
        // Add hover effect
        image.addEventListener('mouseenter', () => {
            image.style.backgroundImage = `url(${hover})`;
        });
        
        image.addEventListener('mouseleave', () => {
            image.style.backgroundImage = `url(${original})`;
        });
    });
    
    // Initialize user authentication
    initUserAuth();
});

// User Authentication functionality
function initUserAuth() {
    const userIcon = document.querySelector('.user');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (userIcon) {
        if (currentUser) {
            // User is logged in
            userIcon.classList.remove('fa-regular');
            userIcon.classList.add('fa-solid');
            userIcon.style.color = '#6e2ca9';
            
            // Add click event for logout
            userIcon.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });
            
            // Add tooltip
            userIcon.title = `Logged in as ${currentUser.name}`;
        } else {
            // User is not logged in
            userIcon.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            userIcon.title = 'Click to login';
        }
    }
}
