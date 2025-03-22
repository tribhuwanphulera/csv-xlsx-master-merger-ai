// ------------------------------------------------------------
// CSV & XLSX MASTER MERGER WITH CHATGPT FIELD MAPPING + DATA CLEANSING
// ------------------------------------------------------------

const fs = require('fs-extra');
const path = require('path');
const csv = require('fast-csv');
const XLSX = require('xlsx');
const axios = require('axios');

// ✅ Load Configuration from config.json
const config = require('./config.json');

const INPUT_DIR = config.inputDir;
const OUTPUT_DIR = config.outputDir;
const ROWS_PER_FILE = config.rowsPerFile;
const FIELD_MAPPING_FILE = config.fieldMappingFile;
const CHATGPT_API_KEY = config.chatGptApiKey;

// ✅ Ensure the output directory exists
fs.ensureDirSync(OUTPUT_DIR);

// ------------------------------------------------------------
// STEP 1: Collect unique field names from ALL files
// ------------------------------------------------------------
const collectUniqueFields = async () => {
  try {
    const files = await fs.readdir(INPUT_DIR);
    const fieldsSet = new Set();

    console.log(`🔍 Scanning ${files.length} files to collect unique fields...\n`);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const filePath = path.join(INPUT_DIR, file);

      let data = [];

      if (ext === '.csv') {
        console.log(`📄 Reading CSV: ${file}`);
        data = await readCSV(filePath);
      } else if (ext === '.xlsx' || ext === '.xlsm') {
        console.log(`📄 Reading XLSX: ${file}`);
        data = readXLSX(filePath);
      } else {
        console.log(`⚠️ Skipping unsupported file: ${file}`);
        continue;
      }

      data.forEach(row => {
        Object.keys(row).forEach(key => fieldsSet.add(key));
      });
    }

    const fieldList = Array.from(fieldsSet);
    console.log(`✅ Collected ${fieldList.length} unique fields:\n`, fieldList);
    return fieldList;
  } catch (err) {
    console.error('❌ Error collecting unique fields:', err);
    return [];
  }
};

// ------------------------------------------------------------
// Helper Functions: Read CSV and XLSX files
// ------------------------------------------------------------
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on('error', reject)
      .on('data', row => results.push(row))
      .on('end', () => resolve(results));
  });
};

const readXLSX = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  let results = [];

  sheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    results = results.concat(data);
  });

  return results;
};

// ------------------------------------------------------------
// STEP 2: Call ChatGPT API to generate field mapping
// ------------------------------------------------------------
const generateFieldMapping = async (fieldsArray) => {
  try {
    console.log('\n🧠 Sending fields to ChatGPT to generate mapping...');

    const prompt = `You are a data normalization expert. Below is a list of raw column names extracted from multiple datasets.\n\n${JSON.stringify(fieldsArray)}\n\nPlease create a field mapping JSON where similar fields are grouped under one standardized field name. Example format:\n{\n  "StandardFieldName1": ["variation1", "variation2"],\n  "StandardFieldName2": ["variation1", "variation2"]\n}\n\nOutput only the JSON.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATGPT_API_KEY}`,
      },
    });

    const completion = response.data.choices[0].message.content.trim();
    console.log('✅ Field mapping received from ChatGPT:\n', completion);

    fs.writeFileSync(FIELD_MAPPING_FILE, completion);
    console.log(`✅ Field mapping saved to ${FIELD_MAPPING_FILE}`);

    return JSON.parse(completion);
  } catch (err) {
    console.error('❌ Error generating field mapping:', err.response?.data || err.message);
    return {};
  }
};

// ------------------------------------------------------------
// STEP 3: Data Cleansing Function (Core for all rows)
// ------------------------------------------------------------
const cleanseValue = (value) => {
  if (typeof value !== 'string') value = String(value || '');

  // Replace unwanted characters (emoji, special chars, etc.)
  let cleaned = value
    .replace(/[^\x20-\x7E]/g, '')   // Remove non-printable/non-ASCII
    .replace(/[^a-zA-Z0-9\s@.\-_,]/g, '') // Keep alphanumeric and basic punctuation
    .trim();

  // Optional normalization (e.g., converting smart quotes, dashes, etc.)
  cleaned = cleaned.normalize("NFKC");

  return cleaned;
};

