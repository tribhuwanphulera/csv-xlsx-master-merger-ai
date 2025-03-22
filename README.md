
# 📂 CSV/XLSX Master Merger with GPT-Powered Field Mapping + Data Cleansing

🚀 **CSV/XLSX Master Merger** is a Node.js-based application that simplifies the process of merging thousands of CSV and Excel files (XLSX/XLSM). It leverages GPT-powered field mapping to intelligently unify inconsistent column headers and includes a robust **data cleansing layer** to ensure your merged datasets are clean, consistent, and ready for downstream processing or analysis.

---

## ✨ Key Features
- 🔍 **Auto-detects unique column headers** across all files (even when headers vary or are incomplete).
- 🤖 **GPT-powered field mapping** groups and normalizes similar columns, regardless of inconsistent naming.
- 🗂️ Supports **CSV, XLSX, and XLSM** file formats.
- 🧹 **Advanced data cleansing** to sanitize and normalize data at the row level:
  - Removes special characters and unknown symbols.
  - Trims unnecessary white spaces.
  - Handles `null`, `undefined`, or missing values.
  - Normalizes character encoding to avoid data corruption.
- 📁 **Merges** data into master CSV files (splits automatically after 100,000 rows for optimal performance).
- ⚡ **Efficient handling** of large datasets with optimized batching.
- 💡 Easy configuration using `config.json`.

---

## 📝 Example Use Case

### 🎯 The Problem  
You have **multiple files**, each with different column combinations and inconsistent data:

#### 📄 File 1
| Name   | Email           | Contact      |
|--------|-----------------|--------------|
| John   | john@email.com  | 9876543210   |

#### 📄 File 2
| Name   | Mobile        | Pincode |
|--------|---------------|---------|
| Alice  | 1234567890    | 110001  |

#### 📄 File 3
| Name   | Email            | FatherName | Mobile       |
|--------|------------------|------------|--------------|
| Bob    | bob@abc.com      | Robert     | 9988776655   |

---

### ✅ What the Script Does
1. **Scans and detects all unique headers** from these files:
   ```
   ["Name", "Email", "Contact", "Mobile", "Pincode", "FatherName"]
   ```

2. **Uses GPT** to generate a smart mapping of similar fields:
   ```json
   {
     "Name": ["Name"],
     "Email": ["Email"],
     "Phone/Mobile": ["Contact", "Mobile"],
     "Pincode": ["Pincode"],
     "Father Name": ["FatherName"]
   }
   ```

3. **Cleans and normalizes the row data**:
   - Strips unwanted characters (emoji, special symbols).
   - Trims spaces and unnecessary whitespace.
   - Converts inconsistent encodings.
   - Ensures empty fields are consistently represented.

4. **Creates a master dataset** with uniform columns and clean data:

| Name  | Email           | Phone/Mobile | Pincode | Father Name |
|-------|-----------------|--------------|---------|-------------|
| John  | john@email.com  | 9876543210   |         |             |
| Alice |                 | 1234567890   | 110001  |             |
| Bob   | bob@abc.com     | 9988776655   |         | Robert      |

---

### 📂 Output Files
Once processed, the merged and cleansed master files are saved in `/output`:
```
output/
├── master_file_1.csv
├── master_file_2.csv (if row count exceeds 100,000)
└── ...
```

---

## 🧹 Data Cleansing Process (Explained)
Our data cleansing layer runs **before writing to the master CSV**. Here's what it does for every cell in every row:

1. ✅ **Trims whitespace** (no more leading or trailing spaces).
2. ✅ **Removes unknown/special characters**:
   - Filters out non-printable, non-standard ASCII characters.
   - Keeps only alphanumeric, standard punctuation (e.g., dots, hyphens, underscores).
3. ✅ **Handles null/undefined**:
   - Converts `null`, `undefined`, and other junk values into empty fields.
4. ✅ **Normalizes encoding**:
   - Converts text to a standard format (Unicode NFKC) to prevent broken characters.
5. ✅ **Ensures clean, consistent data** across your entire dataset, making it ready for downstream systems (analytics, databases, etc.).

---

## 🚀 How to Run the Script

```bash
node index.js
```

---

## ⚙️ Configuration (`config.json`)

You can customize the script via `config.json`:

```json
{
  "inputDir": "input",
  "outputDir": "output",
  "rowsPerFile": 100000,
  "fieldMappingFile": "field_mapping.json",
  "chatGptApiKey": "sk-your-openai-key"
}
```

---

## 🛠️ Installation & Setup

### Prerequisites
- ✅ Node.js (version 16 or higher)
- ✅ OpenAI GPT API Key (GPT-4 or GPT-3.5)

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/tribhuwanphulera/csv-xlsx-master-merger-ai.git
   cd csv-xlsx-master-merger-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prepare your data**
   - Place all CSV/XLSX/XLSM files inside the `/input` folder.

4. **Configure the settings**
   - Update `config.json` with your OpenAI GPT API key and file preferences.

---

## 🔐 API Key Security Tips
- Keep your OpenAI `chatGptApiKey` private and secure.
- In production, store sensitive data in environment variables or secret managers.

---

## 🙌 Contributing
1. Fork the repo.
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push and create a Pull Request.

---

## ❓ FAQ

### ✅ What GPT model is used?
- GPT-4 by default, but GPT-3.5 can be selected in `config.json`.

### ✅ Can it handle thousands of files?
- Absolutely! The app batches and processes large datasets efficiently.

### ✅ What formats are supported?
- CSV, XLSX, XLSM.

---

## 🚀 Roadmap / Upcoming Features
- CLI progress indicators.
- Streaming support for very large files.
- Support for additional formats like JSON and XML.
- Direct database export (MySQL/PostgreSQL).

---

## 📜 License
MIT License.

---

## 👨‍💻 Author
- **Tribhuwan Phulera**
- [GitHub Profile](https://github.com/tribhuwanphulera)
