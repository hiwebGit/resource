/* UI */ ;
(function (window, document, $, undefined) {
  UI.curationSw = {
    sliderEl: '[data-slider="curation"]',
    defaultConfig: {
      observer: true,
      observeParents: true,
      initialSlide: 0,
      lazy: true,
      breakpoints: {
        768: {
          initialSlide: 0,
        }
      },
      on: {
        init: function () {},
      },
    },
    setSwiper: function () {
      const that = this;
      $(this.sliderEl).each(function (idx, swEl) {
        setConfig = $(swEl).attr('data-swiper') ? JSON.parse(swEl.dataset.swiper) : {};
        swEl.options = Object.assign({}, that.defaultConfig, setConfig);

        if (typeof $(swEl).attr('data-swiper-reinit') !== 'undefined') {
          const initIndex = Number($(swEl).attr('data-swiper-reinit'));
          swEl.options.initialSlide = initIndex;
          swEl.options.breakpoints[768].initialSlide = initIndex;
          $(swEl).removeAttr('data-swiper-reinit');
        }

        if (typeof swEl.options.pagination !== 'undefined') {
          swEl.options.pagination.el = $(swEl).closest('.page-kv').find('.swiper-pagination')[0];
          if (swEl.options.pagination.type === 'fraction') {
            swEl.options.pagination.formatFractionCurrent = function (number) {
              if ($(swEl).attr('data-curation-page') === 'custom' && window.winWChk === 'mo') {
                const nowPage = number - 1 !== 0 ? number - 1 : $(swEl).find('.swiper-slide:not(.swiper-slide-duplicate)').length;
                return ('0' + nowPage).slice(-2);
              } else {
                return ('0' + number).slice(-2);
              }
            }
            swEl.options.pagination.formatFractionTotal = function (number) {
              return ('0' + number).slice(-2);
            }
            swEl.options.pagination.renderFraction = function (currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span><span class="bar"></span><span class="' +
                totalClass + '"></span>';
            }
          }
        }

        if (swEl.options.navigation === true) {
          swEl.options.navigation = {
            nextEl: $(swEl).closest('.page-kv').find('.swiper-next'),
            prevEl: $(swEl).closest('.page-kv').find('.swiper-prev'),
          }
        }

        if (swEl.options.loop === true) {
          swEl.options.loopedSlides = $(swEl).find('.swiper-slide').length;
        }

        if ($(swEl).hasClass('kv-swiper__gallery') && window.winWChk === 'pc') {
          swEl.options.autoplay = false;
        }

        if (swEl.options.autoplay === true) {
          swEl.options.autoplay = {
            delay: 5000,
            disableOnInteraction: false,
          }
        }

        if ($(swEl).attr('data-curation-style') === 'active-bigger') {
          swEl.options.on.init = function () {
            $(swEl).find('.swiper-slide').addClass('changed');
          }
          swEl.options.on.slideChangeTransitionStart = function () {
            $(swEl).find('.swiper-slide').addClass('changing');
            $(swEl).find('.swiper-slide').removeClass('changed');
          }
          swEl.options.on.slideChangeTransitionEnd = function () {
            $(swEl).find('.swiper-slide').removeClass('changing');
            $(swEl).find('.swiper-slide').addClass('changed');
          }

          // slideToClickedSlide
          $('[data-slider=curation]').on('click', '.swiper-slide', function (ev) {
            if (!$(this).hasClass('swiper-slide-active')) {
              ev.preventDefault();

              var activeIdx = $(this).data('swiper-slide-index'),
                swSpeed = swEl.options.speed;

              swInstance.slideToLoop(activeIdx, swSpeed);
            }
          });
        }

        if ($(swEl).attr('data-curation-style') === 'overlap') {
          swEl.options.on.init = function () {
            if (window.winWChk === 'pc') {
              $(swEl).find('.swiper-slide').eq(this.activeIndex).css('opacity', 1).siblings('.swiper-slide').css('opacity', 0);
              $(swEl).find('.swiper-slide').eq(this.activeIndex - 1).css('opacity', 1);
              $(swEl).find('.swiper-slide').eq(this.activeIndex - 2).css('opacity', 1);
            }
          }
          swEl.options.on.slideChange = function () {
            if (window.winWChk === 'pc') {
              $(swEl).find('.swiper-slide').eq(this.activeIndex).css('opacity', 1).siblings('.swiper-slide').css('opacity', 0);
              $(swEl).find('.swiper-slide').eq(this.activeIndex - 1).css('opacity', 1);
              $(swEl).find('.swiper-slide').eq(this.activeIndex - 2).css('opacity', 1);
            }
          }
        }

        if ($(swEl).attr('data-curation-nav') === 'preview') {
          const prevNav = $(swEl).find('.swiper-prev').find('.swiper--btn__bg');
          const nextNav = $(swEl).find('.swiper-next').find('.swiper--btn__bg');

          swEl.options.on.init = function () {
            const prevImg = this.$el.find('.swiper-slide-prev').find('.kv-swiper__img img').attr('src');
            const nextImg = this.$el.find('.swiper-slide-next').find('.kv-swiper__img img').attr('src');

            prevNav.css('background-image', `url(${prevImg})`);
            nextNav.css('background-image', `url(${nextImg})`);
          }
          swEl.options.on.slideChangeTransitionStart = function () {
            const prevImg = this.$el.find('.swiper-slide-prev').find('.kv-swiper__img img').attr('src');
            const nextImg = this.$el.find('.swiper-slide-next').find('.kv-swiper__img img').attr('src');

            prevNav.css('background-image', `url(${prevImg})`);
            nextNav.css('background-image', `url(${nextImg})`);
          }

          // PW_D_OFF_32_00_00__KV.html -> 모바일일 때, 키비주얼 스와이퍼 내비게이션 버튼 배경이미지 없애기
          if (matchMedia("screen and (max-width: 768px)").matches) {
            swEl.options.on.init = function () {
              prevNav.css('background-image', 'none');
              nextNav.css('background-image', 'none');
            }
            swEl.options.on.slideChangeTransitionStart = function () {
              prevNav.css('background-image', 'none');
              nextNav.css('background-image', 'none');
            }
          }
        }

        if (typeof $(swEl).data('ui') === 'undefined') {
          if (typeof swEl.options.thumbs === 'undefined') {
            swInstance = new Swiper(swEl, swEl.options);
            //console.log(swEl.options);
            $(swEl).data('ui', swInstance);
          } else {
            const mappingSw = $(swEl).closest('[data-role="swiper-container"]').find('[data-slider="curation"]')[0].swiper;
            swInstance = new Swiper(swEl, swEl.options);
            $(swEl).data('ui', swInstance);

            swInstance.controller.control = mappingSw;
            mappingSw.controller.control = swInstance;
            swInstance.update();
            mappingSw.update();
          }
          if (typeof swEl.options.autoplay !== 'undefined') {
            if (swInstance.params.autoplay.enabled === true) {
              that.autoplaySet(swInstance, true);
            } else {
              that.autoplaySet(swInstance, false);
            }
          }
        }
      })
    },
    autoplaySet: function (sw, autoplayFlag) {
      setTimeout(function () {
        if (autoplayFlag === true) {
          const controls = sw.pagination.$el.closest('.page-kv').find('.swiper-controls');
          if (controls.find('.btn-autoplay').length === 0) {
            controls.append(
              '<button type="button" class="swiper--play btn-autoplay"><span>시작</span></button><button type="button" class="swiper--pause btn-autoplay"><span>멈춤</span></button>'
            );
          }
          if (sw.autoplay.running) {
            controls.find('.swiper--play').addClass('disabled').css('display', 'none');
            controls.find('.swiper--pause').removeClass('disabled').css('display', '');
          } else {
            controls.find('.swiper--play').removeClass('disabled').css('display', '');
            controls.find('.swiper--pause').addClass('disabled').css('display', 'none');
          }

          controls.find('.swiper--play').off('click').on('click', function () {
            sw.autoplay.start();
            controls.find('.swiper--play').addClass('disabled').css('display', 'none');
            controls.find('.swiper--pause').removeClass('disabled').css('display', '');
          });
          controls.find('.swiper--pause').off('click').on('click', function () {
            sw.autoplay.stop();
            controls.find('.swiper--play').removeClass('disabled').css('display', '');
            controls.find('.swiper--pause').addClass('disabled').css('display', 'none');
          });
        } else {
          if (sw.autoplay.running === true) {
            sw.autoplay.stop();
          }
          sw.pagination.$el.closest('.page-kv').find('.btn-autoplay').remove();
        }
      }, 300);
    },
    init: function () {
      if ($(this.sliderEl).length > 0) {
        this.setSwiper();
      }
    },
    resize: function () {
      if ($(this.sliderEl).length) {
        const that = this;
        $(this.sliderEl).each(function (idx, swEl) {
          if (typeof $(swEl).data('ui') !== 'undefined') { //case: swiper initialized
            if ($(swEl).attr('data-curation-page') === 'custom') {
              const currentIndex = $(swEl).data('ui').realIndex;
              if (window.winWChk === 'mo') {
                $(swEl).attr('data-swiper-reinit', currentIndex + 1)
              } else {
                $(swEl).attr('data-swiper-reinit', currentIndex - 1)
              }
              $(swEl).data('ui').destroy();
              $(swEl).removeData('ui');
              setTimeout(function () {
                that.setSwiper();
              }, 300)
            }
            if ($(swEl).hasClass('kv-swiper__gallery')) {
              if (window.winWChk === 'mo') {
                that.autoplaySet($(swEl).data('ui'), true);
                $(swEl).data('ui').autoplay.start();
              } else {
                that.autoplaySet($(swEl).data('ui'), false);
                $(swEl).data('ui').autoplay.stop();
              }
            }
            if ($(swEl).attr('data-curation-style') === 'overlap') {
              const sw = $(swEl).data('ui');
              if (window.winWChk === 'mo') {
                $(sw.slides).css('opacity', '');
              } else {
                $(sw.slides[sw.activeIndex]).css('opacity', 1).siblings('.swiper-slide').css('opacity', 0);
                $(sw.slides[sw.activeIndex - 1]).css('opacity', 1);
                $(sw.slides[sw.activeIndex - 2]).css('opacity', 1);
              }
            }

            if ($(swEl).attr('data-curation-style') === 'active-bigger') {
              const sw = $(swEl).data('ui');
              if (window.winWChk === 'pc') {
                $(sw.slides).css('width', '')
                sw.update();
              }
            }
          }
        });
      }
    },
  }
  UI.curationSw.init();

})(window, document, jQuery);