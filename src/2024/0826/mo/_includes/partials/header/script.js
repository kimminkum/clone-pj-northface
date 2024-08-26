export function initHeader() {
  const header = document.querySelector(".layout-header");
  const headerItems = header.querySelectorAll(".layout-header__menu-item");
  const SCROLLED_CLASS = "is-scrolled";
  const SCROLL_THRESHOLD = 50;
  const HOVER_CLASS = "is-active";
  const CHANGE_THRESHOLD = 150;

  let lastScrollTop = 0;
  let isScrollingUp = false;

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    const isScrollingDown = scrollPosition > lastScrollTop;
    const isOverThreshold = scrollPosition > SCROLL_THRESHOLD;

    isScrollingUp = !isScrollingDown;
    header.classList.toggle(SCROLLED_CLASS, isScrollingDown && isOverThreshold);

    if (scrollPosition <= 0) {
      header.classList.remove(SCROLLED_CLASS);
      header.classList.remove("is-change");
    } else if (isScrollingUp && scrollPosition > 0) {
      header.classList.add("is-change");
    } else {
      header.classList.remove("is-change");
    }

    lastScrollTop = scrollPosition;
  };

  const hoverEvent = (e) => {
    const target = e.currentTarget;
    const subMenu = target.querySelector(".layout-header__submenu");
    if (subMenu) {
      target.classList.add(HOVER_CLASS);
    }
  };

  const leaveEvent = (e) => {
    const target = e.currentTarget;
    const subMenu = target.querySelector(".layout-header__submenu");
    if (subMenu) {
      target.classList.remove(HOVER_CLASS);
    }
  };

  //240822 추가 header 클래스 제어
  function checkMainClass() {
    const mainElement = document.querySelector("main");
    if (mainElement && !mainElement.classList.contains("page-main")) {
      header.classList.add("subpage-header");
      if (mainElement.classList.contains("page-tech")) {
        header.classList.add("is-black");
      }
      if (mainElement.classList.contains("page-list")) {
        header.classList.add("subpage-header--plp");
      }

      if (mainElement.classList.contains("page-look-list")) {
        header.classList.add("subpage-header--lb");
        // document
        //   .querySelector(".subpage-header--lb .layout-header__logo-link")
        //   .setAttribute("href", "../../index.html");
      }
    } else {
      header.classList.remove("subpage-header");
    }
  }

  function init() {
    window.addEventListener("scroll", handleScroll);
    headerItems.forEach((item) => {
      item.addEventListener("mouseenter", hoverEvent);
      item.addEventListener("mouseleave", leaveEvent);
    });
    handleScroll();
    checkMainClass();

    const backButton = header.querySelector(".subpage-header .btn-mob-back");
    if (backButton) {
      backButton.addEventListener("click", () => {
        window.history.back();
        document.querySelector(".gnb").classList.remove("active");
      });
    }
  }

  init();

  return { init };
}
