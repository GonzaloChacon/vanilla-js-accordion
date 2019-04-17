/*
 * Gonzalo Chacon
 */

const animate = (function() {
  /**
   * scroll() - Scroll window implementing requestAnimationFrame
   * in order to make animation in the next browser repaint.
   *
   * @param {numbe} elementTop - Position of the element to scroll to.
   **/
  function scroll(elementTop) {
    const duration = 300;
    const startingY = window.pageYOffset;
    const elementY = window.pageYOffset + elementTop;
    const targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
    const diff = targetY - startingY;

    const easing = function(t) {
      return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
    };

    let start;

    if (!diff) {
      return;
    }

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) {
        start = timestamp;
      }

      const time = timestamp - start;
      const percent = easing(Math.min(time / duration, 1));

      window.scrollTo(0, startingY + diff * percent);

      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });
  }

  return {
    scroll,
  };
})();

// Component declaration and instantiations
(function(animate) {
  class Accordion {
    CONFIG = {
      ATTR_EXPANDED: 'aria-expanded',
      ATTR_HIDDEN: 'aria-hidden',

      ACC_CLASS_ITEM: 'accordion__item',
      ACC_CLASS_LABEL: 'accordion__label',
      ACC_CLASS_CONTENT: 'accordion__content',
    };

    constructor(accordion) {
      this.accordion = accordion;
      this.accItems = accordion.querySelectorAll(`.${this.CONFIG.ACC_CLASS_ITEM}`);
    }

    init() {
      this.accordion.addEventListener('click', (event) => {
        event.stopPropagation();

        if (event.target.classList.contains(this.CONFIG.ACC_CLASS_LABEL)) {
          const activeItem = event.target.parentNode;

          this.toggleClass(activeItem);
        }
      });
    }

    toggleClass(el) {
      if (el.classList.contains('active')) {
        this.hideContent(el);
      } else {
        this.closeAll();
        animate.scroll(el.getBoundingClientRect().top);
        el.classList.add('active');
        this.displayContent(el);
      }
    }

    displayContent(el) {
      const accContent = el.querySelector(`.${this.CONFIG.ACC_CLASS_CONTENT}`);
      accContent.style.height = accContent.scrollHeight + 'px';
      this.setAccessibilityAttrs(el);
    }

    hideContent(el) {
      if (el.querySelector(`.${this.CONFIG.ACC_CLASS_CONTENT}`).style.height) {
        el.classList.toggle('active');
      }
      el.querySelector(`.${this.CONFIG.ACC_CLASS_CONTENT}`).style.height = null;
      this.setAccessibilityAttrs(el);
    }

    setAccessibilityAttrs(el) {
      const accContent = el.querySelector(`.${this.CONFIG.ACC_CLASS_CONTENT}`);
      const accLabel = el.querySelector(`.${this.CONFIG.ACC_CLASS_LABEL}`);

      if (el.classList.contains('active')) {
        accLabel.setAttribute(this.CONFIG.ATTR_EXPANDED, true);
        accContent.setAttribute(this.CONFIG.ATTR_HIDDEN, false);
      } else {
        accLabel.setAttribute(this.CONFIG.ATTR_EXPANDED, false);
        accContent.setAttribute(this.CONFIG.ATTR_HIDDEN, true);
      }
    }

    closeAll() {
      this.accItems.forEach((el) => {
        this.hideContent(el);
      });
    }
  };

  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach((accordion) => {
    new Accordion(accordion).init();
  });
})(animate);
