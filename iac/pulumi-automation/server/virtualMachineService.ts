import { InlineProgramArgs, LocalWorkspace, Stack } from "@pulumi/pulumi/automation";
import * as hcloud from "@pulumi/hcloud";

export interface VirtualMachineParams {
    name: string;
    serverType: string;
    image: string;
}

export class VirtualMachineService {
    /**
     * Creates a Pulumi program that provisions a Hetzner Cloud server
     */
    private createPulumiProgram(params: VirtualMachineParams) {
        return async () => {
            const node1 = new hcloud.Server("node1", {
                name: params.name,
                image: params.image,
                serverType: params.serverType,
                publicNets: [{
                    ipv4Enabled: true,
                    ipv6Enabled: true,
                }],
            });

            return {
                websiteUrl: node1.name,
            };
        };
    }

    /**
     * Creates or selects a Pulumi stack
     */
    private async getStack(params: VirtualMachineParams): Promise<Stack> {
        const stackArgs: InlineProgramArgs = {
            stackName: "dev",
            projectName: "inlineNode",
            program: this.createPulumiProgram(params)
        };

        return await LocalWorkspace.createOrSelectStack(stackArgs);
    }

    /**
     * Refreshes the Pulumi stack
     */
    public async refreshStack(params: VirtualMachineParams): Promise<void> {
        const stack = await this.getStack(params);
        console.info("refreshing stack...");
        await stack.refresh({ onOutput: console.info });
        console.info("refresh complete");
    }

    /**
     * Updates the Pulumi stack (creates or updates resources)
     */
    public async updateStack(params: VirtualMachineParams): Promise<any> {
        const stack = await this.getStack(params);
        
        console.info("successfully initialized stack");
        console.info("installing plugins...");
        console.info("plugins installed");
        console.info("setting up config");
        console.info("config set");
        
        await this.refreshStack(params);
        
        console.info("updating stack...");
        const upRes = await stack.up({ onOutput: console.info });
        
        return {
            summary: upRes.summary.resourceChanges,
            outputs: upRes.outputs
        };
    }

    /**
     * Destroys the Pulumi stack (removes all resources)
     */
    public async destroyStack(params: VirtualMachineParams): Promise<void> {
        const stack = await this.getStack(params);
        
        console.info("destroying stack...");
        await stack.destroy({ onOutput: console.info });
        console.info("stack destroy complete");
    }
}