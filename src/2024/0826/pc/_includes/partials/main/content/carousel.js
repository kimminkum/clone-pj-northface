export function initCarousel(carouselElement, progressBarElement) {
  const carousel = carouselElement;
  const progressBar = progressBarElement;
  let currentIndex = 0;
  let realIndex = 0;
  let startX;
  let isInteracting = false;
  let loopCount = 0;
  let cloneCount = 3;

  const slides = Array.from(carousel.children);
  const totalSlides = slides.length;

  // Clone slides
  for (let i = 0; i < 5; i++) {
    slides.forEach((slide, index) => {
      const clone = slide.cloneNode(true);
      clone.classList.add("carousel-clone");
      carousel.appendChild(clone);
    });
  }

  const allSlides = Array.from(carousel.children);

  function updateCarousel(animate = true) {
    const slideWidth = 328;
    const activeSlideWidth = 520;
    const gap = 10;
    const offset = currentIndex * (slideWidth + gap);
    const isLastTransition = realIndex === totalSlides - 1 && loopCount === 0;
    const normalizedIndex = currentIndex % totalSlides;
    realIndex = normalizedIndex;

    // console.log(realIndex);

    carousel.style.transition =
      animate && !isLastTransition ? "transform 0.3s ease-out" : "none";
    carousel.style.transform = `translateX(-${offset}px)`;

    allSlides.forEach((slide, index) => {
      const isActive =
        (index - currentIndex + allSlides.length) % allSlides.length === 0;
      slide.style.width = isActive
        ? `${activeSlideWidth}px`
        : `${slideWidth}px`;
      slide.classList.toggle("is-active", isActive);
    });

    // Update progress bar

    progressBar.style.width = `${((normalizedIndex + 1) / totalSlides) * 100}%`;
  }

  function setCurrentIndex(index, animate = true) {
    let previousIndex = currentIndex;
    currentIndex = index;

    if (
      previousIndex % totalSlides === totalSlides - 1 &&
      currentIndex % totalSlides === 0
    ) {
      loopCount++;
    }

    updateCarousel(animate);

    // // Reset position if needed
    console.log(currentIndex, totalSlides, loopCount, cloneCount);
    if (currentIndex > previousIndex) {
      if (currentIndex >= 5 * totalSlides) {
        currentIndex = cloneCount * totalSlides;
        loopCount = 0;
        carousel.addEventListener(
          "transitionend",
          () => {
            allSlides[previousIndex].classList.remove("is-active");
            allSlides[currentIndex].classList.add("is-active");
            allSlides[currentIndex].style.width = `520px`;
            allSlides[currentIndex].classList.add("remove-active");

            updateCarousel(false);

            setTimeout(() => {
              allSlides[currentIndex].classList.remove("remove-active");
            });
          },
          { once: true },
        );
      }
    } else {
      if (currentIndex < totalSlides) {
        currentIndex = cloneCount * totalSlides - 1;
        loopCount = 0;
        carousel.addEventListener(
          "transitionend",
          () => {
            allSlides[previousIndex].classList.remove("is-active");
            allSlides[currentIndex].classList.add("is-active");
            allSlides[currentIndex].style.width = `520px`;
            allSlides[currentIndex].classList.add("remove-active");

            updateCarousel(false);

            setTimeout(() => {
              allSlides[currentIndex].classList.remove("remove-active");
            });
          },
          { once: true },
        );
      }
    }
  }
  function handleInteractionStart(e) {
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    isInteracting = true;
    if (e.type === "mousedown") {
      e.preventDefault();
      carousel.style.cursor = "grabbing";
    }
  }

  function handleInteractionMove(e) {
    if (!isInteracting) return;
    const currentX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 30) {
      setCurrentIndex(currentIndex + (diff > 0 ? 1 : -1));
      isInteracting = false;
    }
  }

  function handleInteractionEnd() {
    isInteracting = false;
    carousel.style.cursor = "grab";

    // console.log(realIndex);
  }

  carousel.addEventListener("touchstart", handleInteractionStart);
  carousel.addEventListener("touchmove", handleInteractionMove);
  carousel.addEventListener("touchend", handleInteractionEnd);
  carousel.addEventListener("mousedown", handleInteractionStart);
  carousel.addEventListener("mousemove", handleInteractionMove);
  carousel.addEventListener("mouseup", handleInteractionEnd);
  carousel.addEventListener("mouseleave", handleInteractionEnd);
  carousel.addEventListener("selectstart", (e) => e.preventDefault());

  // Initial setup
  currentIndex = cloneCount * totalSlides;
  updateCarousel(false);
}
