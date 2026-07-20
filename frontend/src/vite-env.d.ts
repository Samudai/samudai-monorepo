/// <reference types="vite/client" />

// All build-time config is exposed through Vite's `import.meta.env` using the
// `REACT_APP_` prefix (see `envPrefix` in vite.config.ts). Declaring the
// prefix as an index signature keeps every `import.meta.env.REACT_APP_*` read
// typed without enumerating each variable.
interface ImportMetaEnv {
    readonly [key: `REACT_APP_${string}`]: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
