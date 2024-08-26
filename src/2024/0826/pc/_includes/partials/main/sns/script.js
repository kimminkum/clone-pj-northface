import Swiper from "swiper/bundle";

export function snsSwiper() {
  const root = document.querySelector(".section--sns");
  const target = root.querySelectorAll(".sns");

  target.forEach((element) => {
    const swiper = new Swiper(element, {
      spaceBetween: 10,
      freeMode: false,
      enteredSlides: true,
      speed: 3500,
      autoplay: {
        delay: 1,
      },
      loop: true,
      slidesPerView: "auto",
      allowTouchMove: false,
      disableOnInteraction: true,
      loopedSlides: 1,
    });
  });
}
