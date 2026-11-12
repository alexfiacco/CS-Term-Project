const WT = "/home/user/montage";
const esbuild = require(WT + "/node_modules/esbuild");
const path = require("path");
const REAL = WT + "/app/_components/Auth.tsx";
const STUB = __dirname + "/auth-stub.tsx";
esbuild.build({
  entryPoints: [__dirname + "/h.tsx"], bundle: true, outfile: __dirname + "/h.js", jsx: "automatic", loader: { ".tsx": "tsx" }, platform: "browser", logLevel: "error",
  alias: { "@": WT }, nodePaths: [WT + "/node_modules"],
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_SUPABASE_URL": '"https://x.supabase.co"', "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": '"x"', "process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": '"x"', "process.env": "{}" },
  plugins: [{ name: "stubs", setup(b) {
    b.onResolve({ filter: /(^|\/)Auth$/ }, (a) => {
      if (a.importer === STUB) return { path: REAL };
      const abs = a.path.startsWith("@/") ? WT + a.path.slice(1) + ".tsx" : path.resolve(a.resolveDir, a.path) + ".tsx";
      return abs === REAL ? { path: STUB } : undefined;
    });
    b.onResolve({ filter: /auth-headers$/ }, () => ({ path: __dirname + "/ah-stub.ts" }));
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: __dirname + "/nav-stub.tsx" }));
    b.onResolve({ filter: /^next\/link$/ }, () => ({ path: __dirname + "/link-stub.tsx" }));
  } }],
}).catch((e) => { console.error(String(e).slice(0, 3000)); process.exit(1); });
