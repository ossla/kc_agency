// CRA uses legacy TypeScript module resolution, which cannot read Plyr's exports.types.
declare module "plyr" {
    import Plyr = require("plyr/src/js/plyr");
    export = Plyr;
}
