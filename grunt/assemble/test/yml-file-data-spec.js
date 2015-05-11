var expect = require('chai').expect;
var assemble = require('assemble');
var readYml = require('../transforms/translation-helpers/yml-file-data');
var path = require('path');

describe('transforms', function() {
  var instance = null;

  beforeEach(function() {
    instance = assemble.init();
    instance.set('data.pageContentNamespace', 'page_data');
  });

  describe('readYml()', function() {
    it('should read data from root', function() {
      var cwd = path.join(__dirname, 'fixture/website');
      var patterns = '**/*.yml';
      var data = readYml(instance)(patterns, cwd);
      var aKey = '/grunt/assemble/test/fixture/website/a/index';
      var bKey = '/grunt/assemble/test/fixture/website/b/index';

      expect(data).to.include.keys(aKey, bKey);
      expect(data[aKey]).to.deep.equal({ page_data: { a: 'a', b: 'b' } });
      expect(data[bKey]).to.deep.equal({ page_data: { ba: 'a' } });
    });

    it('should read data from locale', function() {
      var cwd = path.join(__dirname, 'fixture/subfolders');
      var patterns = '**/*.yml';
      var data = readYml(instance)(patterns, cwd);
      var cKey = '/grunt/assemble/test/fixture/subfolders/de/c/index';
      var dKey = '/grunt/assemble/test/fixture/subfolders/de/d/index';

      expect(data).to.include.keys(cKey, dKey);
      expect(data[cKey]).to.deep.equal({ page_data: { c: 'c', TR_subfolder_c: 'subfolder c data'} });
      expect(data[dKey]).to.deep.equal({
        page_data: {
          d: 'd',
          TR_subfolder_d: 'subfolder d data',
          d_1: 'd_1',
          TR_subfolder_d_1: 'subfolder d_1 data'
        }
      });
    });

  });

});
