import * as talos from "@pulumiverse/talos";
import * as hcloud from "@pulumi/hcloud";

const server_image = "224159775"
// Create a new server running debian
const node1 = new hcloud.Server("node1", {
    name: "node1",
    image: server_image,
    location: "ash",
    serverType: "cpx21",
    publicNets: [{
        ipv4Enabled: true,
        ipv6Enabled: true,
    }],
});
const nodeIp = node1.ipv4Address
const secrets = new talos.machine.Secrets("secrets", {},{dependsOn: [node1]});

const configuration = talos.machine.getConfigurationOutput({
    clusterName: "exampleCluster",
    machineType: "controlplane",
    clusterEndpoint: "https://cluster.local:6443",
    machineSecrets: secrets.machineSecrets,
},{dependsOn: [secrets]});

const configurationApply = new talos.machine.ConfigurationApply("configurationApply", {
    clientConfiguration: secrets.clientConfiguration,
    machineConfigurationInput: configuration.machineConfiguration,
    node: nodeIp,
    configPatches: [JSON.stringify({
        machine: {
            install: {
                disk: "/dev/sdd",
            },
        },
    })],
});

const bootstrap = new talos.machine.Bootstrap("bootstrap", {
    node: nodeIp,
    clientConfiguration: secrets.clientConfiguration,
}, {
    dependsOn: [configurationApply],
});

const kubeconfig = new talos.cluster.Kubeconfig("kubeconfig", {
    node: nodeIp,
    clientConfiguration: {
        caCertificate: secrets.clientConfiguration.caCertificate,
        clientCertificate: secrets.clientConfiguration.clientCertificate,
        clientKey: secrets.clientConfiguration.clientKey,
    }
})

export const kubeconfigOutput = kubeconfig.kubeconfigRaw;
