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

import * as assert from "power-assert";

import { HandlerContext } from "@atomist/automation-client";
import { InMemoryProject } from "@atomist/automation-client/project/mem/InMemoryProject";

import { updateAtomistTeam } from "../../../../lib/commands/editor/node/updateAtomistTeam";

describe("update Atomist Team", () => {

    const fakeContext = {
        workspaceId: "TEAMYAY",
    } as any as HandlerContext;

    it("changes the team", done => {
        const p = InMemoryProject.of({
            path: "src/atomist.config.ts",
            content:
                `
export const configuration: Configuration = {
    name: pj.name,
    version: pj.version,
    workspaceIds: ["T5964N9B7"], // <-- run @atomist pwd in your slack team to obtain the team id
    commands: assembled.commandHandlers.concat([
        HelloWorld,
        () => affirmationEditor,
        () => applyHttpServicePhases,
        () => breakBuildEditor,
        () => unbreakBuildEditor,
        () => javaAffirmationEditor,
    ]),
};
`,
        });
        updateAtomistTeam(p, fakeContext)
            .then(
                edited => edited.findFile("src/atomist.config.ts"))
            .then(f => f.getContent())
            .then(content => {
                assert(content.includes(`workspaceIds: ["TEAMYAY"], // <-- run @atomist pwd in your slack team to obt`),
                    "content: " + content);
            })
            .then(done, done);
    });

    it("changes the team when it's multiline", done => {
        const p = InMemoryProject.of({
            path: "src/atomist.config.ts",
            content:
                `
export const configuration: Configuration = {
    name: pj.name,
    version: pj.version,
    workspaceIds: [
        //  "T1JVCMVH7",
        "T5964N9B7",    // spring-team
        //  "T29E48P34",    // Atomist community
    ],
    commands: assembled.commandHandlers.concat([
        HelloWorld,
        () => affirmationEditor,
        () => applyHttpServicePhases,
        () => breakBuildEditor,
        () => unbreakBuildEditor,
        () => javaAffirmationEditor,
    ]),
};
`,
        });
        updateAtomistTeam(p, fakeContext)
            .then(
                edited => edited.findFile("src/atomist.config.ts"))
            .then(f => f.getContent())
            .then(content => {
                assert(content.includes(`workspaceIds: ["TEAMYAY"],\n    commands:`),
                    "content: " + content);
            })
            .then(done, done);
    });
});