// ------------------------------------------------------------
// STEP 4: Normalize and Cleanse Rows
// ------------------------------------------------------------
const createReverseMap = (fieldMapping) => {
  const reverseMap = {};
  for (const [standardField, variations] of Object.entries(fieldMapping)) {
    variations.forEach(variant => {
      reverseMap[variant.trim().toLowerCase()] = standardField;
    });
  }
  return reverseMap;
};

const normalizeRow = (row, masterFieldArray, reverseMap) => {
  const normalized = {};
  masterFieldArray.forEach(field => {
    normalized[field] = '';
  });

  Object.keys(row).forEach(originalKey => {
    const cleanedKey = originalKey.trim().toLowerCase();
    const mappedField = reverseMap[cleanedKey];

    if (mappedField) {
      const rawValue = row[originalKey];
      const cleanedValue = cleanseValue(rawValue);
      normalized[mappedField] = cleanedValue;
    }
  });

  return normalized;
};

// ------------------------------------------------------------
// STEP 5: Process ALL FILES and Create Master CSVs
// ------------------------------------------------------------
const processAndCreateMasters = async (fieldMapping) => {
  try {
    const reverseMap = createReverseMap(fieldMapping);
    const masterFieldArray = Object.keys(fieldMapping);
    const files = await fs.readdir(INPUT_DIR);

    let masterData = [];
    let fileCount = 1;

    console.log('\n⚙️ Starting full data processing with data cleansing...\n');

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const filePath = path.join(INPUT_DIR, file);

      let data = [];

      if (ext === '.csv') {
        console.log(`📄 Processing CSV: ${file}`);
        data = await readCSV(filePath);
      } else if (ext === '.xlsx' || ext === '.xlsm') {
        console.log(`📄 Processing XLSX: ${file}`);
        data = readXLSX(filePath);
      } else {
        console.log(`⚠️ Skipping unsupported file: ${file}`);
        continue;
      }

      data.forEach(row => {
        const normalized = normalizeRow(row, masterFieldArray, reverseMap);
        masterData.push(normalized);

        if (masterData.length === ROWS_PER_FILE) {
          writeToCSV(masterData, fileCount, masterFieldArray);
          fileCount++;
          masterData = [];
        }
      });
    }

    if (masterData.length > 0) {
      writeToCSV(masterData, fileCount, masterFieldArray);
    }

    console.log(`\n🎉 Processing complete! Master files created in: ${OUTPUT_DIR}\n`);
  } catch (err) {
    console.error('❌ Error processing files:', err);
  }
};

// ------------------------------------------------------------
// STEP 6: Write Master CSVs to Output Directory
// ------------------------------------------------------------
const writeToCSV = (data, count, masterFieldArray) => {
  const outputFile = path.join(OUTPUT_DIR, `master_file_${count}.csv`);
  const ws = fs.createWriteStream(outputFile);

  csv.write(data, { headers: masterFieldArray })
    .pipe(ws)
    .on('finish', () => console.log(`✅ Master file created: ${outputFile}`));
};

// ------------------------------------------------------------
// MAIN FUNCTION: Run the process
// ------------------------------------------------------------
const run = async () => {
  console.log('🚀 Starting CSV & XLSX Master Merger Process with Cleansing...\n');

  const fields = await collectUniqueFields();

  if (fields.length === 0) {
    console.log('❌ No fields found. Exiting...');
    return;
  }

  const fieldMapping = await generateFieldMapping(fields);

  if (Object.keys(fieldMapping).length === 0) {
    console.log('❌ No mapping found. Exiting...');
    return;
  }

  await processAndCreateMasters(fieldMapping);
};

run();
