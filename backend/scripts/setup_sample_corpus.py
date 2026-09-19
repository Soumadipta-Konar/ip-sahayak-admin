import csv
from pathlib import Path
import fitz

PROJECT_ROOT = Path(__file__).resolve().parent.parent
corpus_dir = PROJECT_ROOT / "corpus_extracted"
corpus_dir.mkdir(exist_ok=True)

# 1. Patents Act 1970 (.txt)
pat_text = """CHAPTER I PRELIMINARY
Section 1 Short title, extent and commencement
(1) This Act may be called the Patents Act, 1970.
(2) It extends to the whole of India.

Section 2 Definitions and interpretation
(1) In this Act, unless the context otherwise requires,—
(a) “Appellate Board” means the Appellate Board referred to in section 116;

CHAPTER II INVENTIONS NOT PATENTABLE
Section 3 What are not inventions
The following are not inventions within the meaning of this Act,—
(a) an invention which is frivolous or which claims anything obviously contrary to well established natural laws;
(d) the mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance;
(p) an invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.
"""
(corpus_dir / "patents_act_1970.txt").write_text(pat_text, encoding="utf-8")

# 2. Biological Diversity Act 2002 (.txt)
bda_text = """CHAPTER I PRELIMINARY
Section 1 Short title, extent and commencement
(1) This Act may be called the Biological Diversity Act, 2002.
(2) It extends to the whole of India.

CHAPTER II REGULATION OF ACCESS TO BIOLOGICAL DIVERSITY
Section 6 Application for intellectual property rights
(1) No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority before making such application.
(2) The National Biodiversity Authority may, while granting approval under this section, impose benefit sharing fee or royalty or both or impose conditions including the sharing of financial benefits arising out of the commercial utilisation of such rights.
"""
(corpus_dir / "biological_diversity_act_2002.txt").write_text(bda_text, encoding="utf-8")

# 3. Create Sample Gazette PDF (.pdf) using PyMuPDF
pdf_doc = fitz.open()
page = pdf_doc.new_page()
pdf_text = """THE GAZETTE OF INDIA : EXTRAORDINARY
[PART II—SEC. 3(i)]
MINISTRY OF COMMERCE AND INDUSTRY
DEPARTMENT FOR PROMOTION OF INDUSTRY AND INTERNAL TRADE

CHAPTER I PRELIMINARY
Section 1 Short title and commencement
(1) These rules may be called the Patents (Amendment) Rules, 2024.
(2) They shall come into force on the date of their publication in the Official Gazette.

CHAPTER II SPECIAL PROVISIONS RELATING TO TRADITIONAL KNOWLEDGE
Section 12 Expedited examination for traditional medicine
(1) An applicant for a patent may request expedited examination where the application pertains to traditional knowledge or herbal medicine.
(2) The Controller shall refer the specification to the Traditional Knowledge Digital Library (TKDL) database.
"""
page.insert_text((50, 72), pdf_text, fontsize=11)
pdf_path = corpus_dir / "patents_amendment_rules_2024.pdf"
pdf_doc.save(str(pdf_path))
pdf_doc.close()

# 4. Generate corpus_index.csv
csv_path = PROJECT_ROOT / "corpus_index.csv"
headers = [
    "file_path",
    "document_title",
    "act_name",
    "year",
    "jurisdiction",
    "language",
    "document_type",
    "status",
]
rows = [
    [
        "corpus_extracted/patents_act_1970.txt",
        "The Patents Act 1970",
        "The Patents Act, 1970",
        "1970",
        "IN",
        "en",
        "statute",
        "Pending",
    ],
    [
        "corpus_extracted/biological_diversity_act_2002.txt",
        "The Biological Diversity Act 2002",
        "The Biological Diversity Act, 2002",
        "2002",
        "IN",
        "en",
        "statute",
        "Pending",
    ],
    [
        "corpus_extracted/patents_amendment_rules_2024.pdf",
        "Patents Amendment Rules 2024",
        "The Patents Rules, 2024",
        "2024",
        "IN",
        "en",
        "regulation",
        "Pending",
    ],
]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(headers)
    w.writerows(rows)

print(f"Sample corpus created at {corpus_dir.resolve()} with .txt and .pdf files.")
print(f"Index created at {csv_path.resolve()}")
