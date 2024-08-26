import AOS from "aos";

export function aosInit() {
  //AOS
  AOS.init({
    duration: 1200,
    once: true,
  });

  IntersectionObserver;
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
}
