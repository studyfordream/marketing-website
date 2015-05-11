var expect = require('chai').expect;
var path = require('path');
var _ = require('lodash');
var assemble = require('assemble');
var config = require('./config');

describe('merge all layout keys associated with pages in websiteRoot and subfolders onto the file.data objects', function() {
  var instance = null;
  var locale = 'de';
  var merged;

  before(function() {
    var patterns = ['**/*.yml'];
    var rootPath = path.join(__dirname, 'fixture', config.websiteRoot);
    var subfolderPath = path.join(__dirname, 'fixture', config.subfoldersRoot, locale);
    instance = assemble.init();
    instance.data(config);

    var readYmlData = require('../transforms/translation-helpers/yml-file-data')(instance);
    var rootData = readYmlData(patterns, rootPath);
    var subfolderData = readYmlData(patterns, subfolderPath);
    var createDictionary = require('../utils/create-dictionary')(instance);
    var rootDict = createDictionary(rootData);
    var subfolderDict = createDictionary(subfolderData, locale);

    var pageDataClone = {
      layouts: {
        '/layouts/path/a': {
          TR_layout_data_a: 'layout data `a`',
          layoutData: 'layout data `a`'
        },
        '/layouts/path/b': {
          TR_layout_data_b: 'layout data `b`',
          layoutData: 'layout data `b`'
        }
      }
    };

    _.forEach(subfolderData, function(fileData, fp) {
      fileData.layouts = _.cloneDeep(pageDataClone.layouts);
    });

    _.forEach(rootData, function(fileData, fp) {
      fileData.layouts = _.cloneDeep(pageDataClone.layouts);
    });

    var removeTranslationKeys = require('../utils/remove-translation-keys')(instance);
    pageDataClone[config.websiteRoot] = removeTranslationKeys(rootData);
    pageDataClone[locale] = removeTranslationKeys(subfolderData, locale);
    removeTranslationKeys(pageDataClone.layouts);

    var mergeLayoutData = require('../plugins/translation-utils/merge-layout-data')(instance);

    merged = mergeLayoutData(pageDataClone);
    console.log(merged);
  });

  describe('mergeLayoutData()', function() {

    it('translates subfolder data', function() {
      //expect(translated[locale]['/grunt/assemble/test/fixture/subfolders/de/c/index']).to.have.deep.property('page_data.TR_subfolder_c', '~subfolder c data~');
      //expect(translated[locale]['/grunt/assemble/test/fixture/subfolders/de/d/index']).to.have.deep.property('page_data.TR_subfolder_d', '~subfolder d data~');
    });

  });

});


