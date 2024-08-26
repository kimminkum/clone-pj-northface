import { aosInit } from "./assets/js/aos";
import { bannerSwiper } from "./_includes/partials/main/banner/script";
import { keywordSwiper } from "./_includes/partials/main/content/script";
import { collectionScrolling } from "./_includes/partials/main/collection/script";
import { bestSwiper } from "./_includes/partials/main/best/script";
import { snsSwiper } from "./_includes/partials/main/sns/script";

import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  aosInit();

  bannerSwiper();
  keywordSwiper();
  collectionScrolling();
  bestSwiper();
  snsSwiper();
});
