var sliderOne = new Swiper(".screenshots-slider", {
  slidesPerView: 4.5,
  spaceBetween: 15,
  freeMode: true,
  loop: true,

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    991: {
      slidesPerView: 3,
    },
    1199: {
      slidesPerView: 4,
    },
    1640: {
      slidesPerView: 5,
    },
  },

  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
