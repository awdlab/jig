// prismjs language component modules are side-effect-only and ship no type
// declarations in `@types/prismjs`. Declare them so dynamic `import()` calls
// under strict mode don't fail with TS7016.
declare module 'prismjs/components/prism-markup';
declare module 'prismjs/components/prism-typescript';
declare module 'prismjs/components/prism-css';
declare module 'prismjs/components/prism-bash';
declare module 'prismjs/components/prism-json';
