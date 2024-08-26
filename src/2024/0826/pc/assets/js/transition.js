/**
 * @typedef {Object} TransitionSettings
 * @property {string} activeClass
 * @property {string} fromClass
 * @property {string} toClass
 * @property {number} duration - in milliseconds
 */

/**
 * @param {Element} target
 * @param {TransitionSettings} settings
 * @returns {Promise<any>}
 * @example
 * transition(element, {
 *   activeClass: "is-active",
 *   fromClass: "enter-from",
 *   toClass: "enter-to",
 *   duration: 300,
 * });
 * transition(element, {
 *   activeClass: "is-active",
 *   toClass: "leave-to",
 *   duration: 300,
 * }).then((target) => {
 *   target.classList.remove("is-active", "leave-to");
 * });
 */
export const transition = (target, settings) =>
  new Promise((resolve, reject) => {
    const { activeClass, fromClass, toClass, duration } = settings;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      target.removeEventListener("transitionend", onTransitionEnd, {
        once: true,
      });
      target.classList.remove(fromClass);
    };
    const onTransitionEnd = (event) => {
      if (event.target === target) {
        cleanup();
        resolve(target);
      }
    };
    const timeoutId = setTimeout(() => {
      cleanup();
      reject("timeout");
    }, duration * 2);

    target.addEventListener("transitionend", onTransitionEnd, { once: true });

    target.classList.add(activeClass);
    if (fromClass) {
      target.classList.add(fromClass);
    }

    requestAnimationFrame(() => {
      target.classList.add(toClass);
    });
  });
