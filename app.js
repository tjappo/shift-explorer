const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(6040, '0.0.0.0', (err) => {
	if (err) {
		console.log(err); // eslint-disable-line no-console
	} else {
		console.log('Shift Explorer Frontend started at 0.0.0.0:6040'); // eslint-disable-line no-console
	}
});
