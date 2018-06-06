  'use strict';
  $(function () {
    const ANIME_SLOW_MILSEC = 2000;
    const ANIME_MID_SLOW_MILSEC = 1000;
    const ANIME_MID_FAST_MILSEC = 500;
    const ANIME_FAST_MILSEC = 250;
    const SCROLL_INTERVAL = 500;

    let state = {
      isMenuOpened: false,
      isModalOpened: false,
      timerID: null,
    };

    let header = {
      header: document.getElementById('header'),
      headerNavi: document.getElementById('header__navi'),
      headerBtn: document.getElementById('bar-SP_menu-btn'),
      btnLines: document.getElementsByClassName('menu-btn_line'),
    };

    let svg = {
      path: document.getElementsByClassName('path'),
    };

    let modal = {
      modalBase: document.getElementById('modal-base'),
      showTargetWrapper: null,
      gif: null,
    };

    let windowHight = window.innerHeight;
    /*----------------------------------------------------------------------
    Following process is related to create works & moadl elements
    ----------------------------------------------------------------------*/
    class Util {
      static creatElem (tag, classNm) {
        let elem = document.createElement(tag);
        if (classNm !== undefined && classNm !== null) {
          for (let i = 0, length = classNm.length; i < length; i++) {
            elem.classList.add(classNm[i]);
          }
        }

        return elem;
      }

      // check value before calling this.createElm.
      static hasVal(val) {
        if (val === null || val === undefined || val === '') {
          return false;
        }

        return true;
      }
    }

    /*-----------------------------------
    class of works-list's elements in Work section
    [construction]
      <work-wrapper work--(right/center/left)>
        L<work_title>
        L<work_img-area>
          Limages
    -----------------------------------*/
    class WorkContent {
      constructor () {
        this.workFragment = document.createDocumentFragment();
      }

      appendWork(data, dataIndex) {
        /*---------------------------
        do not need to call Util.hasVal
        → if data loading faild, img will be set  an error img
        ---------------------------*/
        let wrapper = Util.creatElem('div', ['work-wrapper']);

        if (dataIndex % 3 === 1) {
          wrapper.classList.add('work--right');
        } else if (dataIndex % 3 === 2) {
          wrapper.classList.add('work--center');
        } else {
          wrapper.classList.add('work--left');
        }

        let workTitle = Util.creatElem('span', ['work_title']);
        workTitle.textContent = data.title;
        workTitle.setAttribute('data-work-id', dataIndex);
        wrapper.appendChild(workTitle);

        let workImgArea = Util.creatElem('div', ['work_img-area']);
        for (let i = 0, length = data.images.length; i < length; i++) {
          let workImg = Util.creatElem('div', [`work_img${i + 1}`, 'is-closed']);
          workImg.style.backgroundImage = `url(${data.imageDir}${data.images[i]})`;
          workImgArea.appendChild(workImg);
        }

        wrapper.appendChild(workImgArea);
        this.workFragment.appendChild(wrapper);
      }

      getWorkContent() { return this.workFragment; }

    }

    /*-----------------------------------
    class of modal-contents' elements
    [construction]
      <modal-wrapper>
        L<modal-container>
          L<modal-container>
            Ltitle, img, and more.
          L<modal-close-btn>
    -----------------------------------*/
    class ModalContent {
      constructor() {
        this.modalFragment = document.createDocumentFragment();
      }

      appendElems(data, index) {

        let wrapper = Util.creatElem('div', ['modal_wrapper']);
        wrapper.setAttribute('data-work-id', index);

        this.container = Util.creatElem('div', ['modal_work-container', 'target']);

        // set each elems
        this.setTitle(data.title);
        this.setSkills(data.skills);
        this.setImg(data.imageDir, data.modalImage, data.title);
        this.setDesc(data.desc);
        this.setLink(data.link);
        wrapper.appendChild(this.container);

        let btnWrapper = Util.creatElem('div', ['modal_btn-wrapper', 'target']);
        let closeBtn = Util.creatElem('div', ['modal_close-btn']);
        btnWrapper.appendChild(closeBtn);
        wrapper.appendChild(btnWrapper);

        this.modalFragment.appendChild(wrapper);
      }

      setTitle(title) {
        if (!Util.hasVal(title)) { return; }

        let workTitle = Util.creatElem('div', ['modal_work-title']);
        workTitle.textContent = title;
        this.container.appendChild(workTitle);
      }

      setSkills(skills) {
        if (!Util.hasVal(skills)) { return; }

        let workSkill = Util.creatElem('div', ['modal_work-skill']);

        for (let val of skills) {
          let skillTag = Util.creatElem('span', ['modal_skill-tag']);
          skillTag.textContent = val;
          workSkill.appendChild(skillTag);
        }

        this.container.appendChild(workSkill);
      }

      setImg(dir, src, alt) {
        if (!Util.hasVal(dir) || !Util.hasVal(src) || !Util.hasVal(alt)) { return; }

        let workImg = Util.creatElem('img', ['modal_work-img']);
        workImg.setAttribute('data-image-url', dir + src);
        workImg.setAttribute('alt', alt);
        this.container.appendChild(workImg);
      }

      setDesc(description) {
        if (!Util.hasVal(description)) { return; }

        let workDesc = Util.creatElem('p', ['modal_work-desc']);
        workDesc.textContent = description;
        this.container.appendChild(workDesc);
      }

      setLink(link) {
        if (!Util.hasVal(link)) { return; }

        let workLink = Util.creatElem('div', ['modal_work-link']);
        let anchor = Util.creatElem('a');
        anchor.setAttribute('href', link);
        anchor.setAttribute('target', '_blank');
        anchor.textContent = 'View the page';
        workLink.appendChild(anchor);
        this.container.appendChild(workLink);
      }

      getModalContent() { return this.modalFragment; }

    }

    // create works' & modal's elements from data ← loaded with Ajax
    function setWorks(data) {
      let worksList = document.getElementById('works-list');

      let workContent = new WorkContent();
      let modalContent = new  ModalContent();
      let index = 1;

      for (let key in data) {
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
      const TYPE_ELEMENT = 1;
      let children = modal.modalBase.childNodes;
      for (let i = 0, length = children.length; i < length; i++) {
        let child = children.item(i);
        if (child.nodeType === TYPE_ELEMENT) {
          if (child.getAttribute(dataAttr) === index) {
            return child;
          }
        }
      }

      return null;
    }

    // open modal
    function showModal() {

      return function (e) {
        if (state.isModalOpened) { return; }

        state.isModalOpened = true;
        let workTitle = this;
        let index = workTitle.getAttribute('data-work-id');
        modal.showTargetWrapper = findShowTarget('data-work-id', index);

        if (modal.showTargetWrapper === null) {
          state.isModalOpened = false;
          return;
        }

        modal.gif = modal.showTargetWrapper.getElementsByClassName('modal_work-img')[0];
        // prevent cash
        modal.gif.setAttribute('src', modal.gif.getAttribute('data-image-url')
         + '?' + (new Date).getTime());

        $('html').addClass('is--unscrollable');
        $('body').addClass('is-unscrollable');

        $(modal.modalBase).fadeIn(ANIME_MID_FAST_MILSEC, function () {
          // preparation to slide in modale contents
          $(modal.showTargetWrapper).addClass('is-set');
          $(modal.showTargetWrapper).find('.target').slideDown(ANIME_MID_SLOW_MILSEC);
        });

      };
    }

    // close modal
    function closeModal(modalBase) {
      return function () {
        if (!state.isModalOpened) { return; }

        state.isModalOpened = false;
        let closeBtn = this;
        // $(closeBtn).off('click');

        $(modal.showTargetWrapper).find('.target').slideUp(ANIME_MID_SLOW_MILSEC, function () {
          // preparation to slide out modale contents
          $(modal.showTargetWrapper).find('.is-set').removeClass('is-set');
          modal.gif.removeAttribute('src');

          $(modal.modalBase).fadeOut(ANIME_MID_FAST_MILSEC, function () {
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
        let scrollTop = $(this).scrollTop();

        if (!(closedImg.length > 0)) {
          closedImg = document.getElementsByClassName('is-closed');
        }

        $(closedImg).each(function () {
          let top = $(this).offset().top;
          if (scrollTop + windowHight > top) {
            $(this).removeClass('is-closed');
          }
        });

        state.timerID = null;
      };

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
        type: 'GET',
      }).done(function (json) {
        setWorks(json.works);
      }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        // console.log('XMLHttpRequest : ' + XMLHttpRequest.status);
        // console.log('textStatus     : ' + textStatus);
        // console.log('errorThrown    : ' + errorThrown.message);

        //if loading failed, set error img in work section
        let errorData = {
          work1: {
            title: 'error. please try to reload.',
            desc: 'sorry. error occured, please try to reload.',
            skills: '',
            link: '',
            imageDir: '',
            images: '',
            modalImage: '',
          },
        };

        setWorks(errorData);
      });

      /*-----------------------------------
      draw svg
      -----------------------------------*/
      // hide svg
      $(svg.path).each(function (index) {
        let lenght = this.getTotalLength() + 300;
        this.style.strokeDasharray  = lenght + ' ' + lenght;
        this.style.strokeDashoffset = lenght;
      });

      $(svg.path).addClass('is-ready');

      // draw svg
      $(svg.path).each(function () {
        $(this).animate({ strokeDashoffset: 1 },
          { duration: ANIME_SLOW_MILSEC,
            complete: function () {
              $(this).animate({ fillOpacity: 1, strokeWidth: 0 },
              { duration: ANIME_MID_FAST_MILSEC }
              );
            },
          }
        );
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

        let href = $(this).attr('href');
        let target = $(href === '#' || href === '' ? 'html' : href);
        $('html, body').animate({ scrollTop: target.offset().top }, ANIME_MID_FAST_MILSEC);
        return false;
      });

      // skill bar hover
      $('.bar').mouseenter(function (e) {
        $(this).addClass('is-protruded');
      });

      $('.bar').on('transitionend', function (e) {
        if (!$(this).hasClass('is-protruded')) {
          return;
        }

        $(this).find('.bar_description').slideDown(ANIME_FAST_MILSEC);
      });

      $('.bar').mouseleave(function (e) {
        let _this = this;
        $(this).find('.bar_description').slideUp(ANIME_FAST_MILSEC, function () {
          $(_this).removeClass('is-protruded');
        });
      });

      // show closed images at works section
      let closedImg = document.getElementsByClassName('.is-closed');
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
