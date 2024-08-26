import Swiper from "swiper/bundle";
import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

(function () {
  const lookBookListSwiper = document.querySelectorAll(
    ".lookbook-list__content",
  );
  const swiperSlider = [];
  lookBookListSwiper.forEach(function (item, index) {
    const swiperOptions = {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 0,
      speed: 20000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
    };

    if (index === 2) {
      swiperOptions.speed = 33000;
    }

    const listSwiper = new Swiper(
      item.querySelector(".lookbook-list__swiper"),
      swiperOptions,
    );
    swiperSlider.push(listSwiper);
  });

  const initLookbookListTimeline = () => {
    let lookbookListTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".lookbook-list__item--scroll--01",
        start: "top 60%",
        end: "+=1300",
        scrub: true,
      },
    });
    lookbookListTimeline
      .to(".lookbook-list__item--scroll--02", {
        ease: "none",
        y: "0",
        duration: 1,
      })
      .to(".lookbook-list__content-cover", {
        ease: "none",
        y: "0",
        duration: 1,
      });
  };

  initLookbookListTimeline();
})();
