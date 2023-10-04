const sectionKeywords = require('./sectionKeywords.json');
const ExperienceSectionParser = require('./sectionsParser/ExperienceSectionParser');
const config = {
  sectionTypeMapping: {
    experience: ExperienceSectionParser,
    // Add mappings for other section types like education
  },
};

function resumeParser(text) {
  try {
    const name = extractName(text);
    const sections = parseSections(text);
    const resumeData = {
      'contact-info': {
        name,
      },
      ...sections[0],
    };

    console.log(JSON.stringify(resumeData, null, 2));
  } catch (error) {
    console.error('Error parsing the resume:', error);
  }
}

function parseSections(text) {
  const lines = text.split('\n');
  let lastSectionName = '';
  let currentSectionContent = '';
  let skipLine = false;
  const sectionsObjects = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    for (const sectionName in sectionKeywords.sections) {
      if (
        sectionKeywords.sections[sectionName].some((keyword) =>
          lowerLine.includes(keyword),
        )
      ) {
        if (lastSectionName.length != 0) {
          const Parser = config.sectionTypeMapping[lastSectionName];
          const parser = new Parser();
          const parsedData = parser.parse(currentSectionContent);
          sectionsObjects.push(parsedData);
        }

        skipLine = true;
        lastSectionName = sectionName;
        currentSectionContent = '';
      }
    }

    if (skipLine) {
      skipLine = false;
      continue;
    }

    currentSectionContent += line + '\n';
  }
  // last section
  const Parser = config.sectionTypeMapping[lastSectionName];
  const parser = new Parser();
  const parsedData = parser.parse(currentSectionContent);
  currentSectionContent = '';
  sectionsObjects.push(parsedData);

  return sectionsObjects;
}

function extractName(text) {
  const lines = text.split('\n');

  const namePatterns = [
    /(Mr\.|Ms\.|Mrs\.)? ([A-Z][a-z]+) ([A-Z][a-z]+)/,
    /([A-Z][a-z]+) ([A-Z][a-z]+)/,
  ];

  for (const line of lines) {
    for (const pattern of namePatterns) {
      const match = line.match(pattern);
      if (match) {
        // Return the matched name
        return match.slice(1).join(' ');
      }
    }
  }
}

module.exports = resumeParser;
