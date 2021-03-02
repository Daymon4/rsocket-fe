const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(createProxyMiddleware('/rsocket', {
        target: 'https://ws.staging.underline.io',
        changeOrigin: true,
        ws: true,
    }));
}
