var expect = require('expect');
var { createSpy, spyOn } = expect;
var History = require('../History');

function describeHistory(history) {
  it('is an instanceof History', function () {
    expect(history).toBeA(History);
  });

  describe('.listen', function () {
    it('calls new listeners immediately', function () {
      var outerLocation;

      history.listen(function (location) {
        outerLocation = location;
      });

      expect(outerLocation).toBeAn('object');
    });
  });

  describe('adding/removing a listener', function () {
    var push, go, pushSpy, goSpy;
    beforeEach(function () {
      // It's a bit tricky to test change listeners properly because
      // they are triggered when the URL changes. So we need to stub
      // out push/go to only notify listeners ... but we can't make
      // assertions on the location because it will be wrong.
      push = history.push;
      pushSpy = spyOn(history, 'push').andCall(history.notifyChange);

      go = history.go;
      goSpy = spyOn(history, 'go').andCall(history.notifyChange);
    });

    afterEach(function () {
      history.push = push;
      history.go = go;
    });

    it('works', function () {
      var spy = expect.createSpy(function () {});

      history.addChangeListener(spy);
      history.push('/home'); // call #1
      expect(pushSpy).toHaveBeenCalled();

      expect(spy.calls.length).toEqual(1);

      history.removeChangeListener(spy)
      history.back(); // call #2
      expect(goSpy).toHaveBeenCalled();

      expect(spy.calls.length).toEqual(1);
    });
  });
}

module.exports = describeHistory;
