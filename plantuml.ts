import { editor, shell, system } from "@silverbulletmd/silverbullet/syscalls";
import { readSetting } from "$sb/lib/settings_page.ts";
import plantumlEncoder from "npm:plantuml-encoder";

export async function pumllocal(generator: string, uml: string) {
  try {
    const buml = btoa(uml)
    const { stdout, stderr } = await shell.run(generator, [buml]);
    console.log(stderr)
    return stdout;
  } catch (error) {
    console.error("PUML generation failed", error)
    return error
    // We can ignore, this happens when there's no changes to commit
  }
  return "";
}

export async function pumlserver(serverurl: string, uml: string) {
  try {
    let encoded = plantumlEncoder.encode(uml)
    let sep = "/"
    if (serverurl.endsWith("/"))
      sep = ""
    let url = serverurl + sep + '/svg/' + encoded
    console.log("silverbullet-plantuml: requesting", url)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text()
    return data;
  } catch (error) {
    console.error("PUML generation failed", error)
    return error
    // We can ignore, this happens when there's no changes to commit
  }
  return "";
}

export async function widget(
  bodyText: string,
) {

  const userConfig = await readSetting("plantuml");
  let result: string = bodyText
  if ('serverurl' in userConfig) {
    result = await pumlserver(userConfig.serverurl, bodyText)
  } else if ('generator' in userConfig) {
    result = await pumllocal(userConfig.generator, bodyText)
  } else {
    console.error("silverbullet-plantuml: neither serverurl nor generator configured")
  }
  userConfig.serverurl
  return {
    html: `<pre id="plantuml">${result}</pre>`,
    script: `
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
