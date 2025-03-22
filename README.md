
# 📂 CSV/XLSX Master Merger with GPT Field Mapping

🚀 **CSV/XLSX Master Merger** is a Node.js application that automates merging thousands of CSV/XLSX files into standardized master datasets, utilizing GPT-powered field mapping for dynamic column unification and normalization.

---

## ✨ Features
- 🔍 Automatically detects unique field names from all files.
- 🤖 GPT-powered field mapping (GPT-4 or GPT-3.5) for grouping similar columns.
- 🛠️ Supports CSV, XLSX, and XLSM formats.
- 📁 Merges data into standardized master CSV files (with up to 1 lakh/100,000 rows per file).
- ⚡ Handles large datasets efficiently.
- 💡 Easy to configure using `config.json`.

---

## 📁 Project Structure

```
csv-xlsx-master-merger-ai/
├── input/               # 📂 Your source files (CSV/XLSX)
├── output/              # 📂 Output directory for merged master files
├── config.json          # ⚙️ Configuration file
├── index.js             # 🚀 Main script
├── package.json         # 📦 Node.js dependencies
├── package-lock.json    # 🔒 Dependency lock file
└── node_modules/        # 📦 Installed dependencies
```

---

## ⚙️ Configuration (`config.json`)

Edit `config.json` to customize your paths, limits, and API key:

```json
{
  "inputDir": "input",
  "outputDir": "output",
  "rowsPerFile": 100000,
  "fieldMappingFile": "field_mapping.json",
  "chatGptApiKey": "sk-xxxxxx"
}
```

---

## 🛠️ Setup & Installation

### Prerequisites
- ✅ Node.js v16+
- ✅ An OpenAI GPT API Key

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/tribhuwanphulera/csv-xlsx-master-merger-ai.git
   cd csv-xlsx-master-merger-ai
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Place your input files inside the `/input` folder.

4. Configure your `config.json` file with the appropriate values.

---

## 🚀 How to Run
Simply execute the script:
```bash
node index.js
```

---

## 📝 Example Workflow

### 🎯 Problem
You have 3 files with inconsistent column headers:

| name   | email           | phone      |
|--------|-----------------|------------|
| John   | john@email.com  | 9876543210 |

| Name   | Email Address    | Contact    |
|--------|------------------|------------|
| Alice  | alice@mail.com   | 1234567890 |

| Full Name | Email  | Mobile Number |
|-----------|--------|---------------|
| Bob       | bob@abc.com | 1122334455 |

---

### 🤖 What Happens
1. The script **detects** all unique columns:
```
["name", "email", "phone", "Name", "Email Address", "Contact", "Full Name", "Mobile Number"]
```

2. Sends them to **ChatGPT API**, which returns a mapping:
```json
{
  "Name": ["name", "Name", "Full Name"],
  "Email": ["email", "Email Address"],
  "Phone": ["phone", "Contact", "Mobile Number"]
}
```

3. The script **normalizes** and merges them into a unified CSV:

| Name  | Email           | Phone       |
|-------|-----------------|-------------|
| John  | john@email.com  | 9876543210  |
| Alice | alice@mail.com  | 1234567890  |
| Bob   | bob@abc.com     | 1122334455  |

---

### 📂 Output Files
After processing, you will find master files in `/output`:
```
output/
├── master_file_1.csv
├── master_file_2.csv (if rows exceed 100,000)
└── ...
```

---

## 🛡️ API Security
- Keep your OpenAI `chatGptApiKey` private!
- Recommended: Use environment variables for sensitive data in production.

---

## 🙌 Contributions Welcome!
1. Fork the project.
2. Create your feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push and create a Pull Request.

---

## ❓ FAQ

### What GPT model is used?
- GPT-4 by default (you can switch to GPT-3.5 for lower cost).

### Can it handle thousands of files?
- Yes! It batches records efficiently and writes in chunks.

### What formats are supported?
- CSV, XLSX, XLSM.

---

## 🚀 Roadmap / Future Ideas
- Add CLI progress indicators.
- Streaming support for massive files.
- More file format support (JSON, XML).

---

## 📜 License
MIT License

---

## 👨‍💻 Author
- **Tribhuwan Phulera**
- [GitHub Profile](https://github.com/tribhuwanphulera)
