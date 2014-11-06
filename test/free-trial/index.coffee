path = require 'path'
Nightmare = require 'nightmare'
should = require('chai').should()
screenshotPath = path.join(process.cwd(), 'screenshots', '/')
freeTrialPath = 'http://0.0.0.0:9000/dist/free-trial'
phantomPath = require('phantomjs').path


describe 'testing form on the free trial page', () ->
  @timeout 30000
    
  describe 'submit the form with an invalid email', () ->
    it 'the email input will show an error', (done) ->
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .type('input[name="url-input"]', 'freeTrialPath')
        .type('input[name="name"]', 'DFP')
        .type('input[name="email"]', 'EatBurritos2013')
        .click('button[type="submit"]')
        .wait(1000)
        .exists '#email.oform-error-show', (emailErrorExists) ->
          emailErrorExists.should.be.true
          done()
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else 
            console.log 'Done.'
  
  describe 'submit the form without a phone number', () ->
    it 'should be successful and redirect to the /edit route', (done) ->
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .type('input[name="url-input"]', 'freeTrialPath')
        .type('input[name="name"]', 'DFP')
        .type('input[name="email"]', 'EatBurritos2013@g.com')
        .click('button[type="submit"]')
        .wait(3000)
        .url (url) ->
          urlContainsEditPath = /\/edit/.test(url)
          urlContainsEditPath.should.be.true
          done()
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else
            console.log 'Done.'

  describe 'submit the form with no info', () ->
    it 'shows an error class on the body', (done) ->
      new Nightmare({phantomPath: phantomPath})
        .viewport(1024, 1000)
        .goto(freeTrialPath)
        .wait(2000)
        .click('#submit')
        .wait(2000)
        .evaluate () ->
          document.getElementsByTagName('body')[0].className.match('oform-error')
        , (bodyClassArr) ->
          bodyClassArr.should.have.length(1)
          done()
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else
            console.log 'Done.'
