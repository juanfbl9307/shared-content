import express from 'express';
import bodyParser from 'body-parser';
import { PulumiController } from './pulumiController';

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize controller
const pulumiController = new PulumiController();

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
