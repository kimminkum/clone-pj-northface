const stickyBar = (function () {
  const config = {
    options: {
      rootSelector: ".sticky-bar",
      headerSelector: null,
      fixedClass: "is-fixed",
    },
    setOptions: (newOptions) => Object.assign(config.options, newOptions),
  };

  const dom = {
    elements: {},
    initElements() {
      this.elements = {
        root: document.querySelector(config.options.rootSelector),
        header: config.options.headerSelector
          ? document.querySelector(config.options.headerSelector)
          : null,
      };
    },
  };

  const stateManager = {
    state: {
      isFixed: false,
      headerHeight: 0,
    },
    setFixed(isFixed) {
      if (this.state.isFixed !== isFixed) {
        this.state.isFixed = isFixed;
        return true;
      }
      return false;
    },
    updateHeaderHeight() {
      this.state.headerHeight = this.getElementHeight(dom.elements.header);
    },
    getElementHeight(element) {
      if (!element) return 0;
      const styles = window.getComputedStyle(element);
      return (
        element.offsetHeight +
        parseFloat(styles.marginTop) +
        parseFloat(styles.marginBottom)
      );
    },
  };

  const uiManager = {
    updateFixed(isFixed) {
      if (stateManager.setFixed(isFixed)) {
        dom.elements.root.classList.toggle(config.options.fixedClass, isFixed);
      }
    },
  };

  const eventHandler = {
    bindEvents() {
      window.addEventListener("scroll", this.onScroll.bind(this));
      window.addEventListener("resize", this.onResize.bind(this));
    },
    onScroll() {
      stickyBar.update();
    },
    onResize: () => {
      stateManager.updateHeaderHeight();
      stickyBar.update();
    },
  };

  return {
    init(options) {
      config.setOptions(options);
      dom.initElements();
      stateManager.updateHeaderHeight();
      eventHandler.bindEvents();
      this.update();
    },
    update() {
      const scrollPosition = window.pageYOffset;
      const rootRect = dom.elements.root.getBoundingClientRect();
      const rootOffset = rootRect.top + scrollPosition;

      const isFixed = scrollPosition > rootOffset - stateManager.state.headerHeight;

      uiManager.updateFixed(isFixed);
    },
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  stickyBar.init({
    rootSelector: ".sticky-bar",
    headerSelector: ".site-header",
    fixedClass: "is-fixed"
  });
});
