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
import { LocalProject } from "@atomist/automation-client/project/local/LocalProject";
import { Project } from "@atomist/automation-client/project/Project";
import * as child_process from "child_process";
import { ChildProcess } from "child_process";

export async function updatePackageLock(project: Project): Promise<Project> {
    const result = new Promise<ChildProcess>((resolve, reject) => child_process.exec("npm install",
        { cwd: (project as LocalProject).baseDir }, (err, stdout, stderr) => {
            if (err) {
                logger.warn("Error in npm install: " + err);
                logger.warn(stderr);
                reject(err);
            } else {
                logger.debug("npm installed:");
                logger.debug(stdout);
                resolve();
            }
        }));

    await result.catch(err => logger.warn("ignoring error; package-lock.json not updated"));
    return project;
}
