import * as talos from "@pulumiverse/talos";
import * as hcloud from "@pulumi/hcloud";
// configuration variables
const server_image = "224159775"
const clusterName = "exampleCluster"
const numberOfWorkerNodes = 2
let workerNodes: hcloud.Server[] = [];
// Server controlplane
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
// Server workers
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
// Control plane IP
const controlPlaneIp = controlPlane.ipv4Address
// Talos
// Credentials
const secrets = new talos.machine.Secrets("secrets", {},{dependsOn: [controlPlane]});
// Configuration definition
const configuration = talos.machine.getConfigurationOutput({
    clusterName: clusterName,
    machineType: "controlplane",
    clusterEndpoint: "https://cluster.local:6443",
    machineSecrets: secrets.machineSecrets,
},{dependsOn: [secrets]});
// Apply configuration to controlPlane
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
// Bootstrap the cluster with controlPlane ipv4Address
const bootstrap = new talos.machine.Bootstrap("bootstrap", {
    node: controlPlaneIp,
    clientConfiguration: secrets.clientConfiguration,
}, {
    dependsOn: [configApplyControlPlane],
});
const configurationWorker = talos.machine.getConfigurationOutput({
    clusterName: clusterName,
    machineType: "worker",
    clusterEndpoint: "https://cluster.local:6443",
    machineSecrets: secrets.machineSecrets,
},{dependsOn: [secrets]});
// Apply configuration to workerNodes
for (let i = 0; i < workerNodes.length; i++) {
    const workerNodeIp = workerNodes[i].ipv4Address;
    new talos.machine.ConfigurationApply(`configurationApplyWorker-${i}`, {
        clientConfiguration: secrets.clientConfiguration,
        machineConfigurationInput: configurationWorker.machineConfiguration,
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
// Retriving kubeconfig output
const kubeConfig = new talos.cluster.Kubeconfig("kubeconfig", {
    node: controlPlaneIp,
    clientConfiguration: {
        caCertificate: secrets.clientConfiguration.caCertificate,
        clientCertificate: secrets.clientConfiguration.clientCertificate,
        clientKey: secrets.clientConfiguration.clientKey,
    }
})
// Stack output defintion
export const kubeconfig = kubeConfig.kubeconfigRaw;
