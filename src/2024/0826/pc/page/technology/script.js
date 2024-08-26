import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Lenis from "lenis";
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

import { horizontalScrolling } from "./module/horizontalScrolling";
import { textEffect } from "./module/textEffect";
import { lnbMenu } from "./module/technologyLnb";
import { initEcology } from "./module/ecologyEffect";
horizontalScrolling();
textEffect();
lnbMenu();
initEcology();
window.scrollTo(0, 0);

import ContentsScroll from "./module/contentsScroll";
const contentsScroll = new ContentsScroll({
  panelSelector: ".scroll-contents__item",
  textSelector: ".scroll-contents__txt",
  imageSelector: ".scroll-contents__bg",
  hideClass: "hide",
});
contentsScroll.init();

document.addEventListener("DOMContentLoaded", function () {
  const sectionIntro = document.querySelector(".section-intro");
  const imageBox = document.querySelector(".video-wrap");
  //intro 애니메이션
  sectionIntro.classList.add("is-active");

  const initImageBoxScrollAnimation = () => {
    gsap.set(imageBox, {
      clipPath: "inset(0px 2.08333%)",
      willChange: "clip-path",
      // invalidateOnRefresh: true,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionIntro,
        start: "top top",
        end: "bottom 120%",
        scrub: 1,
        // markers: true,
      },
    });

    tl.to(imageBox, {
      clipPath: "inset(0px 0%)",
      ease: "power2.inOut",
      duration: 0.6,
    }).to(imageBox, {
      duration: 0.4,
      onUpdate: function () {
        gsap.set(imageBox, { clipPath: "inset(0px 0%)" });
      },
    });
  };

  initImageBoxScrollAnimation();
});

let animationTimeline;

ScrollTrigger.create({
  trigger: "#section2",
  start: "top bottom",
  end: "+=100%",
  onUpdate: (self) => {
    // progress를 0에서 1 사이의 값으로 제한
    const progress = Math.min(Math.max(self.progress, 0), 1);

    if (progress >= 1) {
      if (!animationTimeline) {
        // 새로운 타임라인 생성 (한 번만)
        animationTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#section2",
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: 0.5, // 스크럽 값을 1로 설정하여 더 부드럽게 만듭니다
            pinSpacing: false,
            anticipatePin: 1, // 핀 효과를 조금 더 일찍 시작합니다
            onEnter: () => console.log("Entered"),
            onLeave: () => console.log("Left"),
            onEnterBack: () => console.log("Entered Back"),
            onLeaveBack: () => console.log("Left Back"),
          },
        });

        // 부드러운 전환을 위한 애니메이션 추가
        animationTimeline.to("#section2", {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });

        console.log("Timeline created");
      }
    } else {
      self.trigger.style.setProperty("--progress", progress.toFixed(3));
    }
  },
  onEnter: (self) => {
    console.log("Main trigger entered");
  },
  onLeave: (self) => {
    console.log("Main trigger left");
  },
  onEnterBack: (self) => {
    console.log("Main trigger entered back");
  },
  onLeaveBack: (self) => {
    console.log("Main trigger left back");
    // 타임라인 리셋
    if (animationTimeline) {
      animationTimeline.scrollTrigger.kill();
      animationTimeline = null;
      console.log("Timeline reset");
    }
  },
});

// CSS 트랜지션 추가
gsap.set("#section2", {
  transition: "all 0.3s ease-out",
});

ScrollTrigger.create({
  trigger: "#section4",
  start: "top bottom",
  end: "+=100%",
  onUpdate: (self) => {
    self.trigger.style.setProperty("--progress", self.progress.toFixed(3));
  },
});
