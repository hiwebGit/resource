/* UI */ ;
(function (window, document, $, undefined) {
  UI.mainUI = {
    resizeSt: null,
    kvSlider: {
      sw: null,
      el: '.main-kv__slider',
      constrols: '.main-kv-controls',
      config: {
        slidesPerView: 1,
        effect: 'fade',
        observer: true,
        observeParents: true,
        lazy: true,
        loop: true,
        loopedSlides: 5,
        speed: 800,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.main-kv__pagination',
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: $('.main-kv-controls').find('.swiper--btn-next'),
          prevEl: $('.main-kv-controls').find('.swiper--btn-prev'),
        },
        on: {
          init: function () {
            const that = this;
            UI.mainUI.kvSlider.changeEv(that, 0);
            setTimeout(function () {
              UI.mainUI.kvSlider.autoplayControl(that);
            }, 300)
          },
          beforeTransitionStart: function () {
            UI.mainUI.kvSlider.changeEv(this, null);
          },
          slideChangeTransitionEnd: function () {
            UI.mainUI.kvSlider.changeEv(this, this.activeIndex);
          }
        },
      },
      init: function () {
        if ($(this.el).length) {
          if (!$(this.el).hasClass('done')) {
            $(this.el).addClass('done');
            $(this.el).find('.main-kv__title').each(function (idx, title) {
              const brExp = /<br\s*\/?>/i;
              const english = /^[A-Za-z0-9]*$/;
              const lines = title.innerHTML.split(brExp);
              let newLine = '';
              $.each(lines, function (idx, txt) {
                let newLetter = '';
                for (let i = 0; i < txt.length; i++) {
                  if (txt[i] !== ' ') {
                    if (idx === 0 && i == 0 && english.test(txt[i])) {
                      newLetter += `<span class="letter letter-italic">${txt[i]}</span>`;
                    } else {
                      newLetter += `<span class="letter">${txt[i]}</span>`;
                    }
                  } else {
                    newLetter += ' ';
                  }
                }
                newLine += `<span class="line">${newLetter}</span>`
              });
              title.innerHTML = newLine;
            })

          }
          if (this.sw === null) {
            this.sw = new Swiper(this.el, this.config);
          }
        }
      },
      changeEv: function (sw, idx) {
        if (idx === null) {
          sw.slides.find('[data-ani="obj"].active').addClass('hide');
          sw.slides.find('.letter.active').addClass('hide');
          sw.$el.closest('.main-kv').find('.circle').removeClass('active');
          return false;
        }
        sw.slides.eq(idx).find('[data-ani="obj"]').addClass('active');
        sw.slides.eq(idx).find('.line').each(function (lineIndex, line) {
          $(line).find('.letter').each(function (letterIndex, letter) {
            setTimeout(function () {
              $(letter).addClass('active');
            }, (lineIndex + letterIndex) * 80);
          })
        })
        sw.$el.closest('.main-kv').find('.circle').addClass('active');
        sw.slides.find('.letter.active.hide').removeClass('active hide');
        sw.slides.find('[data-ani="obj"].active.hide').removeClass('active hide');

        setTimeout(function () {
          if (sw.autoplay.running === true) {
            sw.slides.eq(idx).find('[data-ani="obj"].active').addClass('hide');
            sw.slides.eq(idx).find('.line').each(function (lineIndex, line) {
              $(line).find('.letter.active').each(function (letterIndex, letter) {
                setTimeout(function () {
                  $(letter).addClass('hide');
                }, (lineIndex + letterIndex) * 80);
              })
            })
          }
        }, 3000)
      },
      autoplayControl: function (sw) {
        const that = this;
        if (sw.autoplay.running) {
          that.btnState()
        } else {
          that.btnState('paused');
        }

        $(that.constrols).find('.swiper--play').off('click').on('click', function () {
          sw.autoplay.start();
          that.btnState()
        });
        $(that.constrols).find('.swiper--pause').off('click').on('click', function () {
          sw.autoplay.stop();
          that.btnState('paused');
        });
      },
      btnState: function (flag = 'play') {
        if (flag === 'play') {
          $(this.constrols).find('.swiper--play').addClass('disabled').css('display', 'none');
          $(this.constrols).find('.swiper--pause').removeClass('disabled').css('display', '');
        } else {
          $(this.constrols).find('.swiper--play').removeClass('disabled').css('display', '');
          $(this.constrols).find('.swiper--pause').addClass('disabled').css('display', 'none');
        }
      }
    },
    reviewSlider: {
      pcSw: null,
      moSw: null,
      pcEl: '.main-recommend-swiper-pc',
      moEl: '.main-recommend-swiper-mo',
      pcConfig: {
        slidesPerView: "auto",
        speed: 650,
        spaceBetween: 50,
        observer: true,
        observeParents: true,
        slideToClickedSlide: true,
        navigation: {
          nextEl: '.main-recommend-navi .swiper-next',
          prevEl: '.main-recommend-navi .swiper-prev',
        },
        pagination: {
          el: ".main-recommend-swiper-pc .swiper-pagination",
          type: 'bullets',
          clickable: true,
        },
        on: {
          init: function () {
            var n = 0;
            $('.main-recommend-cont__slide').eq(n + 1).addClass('revise');
          }
        },
      },
      moConfig: {
        slidesPerView: 1,
        speed: 650,
        spaceBetween: 18,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".main-recommend-swiper-mo .swiper-pagination",
          type: 'bullets',
          clickable: true,
        },
      },
      init: function () {
        if (window.winWChk == 'pc') {
          if ($(this.pcEl).length) {
            if (this.pcSw === null) {
              this.pcSw = new Swiper(this.pcEl, this.pcConfig);
              this.likeActive();
            }
          }
        } else {
          if ($(this.moEl).length) {
            if (this.moSw === null) {
              this.moSw = new Swiper(this.moEl, this.moConfig);
              this.likeActive();
            }
          }
        }
      },
      resize: function () {
        this.init();
      },
      likeActive: function () {
        const that = this;
        if (window.winWChk == 'pc') {
          clickedEl = $(that.pcEl);
          toggleEl = $(that.moEl)
        } else {
          clickedEl = $(that.moEl);
          toggleEl = $(that.pcEl)
        }
        clickedEl.find('.btn-fav').each(function (idx, btn) {
          $(btn).off('click.like').on('click.like', function (e) {
            const target = $(e.currentTarget);
            setTimeout(function () {
              if (target.hasClass('is-fav')) {
                toggleEl.find('.btn-fav').eq(idx).addClass('is-fav');
              } else {
                toggleEl.find('.btn-fav').eq(idx).removeClass('is-fav')
              }
            }, 500)
          })
        })
      }
    },
    bestSlider: {
      sw: null,
      el: '.best-slide-wrap',
      config: {
        navigation: {
          nextEl: ".best-slide-wrap .swiper-next",
          prevEl: ".best-slide-wrap .swiper-prev",
        },
        pagination: {
          el: ".main-best__pagination",
          type: 'bullets',
          clickable: true,
        },
        breakpoints: {
          360: {
            // 이미지 크기 복원 안되는 이슈로 주석 처리
            // slidesPerView: 1.25,
          }
        },
        slidesPerView: 'auto',
        centeredSlides: true,
        observer: true,
        speed: 800,
        on: {
          slideChangeTransitionStart: function () {
            const imgSrc = this.slides.eq(this.activeIndex).find('.best-item__img img').attr('src');
            this.$el.closest('.main-best-section').find('.full-image img').attr('src', imgSrc);
          },
          // slideChangeTransitionEnd: function () {
          //   this.$el.closest('.main-best-section').find('.full-image').removeClass('dark');
          // },
          // slideChange: function () {
          //   this.$el.closest('.main-best-section').find('.full-image').addClass('dark');
          // }
        }
      },
      init: function () {
        if ($(this.el).length) {
          if (this.sw === null) {
            this.sw = new Swiper(this.el, this.config);
          }
        }
      }
    },
    infoSlider: {
      sw: null,
      el: '.main-info__swiper',
      config: {
        slidesPerView: 'auto',
        autoHeight: true,
        touchRatio: 0.2,
        speed: 0,
        // delay: 3000,
        loop: true,
        slideToClickedSlide: true,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: ".main-info-section .swiper-next",
          prevEl: ".main-info-section .swiper-prev"
        },
        pagination: {
          el: ".main-info-section .swiper-paging",
          type: 'bullets',
          clickable: true
        },
        // initialSlide: 0,
        // slideToClickedSlide: true,
        // spaceBetween: 240,
        breakpoints: {
          // 1280: {
          //   spaceBetween: 318,
          // },
          768: {
            speed: 100,
            spaceBetween: 16,
            touchRatio: 0.2,
            pagination: {
              el: ".main-info-section .swiper-paging",
              type: 'bullets',
              clickable: true
            },
            observer: true,
            observeParents: true
          }
        },
      },
      init: function () {
        if ($(this.el).length) {
          if (this.sw === null) {
            this.sw = new Swiper(this.el, this.config);
          }
        }
        if (typeof (swiper) == 'object') swiper.destroy();
      },
      resize: function () {
        this.init();
      }
    },
    artGuideSlider: {
      sw: null,
      el: '.main-art__swiper',
      config: {
        loop: true,
        touchRatio: 0.2,
        spaceBetween: 16,
        slidesPerView: 1,
        speed: 100,
        pagination: {
          el: ".main-art__swiper .swiper-paging",
          type: 'bullets',
          clickable: true,
        },
      },
      init: function () {
        if (window.winWChk == 'mo' && this.sw === null) {
          this.sw = new Swiper(this.el, this.config);
        }
        if (window.winWChk == 'pc' && this.sw !== null) {
          this.sw.destroy();
          this.sw = null;
        }
      },
      resize: function () {
        this.init();
      }
    },
    artistQuizSlide: {
      sw: null,
      el: '.main-artist-quiz .swiper-container',
      config: {
        slidesPerView: 1,
        pagination: {
          el: ".main-artist-quiz__controls .swiper-pagination",
          type: 'bullets',
        },
        navigation: {
          nextEl: ".main-artist-quiz__controls .swiper-next",
          prevEl: ".main-artist-quiz__controls .swiper-prev",
        },
      },
      init: function () {
        if ($(this.el).length) {
          if (this.sw === null) {
            this.sw = new Swiper(this.el, this.config);
          }
        }
      }
    },
    artistNewSlide: {
      sw: null,
      el: '.main-artist-new .swiper-container',
      config: {
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        loop: true,
        loopedSlides: 7,
        pagination: {
          el: ".main-artist-new__controls .swiper-pagination",
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: ".main-artist-new__controls .swiper-next",
          prevEl: ".main-artist-new__controls .swiper-prev",
        },
        on: {
          init: function () {
            this.$el.find('.swiper-slide').addClass('changed');
          },
          slideChangeTransitionStart: function () {
            this.$el.find('.swiper-slide').addClass('changing');
            this.$el.find('.swiper-slide').removeClass('changed');
          },
          slideChangeTransitionEnd: function () {
            this.$el.find('.swiper-slide').removeClass('changing');
            this.$el.find('.swiper-slide').addClass('changed');
          },
        }
      },
      init: function () {
        if ($(this.el).length) {
          if (this.sw === null) {
            this.sw = new Swiper(this.el, this.config);
          }
        }
      }
    },
    newsSlide: {
      sw: null,
      el: '.tab-content .news-slide-wrap',
      config: {
        slidesPerView: 'auto',
        spaceBetween: '48',
        observer: true,
        observeParents: true,
        breakpoints: {
          768: {
            slidesPerView: '1',
            spaceBetween: '20',
            //centeredSlides: true,
          },
        },
        pagination: {
          el: ".main-news-controls .main-news__pagination",
          type: 'bullets',
          clickable: true
        },
        navigation: {
          nextEl: ".main-news-navi .swiper-next",
          prevEl: ".main-news-navi .swiper-prev",
        }
      },
      init: function () {
        if ($(this.el).length) {
          console.log(this.sw)
          if (this.sw === null) {
            if ((window.winWChk == 'mo')) {
              this.sw = new Swiper(this.el, this.config);
            }
          } else {
            if ((window.winWChk == 'pc')) {
              this.sw.destroy();
              this.sw = null
            } else {
              this.sw = new Swiper(this.el, this.config);
            }
          }
        }
      },
      resize: function () {
        console.log('new rewsiuze')
        this.init();
      },
    },
    init: function () {
      this.kvSlider.init();
      this.reviewSlider.init();
      this.bestSlider.init();
      // this.infoSlider.init();
      this.artGuideSlider.init();
      this.artistQuizSlide.init();
      this.artistNewSlide.init();
      //this.newsSlide.init();
    },
    resize: function () {
      if (UI.mainUI.resizeSt !== null) {
        clearTimeout(UI.mainUI.resizeSt);
      }
      UI.mainUI.resizeSt = setInterval(function () {
        UI.mainUI.reviewSlider.resize();
        UI.mainUI.artGuideSlider.resize();
        //UI.mainUI.newsSlide.resize();
        clearTimeout(UI.mainUI.resizeSt);
        UI.mainUI.resizeSt = null;
      }, 500);
    },
    scroll: function () {

    }
  }
})(window, document, jQuery);

$(function () {
  UI.mainUI.init();

  $(window).on('resize', function () {
    UI.mainUI.resize();
  })

  $(window).on('scroll', function () {
    UI.mainUI.scroll();
  })
});