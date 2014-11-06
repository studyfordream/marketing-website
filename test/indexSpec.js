var Nightmare = require('nightmare');
//var should = require('should');
var TerminalReporter = require('grunt-jasmine-node/node_modules/jasmine-node/lib/jasmine-node/reporter').jasmineNode.TerminalVerboseReporter;

describe('Nightmare', function () {
  //this.timeout(20000);
  jasmine.getEnv().defaultTimeoutInterval = 30000;
  var consoleReporter = new jasmine.ConsoleReporter({
    showColors: true,
    print: function() {
      console.log.apply(console, arguments)
    }
  });

  jasmine.getEnv().addReporter(consoleReporter);

  //jasmine.getEnv().addReporter(new jasmine.TerminalReporter({color: true}));

  it('should be constructable', function () {
    var nightmare = new Nightmare();
    expect(nightmare instanceof Nightmare).toBe(true);
  });

  describe('navigation', function () {

    it('should click on a link, go back, and then go forward', function (done) {
      new Nightmare()
        .goto('http://www.google.com/')
        .click('a')
        .back()
        .forward()
        .run(done);
    });

    it('should goto wikipedia.org', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .run(done);
    });

    it('should refresh the page', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .refresh()
        .run(done);
    });

    it('should get the url', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .url(function (url) {
          try {
            expect(url).toBe('http://www.wikipedia.org/');
          } catch(e) {
            console.log('error', e);
          }
        })
        .run(done);
    });

    it('should check if the selector exists', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .exists('a.link-box', function (exists) {
          expect(exists).toBe(true);
        })
        .exists('a.blahblahblah', function (exists) {
          expect(exists).toBe(false);
        })
        .run(done);
    });

    it('should get the title', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .title(function (title) {
          expect(title).toBe('Wikipedia');
        })
        .run(done);
    });

    it('should check if an element is visible', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .visible('input[type="hidden"]',function(visible) {
          expect(visible).toBe(false);
        })
        .visible('#searchInput',function(visible) {
          expect(visible).toBe(true);
        })
        .run(done);
    });

  });
  
  describe('navigation second', function () {

    it('should click on a link, go back, and then go forward', function (done) {
      new Nightmare()
        .goto('http://www.google.com/')
        .click('a')
        .back()
        .forward()
        .run(done);
    });

    it('should goto wikipedia.org', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .run(done);
    });

    it('should refresh the page', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .refresh()
        .run(done);
    });

    it('should get the url', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .url(function (url) {
          try {
            expect(url).toBe('http://www.wikipedia.org/');
          } catch(e) {
            console.log('error', e);
          }
        })
        .run(done);
    });

    it('should check if the selector exists', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .exists('a.link-box', function (exists) {
          expect(exists).toBe(true);
        })
        .exists('a.blahblahblah', function (exists) {
          expect(exists).toBe(false);
        })
        .run(done);
    });

    it('should get the title', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .title(function (title) {
          expect(title).toBe('Wikipedia');
        })
        .run(done);
    });

    it('should check if an element is visible', function (done) {
      new Nightmare()
        .goto('http://www.wikipedia.org/')
        .visible('input[type="hidden"]',function(visible) {
          expect(visible).toBe(false);
        })
        .visible('#searchInput',function(visible) {
          expect(visible).toBe(true);
        })
        .run(done);
    });

  });

});
