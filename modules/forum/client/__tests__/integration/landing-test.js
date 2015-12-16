import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Async from 'TestHelpers/client/dom';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Integration test', () => {
  describe('landing page transition to forum', () => {
    var button;
    beforeEach(done => {
      button = $('#landing-discover');
      setTimeout(() => {
        button.click();
        done();
      }, 500)
    });

    afterEach(done => {
      done();
    });
    
    it('on click', () => {
      expect(location.pathname).toEqual('/forum');
    });
  });

  describe('when user not login in forum', () => {
    beforeEach(done => {
      var button;      
      button = $('#landing-discover');
      setTimeout(() => {
        button.click();
        done();
      }, 500)
    });
    
    it('open login form', done => {
      var button;
      var popover;
      new Async(() => {
        button = $('#signin-anchor');
      }).waitsFor(() => {
        button.click();
      }, 500).continueWith(() => {
        popover = $('.right-popover');
        expect(popover.length).toEqual(1);
        done();
      });
    })
  })
});
