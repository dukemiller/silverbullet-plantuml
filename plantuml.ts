import { editor, shell, system } from "@silverbulletmd/silverbullet/syscalls";
import { readSetting } from "$sb/lib/settings_page.ts";

export async function puml(uml: string) {
  try {
    const buml = btoa(uml)
    const userConfig = await readSetting(PLUG_NAME);
    let generator = userConfig.generator
    const { stdout, stderr } = await shell.run(generator, [buml]);
    console.log(stderr)
    return stdout;
  } catch {
    // We can ignore, this happens when there's no changes to commit
  }
  return "";
}

export async function widget(
  bodyText: string,
) {
  let result: string = await puml(bodyText)
  return {
    html: `<pre id="plantuml">${result}</pre>`,
    script: `
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
