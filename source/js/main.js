import { iosVhFix } from "./utils/ios-vh-fix";
import { initModals } from "./modules/modals/init-modals";
import { Form } from "./modules/form-validate/form";
import Swiper from "./vendor/swiper";
import { gsap } from "./vendor/gsap/gsap.min.js";
import { ScrollTrigger } from "./vendor/gsap/ScrollTrigger.min.js";
import { ScrollToPlugin } from "./vendor/gsap/ScrollToPlugin.min.js";

// ---------------------------------

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const introLeft = document.querySelector(".intro__left");
  const introRight = document.querySelector(".intro__right");
  const introLeftImg = document.querySelector(".intro__left img");
  const introRightImg = document.querySelector(".intro__right-img");
  const introRightAnimate = document.querySelector(".intro__animate");
  const introBox = document.querySelector(".intro__box");
  const introTitle = document.querySelector(".intro__box h1");
  const introTitleSlogan = document.querySelector(".intro__box h1 span");
  const introInnerBtn = document.querySelector(".intro__inner .btn");
  const introInnerImg = document.querySelector(".intro__inner img");
  const introInnerDesc = document.querySelector(".intro__inner p");
  const introBtn = document.querySelector(".intro__btn");

  setTimeout(() => {
    introLeft.style.transform = "translateX(-67%)";
    introRight.style.transform = "translateX(-95%)";
    introLeftImg.style.transform = "translateX(11%)";
    introRightAnimate.style.right = "4%";
    introBox.style.top = "0";
    introTitle.style.fontSize = "66px";
    introTitle.style.lineHeight = "74px";
    introTitleSlogan.style.fontSize = "66px";
    introTitleSlogan.style.lineHeight = "74px";
    introTitleSlogan.style.color = "#ffffff";
    introInnerBtn.style.transform = "translateY(0)";
    introInnerImg.style.transform = "scale(0.5)";
    introInnerImg.style.top = "-56%";
    introInnerImg.style.left = "-7%";
  }, 1000);

  setTimeout(() => {
    introInnerBtn.style.opacity = "1";
    introInnerImg.style.opacity = "0";
    introInnerDesc.style.opacity = "1";
  }, 1500);

  setTimeout(() => {
    header.style.transform = "translateY(0)";
  }, 2000);

  // gsap start

  gsap.registerPlugin(ScrollTrigger);

  let allowScroll = true;
  let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause();
  let currentIndex = 0;
  let swipePanels = gsap.utils.toArray(".swipe-section-panel");
  gsap.set(swipePanels, { zIndex: (i) => swipePanels.length - i });
  let intentObserver = ScrollTrigger.observe({
    type: "wheel,touch",
    onUp: () => allowScroll && gotoPanel(currentIndex - 1, false),
    onDown: () => allowScroll && gotoPanel(currentIndex + 1, true),
    tolerance: 10,
    preventDefault: true,
    onEnable(self) {
      allowScroll = false;
      scrollTimeout.restart(true);
      let savedScroll = self.scrollY();
      self._restoreScroll = () => self.scrollY(savedScroll);
      document.addEventListener("scroll", self._restoreScroll, {
        passive: false,
      });
    },
    onDisable: (self) =>
      document.removeEventListener("scroll", self._restoreScroll),
  });
  intentObserver.disable();

  function gotoPanel(index, isScrollingDown) {
    if (
      (index === swipePanels.length && isScrollingDown) ||
      (index === -1 && !isScrollingDown)
    ) {
      intentObserver.disable();
      return;
    }
    allowScroll = false;
    scrollTimeout.restart(true);

    let target = isScrollingDown
      ? swipePanels[currentIndex]
      : swipePanels[index];
    gsap.to(target, {
      yPercent: isScrollingDown ? -100 : 0,
      duration: 0.75,
    });

    if (index > 0) {
      introLeft.style.transition = "0.75s ease-out";
      introRight.style.transition = "0.75s ease-out";
      introLeft.style.transform = "translate(-67%, -100%)";
      header.style.opacity = "0";
      header.style.visibility = "hidden";
      introRightAnimate.style.transition = "0.75s ease-out";
      introRightAnimate.style.transform = "translateY(-100%)";
      introRightImg.style.transform = "scale(1.1)";
      introBtn.style.opacity = "1";
      introBtn.style.visibility = "visible";
    } else {
      introLeft.style.transform = "translate(-67%, 0)";
      header.style.opacity = "1";
      header.style.visibility = "visible";
      introRightAnimate.style.transform = "translateY(0)";
      introRightImg.style.transform = "scale(1)";
      introBtn.style.opacity = "0";
      introBtn.style.visibility = "hidden";
    }

    if (index == 4) {
      introRight.style.transform = "translateX(-63%)";
    } else {
      introRight.style.transform = "translateX(-95%)";
    }

    currentIndex = index;
  }

  ScrollTrigger.create({
    trigger: ".intro__wrapper",
    pin: false,
    start: "top bottom",
    end: "1",
    onEnter: (self) => {
      if (intentObserver.isEnabled) {
        return;
      }
      self.scroll(self.start + 1);
      intentObserver.enable();
    },
    onEnterBack: (self) => {
      if (intentObserver.isEnabled) {
        return;
      }
      self.scroll(self.end - 1);
      intentObserver.enable();
    },
  });

  //snap to section

  let panels = gsap.utils.toArray(".section"),
    scrollTween;
  function goToSection(i) {
    scrollTween = gsap.to(window, {
      scrollTo: { y: i, autoKill: false },
      ease: "power1.out",
    });
  }

  panels.forEach((panel, i) => {
    const tlSnapIn = gsap.timeline();
    tlSnapIn.to(panel, {
      duration: 0.75,
      scrollTrigger: {
        trigger: panel,
        start: "top bottom",
        onEnter: (e) => {
          goToSection(panel);
          if (panel.id == "video") {
            introBtn.style.opacity = "0";
            introBtn.style.visibility = "hidden";
            header.style.opacity = "1";
            header.style.visibility = "visible";
          }
          if (panel.id == "footer") {
            const footerTimeline = gsap.timeline();

            footerTimeline.from(
              panel,
              { yPercent: 50, duration: 0.75, ease: "power2.out" },
            );
          }
        },
        onEnterBack: (e) => {
          goToSection(panel);
          if (panel.id == "video") {
            introBtn.style.opacity = "0";
            introBtn.style.visibility = "hidden";
          }
          if (panel.id == "intro") {
            introBtn.style.opacity = "1";
            introBtn.style.visibility = "visible";
            header.style.opacity = "0";
            header.style.visibility = "hidden";
          }
        },
      },
    });
  });

  // gsap end

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener("load", () => {
    initModals();
    const form = new Form();
    window.form = form;
    form.init();
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
