const fs = require('fs');
const pdf = require('pdf-parse');

// Configuration
const config = {
  keywords: {
    dateWords: ['present', 'ongoing', 'current', 'now', 'today'],
    educationDescriptors: [
      'education',
      'academic background',
      'educational qualifications',
      'scholastic achievements',
      'educational history',
      'formal education',
      'degrees earned',
      'qualifications',
      'certifications',
      'training',
      'diplomas and degrees',
      'educational attainment',
      'academic record',
      'coursework',
      'graduation information',
      'study programs',
      'institutional background',
      'scholarships and awards',
      'gpa (grade point average)',
      'honors and distinctions',
    ],
    experienceKeywords: [
      'experience',
      'work experience',
      'employment history',
      'professional experience',
      'work history',
      'career highlights',
      'job history',
      'work background',
      'previous positions',
      'professional background',
      'work record',
      'job experience',
      'career history',
      'job positions',
      'job details',
      'professional work',
      'job summary',
      'employment record',
      'professional history',
    ],
  },
  dateRangeRegex:
    /(\w+\s\d{4}\s*-\s*(?:\w+\s\d{4}|present))|(\w+\s\d{4})\s(?:to|[-–]\s*)\s*(\w+\s\d{4}|present)/gi,
};

async function parseResume() {
  try {
    const dataBuffer = fs.readFileSync(args[0]);
    const data = await pdf(dataBuffer);

    const resumeText = data.text;
    const name = extractName(resumeText);
    const experience = extractExperience(resumeText).slice(1);
    const resumeData = {
      'contact-info': {
        name,
      },
      experience,
    };
    // console.log(resumeText);
    console.log(JSON.stringify(resumeData, null, 2));
  } catch (error) {
    console.error('Error parsing the resume:', error);
  }
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

  return '';
}

function extractExperience(text) {
  const lines = text.split('\n');

  const experience = [];

  let experienceSection = false;
  // Iterate through lines to find experience details
  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      config.keywords.experienceKeywords.some((keyword) =>
        lowerLine.includes(keyword),
      )
    ) {
      experienceSection = true;
    }
    if (
      config.keywords.educationDescriptors.some((keyword) =>
        lowerLine.includes(keyword),
      )
    ) {
      if (experienceSection) experienceSection = false;
    }

    if (experienceSection) {
      // Start a new job when a new line is empty or a new phrase begins.
      if (
        lowerLine.trim().length === 0 ||
        lowerLine === '\n' ||
        experience.length == 0
      ) {
        let currentJob = {
          'start-date': '',
          'end-date': '',
          title: '',
          description: '',
          company: '',
        };

        experience.push(currentJob);
      }

      let index = experience.length - 1;
      extractCurrentJobExperience(experience[index], lowerLine);
    }
  }

  return experience;
}

function extractCurrentJobExperience(currentJob, line) {
  if (line.trim().length === 0 || line === '\n') return;

  // Check if the line contains a 4-digit date (might be a date).
  if (!currentJob['start-date'] && /\b\d{4}\b/.test(line)) {
    extractDate(currentJob, line);
  }

  if (!currentJob.title) {
    currentJob.title = line;
    return;
  }

  if (!currentJob.company) {
    currentJob.company = line
      .replace(config.dateRangeRegex, '')
      .replace(/^[^\w]+|[^\w]+$/g, '');
    return;
  }

  currentJob.description += `${line}`;
}

function extractDate(currentJob, line) {
  const words = line.split(/\s+/);
  let extractedDates = [];
  const dateWordsPattern = config.keywords.dateWords.join('|');

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

const args = process.argv.slice(2);
parseResume();
