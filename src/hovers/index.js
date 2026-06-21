import { hovers as hoverImports } from '../udfRegistry';

const hovers = Object.fromEntries(
  Object.entries(hoverImports).map(([key, value]) => [key.toLowerCase(), value]),
);

export default hovers;
