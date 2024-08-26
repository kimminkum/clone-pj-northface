const showModalIfOpener = (trigger) => {
  if (!trigger) return;

  const target = document.getElementById(trigger.dataset.showModal);

  if (!target || typeof target.showModal !== "function") return;

  target.showModal();
};
const closeIfCloser = (trigger) => {
  if (!trigger) return;

  const target =
    document.getElementById(trigger.dataset.close) || trigger.closest("dialog");

  if (!target || typeof target.close !== "function") return;

  target.close();
};
const closeIfNotBox = (target) => {
  const dialog = target.closest("dialog");

  if (!dialog || target.closest(".modal__box")) return;

  dialog.close();
};

document.addEventListener("click", (event) => {
  const target = event.target;

  showModalIfOpener(target.closest("[data-show-modal]"));
  closeIfCloser(target.closest("[data-close]"));
  closeIfNotBox(target);
});
