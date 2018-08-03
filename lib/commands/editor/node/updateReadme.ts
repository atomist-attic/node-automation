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

import { logger } from "@atomist/automation-client";
import { Project } from "@atomist/automation-client/project/Project";

export function updateReadme(appName: string, description: string) {
    return async (project: Project) => {
        try {
            const readmeFile = await project.getFile("README.md");
            const content = await readmeFile.getContent();
            const newContent = content.replace(/^\s*#.*/, `# ${appName}\n\n${description}`);
            await readmeFile.setContent(newContent);
        } catch (e) {
            logger.warn(`Did not update README for ${appName}: ${e.message}`);
        }
        return project;
    };
}
