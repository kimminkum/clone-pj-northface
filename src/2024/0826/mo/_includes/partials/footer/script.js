export function initFooter() {
  const btnWrap = document.querySelector(".footer__button-wrap");
  const topBtn = document.querySelector(".footer__button--top");
  const footer = document.querySelector(".footer");
  // const bottomBar = document.querySelector(".footer__bottom-bar");
  // const bottomLnb = document.querySelector(".floating-lnb");

  const ACTIVE_CLASS = "is-active";
  const FIX_CLASS = "is-fix";

  const handleScroll = () => {
    const footerHeight = footer.offsetHeight;
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    topBtn.classList.toggle(ACTIVE_CLASS, scrollPosition > 50);
    // const isBottomReached =
    //   documentHeight - footerHeight <= scrollPosition + windowHeight;
    // btnWrap.classList.toggle(FIX_CLASS, isBottomReached);
    // bottomBar.classList.toggle(FIX_CLASS, isBottomReached);
    // bottomLnb.classList.toggle(FIX_CLASS, isBottomReached);

  //   if (isBottomReached) {
  //     btnWrap.style.bottom = `${footerHeight}px`;
  //   } else {
  //     btnWrap.style.bottom = "";
  //   }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addEventListeners = () => {
    window.addEventListener("scroll", handleScroll);
    topBtn.addEventListener("click", scrollToTop);
  };

  const init = () => {
    addEventListeners();
    handleScroll();
  };

  init();

  return { init };
}
