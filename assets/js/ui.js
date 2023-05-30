/* UI */ ;
(function (window, document, $, undefined) {
  var UI = UI || {};
  window.st = null;
  const winW = window.innerWidth;
  if (window.winWChk != 'mo' && winW <= 768) {
    window.winWChk = 'mo'
  }

  if (window.winWChk != 'pc' && winW >= 769) {
    window.winWChk = 'pc'
  }

  $.fn.scrollStopped = function (callback) {
    var that = this,
      $this = $(that);

    $this.scroll(function (ev) {
      clearTimeout($this.data('scrollTimeout'));
      $this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
    });
  };

  UI.userAgentCheck = function () {
    var deviceCheck;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      deviceCheck = true
    } else {
      deviceCheck = false;
    }
    return deviceCheck;
  }

  // all menu show/hide
  UI.allMenu = {
    openBtn: '[data-allmenu=open]',
    closeBtn: '[data-allmenu=close]',
    allSect: '.all-section',
    allSectActive: 'is-active',
    allMenuSw: null,
    init: function () {
      var _this = this;
      var eventName = (window.winWChk == 'mo') ? 'click' : 'mouseenter';

      $('#header').off('click.allmenuEv').off('mouseenter.allmenuEv').on(eventName + '.allmenuEv', _this.openBtn, function () {
        _this.headerReset();

        if ($(_this.allSect).hasClass(_this.allSectActive)) {
          _this.hidden();
        } else {
          _this.open();
        }
      })

      $(document).off('click', this.closeBtn).on('click', this.closeBtn, function () {
        _this.hidden();
      })

      $(document).off('click', ".all-section [data-menu = search]").on('click', ".all-section [data-menu = search]", function () {
        $(".header-search-bar__wrap").toggleClass(_this.allSectActive);
      });
      // 개발 현행화
      $(document).off('click', '.all-section .gnb-menu__depbox > li > a, .all-section-bottom .inquiry-btn, .app-home, .buddy-banner__item')
        .on('click', '.all-section .gnb-menu__depbox > li > a, .all-section-bottom .inquiry-btn, .app-home, .buddy-banner__item', function () {
          $(".all-section ").removeClass("is-active");
          $('#wrap').removeClass('dim');
          $('#header').removeClass('header--opened is-open');
          $('.lnb-menu').removeClass('is-lnb-active');
        });

      // $(this.closeBtn).off('click.allmenuClose').on('click.allmenuClose', function () {
      //   _this.hidden();
      // })

      // $(".all-section [data-menu = search]").off('click.allsearch').on('click.allsearch', function () {
      //   $(".header-search-bar__wrap").toggleClass(_this.allSectActive);
      // });

    },
    headerReset: function () {
      $('.header__box').hide();
      $('#header').removeClass('header--opened');
      $('#wrap').removeClass('dim');
    },
    hidden: function () {
      $(this.allSect).removeClass(this.allSectActive);
      $('#header').removeClass('header--opened');
      $('#wrap').removeClass('dim');
      $(document).off('mouseover.allMouse');
    },
    open: function () {
      var _this = this;
      $(this.allSect).addClass(this.allSectActive);
      $('#header').addClass('header--opened');
      $('#wrap').addClass('dim');

      // 커튼배너 클래스 추가 
      if ($('.cotton-banner').hasClass('is-active')) {
        $('.all-section.is-active').addClass('bannerOn');
      }

      if (UI.gnb.headerSw !== null) {
        UI.gnb.headerSw.destroy();
        UI.gnb.headerSw = null;
      }

      if (window.winWChk == 'pc') {
        if (!$('.all-section-wrap .buddy-card.show-pc').hasClass('swiper-container-initialized')) {
          _this.allMenuSw = new Swiper('.all-section-wrap .buddy-card.show-pc', {
            slidePerView: '1',
            autoplay: {
              delay: 2000,
            },
            pagination: {
              el: ".swiper-pagination",
            },
          });
        }
        $(document).on('mouseover.allMouse', function (e) {
          _this.leaveEv(e.target);
        });
      } else {
        if (!$('.all-section-wrap .buddy-card.show-mo').hasClass('swiper-container-initialized')) {
          _this.allMenuSw = new Swiper('.all-section-wrap .buddy-card.show-mo', {
            slidePerView: '1',
            autoplay: {
              delay: 2000,
            },
          });
        }
      }
    },
    leaveEv: function (target) {
      if ($(target).closest('.header--opened').length <= 0) {
        this.headerReset();
        this.hidden();
      }
    },
    resize: function () {
      if (this.allMenuSw !== null) {
        this.allMenuSw.destroy();
        this.allMenuSw = null;
      }
      this.hidden();
      this.init();
    }
  }

  UI.gnb = {
    el: '.header',
    box: '.header__box',
    IsScrolling: 'header--ing',
    IsScrolled: 'header--scroll',
    IsScrollend: 'header--active',
    IsMenuOpened: 'header--opened',
    menuActive: 'is-menu-active',
    headerSw: null,
    init: function () {
      this.scrollCheckSet(window);
      this.scroll();
      this.scrollEnd(50, window);
      this.resize();
    },
    scroll: function () {
      var _this = this;
      $(window).on('scroll', function () {
        $(_this.el).addClass(_this.IsScrolling);
        _this.scrollCheckSet(window);
      });
    },
    scrollCheckSet: function (obj) {
      var _this = this;
      var scrollT = $(obj).scrollTop();
      if (scrollT > 0) {
        $(_this.el).addClass(_this.IsScrolled);
      } else {
        $(_this.el).removeClass(_this.IsScrolled);
      }
    },
    scrollEnd: function (time, obj) {
      var _this = this;
      $(obj).scrollStopped(function (ev) {
        setTimeout(() => {
          $(_this.el).removeClass(_this.IsScrolling);

          if ($(obj).scrollTop() > 0) {
            $(_this.el).addClass(_this.IsScrollend).addClass(_this.IsScrolled);
          } else {
            $(_this.el).addClass(_this.IsScrollend).removeClass(_this.IsScrolled);
          }
        }, time);
      });
    },
    gnbHover: function () {
      var _this = this;
      if (window.winWChk == 'pc') {
        $(_this.el).off('mouseenter.gnbHover').on('mouseenter.gnbHover', '[data-gnb]', function () {
          var $gnbMenuBox = $('[data-header-box=gnb]'),
            rType = 'type-right';

          $(_this.box).show();
          $(_this.el).addClass(_this.IsMenuOpened);
          $('#wrap').addClass('dim');

          $gnbMenuBox.addClass(_this.menuActive).siblings().removeClass(_this.menuActive);
          $('[data-lnb=' + $(this).data('gnb') + ']').show().siblings().hide();

          if ($(this).data('dir') == 'right') {
            $gnbMenuBox.addClass(rType);
          } else {
            $gnbMenuBox.removeClass(rType);
          }

          _this.swInit();

          $(document).off('mouseover.gnbMouse').on('mouseover.gnbMouse', function (e) {
            _this.leaveEv(e.target);
          });
        });
      } else {
        $(_this.el).off('mouseenter.gnbHover')
      }
    },
    menuHover: function () {
      var _this = this;
      if (window.winWChk == 'pc') {
        $(_this.el).off('mouseenter.menuHover').on('mouseenter.menuHover', '[data-menu]', function () {
          var $menuBox = $('[data-header-box=' + $(this).data('menu') + ']');

          UI.allMenu.hidden();
          $(_this.box).show();
          $(_this.el).addClass(_this.IsMenuOpened);
          $('#wrap').addClass('dim');

          $menuBox.addClass(_this.menuActive).siblings().removeClass(_this.menuActive);

          $(document).off('mouseover.gnbMouse').on('mouseover.gnbMouse', function (e) {
            _this.leaveEv(e.target);
          });
        });
      } else {
        $(_this.el).off('mouseenter.menuHover')
      }
    },
    headerReset: function () {
      $(this.box).hide();
      $('#header').removeClass(this.IsMenuOpened);
    },
    leaveEv: function (target) {
      if ($(target).closest('.header--opened').length <= 0) {
        this.headerReset();
        this.hidden();
      }
    },
    hidden: function () {
      $('[data-header-box]').removeClass(this.menuActive);
      UI.allMenu.hidden();
    },
    swInit: function () {
      if (!$('.header__box .buddy-card').hasClass('swiper-container-initialized')) {
        this.headerSw = new Swiper('.header__box .buddy-card', {
          slidePerView: '1',
          autoplay: {
            delay: 5000,
          },
          pagination: {
            el: ".buddy-card .swiper-pagination",
          },
        });
      } else {
        this.headerSw.destroy();
        this.headerSw = new Swiper('.header__box .buddy-card', {
          slidePerView: '1',
          autoplay: {
            delay: 3000,
          },
          pagination: {
            el: ".buddy-card .swiper-pagination",
          },
        });
      }
    },
    resize: function () {
      this.gnbHover();
      this.menuHover();
      if (window.winWChk == 'pc') {
        $(document).off('mouseover.gnbEvtOff').on('mouseover.gnbEvtOff', function () {
          if (!$(UI.gnb.el).hasClass(UI.gnb.IsMenuOpened)) {
            $(document).off('mouseover.gnbMouse')
          }
        });
      } else {
        $(document).off('mouseover.gnbEvtOff')
      }
    }
  }

  UI.gnbSelect = {
    gnbEl: '.gnb-menu',
    gnbCur: '.gnb-menu__current',
    gnbList: '.gnb-menu__list',
    gnbListItem: '.gnb-menu__list li',
    openName: 'is-gnb-active',
    selectName: 'is-active',
    init: function () {
      this.openEv();
    },
    openChk: function (wrapper) {
      var chk = undefined;
      chk = wrapper.hasClass(this.openName) ? true : false;

      return chk;
    },
    openEv: function () {
      var _this = this;

      $('#header').on('click', _this.gnbCur, function (ev) {
        var $gnbBox = $(ev.target).closest(_this.gnbEl);

        if (_this.openChk($gnbBox)) {
          $gnbBox.removeClass(_this.openName);
          _this.headerCheck.close();
        } else {
          $gnbBox.addClass(_this.openName);
          _this.headerCheck.open();
        }

      });

      _this.selectEv();
    },
    selectEv: function () {
      var _this = this;

      $('#header').on('click', _this.gnbListItem + ' a', function (ev) {
        var target = $(ev.currentTarget);
        var $gnbBox = target.closest(_this.gnbEl);
        var curText = target.html();
        var $selItem = target.closest('li');
        var curImgName = target.data('gnb-sel');

        $gnbBox.removeClass(_this.openName).find(_this.gnbCur).html(curText).removeAttr('data-gnb-sel-cur').attr('data-gnb-sel-cur', curImgName);
        $gnbBox.find(_this.gnbListItem).removeClass(_this.selectName);
        $selItem.addClass(_this.selectName);
        _this.headerCheck.close();

        if (target.attr('href') == "#") {
          ev.preventDefault();
        }
      });
    },
    resize: function () {
      $(this.gnbEl).removeClass(this.openName);
    },
    headerCheck: {
      open: function () {
        $('#header').addClass('is-open');
      },
      close: function () {
        $('#header').removeClass('is-open');
      }
    }
  }

  UI.lnbSelect = {
    lnbEl: '.lnb-menu',
    lnbCur: '.lnb-menu__current',
    lnbList: '.lnb-menu__list',
    lnbListItem: '.lnb-menu__list li',
    openName: 'is-lnb-active',
    selectName: 'is-active',
    init: function () {
      this.openEv();
    },
    openChk: function (wrapper) {
      var chk = undefined;
      chk = wrapper.hasClass(this.openName) ? true : false;

      return chk;
    },
    openEv: function () {
      var _this = this;

      $('#header').on('click', _this.lnbCur, function (ev) {
        console.log(2);
        $('.lnb-menu__list .sel').removeClass('sel')
        var $lnbBox = $(ev.target).closest(_this.lnbEl);

        if (_this.openChk($lnbBox)) {
          $lnbBox.removeClass(_this.openName);
          _this.headerCheck.close();
        } else {
          $lnbBox.addClass(_this.openName);
          _this.headerCheck.open();
        }

      });

      _this.selectEv();
    },
    selectEv: function () {
      var _this = this;

      // 20230518 test
      setTimeout(function () {
        $('.is-lnb-active').removeClass('is-lnb-active');
      }, 1000);
      // //20230518 test




      $('#header').on('click', _this.lnbListItem + ' a', function (ev) {
        var target = $(ev.currentTarget);
        var $lnbBox = target.closest(_this.lnbEl);
        var curText = target.html();
        var $selItem = target.closest('li');

        // 20230518 $lnbBox.removeClass(_this.openName).find(_this.lnbCur).html(curText);
        // 20230518
        // 20230525
        $('.lnb-menu__list').find('.my-2dp').slideUp();
        if ($(window).width() <= 768) {
          if ($(this).attr('class') == 'no-dp') {
            $lnbBox.removeClass(_this.openName).find(_this.lnbCur).html(curText);
          } else { // 2뎁스 없다면
            if ($(this).closest('li').hasClass('sel')) {
              $(this).closest('li').removeClass('sel');
            } else {
              console.log(1);
              $('.lnb-menu__list').find('.sel').removeClass('sel');
              $(this).next().slideDown();
              $(this).closest('li').addClass('sel');
            }
          }
        }


        // //20230518 
        $lnbBox.find(_this.lnbListItem).removeClass(_this.selectName);
        $selItem.addClass(_this.selectName);
        _this.headerCheck.close();

        if (target.attr('href') == "#") {
          ev.preventDefault();
        }
      });


    },
    resize: function () {
      $(this.lnbEl).removeClass(this.openName);
    },
    headerCheck: {
      open: function () {
        $('#header').addClass('is-open');
      },
      close: function () {
        $('#header').removeClass('is-open');
      }
    }
  }

  UI.headerBanner = {
    slider: null,
    sliderEl: '.lnb-slider',
    observer: true,
    observeParents: true,
    config: {
      slidePerView: '1',
      pagination: {
        el: '.lnb-slider__pagination',
      },
      on: {
        init: function () {}
      }
    },
    init: function () {
      if ($(this.sliderEl).find('.swiper-slide').length > 0) {
        if (!$(this.sliderEl).hasClass('swiper-container-initialized')) {
          this.slider = new Swiper(this.sliderEl, this.config);
        } else {
          // this.slider.update();
        }
      }
    },
  }

  UI.mainKeyvisual = {
    slider: null,
    sliderEl: '.main-kv__slider',
    config: {
      slidePerView: '1',
      pagination: {
        el: '.main-kv__pagination',
      },
      loop: true,
      // autoplay: {
      //   delay: 7000,
      // },
      on: {
        init: function () {},
        slideChange() {
          $(this.sliderEl).find('.swiper-slide-active .main-kv__thumb').addClass('active');
          // console.log('slide changed');
        }
      }
    },
    init: function () {
      if ($(this.sliderEl).find('.swiper-slide').length > 0) {
        if (!$(this.sliderEl).hasClass('swiper-container-initialized')) {
          this.slider = new Swiper(this.sliderEl, this.config);
        } else {
          this.slider.update();
        }
      }
    },
  }

  UI.adBanner = {
    slider: null,
    sliderEl: '.ad-banner',
    config: {
      slidePerView: '1',
      pagination: {
        el: '.ad-banner__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.ad-swiper-button-next'
      },
      loop: true,
      autoplay: {
        delay: 5000,
      },
    },
    init: function () {
      if ($(this.sliderEl).find('.swiper-slide').length > 0) {
        if (!$(this.sliderEl).hasClass('swiper-container-initialized')) {
          this.slider = new Swiper(this.sliderEl, this.config);
        } else {
          this.slider.update();
        }
        UI.swAutoplayAdd(this.slider);
      } else {
        // ad-banner 아이템이 없을대 마진값 삭제
        $('.ad-banner-wrap').css({
          margin: 0,
        });
      }
    },
  }

  UI.reviewSwiper = {
    slider: null,
    sliderEl: '.review-thum',
    swiper: function () {
      $(this.sliderEl).each(function (idx, el) {
        if (window.innerWidth <= 768) {
          if ($(el).find('.swiper-slide').length > 2) {
            if (!$(el).hasClass('swiper-container-initialized')) {
              this.slider = new Swiper(el, {
                slidesPerView: 'auto',
                loop: false,
                observer: true,
              });
            } else {
              this.slider.update();
            }
          }
        } else {
          if ($(el).hasClass('swiper-container-initialized')) {
            this.slider.destroy();
          }
        }
      })
    },
    init: function () {
      var _this = this;
      _this.swiper();

      $(window).on('resize', function () {
        _this.swiper();
      });
    },
  }

  UI.artItem = {
    slider: null,
    sliderEl: '.art-vt-slide__content',
    swiper: function () {
      $(this.sliderEl).each(function (idx, el) {
        if (window.innerWidth <= 768) {
          // s 슬라이드 1개일때 영역 안잡히는 부분 수정
          if ($(el).find('.swiper-slide').length >= 1) {
            // e 슬라이드 1개일때 영역 안잡히는 부분 수정
            if (!$(el).hasClass('swiper-container-initialized')) {
              var _pagination = $(el).closest('.art-vt-slide__wrap').find('.art-vt-slide__pagination')[0];
              this.slider = new Swiper(el, {
                slidesPerView: '1',
                pagination: {
                  el: _pagination,
                },
                loop: false,
                observer: true,
              });
            } else {
              this.slider.update();
            }
          }
        } else {
          if ($(el).hasClass('swiper-container-initialized')) {
            this.slider.destroy();
          }
        }
      })
    },
    init: function () {
      var _this = this;
      _this.swiper();

      $(window).on('resize', function () {
        _this.swiper();
      });
    },
  }

  UI.pdtVtSlider = {
    slider: null,
    sliderEl: '.pdt-vt-slider',
    swiper: function () {
      $(this.sliderEl).each(function (idx, el) {
        if (window.innerWidth <= 768) {
          if ($(el).find('.swiper-slide').length > 1) {
            if (!$(el).hasClass('swiper-container-initialized')) {
              var _pagination = $(el).closest('.pdt-vt-wrap').find('.pdt-vt-slide__pagination')[0];
              this.slider = new Swiper(el, {
                slidesPerView: 1,
                pagination: {
                  el: _pagination,
                },
                loop: false,
                observer: true,
              });
            } else {
              this.slider.update();
            }
          }
        } else {
          if ($(el).hasClass('swiper-container-initialized')) {
            this.slider.destroy();
          }
        }
      })
    },
    init: function () {
      var _this = this;
      _this.swiper();

      $(window).on('resize', function () {
        _this.swiper();
      });
    },
  }

  UI.pfListKeyvisual = {
    slider: null,
    sliderEl: '.pf-kv__slider',
    config: {
      slidePerView: '1',
      pagination: {
        el: '.pf-kv__pagination',
        type: 'fraction',
        formatFractionCurrent: function (number) {
          return ('0' + number).slice(-2);
        },
        formatFractionTotal: function (number) {
          return ('0' + number).slice(-2);
        },
        renderFraction: function (currentClass, totalClass) {
          return `<span class="${currentClass}"></span><span class="bar"></span><span class="${totalClass}"></span>`;
        }
      },
      observer: true,
      observeParents: true,
      loop: true,
      autoplay: {
        delay: 7000,
      },
      navigation: {
        nextEl: '.pf-kv__nav.swiper-button-next',
        prevEl: '.pf-kv__nav.swiper-button-prev',
      },
      on: {
        init: function () {},
        slideChange() {
          $(this.sliderEl).find('.swiper-slide-active .pf-kv__thumb').addClass('active');
          // console.log('slide changed');
        },

      }
    },
    init: function () {
      if ($(this.sliderEl).find('.swiper-slide').length > 0) {
        if (!$(this.sliderEl).hasClass('swiper-container-initialized')) {
          this.slider = new Swiper(this.sliderEl, this.config);
        } else {
          this.slider.update();
        }
      }
    },
  }

  UI.toggleSection = {
    el: '[data-toggle]',
    init: function () {
      var _this = this;

      $(_this.el).on('click', function () {
        var $btn = $(this),
          btnToggleName = $btn.data('toggle'),
          relName = $btn.data('toggleRel');

        if ($btn.hasClass(btnToggleName)) {
          $btn.removeClass(btnToggleName);
        } else {
          $btn.addClass(btnToggleName);
        }

        if (relName) {
          var $relSect = $('[data-section=' + relName + ']');
          var sectToggleName = $relSect.data('toggleSection');

          if ($relSect.hasClass(sectToggleName)) {
            $relSect.removeClass(sectToggleName);
          } else {
            $relSect.addClass(sectToggleName);
          }
        }
      });
    }
  }

  UI.toggleLike = function () {
    var btnLike = '.btn-fav',
      toggleLike = 'is-fav';

    $(document).on('click', btnLike, function (ev) {
      if (ev.target.tagName == 'BUTTON' || ev.target.tagName == 'A') {

        if ($(ev.target).hasClass(toggleLike)) {
          $(ev.target).removeClass(toggleLike);
        } else {
          $(ev.target).addClass(toggleLike);
        }
      }
      // $(btnLike).hasClass(toggleLike) ? $(this).removeClass(toggleLike) : $(this).addClass(toggleLike);
    });
  }

  UI.toggleActive = {
    addAct: function (obj, name) {

    },
    removeAct: function (obj, name) {

    },
    toggleAct: function (obj, name) {

    }
  }

  // UI

  UI.tab = {
    varSet: {
      tabWrapper: '[data-tab=tab-wrap]',
      tabBtn: '[data-tab=tab-btn]',
      tabBtnArea: '[data-tab=tab-list]',
      tabCont: '[data-tab=tab-content]',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      $(_this.varSet.tabBtn).on('click', function (ev) {
        if ($(ev.target).attr('href') == '#') {
          ev.preventDefault();
        }
        _this.clickEv(ev);
      });
    },
    clickEv: function (ev) {
      var _this = this;
      $(ev.target).closest(_this.varSet.tabBtnArea).find(_this.varSet.tabBtn).removeClass(_this.varSet.activeClassName);
      $(ev.target).addClass(_this.varSet.activeClassName);
    },
  }

  UI.sortList = {
    sortEl: '.view-sort',
    sortBtn: '.view-sort__btn',
    sortCur: '.view-sort__cur',
    sortList: '.view-sort__list',
    openName: 'is-open',
    selectName: 'sort-on',
    init: function () {
      this.openEv();
    },
    openChk: function (wrapper) {
      var chk = undefined;
      chk = wrapper.hasClass(this.openName) ? true : false;

      return chk;
    },
    openEv: function () {
      var _this = this;

      $(_this.sortCur).on('click', function (ev) {
        var $sortBox = $(ev.target).closest(_this.sortEl);

        if (_this.openChk($sortBox)) {
          $sortBox.removeClass(_this.openName);
        } else {
          $sortBox.addClass(_this.openName);
        }
      });

      _this.selectEv();
    },
    selectEv: function () {
      var _this = this;

      $(_this.sortBtn).on('click', function (ev) {
        var $sortBox = $(ev.target).closest(_this.sortEl);
        var curText = $(ev.target).text();
        $sortBox.removeClass(_this.openName).find(_this.sortCur).text(curText);
        $sortBox.find('li').removeClass(_this.selectName)
        $(ev.target).closest('li').addClass(_this.selectName);
      });
    },
    resize: function () {
      $(this.sortEl).removeClass(this.openName);
    },
  }

  UI.dropdownList = {
    el: '.dropdown',
    curBtn: '.dropdown__cur',
    list: '.dropdown__list',
    btn: '.dropdown__btn',
    openName: 'is-open',
    selectName: 'is-on',
    init: function () {
      this.openEv();
    },
    openChk: function (wrapper) {
      var chk = undefined;
      chk = wrapper.hasClass(this.openName) ? true : false;

      return chk;
    },
    openEv: function () {
      var _this = this;

      $(document).on('click.dropdown', _this.curBtn, function (ev) {
        var $dropdown = $(ev.target).closest(_this.el);

        //$(_this.el).removeClass(_this.openName);

        if (_this.openChk($dropdown)) {
          $dropdown.removeClass(_this.openName);
        } else {
          $dropdown.addClass(_this.openName);
        }
      });

      _this.selectEv();
    },
    selectEv: function () {
      var _this = this;

      $(document).on('click.dropdownBtn', _this.btn, function (ev) {
        var $dropdown = $(ev.target).closest(_this.el);
        var curText = $(ev.target).text();
        $dropdown.removeClass(_this.openName).find(_this.curBtn).text(curText);
        $dropdown.find('li').removeClass(_this.selectName)
        $(ev.target).closest('li').addClass(_this.selectName);
      });
    },
    resize: function () {
      $(this.el).removeClass(this.openName);
    },
  }

  UI.tabList = {
    tabEl: '.tab',
    tabBtn: '.tab__btn',
    tabCur: '.tab__cur',
    tabList: '.tab__list',
    tabListItem: '.tab__item',
    openName: 'is-open',
    selectName: 'is-active',
    init: function () {
      this.openEv();
    },
    openChk: function (wrapper) {
      var chk = undefined;
      chk = wrapper.hasClass(this.openName) ? true : false;

      return chk;
    },
    openEv: function () {
      var _this = this;

      $(_this.tabCur).on('click', function (ev) {
        var $tabBox = $(ev.target).closest(_this.tabEl);

        if (_this.openChk($tabBox)) {
          _this.closeEv($tabBox);
        } else {
          $tabBox.addClass(_this.openName);
        }
      });

      _this.selectEv();
    },
    closeEv: function (box) {
      var _this = this
      box.removeClass(_this.openName);
    },
    selectEv: function () {
      var _this = this;

      $(_this.tabBtn).on('click', function (ev) {
        var $tabBox = $(ev.target).closest(_this.tabEl);
        var curText = $(ev.target).text();
        var selIdx = $(ev.target).closest(_this.tabListItem).index();

        $tabBox.removeClass(_this.openName).find(_this.tabCur).text(curText);
        $tabBox.find(_this.tabBtn).removeClass(_this.selectName);
        $(ev.target).addClass(_this.selectName);

        if ($(ev.target).attr('href') == "#") {
          ev.preventDefault();
        }

        var tabRel = $tabBox.data('tab-pc') || $tabBox.data('tab-mobile');
        if (tabRel) {
          var tabOther = $tabBox.data('tab-pc') ? "mobile" : "pc";
          var tabOtheritems = $('[data-tab-' + tabOther + '=' + tabRel + ']').find(_this.tabListItem);
          tabOtheritems.eq(selIdx).find(_this.tabBtn).trigger('click');
        }
      });
    },
    resize: function () {
      $(this.tabEl).removeClass(this.openName);
    },
  }

  UI.menuTabSlide = {
    tSwiper: null,
    tSwiperEl: '.tab-swiper .swiper',
    config: {
      slidesPerView: "auto",
      observer: true,
      observeParents: true,
      slideVisibleClass: 'swiper-slide-visible',
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      slideToClickedSlide: true,
    },
    init: function () {
      //console.log('check', window.winWChk);

      // pc
      if (window.winWChk === 'pc') {
        if ($(this.tSwiperEl).find('.swiper-slide').length > 0) {
          //console.log('length : ' + $(this.tSwiperEl).find('.swiper-slide').length);

          if (!$(this.tSwiperEl).hasClass('swiper-container-initialized')) {

            this.tSwiper = new Swiper(this.tSwiperEl, this.config);
            var tabActiveIdx = $(this.tSwiperEl).find('.tab__btn.is-active').closest('li').index();

            if (tabActiveIdx > 0) {
              $(this.tSwiperEl).find('.tab__btn.is-active').trigger('click touchstart');
              UI.menuTabSlide.tSwiper.slideTo(tabActiveIdx, 0)

              setTimeout(function () {
                UI.menuTabSlide.tSwiper.slideTo(tabActiveIdx, 0)
              }, 0)
            }
          } else {
            console.log('pc no');
            this.tSwiper.update();
          }
        }
      } else { //mobile
        if ($(this.tSwiperEl).hasClass('only-tab')) {
          if ($(this.tSwiperEl).hasClass('swiper-container-initialized')) {
            this.tSwiper.update();
          } else {
            this.tSwiper = new Swiper(this.tSwiperEl, this.config);
          }
        } else {
          if ($(this.tSwiperEl).hasClass('swiper-container-initialized')) {
            this.tSwiper.destroy();
          }
        }
      }
    },
    resize: function () {
      if (this.tSwiper != null) {
        this.tSwiper.destroy();
        this.tSwiper = null;
      }
      this.init();
    },
  }

  UI.reviewSticky = {
    varSet: {
      btn: '.reply-item__util .btn',
      hideBtn: '.reply-writer .btn-close',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      _this.clickEv();
    },
    clickEv: function () {
      var _this = this;
      $(document).on('click', _this.varSet.btn, function () {
        var $group = $(this).closest('.reply-list-wrap').find(_this.varSet.replyWriter);
        if (!$group.hasClass(_this.varSet.activeClassName)) {
          $group.addClass(_this.varSet.activeClassName);
        }
      });

      $(document).on('click', _this.varSet.hideBtn, function () {
        var $group = $(this).closest('.reply-writer');
        if ($group.hasClass(_this.varSet.activeClassName)) {
          $group.removeClass(_this.varSet.activeClassName);
        }
      });
    },
  }

  UI.visibleTarget = {
    varSet: {
      showBtn: '[data-role=visible_btn]',
      contWrap: '[data-role=visible_wrap]',
      cont: '[data-role=visible_cont]',
      hideBtn: '[data-role=hide_btn]',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      _this.clickEv();
    },
    clickEv: function () {
      var _this = this;

      $(document).on('click', _this.varSet.showBtn, function () {
        var $group = $(this).closest(_this.varSet.contWrap).find(_this.varSet.cont);
        if (!$group.hasClass(_this.varSet.activeClassName)) {
          $group.addClass(_this.varSet.activeClassName);
        }
      });

      $(document).on('click', _this.varSet.hideBtn, function () {
        var $group = $(this).closest(_this.varSet.cont);
        if ($group.hasClass(_this.varSet.activeClassName)) {
          $group.removeClass(_this.varSet.activeClassName);
        }
      });
    }
  }

  UI.replyView = {
    varSet: {
      replyShowBtn: '.reply-item__util .btn',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      _this.clickEv();
    },
    clickEv: function () {
      var _this = this;

      $(document).on('click', _this.varSet.replyShowBtn, function () {
        var $group = $(this).closest('.reply-item');

        if (winWChk === 'pc') {
          $group.find('.input__color-gray').addClass(_this.varSet.activeClassName);

        }
      });

      if (winWChk === 'mo') $('.reply-item').find('.input__color-gray').removeClass(_this.varSet.activeClassName)
    },
    resize: function () {
      var _this = this;

      _this.init();
    }
  }

  UI.filterItem = {
    varSet: {
      closeBtn: '.sort-area__layer button',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      _this.clickEv();
    },
    clickEv: function () {
      var _this = this;

      $(document).on('click', _this.varSet.closeBtn, function () {
        var $group = $(this).closest('.sort-area__layer');
        $group.removeClass(_this.varSet.activeClassName);
      });
    },
    resize: function () {
      var _this = this;

      _this.init();
    }
  }

  UI.newsSw = {
    slider: null,
    sliderEl: '.top-news-wrapper',
    config: {
      slidesPerView: 1,
      loop: true,
      pagination: {
        el: null,
      }
    },
    initClass: 'swiper-container-initialized',
    init: function () {
      if ($(this.sliderEl).length) {

        if ($(this.sliderEl).find('.swiper-slide').length > 0 && window.winWChk === 'mo') {
          if (!$(this.sliderEl).hasClass(this.initClass)) {
            if ($(this.sliderEl).find('.swiper-pagination').length > 0) {
              this.config.pagination.el = $(this.sliderEl).find('.swiper-pagination')[0];
            } else {
              $(this.sliderEl).append('<div class="swiper-pagination"></div>')
              this.config.pagination.el = $(this.sliderEl).find('.swiper-pagination')[0];
            }
            this.slider = new Swiper(this.sliderEl, this.config);
          }
        }
      }
    },
    resize: function () {
      if ($(this.sliderEl).hasClass(this.initClass) && window.winWChk === 'pc') {
        $(this.sliderEl).find('.swiper-pagination').remove();
        this.slider.destroy();
      }
      if (!$(this.sliderEl).hasClass(this.initClass) && window.winWChk === 'mo') {
        this.init();
      }
    }
  }

  UI.themeSw = {
    slider: null,
    sliderEl: '.theme-column',
    config: {
      autoplay: true,
      observer: true,
      observeParents: true,
      slidesPerView: "auto",
      slidesPerGroup: 2,
      centeredSlides: false,
      slidesPerGroupSkip: 1,
      pagination: {
        el: ".theme-column .swiper-dot",
        clickable: true,
      },
      spaceBetween: 24,
      breakpoints: {
        1600: {
          spaceBetween: 19,
        },
        1280: {
          spaceBetween: 12,
        },
        769: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 0,
        },
      },
    },
    initClass: 'swiper-container-initialized',
    init: function () {
      if ($(this.sliderEl).length) {
        if ($(this.sliderEl).find('.swiper-slide').length > 0) {
          if (!$(this.sliderEl).hasClass(this.initClass)) {
            if ($(this.sliderEl).find('.swiper-dot').length > 0) {
              this.config.pagination.el = $(this.sliderEl).find('.swiper-dot')[0];
            } else {
              $(this.sliderEl).append('<div class="swiper-dot"></div>')
              this.config.pagination.el = $(this.sliderEl).find('.swiper-dot')[0];
            }
            this.slider = new Swiper(this.sliderEl, this.config);
            UI.swAutoplayAdd(this.slider);
          }
        }
      }
    },
    resize: function () {
      if (this.slider != null) {
        this.slider.destroy();
        this.slider = null;
      }
      this.init();
    }
  }

  UI.checkboxAll = function (all, items, reverse) {
    var $all = $(all),
      $items = $(items).not(all),
      itemLen = $items.length;

    reverse = reverse || false;

    //all checkbox
    $all.on('change.checkboxAll', function () {
      var state = $(this).prop('checked');

      $items.each(function () {
        if (reverse) {
          $(this).prop('checked', !state);
        } else {
          $(this).prop('checked', state).trigger('change');
        }
      });
    });

    //items checkbox
    $items.on('change.checkboxAll', function () {
      var state = (itemLen == $items.filter(':checked').length);

      if (reverse) {
        if ($items.filter(':checked').length >= 1) {
          $all.prop('checked', false);
        }
      } else {
        $all.prop('checked', state);
      }
    });
  }

  UI.myFavVod = {
    slider: null,
    sliderEl: '.vod-list-wrap',
    configPC: {
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      freeMode: true,
      pagination: {
        el: ".vod-list-content .swiper-pagination",
        clickable: true,
        type: "progressbar",
      },
    },
    configMobile: {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      autoplay: true,
      pagination: {
        el: ".vod-list-content .swiper-pagination",
        clickable: true,
      },
    },
    initClass: 'swiper-container-initialized',
    init: function () {
      if ($(this.sliderEl).length) {
        if (!$(this.sliderEl).hasClass(this.initClass)) {

          var listSection = $(this.sliderEl).closest('.vod-list-content');

          if (listSection.find('.swiper-pagination').length > 0) {
            this.configPC.pagination.el = listSection.find('.swiper-pagination')[0];
          } else {
            listSection.append('<div class="swiper-pagination"></div>')
            this.configPC.pagination.el = listSection.find('.swiper-pagination')[0];
          }

          if (window.winWChk === 'pc') {
            this.slider = new Swiper(this.sliderEl, this.configPC);
          } else {
            this.slider = new Swiper(this.sliderEl, this.configMobile);
            UI.swAutoplayAdd(this.slider);
          }
        }
      }
    },
    resize: function () {
      if (this.slider != null) {
        this.slider.destroy();
        this.slider = null;
        $(this.sliderEl).closest('.vod-list-content').find('.swiper-controls').remove();
      }
      this.init();
    }
  }

  UI.thisMonth = {
    slider: null,
    sliderEl: '.this-month-pdts',
    config: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      pagination: {
        el: ".swiper-pagination",
      },
      autoplay: true,
    },
    initClass: 'swiper-container-initialized',
    init: function () {
      if ($(this.sliderEl).length) {

        if ($(this.sliderEl).find('.swiper-slide').length > 0 && window.winWChk === 'mo') {
          if (!$(this.sliderEl).hasClass(this.initClass)) {
            if ($(this.sliderEl).find('.swiper-pagination').length > 0) {
              this.config.pagination.el = $(this.sliderEl).find('.swiper-pagination')[0];
            } else {
              $(this.sliderEl).append('<div class="swiper-pagination"></div>')
              this.config.pagination.el = $(this.sliderEl).find('.swiper-pagination')[0];
            }
            this.slider = new Swiper(this.sliderEl, this.config);
            UI.swAutoplayAdd(this.slider);
          }
        }
      }
    },
    resize: function () {
      if ($(this.sliderEl).hasClass(this.initClass) && window.winWChk === 'pc') {
        if (this.slider != null) {
          $(this.sliderEl).find('.swiper-controls').remove();
          this.slider.destroy();
          this.slider = null;
        }
      }
      if (!$(this.sliderEl).hasClass(this.initClass) && window.winWChk === 'mo') {
        this.init();
      }
    }
  }

  //layer popou
  UI.lyPopup = {
    openBtn: '[data-pop-open]',
    openClass: 'is-open',
    closeBtn: '[data-pop-btn=close]',
    init: function () {
      this.toggle();
      this.close();
    },
    toggle: function () {
      var _this = this;
      $(document).on('click', _this.openBtn, function (ev) {
        var $this = $(ev.target),
          popName = $this.data('pop-open'),
          names = new Array();

        if (popName != undefined) {
          names = popName.split(',');
        }

        $.each(names, function (idx, item) {
          var $lyPop = $('[data-pop=' + item + ']'),
            textOpen = $this.data('st-open'),
            textClose = $this.data('st-close'),
            $textBox = $this.find('.st-text');

          if ($lyPop.hasClass(_this.openClass)) {
            $lyPop.removeClass(_this.openClass);
            $textBox.text(textOpen);
            $this.removeClass(_this.openClass);
            //console.log($this)
          } else {
            _this.open('[data-pop=' + item + ']')
            //$lyPop.addClass(_this.openClass);
            $textBox.text(textClose);
            $this.addClass(_this.openClass);
          }
        });
      });
    },
    open: function (item) {
      var _this = this;
      var isOnlyMobilePop = $(item).hasClass('m-pop');

      $(item).addClass(_this.openClass);

      if (isOnlyMobilePop && window.winWChk == 'pc') {
        $('body').removeClass('body-hidden');
      } else {
        $('body').addClass('body-hidden');
      }

      _this.close();

      // 팝업 open 후 실행
      UI.popupImageSw.init();
      if ($('.pop-video .swiper').length && !$('.pop-video-swiper').hasClass('swiper-container-initialized')) {
        artistVodPopupSwiper();
      }
    },
    close: function () {
      var _this = this;
      $(document).on('click', _this.closeBtn, function (ev) {
        _this.destroy($(ev.target).closest('[data-pop]'));
        $('body').removeClass('body-hidden');
      });
    },
    destroy: function (layer) {
      var _this = this;
      layer.each(function () {
        layer.removeClass(_this.openClass);
        $('[data-pop-open=' + $(this).data('pop') + ']').removeClass(_this.openClass);

        var openText = layer.data('st-open');
        if (openText) {
          $(this).find('st-text').text(openText);
        }
        $('body').removeClass('body-hidden');
      });
    },
    resize: function () {
      var _this = this;
      _this.destroy($('.m-pop[data-pop].' + _this.openClass));
    }
  }


  UI.deleteItem = {
    init: function (el, outer) {
      var _this = this;
      $(outer).find(el).on('click', function (ev) {
        if ($(ev.target).attr('href') == '#') {
          ev.preventDefault();
        }
        _this.clickEv(el, outer, ev);
      });
    },
    clickEv: function (el, outer, ev) {
      $(ev.target).closest(outer).remove();
    }
  }

  UI.commentSort = {
    varSet: {
      commentWrapper: '.one-line__detail',
      commentBtn: '.one-line-sub__box .btn',
      commentBtnText: '.arrow-txt',
      activeClassName: 'is-active',
    },
    init: function () {
      var _this = this;
      $(_this.varSet.commentBtn).on('click', function (ev) {
        if ($(ev.target).attr('href') == '#') {
          ev.preventDefault();
        }
        _this.click(ev);
      });
    },
    click: function (ev) {
      var _this = this;
      $(ev.target).closest('.one-line').find(_this.varSet.commentWrapper).toggleClass(_this.varSet.activeClassName);

      if ($(ev.target).closest('.one-line').find(_this.varSet.commentWrapper).hasClass(_this.varSet.activeClassName)) {
        $(ev.target).closest(_this.varSet.commentBtn).removeClass(_this.varSet.activeClassName);
        $(ev.target).closest('.one-line').find(_this.varSet.commentBtnText).text('한줄평 닫기');
      } else {
        $(ev.target).closest(_this.varSet.commentBtn).addClass(_this.varSet.activeClassName);
        $(ev.target).closest('.one-line').find(_this.varSet.commentBtnText).text('한줄평 열기');
      }
    }
  }

  UI.kvScroll = {
    varSet: {
      el: '.header',
      scrollChkName: 'header--scroll',
      scrollEndName: 'header--active',
    },
    scroll: function () {
      var _this = this;
      $(window).on('scroll', function () {
        _this.scrollCheckSet(window);
      });
    },
    resize: function () {
      var _this = this;
      _this.scrollCheckSet(window);
      _this.scroll();
    },
    init: function () {
      var _this = this;
      _this.scrollCheckSet(window);
      _this.scroll();
    },
    scrollCheckSet: function (obj) {
      var _this = this;
      var device = $(window).innerWidth();
      var thisScroll = $(window).scrollTop();
      var _this = $(".offer__box-r");
      var extra = $(".offer-info").outerHeight() / 2;
      var start = $(".offer-review.side").is(':visible') ? 1 : 0;
      var heightR = $(".offer-info").outerHeight() + $(".offer-review.side").outerHeight();
      var heightL = $(".offer__box-l").height();
      //var contentP = $(".content").css("paddingTop");
      var gap = parseInt(heightR - heightL);
      var num1 = heightL > heightR ? 0 : parseInt(extra);
      var num2
      if (num1 == 0) {
        num2 = 0;
      } else if (extra < gap) {
        num2 = extra;
      } else {
        num2 = gap;
      }
      if (device > 768 && start) {
        if (thisScroll > 0) {
          _this.css({
            'transform': 'translateY(-' + num1 + 'px)'
          });
          $(".kv-offer").css({
            'margin-bottom': -num2
          });
        } else {
          _this.css({
            'transform': 'translateY(' + 0 + 'px)'
          });
          $(".kv-offer").css({
            'margin-bottom': 0
          });
        }
      } else {
        _this.css({
          'transform': 'translateY(' + 0 + 'px)'
        });
        $(".kv-offer").css({
          'margin-bottom': 0
        });
      }
    },
  }

  UI.anchorScroll = {
    varSet: {
      anchorBtn: '.anchor__btn',
      clickFlag: false,
    },
    init: function () {
      var _this = this;
      $(_this.varSet.anchorBtn).on('click', function (ev) {
        if ($(ev.target).attr('href') == '#') {
          ev.preventDefault();
        }
        _this.click(ev);
      });

      if (!_this.varSet.clickFlag) {
        _this.scroll();
      }
    },
    click: function (ev) {
      var _this = this;
      var _target = $(ev.target).attr('href').split("#")[1];
      _this.varSet.clickFlag = true;

      $('html, body').animate({
        scrollTop: $("#" + _target).offset().top - $('.offer-anchor-wrap').outerHeight() - 20
      }, 300);

      setTimeout(() => {
        $(_this.varSet.anchorBtn).removeClass('is-active');
        $(ev.target).addClass('is-active');
      }, 500);
    },
    scroll: function () {
      var _this = this;
      $(window).on('scroll', function (ev) {
        $(document).find('[id^=section]').each(function () {
          var _this = this;
          if (($(window).scrollTop() >= $(_this).offset().top) && ($(window).scrollTop() < $(_this).offset().top + $(_this).outerHeight())) {
            $('.anchor__btn').removeClass('is-active');
            if (_this.id === 'section_review') {
              $('[href="#' + _this.id + '"]').eq(0).addClass('is-active');
            } else {
              $('[href="#' + _this.id + '"]').addClass('is-active');
            }
          }
        });
      });
    }
  }

  UI.popupImageSw = {
    varSet: {
      slider: null,
      sliderThumbnail: null,
      direction: null,
      slidesPerView: null,
      slidePlay: null,
      sliderViewEl: '.image-viewer',
      sliderThumbnailEl: '.image-thumbnail',
      initClass: 'swiper-container-initialized',
    },
    swiper: function () {
      //image viewer Swiper
      var _this = this;
      if ($(_this.varSet.sliderViewEl).find('.swiper-slide').length > 1) {
        if (!$(_this.varSet.sliderViewEl).hasClass(_this.varSet.initClass)) {
          _this.varSet.slider = new Swiper(_this.varSet.sliderViewEl, {
            slidesPerView: 1,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            loop: true,
            loopedSlides: 50,
          });

          // _this.varSet.slider.on('slideChange', function () {
          //   _this.varSet.sliderThumbnail.slideTo(_this.varSet.slider.realIndex);
          // })
        } else {
          _this.varSet.slider.update();
        }
      }

      //image Thumbnail Swiper
      if ($(_this.varSet.sliderThumbnailEl).find('.swiper-slide').length > 0) {
        if (window.winWChk === 'mo') {
          _this.varSet.direction = 'horizontal';
          _this.varSet.slidesPerView = 'auto';
        } else {
          _this.varSet.direction = 'vertical';
          _this.varSet.slidesPerView = 'auto';
        }
        _this.varSet.sliderThumbnail = new Swiper(_this.varSet.sliderThumbnailEl, {
          slidesPerView: _this.varSet.slidesPerView,
          direction: _this.varSet.direction,
          simulateTouch: true,
          mousewheel: true,
        });

        // $('.image-thumbnail .thumb-img').each(function (idx, el) {
        //   $(el).on('click', function () {
        //     _this.varSet.slider.slideTo(idx);
        //   })
        // })
      }
    },
    init: function () {
      var _this = this;
      _this.swiper();
    },
    resize: function () {
      var _this = this;
      if (_this.varSet.sliderThumbnail) {
        _this.varSet.sliderThumbnail.destroy();
      }

      setTimeout(function () {
        _this.swiper();
      }, 200);
    }
  }

  UI.drawStar = function () {
    // starVal = target.value;
    $('.star-range__value').on('change', function () {
      //console.log(this.value);
      $(this).closest('.star-range').find('.star-range__over').css({
        width: this.value * 10 + '%'
      });
    })

  }

  UI.swAutoplayAdd = function (sw, wrap = null) {
    const pagination = sw.pagination.$el;
    let wrapper;

    if (wrap === null) {
      if (pagination.closest('.swiper-controls').length === 0) {
        wrapper = document.createElement('div');
        wrapper.classList.add('swiper-controls');
        //wrapper.dataset.swiper = sw;
        pagination[0].parentNode.insertBefore(wrapper, pagination[0]);
        wrapper.appendChild(pagination[0]);
      }
    } else {
      wrapper = wrap;
    }

    if ($(wrapper).find('.btn-autoplay').length === 0) {
      $(wrapper).append(
        '<button type="button" class="swiper--play btn-autoplay"><span>시작</span></button><button type="button" class="swiper--pause btn-autoplay"><span>멈춤</span></span></button>'
      );

      sw.params.autoplay.disableOnInteraction = false;

      if (sw.autoplay.running) {
        pauseShow();
      } else {
        playShow();
      }

      $(wrapper).find('.btn-autoplay').off('click').on('click', function (e) {
        const btn = $(e.currentTarget);

        if (btn.hasClass('swiper--play')) {
          sw.autoplay.start();
          pauseShow();
        } else {
          sw.autoplay.stop();
          playShow();
        }
      })
    }

    function playShow() {
      $(wrapper).find('.swiper--play').removeClass('disabled').show();
      $(wrapper).find('.swiper--pause').addClass('disabled').hide();
    }

    function pauseShow() {
      $(wrapper).find('.swiper--play').addClass('disabled').hide();
      $(wrapper).find('.swiper--pause').removeClass('disabled').show();
    }
  }

  //init 
  UI.init = function () {
    UI.allMenu.init();
    UI.headerBanner.init();
    //UI.mainKeyvisual.init();
    UI.pfListKeyvisual.init();
    UI.gnb.init();
    UI.gnbSelect.init();
    UI.lnbSelect.init();
    UI.adBanner.init();
    UI.artItem.init();
    UI.tab.init();
    UI.menuTabSlide.init();
    UI.toggleSection.init();
    UI.toggleLike();
    UI.reviewSticky.init();
    UI.visibleTarget.init();
    UI.newsSw.init();
    UI.themeSw.init()
    UI.reviewSwiper.init();
    UI.sortList.init();
    UI.tabList.init();
    UI.lyPopup.init();
    UI.deleteItem.init('[data-role=delete-btn]', '[data-role=delete-wrap]');
    UI.deleteItem.init('.btn-del', '.select-tag');
    UI.deleteItem.init('.btn-del', '.photo-add__select');
    // UI.curationSw.init();
    UI.commentSort.init();
    UI.kvScroll.init();
    UI.anchorScroll.init();
    UI.replyView.init();
    UI.pdtVtSlider.init();
    UI.myFavVod.init();
    UI.thisMonth.init();
    UI.filterItem.init();
    UI.drawStar();
    UI.dropdownList.init();
  }

  /*
    UI.resize = function () {
      if (window.st !== null) {
        clearTimeout(window.st);
      }
      const winW = window.innerWidth;
      window.st = setInterval(function () {
        const winW = window.innerWidth;
        if (window.winWChk != 'mo' && winW <= 768) { //모바일 버전으로 전환할 때 1번만 실행할 코드 추가
          window.winWChk = 'mo';
          UI.lyPopup.resize();
          UI.kvScroll.resize();
          UI.popupImageSw.resize();
          UI.replyView.resize();
          UI.myFavVod.resize();
          UI.newsSw.resize();
          UI.themeSw.resize();
          UI.thisMonth.resize();
          UI.allMenu.resize();
          UI.gnb.resize();
          UI.menuTabSlide.resize();

          if (typeof UI.curationSw !== 'undefined') {
            UI.curationSw.resize();
          }
        }

        if (window.winWChk != 'pc' && winW >= 769) { //PC 踰꾩쟾�쇰줈 �꾪솚�� �� 1踰덈쭔 �ㅽ뻾�� 肄붾뱶 異붽�
          window.winWChk = 'pc';
          UI.lyPopup.resize();
          UI.sortList.resize();
          UI.popupImageSw.resize();
          UI.replyView.resize();
          UI.myFavVod.resize();
          UI.newsSw.resize();
          UI.themeSw.resize();
          UI.thisMonth.resize();
          UI.allMenu.resize();
          UI.gnb.resize();
          UI.menuTabSlide.resize();

          if (typeof UI.curationSw !== 'undefined') {
            UI.curationSw.resize();
          }
        }

        clearTimeout(window.st);
        window.st = null;
      }, 150);
    }
  */

  UI.scroll = function () {}

  window.UI = UI;

})(window, document, jQuery);

