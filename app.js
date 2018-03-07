const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(6040, '0.0.0.0', (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Shift Explorer Frontend started at 0.0.0.0:6040`);
	}
});
