import { Configuration } from "@atomist/automation-client";
import { initMemoryMonitoring } from "@atomist/automation-client/internal/util/memory";

import * as config from "config";
import * as appRoot from "app-root-path";

import { nodeGenerator } from "./commands/generator/NodeGenerator";
import { LogzioAutomationEventListener, LogzioOptions } from "./util/logzio";
import { secret } from "./util/secrets";

// tslint:disable-next-line:no-var-requires
const pj = require(`${appRoot.path}/package.json`);

const token = secret("github.token", process.env.GITHUB_TOKEN);
const notLocal = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";

const logzioOptions: LogzioOptions = {
    applicationId: secret("applicationId"),
    environmentId: secret("environmentId"),
    token: secret("logzio.token", process.env.LOGZIO_TOKEN),
};

export const configuration: Configuration = {
    name: pj.name,
    version: pj.version,
    keywords: pj.keywords,
    policy: config.get("policy"),
    teamIds: config.get("teamIds"),
    token,
    commands: [
        () => nodeGenerator(),
    ],
    events: [],
    listeners: [],
    http: {
        enabled: true,
        auth: {
            basic: {
                enabled: config.get("http.auth.basic.enabled"),
                username: secret("dashboard.user"),
                password: secret("dashboard.password"),
            },
            bearer: {
                enabled: config.get("http.auth.bearer.enabled"),
                adminOrg: "atomisthq",
            },
        },
    },
    endpoints: {
        api: config.get("endpoints.api"),
        graphql: config.get("endpoints.graphql"),
    },
    applicationEvents: {
        enabled: true,
        teamId: "T29E48P34",
    },
    cluster: {
        enabled: notLocal,
        // worker: 2,
    },
    ws: {
        enabled: true,
        termination: {
            graceful: true,
        },
    },
};
(configuration as any).groups = config.get("groups");

initMemoryMonitoring();
