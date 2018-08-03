/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    HandlerContext,
    logger,
} from "@atomist/automation-client";
import {
    File,
} from "@atomist/automation-client/project/File";
import {
    Project,
} from "@atomist/automation-client/project/Project";
import * as path from "path";

export async function updateAtomistTeam(project: Project, ctx: HandlerContext) {
    try {
        let atomistConfigFile: File;
        for (const dir of ["src", "lib"]) {
            atomistConfigFile = await project.getFile(path.join(dir, "atomist.config.ts"));
            if (atomistConfigFile) {
                break;
            }
        }
        if (!atomistConfigFile) {
            return project;
        }
        const content = await atomistConfigFile.getContent();
        const newContent = content
            .replace(/\bworkspaceIds\s*:\s*\[[^\]]*]/, `workspaceIds: ["${ctx.workspaceId}"]`)
            .replace(/\bteamIds\s*:\s*\[[^\]]*]/, `workspaceIds: ["${ctx.workspaceId}"]`);
        await atomistConfigFile.setContent(newContent);
    } catch (e) {
        logger.warn(`Failed to update Atomist workspace: ${e.message}`);
    }
    return project;
}
