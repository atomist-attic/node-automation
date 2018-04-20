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

import { AnyProjectEditor } from "@atomist/automation-client/operations/edit/projectEditor";
import { chainEditors } from "@atomist/automation-client/operations/edit/projectEditorOps";

import { NodeGeneratorParameters } from "./nodeGenerator";
import { updateAtomistTeam } from "./updateAtomistTeam";
import { updatePackageJsonIdentification } from "./updatePackageJsonIdentification";
import { updatePackageLock } from "./updatePackageLock";
import { updateReadme } from "./updateReadme";

export function nodeTransform(params: NodeGeneratorParameters): AnyProjectEditor<NodeGeneratorParameters> {
    return chainEditors(
        updatePackageJsonIdentification(params.target.description,
            params.version, params.screenName, params.target),
        updateReadme(params.target.repo, params.target.description),
        updateAtomistTeam,
        updatePackageLock,
    );
}
