import { Request, Response, Router } from 'express';
import { VirtualMachineService, VirtualMachineParams } from './virtualMachineService';

export class PulumiController {
    private router: Router;
    private vmService: VirtualMachineService;

    constructor() {
        this.router = Router();
        this.vmService = new VirtualMachineService();
        this.initializeRoutes();
    }

    /**
     * Initialize all controller routes
     */
    private initializeRoutes(): void {
        // GET endpoint to refresh the stack
        this.router.get('/refresh', this.refreshStack.bind(this));

        // POST endpoint to update the stack (create/update resources)
        this.router.post('/update', this.updateStack.bind(this));

        // DELETE endpoint to destroy the stack (remove all resources)
        this.router.delete('/destroy', this.destroyStack.bind(this));

        // GET endpoint to get the status of the service
        this.router.get('/status', (req: Request, res: Response) => {
            res.status(200).json({ status: 'OK', message: 'Pulumi Automation API is running' });
        });
    }

    /**
     * Handler for refreshing the stack
     */
    private async refreshStack(req: Request, res: Response): Promise<void> {
        try {
            // Default parameters if not provided in the request
            const params: VirtualMachineParams = {
                name: req.body.name || 'node1',
                serverType: req.body.serverType || 'cx22',
                image: req.body.image || 'debian-11'
            };

            await this.vmService.refreshStack(params);
            res.status(200).json({ message: 'Stack refreshed successfully' });
        } catch (error) {
            console.error('Error refreshing stack:', error);
            res.status(500).json({ 
                message: 'Error refreshing stack', 
                error: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    /**
     * Handler for updating the stack
     */
    private async updateStack(req: Request, res: Response): Promise<void> {
        try {
            // Extract parameters from request body
            const { name, serverType, image } = req.body;

            // Validate required parameters
            if (!name || !serverType || !image) {
                res.status(400).json({
                    message: 'Missing required parameters', 
                    required: ['name', 'serverType', 'image'] 
                });
                return
            }

            const params: VirtualMachineParams = { name, serverType, image };
            const result = await this.vmService.updateStack(params);

            res.status(200).json({ 
                message: 'Stack updated successfully',
                summary: result.summary,
                outputs: result.outputs
            });
        } catch (error) {
            console.error('Error updating stack:', error);
            res.status(500).json({ 
                message: 'Error updating stack', 
                error: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    /**
     * Handler for destroying the stack
     */
    private async destroyStack(req: Request, res: Response): Promise<void> {
        try {
            // Default parameters if not provided in the request
            const params: VirtualMachineParams = {
                name: req.body.name || 'node1',
                serverType: req.body.serverType || 'cx22',
                image: req.body.image || 'debian-11'
            };

            await this.vmService.destroyStack(params);
            res.status(200).json({ message: 'Stack destroyed successfully' });
        } catch (error) {
            console.error('Error destroying stack:', error);
            res.status(500).json({ 
                message: 'Error destroying stack', 
                error: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    /**
     * Get the router instance
     */
    public getRouter(): Router {
        return this.router;
    }
}
