import { commandsPrefix, commandsList } from '../src/commandsList';

describe('commandsList', () => {
  it('exports commandsPrefix as a string', () => {
    expect(typeof commandsPrefix).toBe('string');
    expect(commandsPrefix).toBe('extension.');
  });

  it('exports commandsList as an array', () => {
    expect(Array.isArray(commandsList)).toBe(true);
  });

  it('contains expected commands', () => {
    expect(commandsList).toContain('runScript');
    expect(commandsList).toContain('killScript');
    expect(commandsList).toContain('compile');
    expect(commandsList).toContain('openInclude');
  });

  it('contains only strings', () => {
    commandsList.forEach(cmd => expect(typeof cmd).toBe('string'));
  });

  it('has no duplicate entries', () => {
    const unique = new Set(commandsList);
    expect(unique.size).toBe(commandsList.length);
  });
});
