var expect = require('chai').expect;
var assemble = require('assemble');
var config = require('./config');

describe('create dictionary from all translation keys', function() {
  var instance = null;
  var locale = 'de';
  var cwdPath = 'grunt/assemble/test/fixture';
  var translatePageData, translated;

  before(function() {
    var lang = {
      modals: {
        '/modals/path': {
          TR_modal_data: 'modal data'
        }
      },
      partials: {
        '/partials/path': {
          TR_partial_data: 'partial data',
          HTML_page_content: 'partial content'
        }
      },
      layouts: {
        '/layouts/path': {
          TR_layout_data: 'layout data'
        }
      },
      website: {
        '/website/dirname/a': {
          TR_a: 'a',
          TR_inherit: 'inherit'
        },
        '/website/dirname/b': {
          HTML_b: 'b'
        },
      },
      de: {
        '/subfolders/de/dirname/a': {
          TR_a: 'overwrite'
        },
        '/subfolders/de/dirname/custom': {
          TR_custom: 'custom'
        }
      }
    };

    var pageDataClone = {
      website: {
        '/website/dirname/a': {
          TR_a: 'a',
          TR_inherit: 'inherit'
        },
        '/website/dirname/b': {
          HTML_b: 'b'
        },
      },
      de: {
        '/subfolders/de/dirname/a': {
          TR_a: 'overwrite'
        },
        '/subfolders/de/dirname/custom': {
          TR_custom: 'custom',
          custom: 'custom'
        },
        '/modals/path': {
          TR_modal_data: 'modalData',
          modalData: 'modal data'
        },
        '/partials/path': {
          TR_partial_data: 'partial data',
          HTML_page_content: 'partial content',
          partialData: 'partial data'
        },
        '/layouts/path': {
          TR_layout_data: 'layout data',
          layoutData: 'layout data'
        }
      }
    };

    var translations = {
      de_DE: {
        a: '~a~',
        inherit: '~inherit~',
        b: '~b~',
        overwrite: '~overwrite~',
        custom: '~custom~',
        'modal data': '~modal data~',
        'partial data': '~partial data~',
        'partial content': '~partial content~',
        'layout data': '~layout data~'
      }
    };

    instance = assemble.init();
    instance.data(config);
    instance.set('lang', lang);
    translatePageData = require('../plugins/translation-utils/translate-page-data')(instance, cwdPath);

    translated = translatePageData(locale, pageDataClone, translations);
  });

  describe('translatePageData()', function() {

    it('translates subfolder data', function() {
      expect(translated[locale]).to.have.deep.property('/subfolders/de/dirname/a.TR_a', '~overwrite~');
      expect(translated[locale]).to.have.deep.property('/subfolders/de/dirname/a.TR_inherit', '~inherit~');
    });

  });

});

