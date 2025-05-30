"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.VirtualMachineService = void 0;
const automation_1 = require("@pulumi/pulumi/automation");
const hcloud = __importStar(require("@pulumi/hcloud"));
class VirtualMachineService {
    /**
     * Creates a Pulumi program that provisions a Hetzner Cloud server
     */
    createPulumiProgram(params) {
        return () => __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * Creates or selects a Pulumi stack
     */
    getStack(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stackArgs = {
                stackName: "dev",
                projectName: "inlineNode",
                program: this.createPulumiProgram(params)
            };
            return yield automation_1.LocalWorkspace.createOrSelectStack(stackArgs);
        });
    }
    /**
     * Refreshes the Pulumi stack
     */
    refreshStack(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield this.getStack(params);
            console.info("refreshing stack...");
            yield stack.refresh({ onOutput: console.info });
            console.info("refresh complete");
        });
    }
    /**
     * Updates the Pulumi stack (creates or updates resources)
     */
    updateStack(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield this.getStack(params);
            console.info("successfully initialized stack");
            console.info("installing plugins...");
            console.info("plugins installed");
            console.info("setting up config");
            console.info("config set");
            yield this.refreshStack(params);
            console.info("updating stack...");
            const upRes = yield stack.up({ onOutput: console.info });
            return {
                summary: upRes.summary.resourceChanges,
                outputs: upRes.outputs
            };
        });
    }
    /**
     * Destroys the Pulumi stack (removes all resources)
     */
    destroyStack(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const stack = yield this.getStack(params);
            console.info("destroying stack...");
            yield stack.destroy({ onOutput: console.info });
            console.info("stack destroy complete");
        });
    }
}
exports.VirtualMachineService = VirtualMachineService;
//# sourceMappingURL=virtualMachineService.js.map