export const showLayer = (layer, timeout = 1000) =>
  new Promise((resolve, reject) => {
    const onTransitionEnd = (event) => {
      if (event.target.classList.contains("layer")) {
        window.clearTimeout(timeoutId);
        resolve();
      }
    };
    const timeoutId = window.setTimeout(() => {
      layer.removeEventListener("transitionend", onTransitionEnd);
      reject("timeout");
    }, timeout);

    layer.addEventListener("transitionend", onTransitionEnd, { once: true });
    layer.classList.add("is-active");

    requestAnimationFrame(() => {
      layer.classList.add("is-open");
    });
  });

export const closeLayer = (layer, timeout = 1000) =>
  new Promise((resolve, reject) => {
    const onTransitionEnd = (event) => {
      if (event.target.classList.contains("layer")) {
        window.clearTimeout(timeoutId);
        layer.classList.remove("is-active");
        layer.dispatchEvent(new CustomEvent("layerclose"));
        resolve();
      }
    };
    const timeoutId = window.setTimeout(() => {
      layer.removeEventListener("transitionend", onTransitionEnd);
      layer.classList.remove("is-active");
      reject("timeout");
    }, timeout);

    layer.addEventListener("transitionend", onTransitionEnd, { once: true });
    layer.classList.remove("is-open");
  });

const showIfOpener = (trigger) => {
  if (!trigger) return;

  const layer = document.getElementById(trigger.dataset.showLayer);

  if (!layer || !layer.classList.contains("layer")) return;

  return showLayer(layer);
};

const closeIfCloser = (trigger) => {
  if (!trigger) return;

  const layer =
    document.getElementById(trigger.dataset.close) || trigger.closest(".layer");

  if (!layer) return;

  return closeLayer(layer);
};
const closeIfNotBox = (target) => {
  const layer = target.closest(".layer--modal");

  if (!layer || target.closest(".layer__box")) return;

  return closeLayer(layer);
};

document.addEventListener("click", (event) => {
  const target = event.target;

  showIfOpener(target.closest("[data-show-layer]"));
  closeIfCloser(target.closest("[data-close]"));
  closeIfNotBox(target);
});
