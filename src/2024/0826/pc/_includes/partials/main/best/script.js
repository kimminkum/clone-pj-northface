import Swiper from "swiper/bundle";

export function bestSwiper() {
  const root = document.querySelector(".section--best");
  const target = root.querySelectorAll(".best");

  target.forEach((element) => {
    const swiper = new Swiper(element, {
      slidesPerView: "auto",
      initialSlide: 0,
      speed: 800,
      spaceBetween: 10,

      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
    });
  });
}
