import { Router } from 'express';
export declare class PulumiController {
    private router;
    private vmService;
    constructor();
    /**
     * Initialize all controller routes
     */
    private initializeRoutes;
    /**
     * Handler for refreshing the stack
     */
    private refreshStack;
    /**
     * Handler for updating the stack
     */
    private updateStack;
    /**
     * Handler for destroying the stack
     */
    private destroyStack;
    /**
     * Get the router instance
     */
    getRouter(): Router;
}
