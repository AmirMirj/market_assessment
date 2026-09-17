const {buildAssessment} = require('../lib/assessment');

module.exports = (request, response) => {
  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({error: 'Method not allowed'});
  }

  const input =
      request.method === 'GET' ? request.query?.company : request.body?.company;
  const assessment = buildAssessment(input);
  if (!assessment) {
    return response.status(404).json({
      error: 'Profile not yet available',
      code: 'ENTITY_NOT_FOUND',
      fallback: true,
    });
  }

  return response.status(200).json({...assessment, fallback: true});
};
