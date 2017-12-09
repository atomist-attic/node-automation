import { LocalProject } from "@atomist/automation-client/project/local/LocalProject";
import { NodeFsLocalProject } from "@atomist/automation-client/project/local/NodeFsLocalProject";
import * as tmp from "tmp";

import { logger, LoggingConfig } from "@atomist/automation-client/internal/util/logger";

LoggingConfig.format = "cli";
(logger as any).level = process.env.LOG_LEVEL || "info";

export function tempProject(): LocalProject {
    const dir = tmp.dirSync();
    return new NodeFsLocalProject("temp", dir.name);
}
