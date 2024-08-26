// carousel.js
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  let currentIndex = 0;
  let startX;
  let isSwiping = false;

  const images = [
    "/api/placeholder/520/520", // 남자가 파란 옷을 입고 있는 이미지
    "/api/placeholder/520/520", // 빨간 셔츠를 입은 사람의 이미지
    "/api/placeholder/520/520", // 흰색 옷을 입은 사람의 이미지
    "/api/placeholder/520/520", // 두 사람이 함께 있는 이미지
    "/api/placeholder/520/520", // 흰색 셔츠를 입은 사람의 이미지
  ];

  // Create slides and indicators
  images.forEach((src, index) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `<img src="${src}" alt="Slide ${index + 1}">`;
    carousel.appendChild(slide);

    const indicator = document.createElement("div");
    indicator.className = "indicator";
    indicator.addEventListener("click", () => setCurrentIndex(index));
    indicatorsContainer.appendChild(indicator);
  });

  const slides = Array.from(carousel.children);
  const indicators = Array.from(indicatorsContainer.children);

  function updateCarousel() {
    const slideWidth = 328; // 비활성 슬라이드 너비
    const activeSlideWidth = 520; // 활성 슬라이드 너비
    const gap = 20; // 슬라이드 간 총 간격
    const offset = currentIndex * (slideWidth + gap);
    carousel.style.transform = `translateX(-${offset}px)`;

    carousel.addEventListener("transitionend", () => {
      carousel.classList.add("is-slide-end");
    });

    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.style.width = `${activeSlideWidth}px`;
        slide.style.height = `${activeSlideWidth}px`;
        slide.style.backgroundColor = "#f0f0f0";
      } else {
        slide.style.width = `${slideWidth}px`;
        slide.style.height = `${slideWidth}px`;
        slide.style.backgroundColor = "#e0e0e0";
      }
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  function setCurrentIndex(index) {
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    updateCarousel();
  }

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isSwiping = true;
  }

  function handleMouseDown(e) {
    startX = e.clientX;
    isSwiping = true;
  }

  function handleTouchMove(e) {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    handleSwipe(diff);
  }

  function handleMouseMove(e) {
    if (!isSwiping) return;
    const currentX = e.clientX;
    const diff = startX - currentX;
    handleSwipe(diff);
  }

  function handleSwipe(diff) {
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      isSwiping = false;
    }
  }

  function handleTouchEnd() {
    isSwiping = false;
  }

  function handleMouseUp() {
    isSwiping = false;
  }

  carousel.addEventListener("touchstart", handleTouchStart);
  carousel.addEventListener("touchmove", handleTouchMove);
  carousel.addEventListener("touchend", handleTouchEnd);
  carousel.addEventListener("mousedown", handleMouseDown);
  carousel.addEventListener("mousemove", handleMouseMove);
  carousel.addEventListener("mouseup", handleMouseUp);
  carousel.addEventListener("mouseleave", handleMouseUp);

  // Initial setup
  updateCarousel();
});
