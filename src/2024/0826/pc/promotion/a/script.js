import AOS from "aos";
import Swiper from "swiper";
import { Mousewheel, Autoplay, Navigation, Pagination } from "swiper/modules";

class TabAnchorScroll {
  constructor(element, arg) {
    let root;
    if (typeof element === "string") {
      root = document.querySelector(element);
    } else if (element instanceof HTMLElement) {
      root = element;
    }

    if (!root || !(root instanceof HTMLElement)) {
      console.log(`대상( ${root} ) 존재하지 않습니다.`);
      return false;
    }

    this.root = root;
    this.options = {
      tabSelector: ".event-tab-item",
      buttonSelector: ".event-tab-link",
      activeClass: "is-active",
      ...arg,
    };
    this.activeIndex = null;
    this.tabs = this.root.querySelectorAll(this.options.tabSelector);
    this.panels =
      this.tabs &&
      Array.from(this.tabs).reduce((acc, current, index) => {
        const button = current.querySelector(this.options.buttonSelector);
        const panelElement = button.hash && document.querySelector(button.hash);

        if (panelElement) {
          const isSticky =
            window
              .getComputedStyle(panelElement)
              .getPropertyValue("position") === "sticky";
          let anchor = panelElement;
          if (isSticky) {
            panelElement.insertAdjacentHTML(
              "beforebegin",
              `<div data-tab-panel="${button.hash}-anchor" style="width:100%;height: 0; opacity: 0"></div>`,
            );
            anchor = document.querySelector(
              `[data-tab-panel="${button.hash}-anchor"]`,
            );
          }
          acc.push({
            selector: button.hash,
            element: panelElement,
            anchor: anchor,
          });
        }
        return acc;
      }, []);

    if (!this.tabs.length || this.tabs.length !== this.panels.length) {
      return false;
    }

    // 탭 클릭
    this.tabs.forEach((tab, index) => {
      const button = tab.querySelector(this.options.buttonSelector);
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const panelElement = button.hash && document.querySelector(button.hash);
        if (panelElement) {
          this.scrollToPanel(panelElement);
        }
      });
    });

    window.addEventListener("scroll", () => {
      let newActiveIndex;
      this.panels.forEach((panel, index) => {
        const headerHeight = parseInt(
          getComputedStyle(this.root).getPropertyValue(
            "--visible-header-height",
          ),
          10,
        );
        const tabHeight = this.root.getBoundingClientRect().height;
        const offsetTop =
          panel.anchor.getBoundingClientRect().top + window.pageYOffset;
        const startPoint = Math.floor(offsetTop - tabHeight - headerHeight);
        const endPoint =
          startPoint + panel.element.getBoundingClientRect().height;
        if (this.options.firstTabOn && index === 0 && scrollY <= startPoint) {
          newActiveIndex = index;
        } else if (scrollY >= startPoint && scrollY < endPoint) {
          newActiveIndex = index;
        }
      });

      if (typeof newActiveIndex === "number" && !isNaN(newActiveIndex)) {
        this.tabSelect(newActiveIndex);
      } else {
        this.tabSelect();
      }
    });

    window.setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    }, 500);
  }
  scrollToPanel(element) {
    const { panels } = this;
    const panel = panels.find((info) => info.element === element);
    const offsetTop =
      panel.anchor.getBoundingClientRect().top + window.pageYOffset;
    const tabHeight = this.root.getBoundingClientRect().height;
    const headerHeight = parseInt(
      getComputedStyle(this.root).getPropertyValue("--header-height"),
      10,
    );
    let scrollTo = offsetTop - tabHeight;
    if (window.scrollY > scrollTo) {
      scrollTo -= headerHeight;
    }

    window.scrollTo({
      top: scrollTo,
      left: 0,
      behavior: "smooth",
    });
  }
  tabSelect(idx) {
    const { activeIndex, options } = this;
    if (activeIndex !== idx) {
      this.tabs.forEach((tab, index) => {
        if (index === idx) {
          tab.classList.add(options.activeClass);
        } else {
          tab.classList.remove(options.activeClass);
        }
      });
      this.activeIndex = idx;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // main flow swiper
  const visualSwiper01 = new Swiper(".a-main-swiper-01 .swiper-container", {
    modules: [Autoplay],
    slidesPerView: "auto",
    effect: "slide",
    speed: 2500,
    centeredSlides: true,
    loop: true,
    parallax: true,
    allowTouchMove: false,
  });

  const visualSwiper02 = new Swiper(".a-main-swiper-02 .swiper-container", {
    modules: [Autoplay],
    slidesPerView: "auto",
    effect: "slide",
    speed: 2500,
    centeredSlides: true,
    loop: true,
    parallax: true,
    allowTouchMove: false,
  });
  window.setTimeout(() => {
    visualSwiper01.params.autoplay.delay = 0;
    visualSwiper02.params.autoplay.delay = 0;
    visualSwiper01.autoplay.start();
    visualSwiper02.autoplay.start();
  }, 1500);

  // swiper
  const swiper1 = new Swiper(".oneday-swiper .swiper-container", {
    modules: [Mousewheel, Pagination, Navigation, Autoplay],
    slidesPerView: "auto",
    loop: true,
    loopAdditionalSlides: 1,
    speed: 600,
    observer: true,
    observeParents: true,
    slidesOffsetBefore: -76,
    spaceBetween: 0 + "%",
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 슬라이더가 화면에 보이면 처음부터 시작
        swiper1.slideToLoop(0);
        swiper1.autoplay.start();
      } else {
        // 슬라이더가 화면에 보이지 않으면 멈춤
        swiper1.autoplay.stop();
      }
    });
  });

  const swiper2 = new Swiper(".best-swiper .swiper-container", {
    modules: [Mousewheel, Pagination, Navigation, Autoplay],
    slidesPerView: 1,
    loop: true,
    loopAdditionalSlides: 1,
    speed: 600,
    observer: true,
    observeParents: true,
    spaceBetween: 0 + "%",
    autoplay: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        const root = document.querySelector(".best-swiper");
        const textSwiperElement = root.querySelector(".swiper-texts");
        const items = textSwiperElement.querySelectorAll(".swiper-text");
        items[this.realIndex].classList.add("active");
      },
      slideChange: function (e) {
        const root = document.querySelector(".best-swiper");
        const textSwiperElement = root.querySelector(".swiper-texts");
        const items = textSwiperElement.querySelectorAll(".swiper-text");
        items.forEach((item, index) => {
          if (this.realIndex === index) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      },
    },
  });

  // tab 클릭시 해당 slide 활성화
  const tabButton = document.querySelectorAll(".best-tab-item");
  tabButton.forEach((tabButton, index) => {
    tabButton.addEventListener("click", () => {
      swiper2.slideToLoop(index);
    });
  });

  const swiper3 = new Swiper(".lucky-swiper .swiper-container", {
    modules: [Mousewheel, Pagination, Navigation, Autoplay],
    slidesPerView: 4.26139,
    loop: true,
    centeredSlides: false,
    loopAdditionalSlides: 1,
    speed: 600,
    observer: true,
    observeParents: true,
    spaceBetween: +2.08333333 + "%",
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    autoplay: false,
  });

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

new TabAnchorScroll(document.querySelector("#stickyTab01"), {
  tabSelector: ".sticky-tab__item",
  buttonSelector: ".sticky-tab__link",
  activeClass: "is-active",
  firstTabOn: true,
  skipTabmove: true,
});
