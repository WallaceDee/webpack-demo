
const template = require('../template/index.art')

const text = 'Hello World!'
$(document).ready(function($) {
	document.getElementById('wrapper').innerHTML = template({ text: text });
});
