window.optly.mrkt.modal = window.optly.mrkt.modal || {};

var History = window.History || {},
  //Modernizr = window.Modernizr || {},
  $modalElms = $('[data-optly-modal]'),
  $elms = {},
  baseUrl = document.URL,
  initialTime = Date.now(),
  lastPop,
  //isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
  //isIosSafari = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent) || /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent),
  //isIosChrome = !!navigator.userAgent.match('CriOS'),
  //isHistorySupported = Modernizr.history && !!window.sessionStorage && ( !(isIosSafari || isSafari) ) || isIosChrome,
  isHistorySupported = false,
  historyIcrementor = 0,
  modalState = {},
  historyTimestamp,
  modalTypes = [];

// CACHE ELEMENTS
if ( $modalElms ) {
  $.each( $modalElms, function(index, elm) {
    var $elm = $(elm),
      modalType = $elm.data('optly-modal');

    modalTypes.push(modalType);
    $elms[ modalType ] = $elm;
  });
}

// FUNCTIONS

function setHistoryId(historyData) {
  var stateData = {};
  if (historyData._id) {
    stateData._id = historyData._id + 1;
  }
  else if (sessionStorage._id) {
    stateData._id = sessionStorage._id + 1;
  }
  else {
    stateData._id = 1;
  }
  return stateData;
}

function openModalHandler(modalType) {
  var title,
    stateData;

  // Check for History/SessionStorage support and how many items are on the history stack
  if (isHistorySupported && historyIcrementor === 0) {
    stateData = setHistoryId(History.getState().data);
    stateData.modalType = modalType;
    // increment history count to track if pushstate should occur on next iteration
    historyIcrementor += 1;
    title = modalType.charAt(0).toUpperCase() + modalType.slice(1);
    if (title === 'Signin') {
      title = 'Login';
    }
    historyTimestamp = Date.now();
    History.pushState(stateData, title, baseUrl);
  } //else {
    //window.location.hash = modalType;
  //}
  window.optly.mrkt.modal.open({ modalType: modalType });
}

function closeModalHandler(e) {
  var $modalCont = $(this),
    $clickedElm = $(e.target),
    trackClose = true;
  if ($modalCont.find(e.target).length === 0 || $clickedElm.data('modal-btn') === 'close') {
    // move history back because this event is outside of the history navigation state
    if (isHistorySupported) {
      // reset history count
      historyIcrementor = 0;
      History.back();
    } else {
      //window.location.hash = '';
      window.optly.mrkt.modal.close({
        modalType: $modalCont.data('optly-modal'),
        track: trackClose
      });
    }
  }
  //specifying cancel button functionality
  else if( $clickedElm.data().modalBtn !== undefined ) {
    window.optly.mrkt.modal.open({
      modalType: $clickedElm.data('modal-btn')
    });
  }
}

// Only use this function if History/Session Storage is supported
function storeModalState(modalType, modalOpen) {
  // set the modal type and last type for an open event
  if (modalOpen) {
    sessionStorage.modalType = modalType;
    sessionStorage.lastType = '';
  }
  // set the modal type and last type for an close event
  else {
    sessionStorage.modalType = '';
    sessionStorage.lastType = modalType;
  }

  // increment the session modal state ID if it has currently been set
  if (sessionStorage._id) {
    sessionStorage._id = Number(sessionStorage._id) + 1;
  }
  // create the session modal state ID if it doesn't exist
  else {
    sessionStorage._id = 1;
  }
}

