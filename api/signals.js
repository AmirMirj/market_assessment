const {getSignals} = require('../lib/intelligence/monitoring');

module.exports = (_request, response) =>
    response.status(200).json(getSignals());
