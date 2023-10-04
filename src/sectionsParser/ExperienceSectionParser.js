const SectionParser = require('./sectionParser');

const dateWords = ['present', 'ongoing', 'current', 'now', 'today'];
const dateRangeRegex =
  /(\w+\s\d{4}\s*-\s*(?:\w+\s\d{4}|present))|(\w+\s\d{4})\s(?:to|[-–]\s*)\s*(\w+\s\d{4}|present)/gi;

class ExperienceSectionParser extends SectionParser {
  parse(text) {
    const lines = text.split('\n');
    const experience = [];
    let currentJob;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      // Start a new job when a new line is empty or a first section begins.
      if (
        lowerLine.trim().length === 0 ||
        lowerLine === '\n' ||
        experience.length === 0
      ) {
        currentJob = {
          'start-date': '',
          'end-date': '',
          title: '',
          description: '',
          company: '',
        };
        experience.push(currentJob);
        continue;
      }

      // Check if the line contains a 4-digit date (might be a date).
      if (!currentJob['start-date'] && /\b\d{4}\b/.test(lowerLine)) {
        this.extractDate(currentJob, lowerLine);
      }

      if (lowerLine.trim().length === 0 || lowerLine === '\n') return;
      else if (!currentJob.title) {
        currentJob.title = lowerLine.trimEnd();
      } else if (!currentJob.company) {
        currentJob.company = lowerLine
          .trimEnd()
          .replace(dateRangeRegex, '')
          .replace(/^[^\w]+|[^\w]+$/g, '');
      } else currentJob.description += `${line}`;
    }

    experience.pop();
    return { experience };
  }

  //TODO: move to a global helper
  extractDate(currentJob, line) {
    const words = line.split(/\s+/);
    let extractedDates = [];
    const dateWordsPattern = dateWords.join('|');

    const regexPattern = new RegExp(
      `(\\w+\\s+\\d{4})\\s+(?:to|-)\\s+(\\w+\\s+\\d{4}|${dateWordsPattern})`,
      'i',
    );

    const matches = line.match(regexPattern);
    extractedDates = matches ? [matches[1], matches[2]] : null;

    if (extractedDates.length > 0) {
      currentJob['start-date'] = extractedDates[0];

      if (extractedDates.length > 1) {
        currentJob['end-date'] = extractedDates[1];
      } else {
        currentJob['end-date'] = 'Present';
      }
    }
  }
}

module.exports = ExperienceSectionParser;
