
import { doWithJson } from "@atomist/automation-client/project/util/jsonUtils";

export function updatePackageJsonIdentification(appName: string,
                                                description: string,
                                                version: string,
                                                author: string) {
    return project =>
        doWithJson(project, "package.json", pkg => {
            pkg.name = appName;
            pkg.description = description;
            pkg.version = version;
            pkg.author = author;
        });
}
