export const ProductSlider = {
  state: {
    thumbItems: null,
    productList: null,
    sliderContainer: null,
    floatThumb: null,
    floatCodiBtn: null,
    productImages: null,
    headerHeight: 88,
    layoutHeader: null,
  },

  init(
    thumbSelector = ".float-thumb--item",
    productListSelector = ".prd-slider--list",
    sliderContainerSelector = ".prd-slider",
    floatThumbSelector = ".float-thumb",
    floatCodiBtnSelector = ".codi-btn",
    productImageSelector = ".prd-slider--img",
    layoutHeaderSelector = ".layout-header",
  ) {
    this.state.thumbItems = document.querySelectorAll(thumbSelector);
    this.state.productList = document.querySelector(productListSelector);
    this.state.sliderContainer = document.querySelector(
      sliderContainerSelector,
    );
    this.state.floatThumb = document.querySelector(floatThumbSelector);
    this.state.floatCodiBtn = document.querySelector(floatCodiBtnSelector);
    this.state.productImages = document.querySelectorAll(productImageSelector);
    this.state.layoutHeader = document.querySelector(layoutHeaderSelector);

    this.addEventListeners();
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.handleScroll);

    // 페이지 로드 시 초기 상태 확인
    this.checkHeaderScrolled();
  },

  addEventListeners() {
    this.state.thumbItems.forEach((item) => {
      item.addEventListener("click", this.handleThumbClick.bind(this));
    });
  },

  handleThumbClick(e) {
    e.preventDefault();
    this.updateActiveThumb(e.currentTarget);
    this.scrollToTargetImage(e.currentTarget);
  },

  updateActiveThumb(clickedThumb) {
    this.state.thumbItems.forEach((thumb) => thumb.classList.remove("active"));
    clickedThumb.classList.add("active");
  },

  scrollToTargetImage(clickedThumb) {
    const targetId = clickedThumb
      .querySelector("a")
      .getAttribute("href")
      .substring(1);
    const targetElement = document.getElementById(targetId);
    const currentScrollPosition = window.pageYOffset;
    const targetPosition =
      targetElement.getBoundingClientRect().top + currentScrollPosition;

    const isScrollingUp = targetPosition < currentScrollPosition;
    const adjustedPosition = isScrollingUp
      ? targetPosition - this.state.headerHeight
      : targetPosition;

    window.scrollTo({
      top: adjustedPosition,
      behavior: "smooth",
    });
  },

  handleScroll() {
    const {
      sliderContainer,
      floatThumb,
      floatCodiBtn,
      productImages,
      thumbItems,
    } = this.state;
    const containerRect = sliderContainer.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;

    if (
      containerTop <= this.state.headerHeight &&
      containerBottom > window.innerHeight
    ) {
      floatThumb.classList.add("is-fixed");
      if (floatCodiBtn) floatCodiBtn.classList.add("is-fixed");
    } else {
      floatThumb.classList.remove("is-fixed");
      if (floatCodiBtn) floatCodiBtn.classList.remove("is-fixed");
    }

    productImages.forEach((img, index) => {
      const imgRect = img.getBoundingClientRect();
      if (
        imgRect.top <= window.innerHeight / 2 &&
        imgRect.bottom >= window.innerHeight / 2
      ) {
        this.updateActiveThumb(thumbItems[index]);
      }
    });

    // 스크롤 시 header-scrolled 상태 확인
    this.checkHeaderScrolled();
  },

  // 추가: layout-header의 is-scrolled 클래스 확인 및 codi-btn 클래스 업데이트
  checkHeaderScrolled() {
    const { layoutHeader, floatCodiBtn } = this.state;
    if (layoutHeader && floatCodiBtn) {
      if (layoutHeader.classList.contains("is-scrolled")) {
        floatCodiBtn.classList.add("header-hidden");
      } else {
        floatCodiBtn.classList.remove("header-hidden");
      }
    }
  },
};
