import Alpine from "alpinejs";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "../../assets/js/common.js";
import { transition } from "../../assets/js/transition.js";
import { showLayer, closeLayer } from "../../assets/js/layer.js";
import { items } from "./product-items.js";

const patchedItems = items.map((item) => ({
  ...item,
  checked: false,
  quickviewOpen: false,
}));
const reactiveItems = Alpine.reactive(patchedItems);
const getProductItems = (totalItemCount) =>
  Alpine.reactive(
    patchedItems
      .filter((item) => !item.isBanner)
      .slice(0, totalItemCount ?? patchedItems.length),
  );
const itemsToCompare = Alpine.reactive(new Set());

const quickview = {
  open(productId) {
    const productCard = document.getElementById(productId);
    const quickviewRoot = productCard?.querySelector(
      ".product-card__quickview",
    );

    if (!quickviewRoot) {
      return Promise.reject("No quickview root found");
    }

    quickviewRoot.classList.remove("leave-from", "leave-to");

    return transition(quickviewRoot, {
      activeClass: "is-active",
      fromClass: "enter-from",
      toClass: "enter-to",
      duration: 300,
    }).then(() => {
      quickviewRoot.classList.remove("enter-from");
    });
  },
  close(productId) {
    const productCard = document.getElementById(productId);
    const quickviewRoot = productCard?.querySelector(
      ".product-card__quickview",
    );

    if (!quickviewRoot) {
      return Promise.reject("No quickview root found");
    }

    return transition(quickviewRoot, {
      activeClass: "is-active",
      fromClass: "leave-from",
      toClass: "leave-to",
      duration: 300,
    }).then(() => {
      quickviewRoot.classList.remove(
        "enter-from",
        "enter-to",
        "leave-from",
        "leave-to",
        "is-active",
      );
    });
  },
};

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".quickview__body") &&
    event.target.closest(".product-card__quickview")
  ) {
    const productCard = event.target.closest(".product-card");
    const productId = productCard?.id;

    if (!productId) {
      return;
    }

    quickview.close(productId).then(() => {
      const item = reactiveItems.find((item) => item.id === productId);

      if (item) {
        item.quickviewOpen = false;
      }
    });
  }
});

Alpine.data("list", () => ({
  mode: "view", // or "compare"
  type: "gallery", // or "grid"
  grid: 4,
  items: reactiveItems,
  productItems: getProductItems(40),
  get listItems() {
    if (this.type === "gallery") {
      return this.items;
    }

    const rows = Math.floor(this.items.length / this.grid);
    const totalItems = rows * this.grid;

    return getProductItems(totalItems);
  },
  itemsToCompare,
  addToCompare(id) {
    if (itemsToCompare.size >= 3) {
      return;
    }
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return;
    }

    item.checked = true;

    itemsToCompare.add(id);
  },
  removeFromCompare(id) {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return;
    }

    item.checked = false;
    itemsToCompare.delete(id);
  },
  toggleCompare(id) {
    if (itemsToCompare.has(id)) {
      this.removeFromCompare(id);
    } else {
      this.addToCompare(id);
    }
  },
  resetComparison() {
    itemsToCompare.forEach((id) => {
      this.removeFromCompare(id);
    });
    this.mode = "view";
  },
  onCompareButtonClick() {
    this.closeQuickview();

    if (this.mode === "view") {
      this.mode = "compare";
      return;
    }

    if (this.itemsToCompare.size < 2) {
      this.resetComparison();
    } else {
      showLayer(document.getElementById("comparisonLayer"));
    }
  },
  showCart() {
    document.querySelectorAll(".layer:not(.cart-layer)").forEach(closeLayer);
    if (this.mode === "compare") {
      this.resetComparison();
    }
    this.closeQuickview();
    showLayer(document.getElementById("cartLayer"));
  },
  openQuickview(id) {
    const item = this.items.find((item) => item.id === id);

    if (!item || item.quickviewOpen) {
      return;
    }

    this.closeQuickview();

    item.quickviewOpen = true;
    quickview.open(id);
  },
  closeQuickview(id) {
    if (id) {
      const item = this.items.find((item) => item.id === id);

      if (!item || !item.quickviewOpen) {
        return;
      }

      quickview.close(id).then(() => {
        item.quickviewOpen = false;
      });
    } else {
      const item = this.items.find((item) => item.quickviewOpen);
      if (item) {
        quickview.close(item.id).then(() => {
          item.quickviewOpen = false;
        });
      }
    }
  },
  initSwiper(swiperElement) {
    this.swiper = new Swiper(swiperElement, {
      slidesPerView: 1,
      loop: true,
      modules: [Navigation],
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  },
  init() {
    const updateSwiper = () => {
      if (!this.swiper) {
        return;
      }

      const swiper = this.swiper;

      swiper.on("update", (self) => {
        const slideIndex = self.realIndex;

        window.setTimeout(() => {
          if (isNaN(self.realIndex)) {
            self.slideTo(slideIndex, 10);
          }
        }, 500);
      });

      this.$nextTick(() => {
        this.swiper.update();
      });
    };
    this.$watch("type", (value, oldValue) => {
      if (value !== oldValue) {
        this.closeQuickview();
        this.$nextTick(() => {
          updateSwiper();
        });
      }
    });
    this.$watch("grid", (value, oldValue) => {
      if (value !== oldValue) {
        this.$nextTick(() => {
          updateSwiper();
        });
      }
    });
  },
}));

if (!window.Alpine) {
  window.Alpine = Alpine;
}

Alpine.start();
