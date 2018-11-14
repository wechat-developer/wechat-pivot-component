var WXBizMsgCrypt = require('wechat-crypto');
var xml2js = require('xml2js');


function Message() {

};


Message.prototype.verify = function (signature, timestamp, nonce, token, encrypted) {
  var utils = new WXBizMsgCrypt(token, 'AeskeynotrequiredAeskeynotrequiredAeskeynot', 'Appidnotrequired');
  return utils.getSignature(timestamp, nonce, encrypted) === signature;
};


Message.prototype.receive = function (xml) {
  return new Promise(function (resolve, reject) {
    var options = {
      explicitArray: false,
      trim: true,
    };
    xml2js.parseString(xml, options, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.xml);
      }
    });
  });
};


Message.prototype.decrypt = function (encrypted, token, aeskey) {
  var utils = new WXBizMsgCrypt(token, aeskey, 'Appidnotrequired');
  var decrypted = utils.decrypt(encrypted);
  // var appid = decrypted.id;
  return this.receive(decrypted.message);
}


module.exports = new Message();
