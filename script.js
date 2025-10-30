let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    const dots = document.querySelectorAll('.dot');


    if (index >= totalSlides) {
        currentSlide = 0; 
    } else if (index < 0) {
        currentSlide = totalSlides - 1; 
    } else {
        currentSlide = index; 
    }

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;


    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function startSlideShow() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1); 
    }, 5000); 
}

function stopSlideShow() {
    clearInterval(slideInterval);
}


document.querySelector('.prev').addEventListener('click', () => {
    showSlide(currentSlide - 1); 
});

document.querySelector('.next').addEventListener('click', () => {
    showSlide(currentSlide + 1); // Chuyển sang slide tiếp theo
});

// Thêm sự kiện cho các chấm
function goToSlide(index) {
    showSlide(index); // Chuyển đến slide được chỉ định
}

// Bắt đầu slideshow khi tải trang
startSlideShow();

// Đặt thời gian kết thúc (ví dụ: 5 ngày từ bây giờ)
const countdownEndDate = new Date();
countdownEndDate.setDate(countdownEndDate.getDate() + 5);

// Hàm cập nhật đồng hồ đếm ngược
function updateCountdown() {
    const now = new Date();
    const timeRemaining = countdownEndDate - now;

    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Cập nhật nội dung HTML
        document.getElementById("days").textContent = days.toString().padStart(2, "0");
        document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
    } else {
        // Khi hết thời gian, hiển thị thông báo
        document.querySelector(".countdown").textContent = "Hết thời gian!";
    }
}

// Gọi hàm cập nhật mỗi giây
setInterval(updateCountdown, 1000);

function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}
