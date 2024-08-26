
import "./_includes/partials/gnb/script"
import Swiper from "swiper/bundle";

// dom 트리 로드시에 실행
document.addEventListener("DOMContentLoaded", function () {
  // main swiper 적용
  const swiper1 = new Swiper(".swiper-main .swiper-container", {
    loop: true,
    effect: "fade",
    speed: 600,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-main .swiper-pagination",
      type: "progressbar",
    },
  });
});
