// Usage: DISABLE_TELEMETRY=true npx tsx src/render.ts [--from s] [--to s] [--out dir/name.mp4]
import {renderVideo} from '@revideo/renderer';
import {parseArgs} from 'node:util';
import * as path from 'node:path';

const {values: a} = parseArgs({options: {
  from: {type: 'string'}, to: {type: 'string'}, out: {type: 'string', default: 'renders/web-framework-bench.mp4'},
}});

async function main() {
  const file = await renderVideo({
    projectFile: './src/project.tsx',
    settings: {
      outDir: path.dirname(a.out!),
      outFile: path.basename(a.out!) as `${string}.mp4`,
      projectSettings: a.from || a.to ? {range: [Number(a.from ?? 0), a.to ? Number(a.to) : Infinity]} : {},
      workers: 1,
      logProgress: true,
    },
  });
  console.log(`Rendered ${file}`);
}
main();
