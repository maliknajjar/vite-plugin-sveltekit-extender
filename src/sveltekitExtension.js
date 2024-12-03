import astLib from 'abstract-syntax-tree';
import { getSvelteFilesInDirectory } from './utils';

export function sveltekitExtension(
  componentsPath = 'src/lib',
  importsBase = '/build/_app/immutable/chunks',
) {
  return {
    name: "vite-plugin-sveltekit-extension",
    apply: "build",
    config(config) {
      config.build.lib = {};
      config.build.lib.entry = getSvelteFilesInDirectory(componentsPath);
      config.build.lib.formats = ['es'];
      config.build.rollupOptions = {};
      config.build.rollupOptions.external = [
        'svelte/internal/disclose-version',
        'svelte/internal/client',
      ];
    },
    renderChunk(code, chunk) {
      if (chunk.facadeModuleId.endsWith('.svelte')) {
        const ast = astLib.parse(code);
        for (let index = 0; index < ast.body.length; index++) {
          const line = ast.body[index];
          if (line.type === 'ImportDeclaration') {
            const pathParsed = line.source.value.split('/');
            const module = pathParsed[pathParsed.length - 1];
            if (line.source.value === 'svelte/internal/disclose-version') {
              line.source.value = `${importsBase}/disclose-version.js`;
            } else if (line.source.value === 'svelte/internal/client') {
              line.source.value = `${importsBase}/index-client.js`;
            }
          }
        }
        return astLib.generate(ast);;
      }
    },
  }
}