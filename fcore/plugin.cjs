/**
 * TypeScript-To-Lua (TSTL) Plugin for `fcore`.
 * Transforms consumer mod imports (`fcore/*`) into native Factorio `require("__fcore__.*")` paths.
 */
module.exports = {
  afterPrint(program, options, emitHost, result) {
    for (const file of result) {
      if (file.code) {
        file.code = file.code.replace(
          /require\(["'](?:lua_modules[/.])?(?:@vladislavprimakov[/.])?(?:fcore|__fcore__)(?:[/.]([^"']+))?["']\)/g,
          (match, subPath) => {
            if (!subPath) {
              return 'require("__fcore__.index")';
            }
            let sub = subPath.replace(/\//g, ".");
            if (sub.startsWith("dist.")) sub = sub.slice(5);
            if (sub === "react" || sub === "react-components" || sub === "styles") {
              sub = sub + ".index";
            }
            return `require("__fcore__.${sub}")`;
          }
        );
      }
    }
  },
};


