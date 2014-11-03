path = require 'path'
Nightmare = require 'nightmare'
should = require('chai').should()
screenshotPath = path.join(process.cwd(), 'screenshots', '/')

describe 'testing signin, create account, and retrieve password', () ->
  @timeout 30000
  describe 'filling out the signin form', () ->
    it 'redirects to the dashboard', (done) ->
      new Nightmare()
        .viewport(1024, 1000)
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signin"]')
        .wait('#signin-dialog')
        .screenshot(screenshotPath)
        .type('#signin-dialog input[name="email"]', 'dfp@optimizely.com')
        .type('#signin-dialog input[name="password"]', 'EatBurritos2013')
        .screenshot(screenshotPath)
        .click('#signin-dialog button[type="submit"]')
        .wait(3000)
        .screenshot(screenshotPath)
        .url (url) ->
          url.should.eq 'http://0.0.0.0:9000/dashboard'
          done();
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else 
            console.log 'Done.'
  
  describe 'filling out the create account form', () ->
    it 'shows the logged in utility nav', (done) ->
      new Nightmare()
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signup"]')
        .wait('#signup-dialog')
        .type('#signup-dialog input[name="email"]', 'dfp@optimizely.com')
        .type('#signup-dialog input[name="password1"]', 'EatBurritos2013')
        .type('#signup-dialog input[name="password2"]', 'EatBurritos2013')
        .click('#signup-dialog button[type="submit"]')
        .wait(3000)
        .exists '#signed-in-utility', (navExists) ->
          navExists.should.be.true
          done()
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else 
            console.log 'Done.'
  
  describe 'filling out the retrieve password form', () ->
    it 'displays the email sent success message', (done) ->
      new Nightmare()
        .goto('http://0.0.0.0:9000/dist')
        .click('[data-modal-click="signin"]')
        .click('[data-modal-click="reset-password"]')
        .wait('#reset-password-dialog')
        .type('#reset-password-dialog input[name="email"]', 'david.fox-powell@optimizely.com')
        .click('#reset-password-dialog button[type="submit"]')
        .wait(3000)
        .evaluate () ->
          document.querySelector('#reset-password-dialog .options p').innerHTML
        , (optionsElmText) ->
            optionsElmText.should.eq 'Email sent.'
            done()
        .run (err, nightmare) ->
          if err
            console.log 'error', err
          else
            console.log 'Done.'
