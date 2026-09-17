const {getOpportunities} = require('../database');

function buildOpportunities(entity) {
  return getOpportunities(entity.id);
}

module.exports = {buildOpportunities};
