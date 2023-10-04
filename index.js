const fs = require('fs');
const pdf = require('pdf-parse');
const resumeParser = require('./src/resumeParser');

const pdfFilePath = './FakeResume.pdf';

async function parseResume() {
  try {
    const dataBuffer = fs.readFileSync(pdfFilePath);

    const data = await pdf(dataBuffer);

    const resumeText = data.text;
    resumeParser(resumeText);
  } catch (error) {
    console.error('Error parsing the resume:', error);
  }
}

parseResume();
