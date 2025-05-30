"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulumiController = void 0;
const express_1 = require("express");
const virtualMachineService_1 = require("./virtualMachineService");
class PulumiController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.vmService = new virtualMachineService_1.VirtualMachineService();
        this.initializeRoutes();
    }
    /**
     * Initialize all controller routes
     */
    initializeRoutes() {
        // GET endpoint to refresh the stack
        this.router.get('/refresh', this.refreshStack.bind(this));
        // POST endpoint to update the stack (create/update resources)
        this.router.post('/update', this.updateStack.bind(this));
        // DELETE endpoint to destroy the stack (remove all resources)
        this.router.delete('/destroy', this.destroyStack.bind(this));
        // GET endpoint to get the status of the service
        this.router.get('/status', (req, res) => {
            res.status(200).json({ status: 'OK', message: 'Pulumi Automation API is running' });
        });
    }
    /**
     * Handler for refreshing the stack
     */
    refreshStack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Default parameters if not provided in the request
                const params = {
                    name: req.body.name || 'node1',
                    serverType: req.body.serverType || 'cx22',
                    image: req.body.image || 'debian-11'
                };
                yield this.vmService.refreshStack(params);
                res.status(200).json({ message: 'Stack refreshed successfully' });
            }
            catch (error) {
                console.error('Error refreshing stack:', error);
                res.status(500).json({
                    message: 'Error refreshing stack',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        });
    }
    /**
     * Handler for updating the stack
     */
    updateStack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract parameters from request body
                const { name, serverType, image } = req.body;
                // Validate required parameters
                if (!name || !serverType || !image) {
                    res.status(400).json({
                        message: 'Missing required parameters',
                        required: ['name', 'serverType', 'image']
                    });
                    return;
                }
                const params = { name, serverType, image };
                const result = yield this.vmService.updateStack(params);
                res.status(200).json({
                    message: 'Stack updated successfully',
                    summary: result.summary,
                    outputs: result.outputs
                });
            }
            catch (error) {
                console.error('Error updating stack:', error);
                res.status(500).json({
                    message: 'Error updating stack',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        });
    }
    /**
     * Handler for destroying the stack
     */
    destroyStack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Default parameters if not provided in the request
                const params = {
                    name: req.body.name || 'node1',
                    serverType: req.body.serverType || 'cx22',
                    image: req.body.image || 'debian-11'
                };
                yield this.vmService.destroyStack(params);
                res.status(200).json({ message: 'Stack destroyed successfully' });
            }
            catch (error) {
                console.error('Error destroying stack:', error);
                res.status(500).json({
                    message: 'Error destroying stack',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        });
    }
    /**
     * Get the router instance
     */
    getRouter() {
        return this.router;
    }
}
exports.PulumiController = PulumiController;
//# sourceMappingURL=pulumiController.js.map