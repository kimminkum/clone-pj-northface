import Lenis from "lenis";
import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

import { aosInit } from "../../assets/js/aos";

(function () {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  gsap.registerPlugin(ScrollTrigger);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const initLookbookheaderTimeline01 = () => {
    const header = document.querySelector(".section-02 .scrolling-header");
    let lookbookDetailTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: "top top",
        end: "+=1000",
        scrub: true,
        pin: header,
      },
    });

    lookbookDetailTimeline
      .to(header.querySelectorAll(".reveal__text"), {
        ease: "none",
        // y: 0,
        // delay: 2,
        duration: 1,
        onComplete: () => {
          header
            .querySelectorAll(".reveal__text")
            .forEach((el) => el.classList.add("is-active"));
        },
        onReverseComplete: () => {
          header
            .querySelectorAll(".reveal__text")
            .forEach((el) => el.classList.remove("is-active"));
        },
      })
      .to(header.querySelectorAll(".section__header-cover"), {
        ease: "none",
        x: 0,
        duration: 20,
        delay: 2,
      })
      .to(header.querySelectorAll(".section__header-cover"), {
        duration: 4,
      })
      .to(header.querySelector(".section__header-inner"), {
        ease: "none",
        y: function (index, target) {
          let elementHeight = target.offsetHeight;
          let percentageMove = (-500 / elementHeight) * 100;
          return percentageMove + "%";
        },
        delay: 2,
        duration: 8,
      });
  };

  const initLookbookProductTimeline01 = () => {
    const root = document.querySelector(".section-03");
    const items = root.querySelectorAll(".scrolling-section");
    items.forEach((item, index) => {
      let lookbookProductTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: item.querySelector(".scrolling-image"),
          start: "top top",
          end: "+=800",
          scrub: true,
          // pin: scrollSection,
        },
      });

      lookbookProductTimeline
        .to(item.querySelector(".scrolling-prd"), {
          ease: "none",
          y: "-50%",
          duration: 4,
        })
        .to(
          item.querySelector(".scrolling-image .image-box--02"),
          {
            ease: "none",
            opacity: 1,
            duration: 2,
          },
          "-=3",
        );
    });
  };
  const initLookbookheaderTimeline02 = () => {
    const header = document.querySelector(".section-05 .scrolling-header");
    let lookbookDetailTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: "top top",
        end: "+=1000",
        scrub: true,
        pin: header,
      },
    });

    lookbookDetailTimeline
      .to(header.querySelectorAll(".reveal__text"), {
        ease: "none",
        duration: 1,
        onComplete: () => {
          header
            .querySelectorAll(".reveal__text")
            .forEach((el) => el.classList.add("is-active"));
        },
        onReverseComplete: () => {
          header
            .querySelectorAll(".reveal__text")
            .forEach((el) => el.classList.remove("is-active"));
        },
      })
      .to(header.querySelectorAll(".section__header-cover"), {
        ease: "none",
        x: 0,
        duration: 20,
        delay: 2,
      })
      .to(header.querySelectorAll(".section__header-cover"), {
        duration: 4,
      })
      .to(header.querySelector(".section__header-inner"), {
        ease: "none",
        y: function (index, target) {
          let elementHeight = target.offsetHeight;
          let percentageMove = (-500 / elementHeight) * 100;
          return percentageMove + "%";
        },
        delay: 2,
        duration: 8,
      });
  };
  const initLookbookProductTimeline02 = () => {
    const root = document.querySelector(".section-06");
    const items = root.querySelectorAll(".scrolling-section");
    items.forEach((item, index) => {
      let lookbookProductTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: item.querySelector(".scrolling-image"),
          start: "top top",
          end: "+=800",
          scrub: true,
        },
      });

      lookbookProductTimeline.to(item.querySelector(".scrolling-prd"), {
        ease: "none",
        x: "0%",
        y: "-50%",
        duration: 4,
      });
    });
  };

  const setScrollingSectionHeight = () => {
    const scrollingImages = document.querySelectorAll(".scrolling-image");
    const scrollingSectionInners = document.querySelectorAll(
      ".scrolling-section__inner",
    );
    const scrollingInners = document.querySelectorAll(".scrolling-inner");

    scrollingImages.forEach((scrollingImage) => {
      // .scrolling-section__inner 높이 설정
      const parentSectionInner = scrollingImage.closest(
        ".scrolling-section__inner",
      );
      if (parentSectionInner) {
        parentSectionInner.style.height = `${scrollingImage.offsetHeight}px`;
      }

      // .scrolling-inner 높이 설정
      const parentInner = scrollingImage.closest(".scrolling-inner");
      if (parentInner) {
        parentInner.style.height = `${scrollingImage.offsetHeight}px`;
      }
    });
  };

  const debouncedSetScrollingSectionHeight = debounce(
    setScrollingSectionHeight,
    300,
  );

  aosInit();

  initLookbookheaderTimeline01();
  initLookbookProductTimeline01();
  initLookbookheaderTimeline02();
  initLookbookProductTimeline02();
  setScrollingSectionHeight();

  window.addEventListener("load", setScrollingSectionHeight);
  window.addEventListener("resize", debouncedSetScrollingSectionHeight);
})();
