const GNBModule = (() => {
  const elements = {
    gnb: document.getElementById("gnb"),
    gnbMenuBody: document.querySelector(".gnb-menu-body"),
    depth1Inner: document.querySelector(".depth1-inner"),
    depth1Items: document.querySelectorAll(".depth1-item"),
    depth2Inner: document.querySelector(".depth2-inner"),
    depth2Items: document.querySelectorAll(".depth2_item"),
    depth3: document.querySelector(".depth3"),
    backBtn: document.querySelector(".gnb-menu-head .menu-head__back"),
    menuTitle: document.querySelector(".gnb-menu-head .menu-head__title"),
    openBtn: document.querySelectorAll(".gnb-btn"),
    closeBtn: document.querySelector(".btn-mob-close"),
    brandInfoBtn: document.getElementById("brand-info--btn"),
    brandInfoLayer: document.querySelector(".brand-info--layer"),
    gnbLogo: document.querySelector(
      ".gnb-menu-head__left .layout-header__logo-link",
    ),
  };

  let currentDepth = 1;
  let currentTitle = "";
  let isBrandInfoVisible = false;

  function showDepth2(title) {
    elements.gnbMenuBody.style.transform = "translateX(-50%)";
    elements.depth2Inner.style.transform = "translateX(0)";
    elements.gnbMenuBody.classList.add("active");
    updateTitle(title);
    showBackButton();
    currentDepth = 2;
  }

  function updateTitle(title) {
    currentTitle = title;
    elements.menuTitle.textContent = title;
    elements.menuTitle.style.opacity = "1";
  }

  function showBackButton() {
    elements.backBtn.style.opacity = "1";
    elements.gnbLogo.classList.add("hidden");
  }

  function hideBackButton() {
    elements.backBtn.style.opacity = "0";
    elements.gnbLogo.classList.remove("hidden");
  }

  function showDepth3() {
    elements.depth3.classList.add("active");
    currentDepth = 3;
  }

  function goBack() {
    if (isBrandInfoVisible) {
      hideBrandInfoLayer();
      return;
    }

    if (currentDepth === 2) {
      elements.gnbMenuBody.style.transform = "translateX(0)";
      elements.depth2Inner.style.transform = "translateX(50%)";
      hideBackButton();
      elements.menuTitle.style.opacity = "0";
      currentDepth = 1;
      elements.gnbMenuBody.classList.remove("active");
    } else if (currentDepth === 3) {
      elements.depth3.classList.remove("active");
      updateTitle(currentTitle);
      currentDepth = 2;
    }
  }

  function openGnb() {
    elements.gnb.classList.add("active");
    document.body.classList.add("overflow-hidden");
  }

  function resetMenu() {
    elements.gnbMenuBody.style.transform = "translateX(0)";
    elements.depth2Inner.style.transform = "translateX(50%)";
    elements.depth3.classList.remove("active");
    hideBackButton();
    elements.menuTitle.style.opacity = "0";
    elements.gnb.classList.remove("active");
    currentDepth = 1;
    document.body.classList.remove("overflow-hidden");
    hideBrandInfoLayer();

    const scrollableElements = elements.gnbMenuBody.querySelectorAll("*");
    scrollableElements.forEach((element) => {
      if (element.scrollHeight > element.clientHeight) {
        element.scrollTop = 0;
      }
    });
  }

  function showBrandInfoLayer() {
    elements.brandInfoLayer.style.transform = "translateX(0)";
    isBrandInfoVisible = true;
    showBackButton();
    updateTitle("브랜드 소개");
  }

  function hideBrandInfoLayer() {
    elements.brandInfoLayer.style.transform = "translateX(100%)";
    isBrandInfoVisible = false;
    elements.gnbMenuBody.classList.remove("active");
    if (currentDepth === 1) {
      hideBackButton();
      elements.menuTitle.style.opacity = "0";
    }
  }

  function toggleBrandInfoLayer(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isBrandInfoVisible) {
      hideBrandInfoLayer();
    } else {
      showBrandInfoLayer();
    }
  }

  function setupEventListeners() {
    elements.depth1Items.forEach((item) => {
      if (!item.classList.contains("depth1-item--promotion")) {
        item.addEventListener("click", function (e) {
          if (!item.classList.contains("depth1-item--line")) {
            if (
              this.id !== "brand-info--btn" &&
              !this.querySelector(".depth1_lookbook")
            ) {
              e.preventDefault();
              showDepth2(this.querySelector(".depth1_into").textContent);
            }
          }
        });
      }
    });

    elements.depth2Items.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });

    elements.backBtn.addEventListener("click", goBack);
    // elements.openBtn.addEventListener("click", openGnb);
    elements.openBtn.forEach((item) => {
      item.addEventListener("click", function (e) {
        openGnb();
      });
    });
    elements.closeBtn.addEventListener("click", resetMenu);
    elements.brandInfoBtn.addEventListener("click", toggleBrandInfoLayer);
  }

  function init() {
    setupEventListeners();
  }

  return {
    init: init,
  };
})();

// 모듈 초기화
GNBModule.init();

//2depth 활성화
document.addEventListener("DOMContentLoaded", function () {
  const depth3 = document.querySelector(".depth3");
  const depth3Lists = document.querySelectorAll(".depth3-list");
  const depth2Items = document.querySelectorAll(".depth2_item");

  depth3.addEventListener("scroll", function () {
    let currentSection = "";

    depth3Lists.forEach(function (list) {
      const listTop = list.offsetTop;
      const listHeight = list.offsetHeight;
      if (depth3.scrollTop >= listTop - 45) {
        currentSection = list.id;
      }
    });

    depth2Items.forEach(function (item) {
      item.classList.remove("target");
      if (item.getAttribute("href") === "#" + currentSection) {
        item.classList.add("target");
      }
    });
  });

  depth2Items.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetList = document.getElementById(targetId);
      if (targetList) {
        depth3.scrollTo({
          top: targetList.offsetTop - 30,
          behavior: "smooth",
        });
        depth2Items.forEach((i) => i.classList.remove("target"));
        this.classList.add("target");
      }
    });
  });
});

// 모듈 초기화
GNBModule.init();

//2depth 활성화
document.addEventListener("DOMContentLoaded", function () {
  const depth3 = document.querySelector(".depth3");
  const depth3Lists = document.querySelectorAll(".depth3-list");
  const depth2Items = document.querySelectorAll(".depth2_item");

  depth3.addEventListener("scroll", function () {
    let currentSection = "";

    depth3Lists.forEach(function (list) {
      const listTop = list.offsetTop;
      const listHeight = list.offsetHeight;
      if (depth3.scrollTop >= listTop - 45) {
        currentSection = list.id;
      }
    });

    depth2Items.forEach(function (item) {
      item.classList.remove("target");
      if (item.getAttribute("href") === "#" + currentSection) {
        item.classList.add("target");
      }
    });
  });

  depth2Items.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetList = document.getElementById(targetId);
      if (targetList) {
        depth3.scrollTo({
          top: targetList.offsetTop - 30,
          behavior: "smooth",
        });
        depth2Items.forEach((i) => i.classList.remove("target"));
        this.classList.add("target");
      }
    });
  });
});
