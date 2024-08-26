import Swiper from "swiper/bundle";
import AOS from "aos";
import "./stickyTab.js";

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
  });

  // 상품 swiper 적용
  const swiper2 = new Swiper(".swiper-01 .swiper-container", {
    loop: true,
    slidesPerView: 3,
    loopAdditionalSlides: 1,
    centeredSlides: true,
    slideActiveClass: "slide-active",
    speed: 600,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
    },
    spaceBetween: 2.3024 + "%",
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 슬라이더가 화면에 보이면 처음부터 시작
        swiper2.slideToLoop(0);
        swiper2.autoplay.start();
      } else {
        // 슬라이더가 화면에 보이지 않으면 멈춤
        swiper2.autoplay.stop();
      }
    });
  });

  // Swiper 컨테이너를 관찰
  observer.observe(document.querySelector(".swiper-01 .swiper-container"));

  const swiperContainer = document.querySelector(
    ".swiper-01 .swiper-container",
  );

  // swiper 위에 마우스가 올라가면 멈춤
  swiperContainer.addEventListener("mouseenter", () => {
    swiper2.autoplay.stop();
  });
  // swiper 위에 마우스가 떠나면 다시 시작
  swiperContainer.addEventListener("mouseleave", () => {
    swiper2.autoplay.start();
  });

  // AOS 초기화
  AOS.init({
    duration: 1200,
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add("is-animated");
          io.unobserve(target);
        }
      });
    },
    {
      root: null,
      threshold: 0.25,
      rootMargin: "0px",
    },
  );

  // data-io 속성이 있는 요소를 관찰
  const ioElements = document.querySelectorAll("[data-io]");
  ioElements.forEach((item) => {
    io.observe(item);
  });

  window.addEventListener("load", function () {
    AOS.refresh();
  });
  window.addEventListener("resize", function () {
    AOS.refresh();
  });
});

// tab menu
const tabListItems = document.querySelectorAll(".percent__tab-list li");
const tabBoxItems = document.querySelectorAll(".percent__tab-box li");

tabListItems.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabListItems.forEach((tab) => {
      tab.classList.remove("is-active");
    });
    tabBoxItems.forEach((box) => {
      box.classList.remove("is-active");
    });

    tab.classList.add("is-active");
    tabBoxItems[index].classList.add("is-active");
  });
});

// sticky tab nav
const stickyTab = initStickyTab2({
  rootSelector: "#stickyTab01",
  headerSelector: ".layout-header",
  endSelector: "#stickyEnd",
  speed: 500,
  onUpdate: (state) => {
    // state.scrollPosition이
  },
  onScrollEnd: (state) => {
    // console.log(state);
  },
});

window.onload = () => {
  console.log("window loaded");
  stickyTab.reInit();
};
