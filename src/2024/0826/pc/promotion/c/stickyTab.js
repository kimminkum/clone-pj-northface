// sticky
/**
 * StickyTab module for creating sticky navigation tabs.
 * @module StickyTab
 */
const StickyTab = (function () {
  const utils = {
    easeInOutQuad: (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },

    smoothScroll: {
      to(options) {
        const {
          to,
          duration = 500,
          container = window,
          callback = () => {},
        } = options;

        const start =
          container === window ? container.pageYOffset : container.scrollTop;
        const change = to - start;
        const startTime = performance.now();

        const animateScroll = function (currentTime) {
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const val = utils.easeInOutQuad(progress, start, change, 1);

          if (container === window) {
            container.scrollTo(0, val);
          } else {
            container.scrollTop = val;
          }

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            callback();
          }
        };
        requestAnimationFrame(animateScroll);
      },
    },

    throttle: (func, limit) => {
      let lastFunc;
      let lastRan;
      return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(
            function () {
              if (Date.now() - lastRan >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
              }
            },
            limit - (Date.now() - lastRan),
          );
        }
      };
    },

    debounce: (func, delay) => {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    getElementHeight: (element) => {
      if (!element) return 0;
      const styles = window.getComputedStyle(element);
      return (
        element.offsetHeight +
        parseFloat(styles.marginTop) +
        parseFloat(styles.marginBottom)
      );
    },

    getOffset: (element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: Math.round(rect.top + window.pageYOffset),
        left: Math.round(rect.left + window.pageXOffset),
      };
    },
  };

  const config = {
    options: {
      rootSelector: ".sticky-tab",
      listSelector: ".sticky-tab__list",
      linkSelector: ".sticky-tab__link",
      headerSelector: null,
      endSelector: null,
      speed: 1000,
      fixedClass: "is-fixed",
      hiddenClass: "is-hidden",
      activeClass: "is-active",
      onInit: null,
      onUpdate: null,
      onScrollEnd: null,
    },
    setOptions: (newOptions) => Object.assign(config.options, newOptions),
  };

  const dom = {
    elements: {},
    initElements() {
      const root = document.querySelector(config.options.rootSelector);
      this.elements = {
        root,
        list: root.querySelector(config.options.listSelector),
        links: root.querySelectorAll(config.options.linkSelector),
        header: config.options.headerSelector
          ? document.querySelector(config.options.headerSelector)
          : null,
        end: config.options.endSelector
          ? document.querySelector(config.options.endSelector)
          : null,
      };
    },
  };

  const stateManager = {
    state: {
      isFixed: false,
      isHidden: false,
      activeSection: null,
      scrollPosition: 0,
      sections: [],
      headerHeight: 0,
      stickyTabHeight: 0,
    },
    setFixed(isFixed) {
      if (this.state.isFixed !== isFixed) {
        this.state.isFixed = isFixed;
        return true;
      }
      return false;
    },

    setHidden(isHidden) {
      if (this.state.isHidden !== isHidden) {
        this.state.isHidden = isHidden;
        return true;
      }
      return false;
    },
    updateHeights() {
      this.state.headerHeight = config.options.headerSelector
        ? utils.getElementHeight(dom.elements.header)
        : 0;
      this.state.stickyTabHeight = utils.getElementHeight(dom.elements.root);
    },
    updateScrollPosition(position) {
      this.state.scrollPosition = position;
    },
    updateSections(newSections) {
      this.state.sections = newSections;
    },
    calculateDynamicBuffer() {
      return -1; // 필요에 따라 동적 버퍼 계산 로직 구현
    },
  };

  const sectionManager = {
    observer: null,
    observedSections: new Set(),

    initObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              uiManager.updateActiveSection(entry.target.id);
            }
          });
        },
        { threshold: [0.1, 0.5] },
      );
    },

    updateSections() {
      stateManager.updateHeights();
      const dynamicBuffer = stateManager.calculateDynamicBuffer();
      const headerHeight = stateManager.state.headerHeight;
      const stickyTabHeight = stateManager.state.stickyTabHeight;

      const newSections = [];
      const links = dom.elements.links;
      const linksLength = links.length;

      for (let i = 0; i < linksLength; i++) {
        const link = links[i];
        const target = document.getElementById(
          link.getAttribute("href").substring(1),
        );
        if (!target) continue;

        const targetOffset = utils.getOffset(target).top;
        const start = Math.max(
          targetOffset - headerHeight - stickyTabHeight - dynamicBuffer,
          0,
        );

        newSections.push({
          id: target.id,
          start: start,
          end: start, // 임시로 start와 같은 값으로 설정
        });

        if (i > 0) {
          newSections[i - 1].end = start;
        }
      }

      // 마지막 섹션의 end 값을 설정
      if (newSections.length > 0) {
        newSections[newSections.length - 1].end =
          Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
          ) -
          headerHeight -
          stickyTabHeight;
      }

      stateManager.updateSections(newSections);
      this.updateObservedSections();
    },

    updateObservedSections() {
      const currentIds = new Set(
        stateManager.state.sections.map((section) => section.id),
      );

      // Remove old sections
      this.observedSections.forEach((id) => {
        if (!currentIds.has(id)) {
          const element = document.getElementById(id);
          if (element) this.observer.unobserve(element);
          this.observedSections.delete(id);
        }
      });

      // Add new sections
      stateManager.state.sections.forEach((section) => {
        if (!this.observedSections.has(section.id)) {
          const element = document.getElementById(section.id);
          if (element) {
            this.observer.observe(element);
            this.observedSections.add(section.id);
          }
        }
      });
    },

    getCurrentSection(scrollPosition) {
      const adjustedScrollPosition =
        scrollPosition +
        stateManager.state.headerHeight +
        stateManager.state.stickyTabHeight;

      let low = 0;
      let high = stateManager.state.sections.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const section = stateManager.state.sections[mid];

        if (
          adjustedScrollPosition >= section.start &&
          adjustedScrollPosition < section.end
        ) {
          return section.id;
        }

        if (adjustedScrollPosition < section.start) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      return null;
    },
  };

  const uiManager = {
    lastFixedState: null,
    lastHiddenState: null,

    updateFixed(isFixed) {
      if (stateManager.setFixed(isFixed)) {
        dom.elements.root.classList.toggle(config.options.fixedClass, isFixed);
      }
    },

    updateHidden(isHidden) {
      if (stateManager.setHidden(isHidden)) {
        dom.elements.root.classList.toggle(
          config.options.hiddenClass,
          isHidden,
        );
      }
    },
    updateActiveSection(sectionId) {
      if (stateManager.state.activeSection !== sectionId) {
        stateManager.state.activeSection = sectionId;
        const activeClass = config.options.activeClass;
        dom.elements.links.forEach((link) => {
          const listItem = link.parentElement;
          const isActive = link.getAttribute("href") === `#${sectionId}`;
          if (isActive) {
            listItem.classList.add(activeClass);
          } else {
            listItem.classList.remove(activeClass);
          }
        });
      }
    },
  };

  const eventHandler = {
    lastKnownScrollPosition: 0,
    ticking: false,
    bindEvents() {
      window.addEventListener("scroll", this.onScroll.bind(this));
      window.addEventListener(
        "resize",
        utils.debounce(this.onResize.bind(this), 200),
      );
      dom.elements.links.forEach((link) => {
        link.addEventListener("click", this.onLinkClick);
      });
    },
    onScroll() {
      this.lastKnownScrollPosition = window.pageYOffset;
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll(this.lastKnownScrollPosition);
          this.ticking = false;
        });
        this.ticking = true;
      }
    },
    handleScroll(scrollPosition) {
      stateManager.updateScrollPosition(scrollPosition);
      const currentSectionId = sectionManager.getCurrentSection(scrollPosition);
      if (currentSectionId) uiManager.updateActiveSection(currentSectionId);
      StickyTab.update();
    },

    onResize: () => {
      sectionManager.updateSections();
      StickyTab.update();
    },
    onLinkClick(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        stateManager.updateHeights();
        StickyTab.scrollTo(utils.getOffset(targetElement).top);
      }
    },
  };

  return {
    init(options) {
      config.setOptions(options);
      dom.initElements();
      stateManager.updateHeights();
      sectionManager.initObserver();
      sectionManager.updateSections();
      eventHandler.bindEvents();
      this.initResizeObserver();

      const initialScrollPosition = window.pageYOffset;
      stateManager.updateScrollPosition(initialScrollPosition);
      this.update();
      this.setInitialActiveSection();

      if (typeof config.options.onInit === "function") {
        config.options.onInit(stateManager.state);
      }
    },
    reInit() {
      stateManager.updateHeights();
      sectionManager.updateSections();
      this.update();
      this.setInitialActiveSection();
    },
    setInitialActiveSection() {
      const scrollPosition = window.pageYOffset;
      const currentSection = sectionManager.getCurrentSection(scrollPosition);
      if (currentSection) {
        uiManager.updateActiveSection(currentSection);
      }
    },
    initResizeObserver() {
      const resizeObserver = new ResizeObserver(
        utils.debounce(() => {
          stateManager.updateHeights();
          sectionManager.updateSections();
          this.update();
        }, 200),
      );

      stateManager.state.sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          resizeObserver.observe(element);
        }
      });
    },
    update() {
      const scrollPosition = window.pageYOffset;

      // 수정 - 헤더가 스크롤되는 동안에는 stickyTab이 fixed 되지 않도록 처리
      // 1030~1120에서 에러가 나기때문에 넣었습니다. 위로 스크롤 될 시에는 아니기 때문에 예외 처리하였습니다.
      // 근본적 해결책 x
      const header = document.querySelector("header.layout-header.is-scrolled");
      if (header) {
        if (scrollPosition > 1030 && scrollPosition < 1120) {
          return;
        }
      }

      stateManager.updateScrollPosition(scrollPosition);

      const dynamicBuffer = stateManager.calculateDynamicBuffer();
      const rootRect = dom.elements.root.getBoundingClientRect();
      const rootOffset = rootRect.top + scrollPosition;
      const endPosition = dom.elements.end
        ? dom.elements.end.getBoundingClientRect().top + scrollPosition
        : Infinity;

      const isFixed =
        scrollPosition >
        rootOffset - stateManager.state.headerHeight - dynamicBuffer;
      const isHidden =
        scrollPosition >=
        endPosition -
          stateManager.state.stickyTabHeight -
          stateManager.state.headerHeight -
          dynamicBuffer;

      uiManager.updateFixed(isFixed);
      uiManager.updateHidden(isHidden);

      const currentSection = sectionManager.getCurrentSection(scrollPosition);
      if (currentSection) uiManager.updateActiveSection(currentSection);

      if (typeof config.options.onUpdate === "function") {
        config.options.onUpdate(stateManager.state);
      }
    },
    scrollTo(to, duration = config.options.speed) {
      stateManager.updateHeights();
      const dynamicBuffer = stateManager.calculateDynamicBuffer();

      // to - stateManager.state.headerHeight - stateManager.state.stickyTabHeight - dynamicBuffer;
      // 수정 자꾸 header 높이만큼 -88px 위로 navigation이 되어서 수정 - 01
      const adjustedTo =
        to - stateManager.state.stickyTabHeight - dynamicBuffer;

      utils.smoothScroll.to({
        to: adjustedTo,
        duration: duration,
        callback: () => {
          setTimeout(() => {
            const currentScrollPosition = window.pageYOffset;
            const currentSection = sectionManager.getCurrentSection(
              currentScrollPosition,
            );
            if (currentSection) {
              uiManager.updateActiveSection(currentSection);
            }
            if (typeof config.options.onScrollEnd === "function") {
              config.options.onScrollEnd(stateManager.state);
            }
          }, 50);
        },
      });
    },
    goToSection(index, duration) {
      const sections = Array.from(dom.elements.links);
      if (index >= 0 && index < sections.length) {
        const targetId = sections[index].getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          this.scrollTo(
            utils.getOffset(targetElement).top,
            duration || config.options.speed,
          );
        }
      }
    },
  };
})();

function initStickyTab2(options) {
  const instance = Object.create(StickyTab);
  instance.init(options);
  return instance;
}

if (typeof window !== "undefined" && !window.initStickyTab2) {
  window.initStickyTab2 = initStickyTab2;
}
