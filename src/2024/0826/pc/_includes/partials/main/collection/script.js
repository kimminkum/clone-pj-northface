import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export function collectionScrolling() {
  gsap.registerPlugin(ScrollTrigger);

  const root = document.querySelector(".section--collection");
  const inner = root.querySelector(".inner");

  // 새로운 애니메이션 추가
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top center", // 루트 요소의 상단이 뷰포트의 중앙에 도달했을 때 시작
      end: "+=300", // 애니메이션 지속 시간 조절
      scrub: 1,
    },
  });

  // 기존 애니메이션
  tl.to(
    inner,
    {
      x: () => -(inner.scrollWidth - window.innerWidth) + "px",
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${inner.offsetWidth}`,
        pin: root,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    },
    ">=0",
  ); // 이전 애니메이션이 완료된 후 시작
}
