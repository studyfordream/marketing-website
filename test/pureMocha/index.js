var should = require('chai').should();
var expect = require('chai').expect;

describe('testing async and sync function', function() {
  this.timeout(30000);
  describe('an async function', function() {
    var testThis;
    it('it should pass', function(done) {
      setTimeout(function() {
        testThis = 'hello';
        expect(testThis).to.equal('hello');
        done();
      }, 2000);
    });
  }); //end signin test
  
  describe('a sync function', function() {
    var animal = 'horse';
    it('it should fail', function() {
      expect(animal).to.equal('cow');
    });
  }); //end create account test
  
  describe('a failing async', function() {
    var things = {first: 'one thing'};
    it('it should fail and continue', function(done) {
      setTimeout(function() {
        things.second = 'another thing';
        expect(things).to.have.property('nothing');
        done();
      }, 2000);
    });
  }); //end retrieve password test


  describe('a last async', function() {
    var things = {first: 'one thing'};
    it('it should pass and not timeout', function(done) {
      setTimeout(function() {
        things.second = 'another thing';
        expect(things).to.have.property('second');
        done();
      }, 2000);
    });
  }); //end retrieve password test

});
