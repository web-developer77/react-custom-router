import { spawn } from 'child_process';
import { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(dirname, '../..');
const tscOutputDir = path.join(repoDir, '.tsc-output');

function tsc(args = []) {
  return spawn('tsc', args, { stdio: 'inherit' });
}

export default function tscPlugin({ build, watch } = {}) {
  let promise = Promise.resolve();

  if (build) {
    promise = new Promise((accept, reject) => {
      tsc().on('exit', code => {
        code === 0 ? accept() : reject(new Error('tsc build failed'));
      });
    });
  }

  if (build && watch) {
    promise.then(() => {
      tsc(['--watch', '--preserveWatchOutput']);
    });
  }

  return {
    name: 'tsc',
    buildStart() {
      // Wait until tsc is finished
      return promise;
    },
    async resolveId(id, importer) {
      if (!importer && /^packages\//.test(id) && /\.tsx?$/.test(id)) {
        // This is an entry point. Get it from .tsc-output
        let jsFile = id
          .replace(/^packages/, tscOutputDir)
          .replace(/\.tsx?$/, '.js');

        // Also emit the .d.ts file
        let dtsFile = jsFile.replace(/\.js$/, '.d.ts');
        let fileName = path.basename(dtsFile);
        let source = await fsp.readFile(dtsFile, 'utf8');
        this.emitFile({ type: 'asset', fileName, source });

        return jsFile;
      }

      return null;
    },
    async load(id) {
      if (id.startsWith(tscOutputDir)) {
        try {
          // Try to grab the .map too if there is one...
          let map = await fsp.readFile(id + '.map', 'utf-8');
          let code = await fsp.readFile(id, 'utf-8');
          return { code, map };
        } catch (error) {
          return null;
        }
      }

      return null;
    }
  };
}
