import { initMemoryMonitoring } from "@atomist/automation-client/internal/util/memory";
import * as appRoot from "app-root-path";
import { nodeGenerator } from "./commands/generator/NodeGenerator";
import { LogzioAutomationEventListener, LogzioOptions } from "./util/logzio";
import { secret } from "./util/secrets";

const pj = require(`${appRoot.path}/package.json`);

const token = secret("github.token", process.env.GITHUB_TOKEN);
const notLocal = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

const logzioOptions: LogzioOptions = {
    applicationId: secret("applicationId"),
    environmentId: secret("environmentId"),
    token: secret("logzio.token", process.env.LOGZIO_TOKEN),
};

// Set up automation event listeners
const listeners = [];

// Logz.io will only work in certain environments
if (logzioOptions.token) {
    listeners.push(new LogzioAutomationEventListener(logzioOptions));
}

const AtomistUser: string = "atomist-bot";
const AtomistToken: string = process.env.ATOMIST_GITHUB_TOKEN || token;

export const configuration: any = {
    name: pj.name,
    version: pj.version,
    // groups: ["all"],
    teamIds: [ "T5964N9B7" ],
    commands: [
        () => nodeGenerator(),
    ],
    events: [],
    token,
    listeners,
    http: {
        enabled: true,
        auth: {
            basic: {
                enabled: false,
            },
            bearer: {
                enabled: true,
            },
            github: {
                enabled: false,
            },
        },
        forceSecure: false,
    },
    applicationEvents: {
        enabled: true,
        teamId: "T29E48P34",
    },
    cluster: {
        enabled: true,
        workers: 2,
    },
};

// For now, we enable a couple of interesting memory and heap commands on this automation-client
initMemoryMonitoring(`${appRoot.path}/node_modules/@atomist/automation-client/public/heap`);
