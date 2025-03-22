
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

## 📝 Example Use Case

### 🎯 The Problem  
You have **multiple files**, each with different column combinations:

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
1. **Detects all unique headers** from these files:
   ```
   ["Name", "Email", "Contact", "Mobile", "Pincode", "FatherName"]
   ```

2. **Sends them to GPT**, which intelligently groups similar fields and creates a mapping:
   ```json
   {
     "Name": ["Name"],
     "Email": ["Email"],
     "Phone/Mobile": ["Contact", "Mobile"],
     "Pincode": ["Pincode"],
     "Father Name": ["FatherName"]
   }
   ```

3. **Creates a master dataset**, filling missing values as needed, under a unified structure:

| Name  | Email           | Phone/Mobile | Pincode | Father Name |
|-------|-----------------|--------------|---------|-------------|
| John  | john@email.com  | 9876543210   |         |             |
| Alice |                 | 1234567890   | 110001  |             |
| Bob   | bob@abc.com     | 9988776655   |         | Robert      |

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

## 🚀 How to Run the Script

```bash
node index.js
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

4. **Configure**
   - Edit `config.json` and add your API key.

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

## ❓ FAQ

### ✅ What GPT model is used?
- Defaults to GPT-4, but you can switch to GPT-3.5 in the config.

### ✅ Can it handle thousands of files?
- Yes! It processes large datasets efficiently.

### ✅ What formats are supported?
- CSV, XLSX, XLSM.

---

## 🚀 Roadmap / Upcoming Features
- CLI progress indicators.
- Streaming support for large files.
- More file formats (JSON, XML).

---

## 📜 License
MIT License.

---

## 👨‍💻 Author
- **Tribhuwan Phulera**
- [GitHub Profile](https://github.com/tribhuwanphulera)
