import { logger } from "@atomist/automation-client";
import { LocalProject } from "@atomist/automation-client/project/local/LocalProject";
import { Project } from "@atomist/automation-client/project/Project";
import * as child_process from "child_process";
import { ChildProcess } from "child_process";

export async function updatePackageLock(project: Project): Promise<Project> {
    const result = new Promise<ChildProcess>((resolve, reject) => child_process.exec("npm install",
        {cwd: (project as LocalProject).baseDir}, (err, stdout, stderr) => {
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
