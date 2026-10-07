const { synthesizeReport, readBody } = require('../gemini.cjs');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const result = await synthesizeReport(readBody(req));
    res.status(result.status).json(result.payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
