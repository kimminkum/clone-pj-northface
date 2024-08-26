import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";

export function lnbMenu() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);
  const navigationEffect = {
    target: document.querySelector(".lnb-inner"),
    sectionEcology: document.querySelector(".section-ecology"),
    sectionEcologyHeader: null,
    sections: document.querySelectorAll(".floating-section .section"),
    lnbItems: document.querySelectorAll(".lnb-inner .lnb-item"),
    headerHeight: 88, //헤더 높이추가

    setLnbPosition: function () {
      if (!this.sectionEcologyHeader) {
        this.sectionEcologyHeader =
          this.sectionEcology.querySelector(".section__header");
      }

      const headerHeight = this.sectionEcologyHeader.offsetHeight;
      const lnbHeight = this.target.offsetHeight;
      const marginTop = headerHeight - (lnbHeight + 40);

      this.target.style.marginTop = `${marginTop}px`;
    },

    onInitBeforeLoad: function () {
      this.setLnbPosition();

      const links = document.querySelectorAll(".lnb__link");
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
            const targetOffsetY = targetSection.getBoundingClientRect().top + currentScrollY;
            const isScrollingUp = targetOffsetY < currentScrollY;

            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: targetSection,
                offsetY: isScrollingUp ? this.headerHeight : -1,
                autoKill: false,
              },
              ease: "power2.inOut",
              onComplete: () => {
                setTimeout(() => this.updateActiveState(), 50);
              },
            });
          }
        });
      });
    },

    onInit: function () {
      this.onScroll();
      this.setLnbPosition();
    },

    onResize: function () {
      this.onScroll();
      this.setLnbPosition();
    },

    updateActiveState: function () {
      const viewportMiddle = window.innerHeight / 2;
      let activeIndex = -1;

      this.sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          activeIndex = index;
        }
      });

      this.lnbItems.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
        }
      });
    },

    onScroll: function () {
      const floatingWrap = document.querySelector(".floating-section");
      let offsetY =
        floatingWrap.getBoundingClientRect().top + window.pageYOffset;
      let floatingWrapHeight = floatingWrap.offsetHeight;
      let viewportHeight = window.innerHeight;
      let scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const lastSection = document.querySelector("#rdsgoosedown");
      let lastSectionY =
        lastSection.getBoundingClientRect().top + window.pageYOffset;

      let isEndOfFloatingSection =
        scrollY + viewportHeight >= offsetY + floatingWrapHeight;

      if (scrollY >= offsetY && !isEndOfFloatingSection) {
        this.target.classList.add("is-fixed");
        this.target.classList.remove("is-end");
      } else if (isEndOfFloatingSection) {
        this.target.classList.remove("is-fixed");
        this.target.classList.add("is-end");
      } else {
        this.target.classList.remove("is-fixed");
        this.target.classList.remove("is-end");
      }

      this.updateActiveState();
    },
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedScroll = debounce(() => navigationEffect.onScroll(), 10);
  const debouncedResize = debounce(() => navigationEffect.onResize(), 100);

  function onScroll() {
    requestAnimationFrame(debouncedScroll);
  }

  function onResize() {
    requestAnimationFrame(debouncedResize);
  }

  function onInitBeforeLoad() {
    navigationEffect.onInitBeforeLoad();
  }

  function onInitAfterLoad() {
    navigationEffect.onInit();
  }

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onInitAfterLoad);
  document.addEventListener("DOMContentLoaded", onInitBeforeLoad);

  return {
    onInitBeforeLoad,
    onInitAfterLoad,
    onScroll,
    onResize,
  };
}

