// Aggregates every signature map from the single source of truth in
// udfRegistry.js. Registering a new UDF there automatically includes it here —
// this file must not maintain its own module list.
import { signatureModules } from '../udfRegistry';

const signatures = Object.assign({}, ...signatureModules.map(mod => mod.default ?? {}));

export default signatures;
