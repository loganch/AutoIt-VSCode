import macrosData from '../completions/macrosData';

const macrosHovers = Object.fromEntries(
  macrosData.map(macro => [macro.label, [macro.documentation]]),
);

export default macrosHovers;
