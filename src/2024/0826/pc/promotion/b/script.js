import Swiper from "swiper";
import { Mousewheel, Autoplay, Navigation, Pagination } from "swiper/modules";
import AOS from "aos";

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".promotion-section--swiper .swiper-container", {
    modules: [Mousewheel, Pagination, Navigation, Autoplay],
    slidesPerView: 'auto',
    loop: true,
    loopAdditionalSlides : 1,
    speed: 600,
    observer: true,
    observeParents: true,
    slidesOffsetBefore: -90,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    autoplay: {

      delay: 2000,
      disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
    },
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 슬라이더가 화면에 보이면 처음부터 시작
        swiper.slideTo(0);
        swiper.autoplay.start();
      } else {
        // 슬라이더가 화면에 보이지 않으면 멈춤
        swiper.autoplay.stop();
      }
    });
  });

  observer.observe(document.querySelector(".promotion-section--swiper .swiper-container"));

  const swiperContainer = document.querySelector(
    ".promotion-section--swiper .swiper-container",
  );

  // swiper 위에 마우스가 올라가면 멈춤
  swiperContainer.addEventListener("mouseenter", () => {
    swiper.autoplay.stop();
  });
  // swiper 위에 마우스가 떠나면 다시 시작
  swiperContainer.addEventListener("mouseleave", () => {
    swiper.autoplay.start();
  });

  AOS.init({
    duration: 1200,
  });
  window.AOS = AOS;
});

['load', 'resize'].forEach((listener)=> {
  window.addEventListener(listener, ()=> {
    AOS.refresh();
  })
})
