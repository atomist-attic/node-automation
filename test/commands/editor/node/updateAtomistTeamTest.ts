import { HandlerContext } from "@atomist/automation-client";
import { InMemoryProject } from "@atomist/automation-client/project/mem/InMemoryProject";
import * as assert from "power-assert";
import { updateAtomistTeam } from "../../../../src/commands/editor/node/updateAtomistTeam";

describe("update Atomist Team", () => {

    const fakeContext = {
        teamId: "TEAMYAY",
    } as any as HandlerContext;

    it("changes the team", done => {
        const p = InMemoryProject.of({
            path: "src/atomist.config.ts",
            content:
                `
export const configuration: Configuration = {
    name: pj.name,
    version: pj.version,
    teamIds: ["T5964N9B7"], // <-- run @atomist pwd in your slack team to obtain the team id
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
                assert(content.includes(`teamIds: ["TEAMYAY"], // <-- run @atomist pwd in your slack team to obtain the team id`),
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
    teamIds: [
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
                assert(content.includes(`teamIds: ["TEAMYAY"],\n    commands:`),
                    "content: " + content);
            })
            .then(done, done);
    });
});
