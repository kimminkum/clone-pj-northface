import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export function initEcology() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  const ecologyContainer = document.querySelector(
    ".section-ecology__container",
  );
  const ecologyBody = ecologyContainer.querySelector(".section-ecology__body");
  const ecologySections = ecologyBody.querySelectorAll(".content");
  const ecologyBackgroundItems = ecologyContainer.querySelectorAll(
    ".section__bg-wrap div",
  );

  // 초기 설정
  gsap.set(ecologyBackgroundItems, { opacity: 0, scale: 1.1 });
  gsap.set(ecologyBackgroundItems[0], { opacity: 1, scale: 1 });
  gsap.set(ecologyBody, { y: 0 });

  let currentIndex = 0;

  // 전체 섹션 고정
  ScrollTrigger.create({
    trigger: ecologyContainer,
    start: "top top",
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
    scrub: 1,
  });

  // 컨텐츠 애니메이션
  const contentAnimation = gsap.to(ecologyBody, {
    y: () => -(ecologyBody.offsetHeight - window.innerHeight),
    ease: "none",
    scrollTrigger: {
      trigger: ecologyContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  // 배경 전환 함수
  function changeBackground(newIndex) {
    if (newIndex !== currentIndex) {
      gsap.to(ecologyBackgroundItems[currentIndex], {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: "power2.in",
      });
      gsap.to(ecologyBackgroundItems[newIndex], {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      currentIndex = newIndex;
    }
  }

  // 배경 이미지 및 섹션 애니메이션
  ecologySections.forEach((section, index) => {
    const sectionHeader = section.querySelector(".content__header");
    const sectionThumbnails = section.querySelectorAll(".card");

    // 배경 이미지 애니메이션
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => changeBackground(index),
      onEnterBack: () => changeBackground(index),
      onLeave: () => {
        if (index < ecologySections.length - 1) {
          changeBackground(index + 1);
        }
      },
      onLeaveBack: () => {
        if (index > 0) {
          changeBackground(index - 1);
        }
      },
    });

    // 헤더 애니메이션
    gsap.from(sectionHeader, {
      y: 100,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "top 20%",
        scrub: 2,
        containerAnimation: contentAnimation,
      },
    });

    // 썸네일 애니메이션
    sectionThumbnails.forEach((thumbnail) => {
      gsap.from(thumbnail, {
        y: 100,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 30%",
          scrub: 2,
          containerAnimation: contentAnimation,
        },
      });
    });
  });
}
