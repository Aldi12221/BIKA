let app;

try {
  app = require('../app');
} catch (err) {
  console.error('Failed to load app:', err);
  app = (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server failed to initialize', detail: err.message }));
  };
}

module.exports = app;
