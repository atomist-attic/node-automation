
import { HandlerContext } from "@atomist/automation-client";
import { Project } from "@atomist/automation-client/project/Project";

export async function updateAtomistTeam(project: Project, ctx: HandlerContext) {
    const atomistConfigFile = await project.findFile("src/atomist.config.ts");
    const content = await atomistConfigFile.getContent();
    const newContent = content.replace(/teamIds:.*$/m,
        `teamIds: ["${ctx.teamId}"],`);
    await atomistConfigFile.setContent(newContent);
    return project;
}
