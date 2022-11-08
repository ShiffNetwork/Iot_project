const axios = require('axios');
const TEMP_MIN = 150;
const TEMP_MAX = 300;
const ENDPOINT = 'http://localhost:4041/temperatures'; //Middleware Endpoint
function randomNumber(min, max) {
return Math.trunc(Math.random() * (max - min) + min);
}
function toByte(string, length) {
let result = string;
while (result.length < length * 2) {
result = '0' + result;
}
return result;
}
function sendData(data) {
axios.post(ENDPOINT, {
data: data,
});
}
function start() {
const value = toByte(randomNumber(TEMP_MIN, TEMP_MAX).toString(16), 2);
const code = toByte((40).toString(16), 1);
const payload = code + value;
// let result = payload.slice(3);
// let finalRes = parseInt(result, 16)
console.log(payload);
sendData(payload);
}
setInterval(() => start(), 2000);