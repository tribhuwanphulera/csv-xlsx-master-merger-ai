
# 📂 CSV/XLSX Master Merger with GPT-Powered Field Mapping

🚀 **CSV/XLSX Master Merger** is a Node.js-based application designed to simplify merging thousands of CSV and Excel files (XLSX/XLSM). It leverages GPT to intelligently unify inconsistent column headers across files—whether they have more fields, fewer fields, or entirely mismatched names.

---

## ✨ Key Features
- 🔍 **Auto-detects unique column headers** across all files (even if some files are incomplete or inconsistent).
- 🤖 **GPT-powered field mapping** to group and normalize similar columns, regardless of header names.
- 🗂️ Supports **CSV, XLSX, and XLSM** formats.
- 📁 **Merges** into master CSV files (split after 100,000 rows per file for better manageability).
- ⚡ **Efficient handling** of large datasets with streamlined batching.
- 💡 Easy-to-configure via `config.json`.

---

## 📁 Folder Structure

```
csv-xlsx-master-merger-ai/
├── input/               # Put your source files here (CSV/XLSX/XLSM)
├── output/              # Merged master CSVs will be saved here
├── config.json          # Configuration file for customizing inputs/outputs
├── index.js             # Main script (entry point)
├── package.json         # Node.js dependencies
└── node_modules/        # Installed packages (auto-generated)
```

---

## ⚙️ Configuration (`config.json`)

Customize according to your needs:

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
   - Place all CSV/XLSX files inside the `/input` folder.
   - Ensure they are named appropriately.

4. **Configure**
   - Edit `config.json` and add your API key.
   - Adjust other options (e.g., `rowsPerFile`).

---

## 🚀 How to Run the Script

```bash
node index.js
```

---

## 📝 Example Use Case

### 🎯 The Problem
You have **three files** with mismatched column headers, missing fields, or extra columns:

| name   | email           | phone      |
|--------|-----------------|------------|
| John   | john@email.com  | 9876543210 |

| Name   | Email Address    | Contact    |
|--------|------------------|------------|
| Alice  | alice@mail.com   | 1234567890 |

| Full Name | Email         | Mobile Number |
|-----------|---------------|---------------|
| Bob       | bob@abc.com   | 1122334455    |

---

### ✅ What the Script Does
1. **Detects all unique headers**, even if some files are missing columns or have extras:
   ```
   ["name", "email", "phone", "Name", "Email Address", "Contact", "Full Name", "Mobile Number"]
   ```

2. **Sends them to GPT**, which intelligently groups and maps them:
   ```json
   {
     "Name": ["name", "Name", "Full Name"],
     "Email": ["email", "Email Address"],
     "Phone": ["phone", "Contact", "Mobile Number"]
   }
   ```

3. **Creates a master dataset**, normalizing all rows under a unified structure:

| Name  | Email           | Phone       |
|-------|-----------------|-------------|
| John  | john@email.com  | 9876543210  |
| Alice | alice@mail.com  | 1234567890  |
| Bob   | bob@abc.com     | 1122334455  |

---

### 📂 Output Files
You'll find the merged master files in `/output`:
```
output/
├── master_file_1.csv
├── master_file_2.csv (if row count exceeds 100,000)
└── ...
```

---

## 🔐 API Key Security Tips
- Always keep your OpenAI `chatGptApiKey` private.
- For production, store sensitive keys in environment variables.

---

## 🙌 Contributing
1. Fork the repo.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push and create a Pull Request.

---

## ❓ Frequently Asked Questions (FAQ)

### ✅ What GPT model is used?
- Defaults to GPT-4, but you can switch to GPT-3.5 in the config for cost savings.

### ✅ Can it handle thousands of files?
- Yes! It processes large datasets in batches and splits files based on row limits.

### ✅ What formats are supported?
- CSV, XLSX, XLSM.

---

## 🚀 Roadmap / Upcoming Features
- Add CLI progress indicators.
- Streaming support for ultra-large files.
- Support for additional formats like JSON and XML.

---

## 📜 License
MIT License.

---

## 👨‍💻 Author
- **Tribhuwan Phulera**
- [GitHub Profile](https://github.com/tribhuwanphulera)
