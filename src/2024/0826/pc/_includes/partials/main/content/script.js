import { initCarousel } from "./carousel.js"; // 캐러셀 모듈 import

export function keywordSwiper() {
  const root = document.querySelector(".section--contents");
  const targets = root.querySelectorAll(".keyword");
  const tabButtons = root.querySelectorAll(".tab-button:not(.disabled)");

  // 각 탭의 캐러셀 초기화 함수
  function initTabCarousels() {
    targets.forEach((target) => {
      const carousel = target.querySelector("#carousel");
      const progressBar = target.querySelector("#carouselProgress");

      if (carousel && progressBar) {
        initCarousel(carousel, progressBar);
      }
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");

      tabButtons.forEach((btn) => btn.classList.remove("is-active"));
      targets.forEach((content) => content.classList.remove("is-active"));

      button.classList.add("is-active");
      const activeTab = document.getElementById(tabId);
      activeTab.classList.add("is-active");
    });
  });

  // 초기 캐러셀 초기화
  initTabCarousels();
}
