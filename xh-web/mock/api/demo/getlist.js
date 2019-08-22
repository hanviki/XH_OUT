module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    text: '嘿嘿~~',
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
