/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from "power-assert";

import { HandlerContext } from "@atomist/automation-client";
import { SimpleProjectEditor } from "@atomist/automation-client/operations/edit/projectEditor";
import { InMemoryProject } from "@atomist/automation-client/project/mem/InMemoryProject";

import { updatePackageJsonIdentification } from "../../../../lib/commands/editor/node/updatePackageJsonIdentification";
import { PersonByChatId } from "../../../../lib/typings/types";

describe("updatePackageJsonIdentification", () => {

    const target = { owner: "org", repo: "repo-yoyo" };

    const fakeQueryResult: PersonByChatId.Query = { ChatId: [{ person: { forename: "Rod", surname: "Johnson" } }] };

    const fakeContext: HandlerContext = {
        graphClient: {
            query: a => Promise.resolve(fakeQueryResult),
        },
    } as HandlerContext;

    it("doesn't edit empty project", async () => {
        const p = new InMemoryProject();
        const sim: SimpleProjectEditor = updatePackageJsonIdentification("y", "v", "a", target);
        const edited = await sim(p, fakeContext, null);
        assert(!!edited);
        assert(edited === p);
    });

    it("changes name", async () => {
        const p = InMemoryProject.of({ path: "package.json", content: SimplePackageJson });
        const desc = "some thing1";
        await updatePackageJsonIdentification(desc, "0.0.0", "a", target)(p, fakeContext);
        const content = p.findFileSync("package.json").getContentSync();
        assert(content.includes(desc));
        const parsed = JSON.parse(content);
        assert(parsed.name === `@${target.owner}/${target.repo}`);
    });

    it("changes version", async () => {
        const p = InMemoryProject.of({ path: "package.json", content: SimplePackageJson });
        const version = "0.1.0";
        await updatePackageJsonIdentification("description of it", version, "a", target)(p, fakeContext);
        const content = p.findFileSync("package.json").getContentSync();
        assert(content.includes(version));
        const parsed = JSON.parse(content);
        assert(parsed.version === version);
    });

    it("changes description", async () => {
        const p = InMemoryProject.of({ path: "package.json", content: SimplePackageJson });
        const version = "0.1.0";
        const description = "whatever you say";
        await updatePackageJsonIdentification(description, version, "a", target)(p, fakeContext);
        const content = p.findFileSync("package.json").getContentSync();
        assert(content.includes(description));
        const parsed = JSON.parse(content);
        assert(parsed.description === description);
    });

    it("changes author", async () => {
        const p = InMemoryProject.of({ path: "package.json", content: SimplePackageJson });
        const version = "0.1.0";
        await updatePackageJsonIdentification("descr", version, "rod's chat ID", target)(p, fakeContext);
        const content = p.findFileSync("package.json").getContentSync();
        assert(content.includes("Rod Johnson"));
        const parsed = JSON.parse(content);
        assert(parsed.author === "Rod Johnson");
    });

});

export const SimplePackageJson = `{
  "name": "heros",
  "description": "The tour of heros",
  "version": "1.0.0",
  "private": true,
  "author": "Brian Love",
  "scripts": {
    "dev": "NODE_ENV=development nodemon ./bin/www",
    "grunt": "grunt",
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "^1.18.2",
    "cookie-parser": "^1.4.3",
    "errorhandler": "^1.5.0",
    "express": "^4.16.2",
    "morgan": "^1.9.0",
    "pug": "^2.0.0-rc.4"
  },
  "devDependencies": {
    "@types/body-parser": "1.16.8",
    "@types/cookie-parser": "^1.4.1",
    "@types/errorhandler": "0.0.32",
    "@types/method-override": "0.0.31",
    "@types/morgan": "^1.7.35",
    "grunt": "^1.0.1",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-ts": "^6.0.0-beta.17",
    "nodemon": "^1.12.1",
    "typescript": "^2.6.1"
  }
}`;
