const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const expressStatusMonitor = require('express-status-monitor');
const path = require('path');
const mongoose = require('mongoose');

//Express Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressStatusMonitor());
app.set('port', process.env.PORT || 3000);
mongoose.connect ('mongodb://localhost/tpmDB');



//Start Express server.
app.listen(app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
