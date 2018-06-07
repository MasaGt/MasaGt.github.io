'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
  var ANIME_SLOW_MILSEC = 2000;
  var ANIME_MID_SLOW_MILSEC = 1000;
  var ANIME_MID_FAST_MILSEC = 500;
  var ANIME_FAST_MILSEC = 250;
  var SCROLL_INTERVAL = 500;

  var state = {
    isMenuOpened: false,
    isModalOpened: false,
    timerID: null
  };

  var header = {
    header: document.getElementById('header'),
    headerNavi: document.getElementById('header__navi'),
    headerBtn: document.getElementById('bar-SP_menu-btn'),
    btnLines: document.getElementsByClassName('menu-btn_line')
  };

  var svg = {
    path: document.getElementsByClassName('path')
  };

  var modal = {
    modalBase: document.getElementById('modal-base'),
    modalLoader: document.getElementById('modal_loader'),
    showTargetWrapper: null,
    gif: null
  };

  var windowHight = window.innerHeight;
  /*----------------------------------------------------------------------
  Following process is related to create works & moadl elements
  ----------------------------------------------------------------------*/

  var Util = function () {
    function Util() {
      _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
      key: 'creatElem',
      value: function creatElem(tag, classNm) {
        var elem = document.createElement(tag);
        if (classNm !== undefined && classNm !== null) {
          for (var i = 0, length = classNm.length; i < length; i++) {
            elem.classList.add(classNm[i]);
          }
        }

        return elem;
      }

      // check value before calling this.createElm.

    }, {
      key: 'hasVal',
      value: function hasVal(val) {
        if (val === null || val === undefined || val === '') {
          return false;
        }

        return true;
      }
    }]);

    return Util;
  }();

  /*-----------------------------------
  class of works-list's elements in Work section
  [construction]
    <work-wrapper work--(right/center/left)>
      L<work_title>
      L<work_img-area>
        Limages
  -----------------------------------*/


  var WorkContent = function () {
    function WorkContent() {
      _classCallCheck(this, WorkContent);

      this.workFragment = document.createDocumentFragment();
    }

    _createClass(WorkContent, [{
      key: 'appendWork',
      value: function appendWork(data, dataIndex) {
        /*---------------------------
        do not need to call Util.hasVal
        → if data loading faild, img will be set  an error img
        ---------------------------*/
        var wrapper = Util.creatElem('div', ['work-wrapper']);

        if (dataIndex % 3 === 1) {
          wrapper.classList.add('work--right');
        } else if (dataIndex % 3 === 2) {
          wrapper.classList.add('work--center');
        } else {
          wrapper.classList.add('work--left');
        }

        var workTitle = Util.creatElem('span', ['work_title']);
        workTitle.textContent = data.title;
        workTitle.setAttribute('data-work-id', dataIndex);
        wrapper.appendChild(workTitle);

        var workImgArea = Util.creatElem('div', ['work_img-area']);
        for (var i = 0, length = data.images.length; i < length; i++) {
          var workImg = Util.creatElem('div', ['work_img' + (i + 1), 'is-closed']);
          workImg.style.backgroundImage = 'url(' + data.imageDir + data.images[i] + ')';
          workImgArea.appendChild(workImg);
        }

        wrapper.appendChild(workImgArea);
        this.workFragment.appendChild(wrapper);
      }
    }, {
      key: 'getWorkContent',
      value: function getWorkContent() {
        return this.workFragment;
      }
    }]);

    return WorkContent;
  }();

  /*-----------------------------------
  class of modal-contents' elements
  [construction]
    <modal-wrapper>
      L<modal-container>
        L<modal-container>
          Ltitle, img, and more.
        L<modal-close-btn>
  -----------------------------------*/


  var ModalContent = function () {
    function ModalContent() {
      _classCallCheck(this, ModalContent);

      this.modalFragment = document.createDocumentFragment();
    }

    _createClass(ModalContent, [{
      key: 'appendElems',
      value: function appendElems(data, index) {

        var wrapper = Util.creatElem('div', ['modal_wrapper']);
        wrapper.setAttribute('data-work-id', index);

        this.container = Util.creatElem('div', ['modal_work-container', 'target']);

        // set each elems
        this.setTitle(data.title);
        this.setSkills(data.skills);
        this.setImg(data.imageDir, data.modalImage, data.title);
        this.setDesc(data.desc);
        this.setLink(data.link);
        wrapper.appendChild(this.container);

        var btnWrapper = Util.creatElem('div', ['modal_btn-wrapper', 'target']);
        var closeBtn = Util.creatElem('div', ['modal_close-btn']);
        btnWrapper.appendChild(closeBtn);
        wrapper.appendChild(btnWrapper);

        this.modalFragment.appendChild(wrapper);
      }
    }, {
      key: 'setTitle',
      value: function setTitle(title) {
        if (!Util.hasVal(title)) {
          return;
        }

        var workTitle = Util.creatElem('div', ['modal_work-title']);
        workTitle.textContent = title;
        this.container.appendChild(workTitle);
      }
    }, {
      key: 'setSkills',
      value: function setSkills(skills) {
        if (!Util.hasVal(skills)) {
          return;
        }

        var workSkill = Util.creatElem('div', ['modal_work-skill']);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = skills[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            var skillTag = Util.creatElem('span', ['modal_skill-tag']);
            skillTag.textContent = val;
            workSkill.appendChild(skillTag);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.container.appendChild(workSkill);
      }
    }, {
      key: 'setImg',
      value: function setImg(dir, src, alt) {
        if (!Util.hasVal(dir) || !Util.hasVal(src) || !Util.hasVal(alt)) {
          return;
        }

        var workImg = Util.creatElem('img', ['modal_work-img']);
        workImg.setAttribute('data-image-url', dir + src);
        workImg.setAttribute('alt', alt);
        this.container.appendChild(workImg);
      }
    }, {
      key: 'setDesc',
      value: function setDesc(description) {
        if (!Util.hasVal(description)) {
          return;
        }

        var workDesc = Util.creatElem('p', ['modal_work-desc']);
        workDesc.textContent = description;
        this.container.appendChild(workDesc);
      }
    }, {
      key: 'setLink',
      value: function setLink(link) {
        if (!Util.hasVal(link)) {
          return;
        }

        var workLink = Util.creatElem('div', ['modal_work-link']);
        var anchor = Util.creatElem('a');
        anchor.setAttribute('href', link);
        anchor.setAttribute('target', '_blank');
        anchor.textContent = 'View the page';
        workLink.appendChild(anchor);
        this.container.appendChild(workLink);
      }
    }, {
      key: 'getModalContent',
      value: function getModalContent() {
        return this.modalFragment;
      }
    }]);

    return ModalContent;
  }();

  // create works' & modal's elements from data ← loaded with Ajax


  function setWorks(data) {
    var worksList = document.getElementById('works-list');

    var workContent = new WorkContent();
    var modalContent = new ModalContent();
    var index = 1;

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        workContent.appendWork(data[key], index);
        modalContent.appendElems(data[key], index);
        index++;
      }
    }

    worksList.appendChild(workContent.getWorkContent());
    modal.modalBase.appendChild(modalContent.getModalContent());
  }

  /*----------------------------------------------------------------------
  Following process is related to modal
  ----------------------------------------------------------------------*/
  // find target modal wrapper to show
  function findShowTarget(dataAttr, index) {
    var TYPE_ELEMENT = 1;
    var children = modal.modalBase.childNodes;
    for (var i = 0, length = children.length; i < length; i++) {
      var child = children.item(i);
      if (child.nodeType === TYPE_ELEMENT) {
        if (child.getAttribute(dataAttr) === index) {
          return child;
        }
      }
    }

    return null;
  }

  // show modal
  function showModal() {

    return function (e) {
      if (state.isModalOpened) {
        return;
      }

      state.isModalOpened = true;
      var workTitle = this;
      var index = workTitle.getAttribute('data-work-id');
      modal.showTargetWrapper = findShowTarget('data-work-id', index);

      if (modal.showTargetWrapper === null) {
        state.isModalOpened = false;
        return;
      }

      modal.gif = modal.showTargetWrapper.getElementsByClassName('modal_work-img')[0];
      var image = new Image();
      image.src = modal.gif.getAttribute('data-image-url') + '?' + new Date().getTime();

      $(image).on('load', function () {
        // prevent cash
        modal.gif.setAttribute('src', this.src);

        // hide loading display
        $(modal.modalLoader).addClass('is-finished');

        // show modal container
        $(modal.modalBase).fadeIn(ANIME_MID_FAST_MILSEC, function () {
          // preparation to slide in modale contents
          $(modal.showTargetWrapper).addClass('is-set');
          $(modal.showTargetWrapper).find('.target').slideDown(ANIME_MID_SLOW_MILSEC);
        });
      });

      $('html').addClass('is--unscrollable');
      $('body').addClass('is-unscrollable');
    };
  }

  // close modal
  function closeModal(modalBase) {
    return function () {
      if (!state.isModalOpened) {
        return;
      }

      state.isModalOpened = false;
      var closeBtn = this;
      // $(closeBtn).off('click');

      $(modal.showTargetWrapper).find('.target').slideUp(ANIME_MID_SLOW_MILSEC, function () {
        // preparation to slide out modale contents
        $(modal.showTargetWrapper).find('.is-set').removeClass('is-set');
        modal.gif.removeAttribute('src');

        $(modal.modalBase).fadeOut(ANIME_MID_FAST_MILSEC, function () {
          $(modal.modalLoader).removeClass('is-finished');
          $('html').removeClass('is-unscrollable');
          $('body').removeClass('is-unscrollable');
        });
      });

      // $(modalBase).on('click', '.modal_close-btn', closeModal(modalBase));
    };
  }

  /*----------------------------------------------------------------------
  Following process is related to show closedImg(at work section)
  ----------------------------------------------------------------------*/
  function checkShowElems(closedImg) {

    return function () {
      var scrollTop = $(this).scrollTop();

      if (!(closedImg.length > 0)) {
        closedImg = document.getElementsByClassName('is-closed');
      }

      $(closedImg).each(function () {
        var top = $(this).offset().top;
        if (scrollTop + windowHight > top) {
          $(this).removeClass('is-closed');
        }
      });

      state.timerID = null;
    };
  }

  /*----------------------------------------------------------------------
  Following process is related to judging device's event at skill section
  ----------------------------------------------------------------------*/
  function judgeEvent(ua) {
    if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('ipod') !== -1 || ua.indexOf('android') !== -1 || ua.indexOf('mobile') !== -1 || ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1 || ua.indexOf('windows') != -1 && ua.indexOf('touch') != -1 && ua.indexOf('tablet pc') == -1) {
      // Mobile(SP & tab)
      return { enter: 'ouchstart', leave: 'touchend' };
    } else {
      // PC
      return { enter: 'mouseenter', leave: 'mouseleave' };
    }
  }

  /*-----------------------------------
  initializing
  -----------------------------------*/
  (function () {

    /*-----------------------------------
    loading works data with Ajax
    -----------------------------------*/
    $.ajax({
      url: 'works/info/works.json',
      dataType: 'json',
      type: 'GET'
    }).done(function (json) {
      setWorks(json.works);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      // console.log('XMLHttpRequest : ' + XMLHttpRequest.status);
      // console.log('textStatus     : ' + textStatus);
      // console.log('errorThrown    : ' + errorThrown.message);

      //if loading failed, set error img in work section
      var errorData = {
        work1: {
          title: 'error. please try to reload.',
          desc: 'sorry. error occured, please try to reload.',
          skills: '',
          link: '',
          imageDir: '',
          images: '',
          modalImage: ''
        }
      };

      setWorks(errorData);
    });

    /*-----------------------------------
    draw svg
    -----------------------------------*/
    // hide svg
    $(svg.path).each(function (index) {
      var lenght = this.getTotalLength() + 300;
      this.style.strokeDasharray = lenght + ' ' + lenght;
      this.style.strokeDashoffset = lenght;
    });

    $(svg.path).addClass('is-ready');

    // draw svg
    $(svg.path).each(function () {
      $(this).animate({ strokeDashoffset: 1 }, { duration: ANIME_SLOW_MILSEC,
        complete: function complete() {
          $(this).animate({ fillOpacity: 1, strokeWidth: 0 }, { duration: ANIME_MID_FAST_MILSEC });
        }
      });
    });

    /*-----------------------------------
    set events
    -----------------------------------*/
    // humberger button
    $(header.headerBtn).on('click', function () {
      if ($(header.headerNavi).hasClass('is-opened')) {
        $(header.btnLines).removeClass('is-opened');
        $(header.headerNavi).removeClass('is-opened');
      } else {
        $(header.btnLines).addClass('is-opened');
        $(header.headerNavi).addClass('is-opened');
      }
    });

    // navi link
    $('a[href^="#"]').click(function () {
      if ($(header.headerNavi).hasClass('is-opened')) {
        $(header.headerNavi).removeClass('is-opened');
        $(header.btnLines).removeClass('is-opened');
      }

      var href = $(this).attr('href');
      var target = $(href === '#' || href === '' ? 'html' : href);
      $('html, body').animate({ scrollTop: target.offset().top }, ANIME_MID_FAST_MILSEC);
      return false;
    });

    // skill bar hover
    var ua = navigator.userAgent.toLowerCase();
    // judge us's enter & leave event
    var mouseEv = judgeEvent(ua);

    $('.bar').on(mouseEv.enter, function (e) {
      $(this).addClass('is-protruded');
    });

    $('.bar').on('transitionend', function (e) {
      if (!$(this).hasClass('is-protruded')) {
        return;
      }

      $(this).find('.bar_description').slideDown(ANIME_FAST_MILSEC);
    });

    $('.bar').on(mouseEv.leave, function (e) {
      var _this = this;
      $(this).find('.bar_description').slideUp(ANIME_FAST_MILSEC, function () {
        $(_this).removeClass('is-protruded');
      });
    });

    // show closed images at works section
    var closedImg = document.getElementsByClassName('.is-closed');
    window.addEventListener('scroll', function () {
      if (state.timerID) {
        return;
      }

      state.timerID = setTimeout(checkShowElems(closedImg), SCROLL_INTERVAL);
    });

    window.addEventListener('resize', function () {
      windowHight = this.innerHeight;
    });

    // trigger of show & hide modal
    $('#works-list').on('click', '.work_title', showModal());
    $(modal.modalBase).on('click', '.modal_close-btn', closeModal(modal.modalBase));
  })();
  /* END of initializing */
});
