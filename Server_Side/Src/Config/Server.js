const http = require('http');
const configKeys = require('../Config');

const PORT = configKeys.PORT || 5000;

const serverConfig = (server) => {
    const startServer = () => {
        server.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    };

    return {
        startServer
    };
};

module.exports = serverConfig;
