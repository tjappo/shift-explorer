const express = require('express');
const config = require('./config');
const path = require('path');
const program = require('commander');
const utils = require('./utils');
const logger = require('./utils/logger');
const split = require('split');
const async = require('async');
const app = express();

app.set('host', config.host);
app.set('port', config.port);
app.set('shift address', `http://${config.shift.host}:${config.shift.port}`);

app.knownAddresses = new utils.knownAddresses();

app.use((req, res, next) => {
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	const wsSrc = `ws://${req.get('host')} wss://${req.get('host')}`;
	res.setHeader('Content-Security-Policy', `frame-ancestors 'none'; default-src 'self'; connect-src 'self' ${wsSrc}; img-src 'self' https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com`);
	return next();
});

app.use(express.static(path.join(__dirname, 'public')));

const morgan = require('morgan');

app.use(morgan('combined', {
	skip(req, res) {
		return parseInt(res.statusCode, 10) < 400;
	},
	stream: split().on('data', (data) => {
		logger.error(data);
	}),
}));
app.use(morgan('combined', {
	skip(req, res) {
		return parseInt(res.statusCode, 10) >= 400;
	},
	stream: split().on('data', (data) => {
		logger.info(data);
	}),
}));
const compression = require('compression');

app.use(compression());
const methodOverride = require('method-override');

app.use(methodOverride('X-HTTP-Method-Override'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));

const corsMiddleWare = function (req, res, next) {
	// TODO: Populate this whitelist from config file
	const ALLOWED_ORIGINS = [ 'http://127.0.0.1:6040' ];

	var origin, isAllowedOrigin;

	origin			= req.headers.origin;
	isAllowedOrigin = ALLOWED_ORIGINS.indexOf(origin) > -1;

	if (isAllowedOrigin) {
		res.header('Access-Control-Allow-Origin', origin);
	}

	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

app.use(corsMiddleWare);

async.parallel([], () => {
	const server = app.listen(app.get('port'), app.get('host'), (err) => {
		if (err) {
			logger.info(err);
		} else {
			logger.info(`Shift Explorer started at ${app.get('host')}:${app.get('port')}`);
            var io = require('socket.io').listen(server);

            setupSockets(io);
		}
	});
});

var setupSockets = function (io) {
    const ns = {
        header: io.of('/header'),
        activityGraph: io.of('/activityGraph'),
        delegateMonitor: io.of('/delegateMonitor'),
        networkMonitor: io.of('/networkMonitor'),
    };

    const header = require('./header');
    const activityGraph = require('./activityGraph');
    const delegateMonitor = require('./delegateMonitor');
    const networkMonitor = require('./networkMonitor');

    const clients = _ns => Object.keys(_ns.connected).length;

    /**
     * @todo Which ns variable?
     */
    const connectionHandler = function (name, _ns, object) {
        _ns.on('connection', (socket) => {
            if (clients(_ns) <= 1) {
                object.onInit();
                logger.info(name, 'First connection');
            } else {
                object.onConnect();
                logger.info(name, 'New connection');
            }
            socket.on('disconnect', () => {
                if (clients(_ns) <= 0) {
                    object.onDisconnect();
                    logger.info(name, 'Closed connection');
                }
            });
            socket.on('forceDisconnect', () => {
               socket.disconnect();
            });
        });
    };

    /**
     * @todo I've used this object to eliminate no-new error
     * Creating an instance of a constructor while not storing the results
     * is a clear sign of side effects.
     */

    /**
     * This could also mean that the code below shouldn't be wrapped in classes
     * It's a very frequent symptom of premature abstraction
     */
    const sideEffects = {};

    sideEffects.header = new header(app, connectionHandler, ns.header);
    sideEffects.activityGraph = new activityGraph(app, connectionHandler, ns.activityGraph);
    sideEffects.delegateMonitor = new delegateMonitor(app, connectionHandler, ns.delegateMonitor);
    sideEffects.networkMonitor = new networkMonitor(app, connectionHandler, ns.networkMonitor);
}
