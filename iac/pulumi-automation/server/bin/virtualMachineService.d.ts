export interface VirtualMachineParams {
    name: string;
    serverType: string;
    image: string;
}
export declare class VirtualMachineService {
    /**
     * Creates a Pulumi program that provisions a Hetzner Cloud server
     */
    private createPulumiProgram;
    /**
     * Creates or selects a Pulumi stack
     */
    private getStack;
    /**
     * Refreshes the Pulumi stack
     */
    refreshStack(params: VirtualMachineParams): Promise<void>;
    /**
     * Updates the Pulumi stack (creates or updates resources)
     */
    updateStack(params: VirtualMachineParams): Promise<any>;
    /**
     * Destroys the Pulumi stack (removes all resources)
     */
    destroyStack(params: VirtualMachineParams): Promise<void>;
}
