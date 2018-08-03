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
    HandleCommand,
    Parameters,
} from "@atomist/automation-client";
import { generatorHandler } from "@atomist/automation-client/operations/generate/generatorToCommand";
import { ProjectPersister } from "@atomist/automation-client/operations/generate/generatorUtils";
import { GitHubProjectPersister } from "@atomist/automation-client/operations/generate/gitHubProjectPersister";

import { NodeGeneratorParameters } from "../editor/node/nodeGenerator";
import { nodeTransform } from "../editor/node/nodeTransform";

/**
 * Creates an Atomist software delivery machine GitHub repository.
 */
@Parameters()
export class SdmGeneratorParameters extends NodeGeneratorParameters {

    constructor() {
        super();
        this.source.repo = "sample-sdm";
        this.target.description = "an Atomist automation for software delivery";
    }
}

export function sdmGenerator(
    projectPersister: ProjectPersister = GitHubProjectPersister,
): HandleCommand<SdmGeneratorParameters> {

    return generatorHandler(
        nodeTransform,
        SdmGeneratorParameters,
        "sdmGenerator",
        {
            intent: ["create software delivery machine", "create sdm"],
            tags: ["node", "npm", "typescript", "sdm"],
            projectPersister,
        });
}
