var crypto = require("crypto");

var key = "Roy Fielding";
var text = "6d6cc50e4ff16c20cbed53036f87a59587715f205180989111288751";
var decipher = crypto.createDecipher("aes-256-ctr", key);
text = decipher.update(text, "hex", "utf8");
text += decipher.final("utf8");

console.log(text);