window.optly.mrkt.modal.open = function(modalArgs) {
  var modalType = modalArgs.modalType,
    staticModal = modalArgs.staticModal,
    $elm = $elms[modalType],
    modalName = $elm.data('modalName'),
    animInitiated,
    $focusElm = $elm.find('[autofocus]');
  // if modalState exists then close modal of the currently open modal state
  if(modalState.type !== undefined) {
    window.optly.mrkt.modal.close({ modalType: modalState.type, track: false });
  }

  //Hack for IE focus in
  if($focusElm.length > 0) {

    var intId = window.setInterval(function() {
      if( !$focusElm.is(':focus') ) {
        $focusElm.focus();
      } else {
        window.clearInterval(intId);
      }
    }, 10);

  }

  // update the global modal state
  modalState.type = modalType;

  if (isHistorySupported) {
    // Update the modal state in the session storage
    storeModalState(modalType, true);
  }

  if (!staticModal) {
    $('html, body').addClass('modal-open');
    window.scrollTo(0,0);
  }

  animInitiated = window.optly.mrkt.anim.enter( $elm );

  if (animInitiated) {
    // Fade in the modal and attach the close modal handler
    $elm.bind('click', closeModalHandler);
  }

  window.analytics.page('modal-' + modalName);

  window.analytics.track('modal-' + modalName + '-open', {
    category: 'modal',
    label: window.location.pathname
  }, {
    integrations: {
      Marketo: false
    }
  });

  w.optly.mrkt.modalTiming = {};

  w.optly.mrkt.modalTiming[modalName] = (new Date()).getTime();

  if(typeof modalArgs.callback === 'function'){
    modalArgs.callback();
  }

};

window.optly.mrkt.modal.close = function(modalArgs) {
  var modalType = modalArgs.modalType,
    trackClose = modalArgs.track,
    $elm = $elms[modalType],
    modalName = $elm.data('modalName'),
    animInitiated;

  // update the global modal state
  modalState.type = undefined;

  if (isHistorySupported) {
    // Update the modal state in the session storage
    storeModalState(modalType, false);
  }

  $('html, body').removeClass('modal-open');

  // Set timeout smooths out the scroll top and modal opening
  window.setTimeout(function() {
    //Scroll top if have scrolled within the div
    $elm.children()[0].scrollTop = 0;

    animInitiated = window.optly.mrkt.anim.leave( $elm );

    if (animInitiated) {
      $elm.unbind('click', closeModalHandler);
    }

    if(trackClose) {
      window.analytics.track('modal-' + modalName + '-close', {
        category: 'modal',
        label: window.location.pathname
      }, {
        integrations: {
          Marketo: false
        }
      });
    }

    if(w.optly.mrkt.modalTiming[modalName]){
      if(w.ga){
        var timePassed = (new Date()).getTime() - w.optly.mrkt.modalTiming[modalName];
        w.ga('send', {
			    'hitType': 'timing',
			    'timingCategory': 'time passed at modal close',
			    'timingVar': w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname) + ' ' + modalName,
			    'timingValue': timePassed,
			    'page': w.optly.mrkt.utils.trimTrailingSlash(w.location.pathname)
			  });
      }
    }

  }, 0);
};

// Only use if History/Session Storage in Enabled
function initiateModal() {
  var modalType = sessionStorage.modalType;
  //Trigger Dialog if modal type is present in session storage
  if (modalType !== undefined  && modalTypes.indexOf( sessionStorage.modalType ) !== -1) {
    window.optly.mrkt.modal.open(modalType);
  }

}

function handlePopstate(e) {

  // Safari fires an initial popstate, we want to ignore this
  if ( (e.timeStamp - initialTime) > 20 ) {
    if (sessionStorage.modalType === '' || sessionStorage.modalType === undefined) {
      if (!!sessionStorage.lastType) {
        historyIcrementor += 1;
        window.optly.mrkt.modal.open(sessionStorage.lastType);
      }
    } else {
      historyIcrementor = 0;
      window.optly.mrkt.modal.close(sessionStorage.modalType);
    }
  }
  lastPop = e.timeStamp;
}

//INITIALIZATION
$(function() {
  if (isHistorySupported) {
    // Check if modal state exists from previous page view
    initiateModal();
    // Bind to popstate
    window.addEventListener('popstate', handlePopstate);
  }

  // Bind modal open to nav click events
  $('body').delegate('[data-modal-click]', 'click', function(){
    openModalHandler($(this).data('modal-click'));
  });
});
