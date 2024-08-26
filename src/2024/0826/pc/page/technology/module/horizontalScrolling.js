import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export function horizontalScrolling() {
  gsap.registerPlugin(ScrollTrigger);

  setupHorizontalScroll(".section--heat-line", animateHeatLine);
  setupHorizontalScroll(".section--goose-down", animateGooseDown);
}

function setupHorizontalScroll(selector, animationCallback) {
  const section = document.querySelector(selector);
  const inner = section.querySelector(".horizontal-scrolling__inner");

  const horizontalScroll = gsap.to(inner, {
    x: () => -(inner.scrollWidth - window.innerWidth) + "px",
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${inner.offsetWidth}`,
      pin: section,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  animationCallback(section, horizontalScroll);
}

function animateHeatLine(section, horizontalScroll) {
  const elements = section.querySelectorAll(".card");

  let animateIn = null;
  let classAdded = false;
  animateIn = gsap.timeline({
    scrollTrigger: {
      trigger: section.querySelector(".card-wrap"),
      containerAnimation: horizontalScroll,
      start: "left right",
      scrub: 0.7,
    },
  });

  elements.forEach((el, index) => {
    const elementsImg = el.querySelector(".card__image");

    if (index === 0) {
      animateIn.fromTo(
        elementsImg,
        { clipPath: "inset(0% 0% 0% 100%)", x: "100px" },
        {
          duration: 4,
          clipPath: "inset(0% 0px 0px 0%)",
          x: "0",
          ease: "power2.out",
        },
        "ani",
      );
    } else if (index === 1) {
      animateIn.fromTo(
        elementsImg,
        { clipPath: "inset(0% 0% 90% 0%)", x: "200px" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          x: "0",
          ease: "power1.out",
          duration: 4,
        },
        "ani",
      );
    } else if (index === 2) {
      animateIn.fromTo(
        elementsImg,
        { clipPath: "inset(0px 0% 0% 100%)", x: "100px" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          x: "0",
          ease: "power1.out",
          duration: 4,
          delay: 1.5,
        },
        "ani",
      );
    } else if (index === 3) {
      animateIn.fromTo(
        elementsImg,
        { clipPath: "inset(0% 0% 60% 0%)", x: "200px" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          x: "0",
          ease: "power2.out",
          duration: 4,
          delay: 1,
          onUpdate: function () {
            const progress = this.progress();
            if (progress >= 0.4 && !classAdded) {
              el.classList.add("is-ani");
              classAdded = true;
            } else if (progress < 0.4 && classAdded) {
              el.classList.remove("is-ani");
              classAdded = false;
            }
          },
        },
        "ani",
      );
    } else if (index === 4) {
      animateIn.fromTo(
        elementsImg,
        {
          clipPath: "inset(0px 0% 0% 80%)",
          transform: "translate3d(70% , 0 , 0px)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          transform: "translate3d(0,0px , 0px)",
          ease: "power2.out",
          duration: 4,
          delay: 3,
          // onUpdate: function () {
          //   const progress = this.progress();
          //   if (progress >= 0.2 && !classAdded) {
          //     el.classList.add("is-ani");
          //     classAdded = true;
          //   } else if (progress < 0.2 && classAdded) {
          //     el.classList.remove("is-ani");
          //     classAdded = false;
          //   }
          // },
        },
        "ani",
      );
    } else if (index === 5) {
      animateIn.fromTo(
        elementsImg,
        {
          clipPath: "inset(80% 0% 0% 0%)",
          transform: "translate3d(0px,20px , 0px)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          transform: "translate3d(0px,0px , 0px)",
          ease: "power2.out",
          duration: 4,
          delay: 2,
        },
        "ani",
      );
    }
  });
}

function animateGooseDown(section, horizontalScroll) {
  const elements = section.querySelectorAll(".card");

  elements.forEach((el) => {
    const topic = el.querySelector(".card__topic");
    const inner = el.querySelector(".card__inner");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        containerAnimation: horizontalScroll,
        start: "left right",
        end: "center center",
        scrub: 1,
      },
    });

    // Animate card__topic
    timeline.fromTo(
      topic,
      { x: "-15%", duration: 5 },
      { x: 0, duration: 5, ease: "power3.out" },
      0,
    );

    // Animate card__inner with 1 second delay
    timeline.fromTo(
      inner,
      { x: "10%", duration: 20 },
      { x: 0, duration: 20, ease: "linear" },
      3, //delay
    );
  });
}
