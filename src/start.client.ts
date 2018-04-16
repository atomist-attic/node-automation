import { automationClient } from "@atomist/automation-client/automationClient";
import { findConfiguration } from "@atomist/automation-client/configuration";
import { logger } from "@atomist/automation-client/internal/util/logger";
import { enableDefaultScanning } from "@atomist/automation-client/scan";
import {
    loadSecretsFromCloudFoundryEnvironment,
} from "./util/secrets";

// tslint:disable:no-floating-promises
loadSecretsFromCloudFoundryEnvironment()
    .then(async () => {
        const configuration = enableDefaultScanning(await findConfiguration());
        const node = automationClient(configuration);
        return node.run()
            .then(() => logger.info("Successfully completed startup of process '%s'", process.pid));
    });
