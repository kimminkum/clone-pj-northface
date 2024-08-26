export function initHeader() {
  const SCROLL_THRESHOLD = 50;
  const SCROLLED_CLASS = "is-scrolled";
  const HOVER_CLASS = "is-active";
  const TRANSPARENT_CLASS = "is-transparent";
  const ALWAYS_CLASS = "gnb-nav__item--depth";

  const header = document.querySelector(".layout-header");
  const dimmed = header.querySelector(".header-dimmed");
  const gnbBg = header.querySelector(".gnb-bg");
  const gnbItems = header.querySelectorAll(".gnb-nav__item");
  const addItems = header.querySelectorAll(".add-nav__item");
  const alwaysItem = header.querySelector(".always-active");
  const isTransparentPage = header.classList.contains(TRANSPARENT_CLASS);

  let lastScrollTop = 0;
  let isTransparent = isTransparentPage;

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    const isScrollingDown = scrollPosition > lastScrollTop;
    const isOverThreshold = scrollPosition > SCROLL_THRESHOLD;

    header.classList.toggle(SCROLLED_CLASS, isScrollingDown && isOverThreshold);

    if (scrollPosition <= 0) {
      header.classList.remove(SCROLLED_CLASS);
    }

    if (scrollPosition > 920) {
      if (isTransparentPage) {
        header.classList.remove(TRANSPARENT_CLASS);
      }
    } else {
      if (isTransparentPage) {
        header.classList.add(TRANSPARENT_CLASS);
      }
    }

    lastScrollTop = scrollPosition;
  };

  const hoverEvent = (e) => {
    const target = e.currentTarget;
    const subMenu = target.querySelector(".subnav");
    const left = subMenu?.getBoundingClientRect().left;

    if (subMenu) {
      header.style.setProperty("--subnav-left", left);
      target.classList.add(HOVER_CLASS);
    }

    if (target.classList.contains(ALWAYS_CLASS)) {
      alwaysItem.classList.add("is-active");
      dimmed.classList.add(HOVER_CLASS);
      gnbBg.classList.add(HOVER_CLASS);
    }

    // New code for addItems
    if (Array.from(addItems).includes(target)) {
      if (target.classList.contains(HOVER_CLASS)) {
        gnbBg.classList.add("is-active2");
        dimmed.classList.add(HOVER_CLASS);
        gnbBg.classList.add(HOVER_CLASS);
      } else {
        gnbBg.classList.remove("is-active2");
        dimmed.classList.remove(HOVER_CLASS);
        gnbBg.classList.remove(HOVER_CLASS);
      }
    }
  };

  const leaveEvent = (e) => {
    const target = e.currentTarget;
    const subMenu = target.querySelector(".subnav");
    if (subMenu) {
      target.classList.remove(HOVER_CLASS);
    }

    if (target.classList.contains(ALWAYS_CLASS)) {
      alwaysItem.classList.remove("is-active");
      dimmed.classList.remove(HOVER_CLASS);
      gnbBg.classList.remove(HOVER_CLASS);
    }

    if (Array.from(addItems).includes(target)) {
      gnbBg.classList.remove("is-active2");
      dimmed.classList.remove(HOVER_CLASS);
      gnbBg.classList.remove(HOVER_CLASS);
    }
  };

  const showHeaderBg = () => {
    if (!isTransparent) return;

    header.classList.remove(TRANSPARENT_CLASS);
    isTransparent = false;
  };

  const hideHeaderBg = () => {
    if (isTransparent) return;

    header.classList.add(TRANSPARENT_CLASS);
    isTransparent = true;
  };

  const init = () => {
    window.addEventListener("scroll", handleScroll);
    gnbItems.forEach((item) => {
      item.addEventListener("mouseenter", hoverEvent);
      item.addEventListener("mouseleave", leaveEvent);
    });
    addItems.forEach((item) => {
      item.addEventListener("mouseenter", hoverEvent);
      item.addEventListener("mouseleave", leaveEvent);
    });
    handleScroll();
  };

  init();

  return {
    init,
    showHeaderBg,
    hideHeaderBg,
  };
}
