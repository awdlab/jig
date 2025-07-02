import { readdir, readFile, writeFile } from 'fs/promises';

const controlsDemoDir = 'apps/demo/src/app/controls';
const outFile = 'apps/demo/src/app/sources.json';

const resultJson: Record<string, Record<string, string>> = {};

(async () => {
  const controlDirs = await readdir(controlsDemoDir);
  const controlDirName = controlDirs.filter(dir => dir.endsWith('-demo'));

  await Promise.all(
    controlDirName.map(async control => {
      const controlName = control.replace('-demo', '');
      const controlDir = `${controlsDemoDir}/${control}`;
      const filesInDir = await readdir(controlDir);

      const demoFiles = filesInDir.filter(file => file.endsWith('-demo.ts'));

      await Promise.all(
        demoFiles.map(async file => {
          const fileContent = await readFile(`${controlDir}/${file}`, 'utf-8');

          // const templateRegex = /template:\s*`([\s\S]*?)`\s*/;
          // const templateStr = fileContent.match(templateRegex)?.[1]?.trim() || '';

          resultJson[controlName] ??= {};
          resultJson[controlName][file.replace('-demo.ts', '')] = fileContent;
        })
      );
    })
  );

  await writeFile(outFile, JSON.stringify(resultJson, null, 2));
})();
