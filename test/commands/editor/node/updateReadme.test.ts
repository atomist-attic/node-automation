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

import { SimpleProjectEditor } from "@atomist/automation-client/operations/edit/projectEditor";
import { InMemoryProject } from "@atomist/automation-client/project/mem/InMemoryProject";

import { updateReadme } from "../../../../lib/commands/editor/node/updateReadme";

describe("updateReadme", () => {

    it("doesn't edit empty project", done => {
        const p = new InMemoryProject();
        const sim: SimpleProjectEditor = updateReadme("x", "y");
        sim(p, null, null)
            .then(edited => {
                assert(!!edited);
                assert(edited === p);
            }).then(done, done);
    });

    it("changes name", done => {
        const p = InMemoryProject.of({ path: "README.md", content: SimpleReadme });
        const name = "thing1";
        const description = "foo";
        updateReadme(name, description)(p)
            .then(() => {
                const content = p.findFileSync("README.md").getContentSync();
                assert(content.includes(name));
            }).then(done, done);
    });

    it("adds description", done => {
        const p = InMemoryProject.of({ path: "README.md", content: SimpleReadme });
        const description = "whatever you say";
        updateReadme("somename", description)(p)
            .then(() => {
                const content = p.findFileSync("README.md").getContentSync();
                assert(content.includes(description));
            }).then(done, done);
    });

});

export const SimpleReadme = `# TypeScript 2 + Express + Node.js

This is a repository to go with my article on creating an Express web application using TypeScript 2.

## Install

Install the node packages via:

\`$ npm install\`

And then run the grunt task to compile the TypeScript:

\`$ npm run grunt\`

## Starting

To start the server run:

\`$ npm start\``;
