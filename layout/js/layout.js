var headerFile;
var gnbObj;

function layoutHeader(myGnb) {
  var type = myGnb['type'];

  gnbObj = myGnb;

  if (type == 1) {
    headerFile = 'layout_header_1depth.html';
  } else if (type == 2) {
    headerFile = 'layout_header_2depth.html';
  } else if (type == 3) {
    headerFile = 'layout_header_3depth.html';
  } else if (type == 0) {
    headerFile = 'layout_header_main.html';
  } else {
    headerFile = 'layout_header.html';
  }

}

function setGnb() {
  var myType = gnbObj['type'];
  var my1 = Number(gnbObj['menu1']) - 1;
  var my2 = Number(gnbObj['menu2']) - 1;

  if (my1 > -1) {
    // 1depth
    $('.gnb').find('li').eq(my1).addClass('is-active').find('a').trigger('click');
  }

  if ((my2 > -1) && (myType == 2 || myType == 3)) {
    // 2depth
    $('.gnb-menu__list').find('li').eq(my1 + 1).find('a').trigger('click');
    $('.lnb-menu').hide().eq(my1).addClass('is-lnb-active').show();
    $('.lnb-menu__list').eq(my1).find('li').eq(my2).find('a').trigger('click');
  }
}


$(document).ready(function () {
  // header - gnb setting
  $("#header").load("../layout/" + headerFile + " .header__inner");
  var timeId = setTimeout(setGnb, 1000);

  // footer 
  if ($("#footer").length) {
    $("#footer").load("../layout/layout_footer.html");
  }

  // detail 
  if ($(".reply-wrap").length) {
    $(".reply-wrap").load("../html/common_reply.html .content > div", function () {
      if ($('[data-pop-open=popupReplyPolicy]').length) {
        $("<div class='pop-reply'>/div>").appendTo(".wrap");
        $('.pop-reply').load("../html/PW_I_ON_CP_10_00.html .pop-wrap");
      }
      if ($('[data-pop-open=popupReplyViewMobile]').length) {
        $("<div class='pop1'>/div>").appendTo(".wrap");
        $('.pop1').load("../html/PW_I_ON_CP_06_00.html .popup-wrap");
      }
      if ($('[data-pop-open=popupCommentWriter]').length) {
        $("<div class='pop2'>/div>").appendTo(".wrap");
        $('.pop2').load("../html/PW_I_ON_CP_07_00.html .pop-wrap");
      }
      if ($('[data-pop-open=popupReplyWriter]').length) {
        $("<div class='pop3'>/div>").appendTo(".wrap");
        $('.pop3').load("../html/PW_I_ON_CP_08_00.html .pop-wrap");
      }
    });
  }


  // 아르떼와 친구들 더보기 관련 변수
  var windowWidth = $(window).width();
  var liHeight;

  // 아르떼와 친구들 더보기 버튼 동작
  function arteFriendsMore() {
    $(document).on('click', '.buddy-banner__more', function (e) {
      e.preventDefault();
      $(this).toggleClass('is-on');
      $(this).siblings('.buddy-banner__list').toggleClass('is-on');
    });
  }

  // 아르떼와 친구들 더보기(모바일) 버튼 동작
  function arteFriendsMoreMobile() {
    arteFriendsMore();

    $(document).on('click', '.header-main .all-menu-btn', function () {
      $('.all-menu-side .buddy-banner__list li').eq(0).each(function () {
        liHeight = $(this).outerHeight() * 2 + "px";
        $('.all-menu-side .buddy-banner__list').css('max-height', liHeight);
      });
    })
  }

  // 아르떼와 친구들 디바이스 크기에 따른 js 분기
  if (windowWidth < 768) {
    //창 가로 크기가 768 미만일 경우
    arteFriendsMoreMobile();
    $('.header').addClass('is-open');
  } else {
    //창 가로 크기가 768보다 클 경우
    arteFriendsMore();
  }
})