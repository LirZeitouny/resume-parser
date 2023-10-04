// Define the SectionParser interface
class SectionParser {
  constructor() {
    if (this.constructor === SectionParser) {
      throw new Error(
        'SectionParser is an abstract class and cannot be instantiated.',
      );
    }
  }

  parse(content) {
    throw new Error('Method parse() must be implemented by subclass.');
  }
}

module.exports = SectionParser;
