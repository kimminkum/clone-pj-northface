import gsap from "gsap/dist/gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class ContentsScroll {
  constructor(options = {}) {
    this.options = {
      panelSelector: ".scroll-contents__item",
      scrubValue: 0.5,
      pinSpacing: false,
      hideClass: "hide",
      textSelector: ".scroll-contents__txt",
      imageSelector: ".scroll-contents__bg",
      firstPanelSelector: ".scroll-contents--01 .scroll-contents__item",
      lastPanelSelector: ".scroll-contents--last",
      excludedPanelSelector: ".scroll-contents--04",
      ...options,
    };
    this.panels = [];
    this.currentPanelIndex = 0;
    this.triggers = [];
    this.firstPanelComplete = false;
    this.firstPanelOpacity = 0;
  }

  init() {
    const firstPanel = document.querySelector(this.options.firstPanelSelector);
    const otherPanels = gsap.utils.toArray(this.options.panelSelector).filter(panel => panel !== firstPanel);
    this.panels = [firstPanel, ...otherPanels];

    this.createScrollTriggers();
  }

  createScrollTriggers() {
    this.createFirstPanelTrigger(this.panels[0]);

    // Create ScrollTriggers for the rest of the panels
    this.panels.slice(1).forEach((panel, i) => {
      this.createPanelTrigger(panel, i + 1);
    });
  }

  createFirstPanelTrigger(panel) {
    const text = panel.querySelector(this.options.textSelector);
    const image = panel.querySelector(this.options.imageSelector);

    gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-contents--01",
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: 0.1,
        pinSpacing: this.options.pinSpacing,
        preventOverlaps: true,
        onUpdate: (self) => {
          const progress = self.progress;
          this.firstPanelOpacity = Math.min(progress * 4, 1);

          gsap.set([text, image], { opacity: this.firstPanelOpacity });

          if (progress === 1 && !this.firstPanelComplete) {
            this.firstPanelComplete = true;
            console.log("First panel complete");
            this.hideOtherPanels();
            this.showNextPanel();
          }
        },
      },
    });
  }

  createPanelTrigger(panel, index) {
    gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: `top top`,
        end: `bottom top`,
        pin: true,
        scrub: this.options.scrubValue,
        pinSpacing: this.options.pinSpacing,
        onUpdate: (self) => this.onPanelUpdate(index, self),
      },
    });
  }

  onPanelUpdate(index, self) {
    if (!this.firstPanelComplete) return;

    const progress = self.progress;
    const currentPanel = this.panels[index];
    const prevPanel = this.panels[index - 1];
    const nextPanel = this.panels[index + 1];

    if (progress <= 0.2 && index !== this.currentPanelIndex) {
      if (prevPanel && !this.isExcludedPanel(prevPanel)) {
        prevPanel.classList.add(this.options.hideClass);
      }
      if (!this.isExcludedPanel(currentPanel)) {
        currentPanel.classList.remove(this.options.hideClass);
      }
      this.currentPanelIndex = index;
    } else if (progress > 0.2 && index === this.currentPanelIndex) {
      if (nextPanel) {
        nextPanel.classList.remove(this.options.hideClass);
      }
      if (!this.isExcludedPanel(currentPanel)) {
        currentPanel.classList.add(this.options.hideClass);
      }
      this.currentPanelIndex = index + 1;
    }

    console.log(`Panel ${index + 1} progress: ${progress.toFixed(2)}`);
  }

  hideOtherPanels() {
    this.panels.slice(1).forEach(panel => {
      if (!this.isExcludedPanel(panel)) {
        panel.classList.add(this.options.hideClass);
      }
    });
  }

  showNextPanel() {
    if (this.panels.length > 1) {
      this.panels[1].classList.remove(this.options.hideClass);
    }
  }

  isExcludedPanel(panel) {
    return panel.closest(this.options.lastPanelSelector) !== null ||
    panel.closest(this.options.excludedPanelSelector) !== null;
  }
}
export default ContentsScroll;
