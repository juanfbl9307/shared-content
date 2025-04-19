import * as talos from "@pulumiverse/talos";
import * as hcloud from "@pulumi/hcloud";

const server_image = "224159775"
const clusterName = "exampleCluster"
const numberOfWorkerNodes = 2
let workerNodes: hcloud.Server[] = [];
// Create a new server with the specified image from the snapshot created.
const controlPlane = new hcloud.Server(`controlplane`, {
    name: `controlplane`,
    image: server_image,
    location: "ash",
    serverType: "cpx21",
    publicNets: [{
        ipv4Enabled: true,
        ipv6Enabled: true,
    }],
})
for (let i = 0; i < numberOfWorkerNodes; i++) {
    let name = `worker-${i}`;
    const node = new hcloud.Server(name, {
        name: name,
        image: server_image,
        location: "ash",
        serverType: "cpx21",
        publicNets: [{
            ipv4Enabled: true,
            ipv6Enabled: true,
        }],
    });
    workerNodes.push(node);
}

const controlPlaneIp = controlPlane.ipv4Address
const secrets = new talos.machine.Secrets("secrets", {},{dependsOn: [controlPlane]});

const configuration = talos.machine.getConfigurationOutput({
    clusterName: clusterName,
    machineType: "controlplane",
    clusterEndpoint: "https://cluster.local:6443",
    machineSecrets: secrets.machineSecrets,
},{dependsOn: [secrets]});

const configApplyControlPlane = new talos.machine.ConfigurationApply("configurationApply", {
    clientConfiguration: secrets.clientConfiguration,
    machineConfigurationInput: configuration.machineConfiguration,
    node: controlPlaneIp,
    configPatches: [JSON.stringify({
        machine: {
            install: {
                disk: "/dev/sdd",
            },
        },
    })],
});

const bootstrap = new talos.machine.Bootstrap("bootstrap", {
    node: controlPlaneIp,
    clientConfiguration: secrets.clientConfiguration,
}, {
    dependsOn: [configApplyControlPlane],
});

for (let i = 0; i < workerNodes.length; i++) {
    const workerNodeIp = workerNodes[i].ipv4Address;
    new talos.machine.ConfigurationApply(`configurationApplyWorker-${i}`, {
        clientConfiguration: secrets.clientConfiguration,
        machineConfigurationInput: configuration.machineConfiguration,
        node: workerNodeIp,
        configPatches: [JSON.stringify({
            machine: {
                install: {
                    disk: "/dev/sdd",
                },
            },
        })],
    }, {
        dependsOn: [bootstrap],
    });
}

const kubeconfig = new talos.cluster.Kubeconfig("kubeconfig", {
    node: controlPlaneIp,
    clientConfiguration: {
        caCertificate: secrets.clientConfiguration.caCertificate,
        clientCertificate: secrets.clientConfiguration.clientCertificate,
        clientKey: secrets.clientConfiguration.clientKey,
    }
})

export const kubeconfigOutput = kubeconfig.kubeconfigRaw;