$(function () {

  UI.init();
  $(window).on('resize', function () {
    UI.resize();
  })

  $(window).on('scroll', function () {
    UI.scroll();
  })

  if (UI.userAgentCheck()) {
    $('html').addClass('user-agent-mobile');
  } else {
    $('html').addClass('user-agent-pc');
  }

  //
  $(".faq__btn").on("click", function () {
    $(this).closest('.faq__item').toggleClass("is-on");
  })

  $(".order-btn").on("click", function () {
    $(this).toggleClass("is-reverse");
  })

  $(".ytube-kv__desc__btn").on("click", function () {
    $(this).closest(".ytube-kv__sub__wrap").toggleClass("active");
  });

  $(document).on('click', '[data-accordion=btn]', function () {
    $(this).closest("[data-accordion=group]").toggleClass("is-on");
  });

  // 기사, 리뷰 등 에디터에 있는 유튜브 감싸는 wrap 추가(스타일)
  $('.view-section .editor-section .view-editor iframe').wrap('<div class="youtube-wrap"></div>');
  // 책 정보 상세 wrap 추가
  $('.tit-line-box__wrap .tit-line-box__item iframe').wrap('<div class="tit-line-box__video"></div>');

  // all Check
  var allChks = '[data-check=allCheck]';
  if ($(allChks).length) {
    $(allChks).each(function () {
      var chkGroup = '[name=' + $(this).attr('name') + ']';
      UI.checkboxAll(this, chkGroup);
    })
  }

});


