const nameGenerator = require('../../../server/lib/name_generator');

// Define a test suite for the name generator
test('generateName function', () => {
    const name = nameGenerator.generateName();
    console.log("===============================>name: ",name);
    // Check that the result is a string
    expect(typeof name).toBe('string');

    // Use a regular expression to split the name into parts. The regular expression matches a sequence of characters
    // that starts with an uppercase letter followed by zero or more lowercase letters. This corresponds to the start
    // of each capitalized word in the string. The match method returns an array of all matches.
    const parts = name.match(/[A-Z][a-z]*/g);

    // The first part is the adjective
    const adjective = parts[0];

    // The second part is the first name
    const firstName = parts[1];

    // The third part is the last name
    const lastName = parts[2];

    expect(nameGenerator.ADJECTIVES).toContain(adjective);
    expect(nameGenerator.FIRST_NAMES).toContain(firstName);
    expect(nameGenerator.LAST_NAMES).toContain(lastName);
});