# Resume Parser

A simple resume parsing tool that extracts information from resumes in PDF format and organizes it into structured data.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Example Output](#example-output)
- [Supported Features](#supported-features)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Resume Parser is a command-line tool that parses resumes in PDF format and extracts key information such as contact details and work experience. It is designed to help automate the process of extracting structured data from resumes for various HR and recruitment tasks.

## Installation

To get started, follow these steps to install the Resume Parser:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/resume-parser.git
   ```

2. Navigate to the project directory:

   ```bash
   cd resume-parser
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

To use the Resume Parser, follow these steps:

1. Place the resumes you want to parse in PDF format in a directory of your choice.

2. Open the `index.js` file in the project directory and set the `pdfFilePath` variable to the path of the PDF resume you want to parse:

   ```javascript
   const pdfFilePath = './path/to/your/resume.pdf';
   ```

3. Run the parser using Node.js:

   ```bash
   node index.js
   ```

4. The parser will extract information from the provided PDF resume and display the parsed data on the console.

## Example Output

After running the Resume Parser, you can expect an output similar to the following example:

```json
{
  "contact-info": {
    "name": "Homer Simpson"
  },
  "experience": [
    {
      "start-date": "may 2017",
      "end-date": "present",
      "title": "night auditor",
      "description": "• Audit and balance reports from the day shifts • Verify that all EoD work has been performed by other departments • Run EoD computer functions so they are complete by the end of the shift • Balance cash drawers and record receipts • Schedule housekeeping for the following day • Sole employee on property during shift • Regularly communicate with Lead Auditors via phone and email  ",
      "company": "springfield inn"
    },
    {
      "start-date": "november 2013",
      "end-date": "june 2016",
      "title": "unrelated technical manufacturing job",
      "description": "• Worked independently, only employee in division • Required to keep detailed notes on production runs ",
      "company": "company two - springfield, usa"
    },
    {
      "start-date": "february 2011",
      "end-date": "june 2013",
      "title": "home improvement / remodeling – skilled laborer",
      "description": "• Responsible for all needed construction not requiring a license ",
      "company": "simpson home improvement - springfield, usa"
    },
    {
      "start-date": "november 2004",
      "end-date": "november 2010",
      "title": "unrelated technical manufacturing job",
      "description": "• Worked independently on swing/night shifts • Limited support staff.  Responsible for routine and emergency maintenance  • Required to keep detailed notes on production runs ",
      "company": "company one - springfield, usa"
    }
  ]
}
```

## Supported Features

The Resume Parser currently supports the following features:

- Extraction of contact information (e.g., name)
- Extraction of work experience details (e.g., job title, company, dates, and description)

## Limitations and Future Work

The current solution relies solely on regex and assumptions about a very specific
resume format. It is not robust to other formats and will not work well on different types of resumes.

A more advanced solution would be to use a Named Entity Recognition (NER) model to extract
the relevant information from the resume. Using libraries like [spaCy](https://spacy.io/), we can train a custom NER model to extract the relevant information from the resume.

## Semantic Search Approach

While using search with database like [Pinecone](https://www.pinecone.io/), we can use semantic search to find relevant resumes.
In this approach, a model embed each resume to a vector and also each query.
Then, we can use the distance between the query vector and the resume vectors to find the most relevant resumes.
In this approach the employer can query in free text and the model will find the most relevant resumes.
Also, less parsing work is needed to be done on the resume, although probably some hybrid solution would work best.

## Soon to update with Type Script.