$(window).on('resize', function () {
  ww = $(window).width();
  if ($('artist-db__content .swiper').length) {
    initSwiper();
  }

  if ($('.artist-db__wrapper.swiper').length) {
    artistVodSwiper();
  }

  // if ($('.artist-db__content .swiper').length) {
  //   initSwiper();
  // }
});


function initSwiper() {

  if (ww < 1024 && mySwiper == undefined) {

    mySwiper = new Swiper(".artist-db__content.type2 .artist-db__wrapper", {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      },
    });
    mySwiper = new Swiper(".artist-db__content .pdt-grid-wrap", {
      slidesPerView: "auto",
      spaceBetween: 16,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      },
    });
  } else if (ww >= 1024 && mySwiper != undefined) {
    mySwiper.destroy();
    mySwiper = undefined;
  }
}

function artistVodSwiper() {
  var artist_vod_swiper = new Swiper(".swiper-content .artist-db__wrapper.swiper", {
    loop: false,
    navigation: {
      nextEl: ".swiper-content .swiper-next",
      prevEl: ".swiper-content .swiper-prev",
    },
    slidesPerView: 'auto',
    spaceBetween: 40,
    breakpoints: {
      768: {
        pagination: {
          el: ".swiper-content .swiper-pagination",
          type: 'bullets',
        },
        spaceBetween: 16,
        speed: 100,
        observer: true,
      }
    },
  });
}

