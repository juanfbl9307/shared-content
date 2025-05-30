"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pulumiController_1 = require("./pulumiController");
// Create Express application
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Initialize controller
const pulumiController = new pulumiController_1.PulumiController();
// Register routes
app.use('/api/pulumi', pulumiController.getRouter());
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Pulumi Automation API',
        endpoints: {
            status: '/api/pulumi/status',
            refresh: '/api/pulumi/refresh',
            update: {
                url: '/api/pulumi/update',
                method: 'POST',
                body: {
                    name: 'string (required)',
                    serverType: 'string (required)',
                    image: 'string (required)'
                }
            },
            destroy: '/api/pulumi/destroy'
        }
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/`);
});
//# sourceMappingURL=index.js.map