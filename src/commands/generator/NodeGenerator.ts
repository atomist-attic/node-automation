import { HandleCommand, Parameter } from "@atomist/automation-client";
import { AnyProjectEditor } from "@atomist/automation-client/operations/edit/projectEditor";
import { chainEditors } from "@atomist/automation-client/operations/edit/projectEditorOps";
import {
    BaseSeedDrivenGeneratorParameters,
} from "@atomist/automation-client/operations/generate/BaseSeedDrivenGeneratorParameters";
import { ProjectPersister } from "@atomist/automation-client/operations/generate/generatorUtils";
import { GitHubProjectPersister } from "@atomist/automation-client/operations/generate/gitHubProjectPersister";
import { updatePackageJsonIdentification } from "../editor/node/updatePackageJsonIdentification";
import { updateReadme } from "../editor/node/updateReadme";

import { Parameters } from "@atomist/automation-client/decorators";
import { generatorHandler } from "@atomist/automation-client/operations/generate/generatorToCommand";

/**
 * Creates a GitHub Repo and installs Atomist collaborator if necessary
 */
@Parameters()
export class NodeGeneratorParameters extends BaseSeedDrivenGeneratorParameters {

    @Parameter({
        displayName: "App name",
        description: "Application name",
        pattern: /^([a-z][-a-z0-9_]*)$/,
        validInput: "a valid Maven artifact ID, which starts with a lower-case letter and contains only " +
        " alphanumeric, -, and _ characters, or `${projectName}` to use the project name",
        minLength: 1,
        maxLength: 50,
        required: true,
        order: 51,
    })
    public appName: string;

    @Parameter({
        displayName: "Version",
        description: "initial version of the project, e.g., 1.2.3-SNAPSHOT",
        pattern: /^.*$/,
        validInput: "a valid semantic version, http://semver.org",
        minLength: 1,
        maxLength: 50,
        required: true,
        order: 52,
    })
    public version: string = "0.1.0";

    constructor() {
        super();
        this.source.owner = "blove";
        this.source.repo = "typescript-express-starter";
    }
}

export function nodeGenerator(projectPersister: ProjectPersister = GitHubProjectPersister): HandleCommand<NodeGeneratorParameters> {
    return generatorHandler(
        nodeTransform,
        NodeGeneratorParameters,
        "springBootGenerator",
        {
            intent: "generate node",
            tags: ["node", "npm", "typescript"],
            projectPersister,
        });
}

function nodeTransform(params: NodeGeneratorParameters): AnyProjectEditor<NodeGeneratorParameters> {
    return chainEditors(
        updatePackageJsonIdentification(params.appName, params.target.description,
            params.version, params.target.owner),
        updateReadme(params.appName, params.target.description),
    );
}
