export function sveltekitExtender() {
  return {
    name: "vite-plugin-sveltekit-extender",
    apply: "build",
    config(config) {
      // disable minifying the exports to their original names so that it can be used by the external compiled svelte component
      config.build.rollupOptions.output.minifyInternalExports = false;

      // removes the hash from the chunks from the index-client and disclose-version libraries
      if (config.build.rollupOptions.output.chunkFileNames === '_app/immutable/chunks/[name].[hash].js') {
        config.build.rollupOptions.output.chunkFileNames = (chunkInfo) => {
          if (chunkInfo.name === 'index-client' || chunkInfo.name === 'disclose-version') {
            return '_app/immutable/chunks/[name].js';
          }
          return '_app/immutable/chunks/[name].[hash].js';
        }
      }
      // TODO: add the below build config in this plugin
      return config;
    },
    // disable tree shaking for index-client svelte runtime library
    transform (code, id) {
      if (id.includes('src/index-client.js')) {
        return {
          code,
          map: null,
          moduleSideEffects: 'no-treeshake',
        };
      }
      return null;
    },
  }
}
