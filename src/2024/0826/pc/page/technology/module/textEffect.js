import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export function textEffect() {
  gsap.registerPlugin(ScrollTrigger);

  let animateIn = null;

  const root = document.querySelector(".section--slogan .section__header");
  const elements = root.querySelectorAll(".section__title span");

  const innertHeight = root.getBoundingClientRect().height * 1.2;

  animateIn = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      scrub: 1,
      pin: root,
      end: () => `+=${innertHeight}`,
    },
  });

  elements.forEach((el, index) => {
    animateIn.fromTo(
      el,
      { clipPath: "inset(100% 0px 0 0px)" },
      {
        duration: 1,
        clipPath: "inset(0% 0px 0px 0px)",
        ease: "power2.out",
      },
      "ani",
    );
  });
}
