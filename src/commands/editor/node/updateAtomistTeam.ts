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

import { HandlerContext } from "@atomist/automation-client";
import { Project } from "@atomist/automation-client/project/Project";

export async function updateAtomistTeam(project: Project, ctx: HandlerContext) {
    const atomistConfigFile = await project.findFile("src/atomist.config.ts");
    const content = await atomistConfigFile.getContent();
    const newContent = content.replace(/teamIds:\s*\[[^\]]*]/,
        `teamIds: ["${ctx.teamId}"]`);
    await atomistConfigFile.setContent(newContent);
    return project;
}
