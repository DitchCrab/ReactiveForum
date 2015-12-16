function asyncWait(delay) {
  return new $.Deferred(function () {
    var _self = this;
    setTimeout(function () {
      _self.resolve();
    }, delay || 0);
  }).promise();
}

var Async = function(init) {
  var d = new $.Deferred(init);
  this.promise = d.promise();
  d.resolve();
};

Async.prototype.continueWith = function (continuation, delay) {
  var _self = this;
  _self.promise.then(function () {
    _self.promise = asyncWait(delay).then(continuation);
  });
  return _self;
};

Async.prototype.waitsFor = function (condition, timeout, pollInterval) {
  pollInterval = pollInterval || 10;
  timeout = timeout || 5000;
  var _self = this,
      wait_d = new $.Deferred(),
      t = 0,
      ln = function () {
        if (condition()) {
          wait_d.resolve();
          return;
        }
        if (t >= timeout) {
          wait_d.reject();
          throw "timeout was reached during waitsFor";
        }
        t += pollInterval;
        setTimeout(ln, pollInterval);
      };
  _self.promise.then(ln);
  _self.promise = wait_d.promise();
  return _self;
};

export default Async;
