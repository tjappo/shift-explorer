/**
 * SOCKET SERVER CONFIGURATION
 */

const config = { };

/**
 * Server settings
 */
config.host = '127.0.0.1';
config.port = 6041;
config.log  = { };

/**
 * SHIFT node
 */
config.shift = { };
config.shift.host = 'corenode1.shiftnrg.org';
config.shift.port = 9305;


/**
 * Logger settings
 */

config.log.enabled = true;
config.log.file    = './logs/socket-server.log';
config.log.level   = 'info';

/**
 * Delegate Proposals
 */
// Delegate proposals support (true - enabled, false - disabled)
config.proposals = { };
config.proposals.enabled = true;
// Interval in ms for updating delegate proposals (default: 10 minutes)
config.proposals.updateInterval = 600000;

module.exports = config;
