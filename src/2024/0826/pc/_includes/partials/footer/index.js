export function initFooter() {
  const footer = document.querySelector(".footer");
  const btnWrap = footer.querySelector(".footer-fix");
  const topBtn = footer.querySelector(".button--top");

  const ACTIVE_CLASS = "is-active";
  const FIX_CLASS = "is-fix";

  const handleScroll = () => {
    if (!footer || !btnWrap || !topBtn) return;
    const footerHeight = footer.offsetHeight;
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    topBtn.classList.toggle(ACTIVE_CLASS, scrollPosition > 50);
    const isBottomReached =
      documentHeight - footerHeight <= scrollPosition + windowHeight;
    btnWrap.classList.toggle(FIX_CLASS, isBottomReached);

    if (isBottomReached) {
      btnWrap.style.bottom = `${footerHeight}px`;
    } else {
      btnWrap.style.bottom = "";
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addEventListeners = () => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    topBtn?.addEventListener("click", scrollToTop);
  };

  const init = () => {
    addEventListeners();
    handleScroll();
  };

  init();

  return { init };
}
