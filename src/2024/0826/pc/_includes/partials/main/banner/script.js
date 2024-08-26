import Swiper from "swiper/bundle";

export function bannerSwiper() {
  const root = document.querySelector(".section--banner");
  const target = root.querySelector(".banner");
  const swiper = new Swiper(target, {
    slidesPerView: 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 800,
    loop: true,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    on: {
      init: function () {
        updatePagination(this);
        updateCustomProgressBar(this);
      },
      slideChange: function () {
        updatePagination(this);
        updateCustomProgressBar(this);
      },
    },
  });

  function updatePagination(swiper) {
    const currentIndex = (swiper.realIndex + 1).toString().padStart(2, "0");
    const totalSlides = swiper.slides.length.toString().padStart(2, "0");
    const currentEl = root.querySelector(".swiper-current");
    const totalEl = root.querySelector(".swiper-total");

    if (currentEl) currentEl.textContent = currentIndex;
    if (totalEl) totalEl.textContent = totalSlides;
  }

  function updateCustomProgressBar(swiper) {
    const customProgressBar = root.querySelector(
      ".custom-progress-bar .progress-bar ",
    );
    if (customProgressBar) {
      const progress = (swiper.realIndex + 1) / swiper.slides.length;
      customProgressBar.style.width = `${progress * 100}%`;
    }
  }
}