function artistVodPopupSwiper() {
  var artist_vod_popup_swiper = new Swiper(".pop-video .swiper", {
    loop: false,
    navigation: {
      nextEl: ".pop-video .swiper-next",
      prevEl: ".pop-video .swiper-prev",
    },
    slidesPerView: 'auto',
    spaceBetween: 40,
    breakpoints: {
      768: {
        pagination: {
          el: ".pop-video .swiper-pagination",
          type: 'bullets',
        },
        spaceBetween: 16,
        speed: 100,
      }
    },
  });
}
$(document).ready(function () {
  if ($('artist-db__content .swiper').length) {
    initSwiper();
  }

  if ($('.artist-db__wrapper.swiper').length) {
    artistVodSwiper();
  }

  // s 우클릭 방지 스크립트 추가
  $(document).bind("contextmenu", function (e) {
    return false;
  });
  // e 우클릭 방지 스크립트 추가
});
// s 우클릭 방지 스크립트 추가
$(document).bind('selectstart', function () {
  return false;
});
$(document).bind('dragstart', function () {
  return false;
});
// e 우클릭 방지 스크립트 추가

// 댓글 목록 모바일 더보기 버튼 스크립트
function load(el, idx) {
  var liNone = el + ".is-none";
  $(liNone + ":lt(" + idx + ")").removeClass("is-none");
}

$(window).on('load', function () {
  $(document).on('click', '.reply-add__more', function () {
    // 숫자에 따라 노출되는 li개수 적용
    load('.reply-list > ul > li', '7');
  })
});