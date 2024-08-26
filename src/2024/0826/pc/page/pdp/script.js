import { ProductSlider } from "../../_includes/partials/pdp/pdp-top/script";
import "../../_includes/components/stickyTab/stickyTab";
import { showLayer, closeLayer } from "../../assets/js/layer";
import Lenis from "lenis";

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const QuickBuy = {
  state: {
    quickBtn: null,
    quickLayer: null,
    closeBtn: null,
    pdpDetail: null,
    isLayerActive: false,
    activeTimer: null,
  },

  init: function (
    quickBtnSelector = ".quick-btn",
    quickLayerSelector = ".quick-layer",
    closeBtnSelector = ".close-btn",
    pdpDetailSelector = ".pdp-detail",
  ) {
    this.state.quickBtn = document.querySelector(quickBtnSelector);
    this.state.quickLayer = document.querySelector(quickLayerSelector);
    this.state.closeBtn = document.querySelector(closeBtnSelector);
    this.state.pdpDetail = document.querySelector(pdpDetailSelector);

    this.addEventListeners();
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.handleScroll);
  },

  addEventListeners: function () {
    this.state.quickBtn.addEventListener(
      "click",
      this.handleQuickBtnClick.bind(this),
    );
    this.state.closeBtn.addEventListener(
      "click",
      this.handleCloseBtnClick.bind(this),
    );
  },

  handleScroll: function () {
    if (this.isPdpDetailVisible() && !this.state.isLayerActive) {
      this.addQuickBtnActive();
    } else if (!this.isPdpDetailVisible()) {
      this.removeQuickBtnActive();
    }
  },

  isPdpDetailVisible: function () {
    if (!this.state.pdpDetail) return false;
    const rect = this.state.pdpDetail.getBoundingClientRect();
    return rect.top <= 0;
  },

  handleQuickBtnClick: function () {
    this.state.quickLayer.classList.add("active");
    this.removeQuickBtnActive();
    this.state.isLayerActive = true;
    if (this.state.activeTimer) {
      clearTimeout(this.state.activeTimer);
    }
  },

  handleCloseBtnClick: function () {
    this.state.quickLayer.classList.remove("active");
    this.state.isLayerActive = false;

    if (this.state.activeTimer) {
      clearTimeout(this.state.activeTimer);
    }

    this.state.activeTimer = setTimeout(() => {
      if (this.isPdpDetailVisible()) {
        this.addQuickBtnActive();
      }
    }, 500);
  },

  addQuickBtnActive: function () {
    this.state.quickBtn.classList.add("active");
  },

  removeQuickBtnActive: function () {
    this.state.quickBtn.classList.remove("active");
  },
};

const SizeModal = {
  state: {
    tabItems: null,
    contentLayers: null,
    modal: null,
    closeButton: null,
    selectBtn: null,
    optionLayer: null,
    sizeTab: null,
    sizeContents: null,
    otherPrdBtn: null,
  },

  init: function (
    modalSelector = "#size",
    tabItemSelector = ".size-tab__item",
    contentLayerSelector = ".size-contents--layer",
    closeButtonSelector = ".size-close",
    selectBtnSelector = ".select-btn",
    optionLayerSelector = ".option-layer",
    sizeTabSelector = ".size-tab",
    sizeContentsSelector = ".size-contents",
    otherPrdBtnSelector = ".other-prd",
  ) {
    this.state.modal = document.querySelector(modalSelector);
    this.state.tabItems = this.state.modal.querySelectorAll(tabItemSelector);
    this.state.contentLayers =
      this.state.modal.querySelectorAll(contentLayerSelector);
    this.state.closeButton =
      this.state.modal.querySelector(closeButtonSelector);
    this.state.selectBtn = this.state.modal.querySelectorAll(selectBtnSelector);
    this.state.optionLayer =
      this.state.modal.querySelector(optionLayerSelector);
    this.state.sizeTab = this.state.modal.querySelector(sizeTabSelector);
    this.state.sizeContents =
      this.state.modal.querySelector(sizeContentsSelector);
    this.state.otherPrdBtn =
      this.state.modal.querySelector(otherPrdBtnSelector);

    this.addEventListeners();
  },

  addEventListeners: function () {
    this.state.tabItems.forEach((tab) => {
      tab.addEventListener("click", this.handleTabClick.bind(this));
    });

    this.state.closeButton.addEventListener(
      "click",
      this.closeModal.bind(this),
    );

    if (this.state.selectBtn) {
      this.state.selectBtn.forEach((tab) => {
        tab.addEventListener("click", this.toggleOptionLayer.bind(this));
      });
    }

    if (this.state.otherPrdBtn) {
      this.state.otherPrdBtn.addEventListener(
        "click",
        this.activateSizeB.bind(this),
      );
    }
  },

  handleTabClick: function (event) {
    event.preventDefault();
    const clickedTab = event.currentTarget;
    const targetId = clickedTab
      .querySelector(".size-tab__link")
      .getAttribute("href")
      .substring(1);

    this.activateTab(targetId);
  },

  activateTab: function (targetId) {
    this.state.tabItems.forEach((tab) => tab.classList.remove("selected"));
    this.state.contentLayers.forEach((layer) =>
      layer.classList.remove("selected"),
    );

    const selectedTab = Array.from(this.state.tabItems).find(
      (tab) =>
        tab.querySelector(".size-tab__link").getAttribute("href") ===
        `#${targetId}`,
    );
    if (selectedTab) {
      selectedTab.classList.add("selected");
    }

    const selectedContent = document.getElementById(targetId);
    if (selectedContent) {
      selectedContent.classList.add("selected");
    }

    if (this.state.optionLayer) {
      this.state.optionLayer.classList.remove("active");
    }
    this.updateVisibility();
  },

  toggleOptionLayer: function (event) {
    event.preventDefault();
    if (this.state.optionLayer) {
      this.state.optionLayer.classList.toggle("active");
      this.updateVisibility();
    }
  },

  updateVisibility: function () {
    const isOptionLayerActive =
      this.state.optionLayer.classList.contains("active");
    this.state.sizeTab.classList.toggle("hidden", isOptionLayerActive);
    this.state.sizeContents.classList.toggle("hidden", isOptionLayerActive);
  },

  closeModal: function () {
    this.resetModal();
    this.state.modal.close();
  },

  openModal: function () {
    this.resetModal();
    this.state.modal.showModal();
  },

  resetModal: function () {
    this.activateTab(
      this.state.tabItems[0]
        .querySelector(".size-tab__link")
        .getAttribute("href")
        .substring(1),
    );
  },

  activateSizeB: function () {
    this.activateTab("sizeB");
    if (this.state.optionLayer) {
      this.state.optionLayer.classList.remove("active");
    }
    this.updateVisibility();
  },
};

// sticky tab nav
const stickyTab = initStickyTab2({
  rootSelector: "#stickyTab01",
  headerSelector: ".layout-header",
  endSelector: "#stickyEnd",
  speed: 500,
  onUpdate: (state) => {
    // state.scrollPosition이
  },
  onScrollEnd: (state) => {
    // console.log(state);
  },
});

window.onload = () => {
  console.log("window loaded");
  stickyTab.reInit();
};

document.addEventListener("DOMContentLoaded", function () {
  ProductSlider.init();
  QuickBuy.init();
  SizeModal.init();
});
