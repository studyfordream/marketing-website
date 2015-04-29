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
       var keys = Object.keys(data);
       var aKey = keys[0];
       var bKey = keys[1];

       expect(data).to.have.all.keys(aKey, bKey);
       expect(data[aKey]).to.deep.equal({ page_data: { a: 'a', b: 'b' } });
       expect(data[bKey]).to.deep.equal({ page_data: { ba: 'a' } });
     });

      it('should read data from locale', function() {
       var cwd = path.join(__dirname, 'fixture/subfolders');
       var patterns = '**/*.yml';
       var data = readYml(instance)(patterns, cwd);
       var keys = Object.keys(data);
       var cKey = keys[0];
       var dKey = keys[1];

       expect(data).to.have.all.keys(cKey, dKey);
       expect(data[cKey]).to.deep.equal({ page_data: { c: 'c'} });
       expect(data[dKey]).to.deep.equal({ page_data: { d: 'd', d_1: 'd_1' } });
      });

   });

 });
