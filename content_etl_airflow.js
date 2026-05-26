const courseContent = {
  'ETL Pipelines': {
    'What is ETL? (Plain English)': {
      'lesson': `## ETL: Extract, Transform, Load

ETL is the backbone of all data engineering. Every company that uses data for decisions has an ETL process — whether it's a formal pipeline or someone manually copying CSVs into Excel. Your job as a data engineer is to automate and harden that process so it runs reliably without human intervention.

### The three phases, precisely defined

**Extract** — pulling raw data from its source system exactly as it exists there. You are not cleaning or calculating anything yet. You are taking a snapshot. Sources can be: relational databases (SQL), flat files (CSV, Excel, JSON), APIs (REST, SOAP), message queues (Kafka), or legacy systems with proprietary formats.

**Transform** — applying business logic to the raw data. This is where you clean nulls, standardize formats, calculate new fields, join datasets, deduplicate, and apply rules. The key word is *logic* — every transformation should be defensible ("we exclude refunded orders because they don't represent revenue").

**Load** — writing the transformed data to the destination. This could be a data warehouse (BigQuery, Snowflake, Redshift), a data lake (S3), a reporting database, or a file. Loading strategy matters: do you append, replace, or upsert?

### A minimal but complete ETL pipeline

\`\`\`python
import pandas as pd
import sqlite3
from datetime import date

# EXTRACT
def extract(source_db: str) -> pd.DataFrame:
    conn = sqlite3.connect(source_db)
    df = pd.read_sql(
        "SELECT * FROM transactions WHERE processed = 0",
        conn
    )
    conn.close()
    print(f"Extracted {len(df)} unprocessed rows")
    return df

# TRANSFORM
def transform(df: pd.DataFrame) -> pd.DataFrame:
    # Drop rows with no amount
    df = df.dropna(subset=["amount"])

    # Standardize status values
    df["status"] = df["status"].str.lower().str.strip()

    # Calculate fee (1.5% on all settled transactions)
    df["fee"] = df.apply(
        lambda r: r["amount"] * 0.015 if r["status"] == "settled" else 0,
        axis=1
    )

    # Add processing date
    df["processed_date"] = str(date.today())

    print(f"Transformed: {len(df)} rows remain after cleaning")
    return df

# LOAD
def load(df: pd.DataFrame, dest_db: str) -> int:
    conn = sqlite3.connect(dest_db)
    df.to_sql("clean_transactions", conn, if_exists="append", index=False)
    conn.close()
    print(f"Loaded {len(df)} rows to warehouse")
    return len(df)

# ORCHESTRATE
def run_etl():
    raw = extract("production.db")
    clean = transform(raw)
    count = load(clean, "warehouse.db")
    print(f"ETL complete: {count} records processed")

run_etl()
\`\`\`

**Beginner Breakdown — The Complete ETL Pipeline**

Let's walk through this code section by section.

*The imports (top of the file):*
- \`import pandas as pd\` — Pandas is a Python library that lets you work with data tables (like Excel, but in code). We nickname it \`pd\` so we don't have to type "pandas" every time.
- \`import sqlite3\` — This is Python's built-in tool for talking to SQLite databases (a simple, file-based database).
- \`from datetime import date\` — This gives us a way to get today's date, which we'll stamp on our processed records.

*The extract function:*
- \`def extract(source_db: str) -> pd.DataFrame:\` — We are defining a reusable function. The \`: str\` and \`-> pd.DataFrame\` are "type hints" — they tell other developers "this function expects a text value (the database filename) and will return a data table."
- \`conn = sqlite3.connect(source_db)\` — Think of this as "opening the database file." \`conn\` is short for "connection" — our live link to the database.
- \`pd.read_sql("SELECT * FROM transactions WHERE processed = 0", conn)\` — This runs a SQL query against the database. We're asking for all rows in the \`transactions\` table where \`processed = 0\` (meaning they haven't been handled yet). The result is loaded into \`df\`, a DataFrame (a table in memory).
- \`conn.close()\` — Just like closing a file when you're done reading it. Always close connections to avoid wasting memory.
- \`print(f"Extracted {len(df)} unprocessed rows")\` — \`len(df)\` counts the rows. The \`f"..."\` is an "f-string" — a way to embed variables inside a text message. This line tells you how many rows were found.

*The transform function:*
- \`df.dropna(subset=["amount"])\` — Remove any row where the \`amount\` column is empty (NULL). We can't calculate revenue on a transaction with no amount, so those rows are useless to us.
- \`df["status"].str.lower().str.strip()\` — \`.str.lower()\` converts text to lowercase (so "SETTLED" and "settled" are treated the same). \`.str.strip()\` removes any accidental spaces at the start or end of the value.
- \`df.apply(lambda r: ..., axis=1)\` — \`apply\` runs a function on every row. \`axis=1\` means "go row by row" (as opposed to column by column). The \`lambda r:\` is a small, unnamed function where \`r\` represents one row at a time.
- \`r["amount"] * 0.015 if r["status"] == "settled" else 0\` — A one-line if/else: if the transaction's status is "settled," charge a 1.5% fee. Otherwise, the fee is zero. This is the business rule encoded in code.
- \`df["processed_date"] = str(date.today())\` — Add a new column to every row recording today's date as a string.

*The load function:*
- \`df.to_sql("clean_transactions", conn, if_exists="append", index=False)\` — This saves our clean DataFrame to the warehouse database. \`"clean_transactions"\` is the table name. \`if_exists="append"\` means "add these rows to the bottom of the table if it already exists — don't delete what's there." \`index=False\` prevents pandas from writing its internal row numbers as an extra column.
- \`return len(df)\` — Return the count of rows loaded so the calling function can report it.

*The run_etl function (the orchestrator):*
- This is the "conductor" that calls the three functions in the right order. \`raw = extract(...)\` gets the dirty data. \`clean = transform(raw)\` cleans it. \`count = load(clean, ...)\` saves it to the warehouse. This separation is intentional — each function does one job, which makes it easy to test and debug each step independently.

### The staging area pattern

\`\`\`python
from pathlib import Path
import json

def extract_and_stage(api_url: str, stage_dir: str) -> Path:
    """Extract from API and save raw to staging before any transformation."""
    import requests
    response = requests.get(api_url, timeout=30)
    response.raise_for_status()

    stage_path = Path(stage_dir)
    stage_path.mkdir(exist_ok=True)
    output = stage_path / f"raw_{date.today()}.json"

    with open(output, "w") as f:
        json.dump(response.json(), f)

    print(f"Staged raw data to {output}")
    return output
\`\`\`

**Beginner Breakdown — Staging Area Pattern**

- \`from pathlib import Path\` — \`Path\` is a modern Python tool for working with file and folder paths in a clean, cross-platform way (works on Windows, Mac, and Linux without you changing the code).
- \`import requests\` — A popular Python library for making HTTP requests (like visiting a URL from code).
- \`response = requests.get(api_url, timeout=30)\` — We're "visiting" the API URL and getting a response back. \`timeout=30\` means "if you don't hear back within 30 seconds, give up and raise an error" — without this, the script could hang forever if the server is down.
- \`response.raise_for_status()\` — If the server responded with an error (like "404 Not Found" or "500 Server Error"), this line will raise an exception in Python immediately, stopping the pipeline before we try to process a broken response.
- \`stage_path.mkdir(exist_ok=True)\` — Creates the staging folder if it doesn't already exist. \`exist_ok=True\` means "don't throw an error if the folder is already there."
- \`stage_path / f"raw_{date.today()}.json"\` — The \`/\` operator on a Path object builds a file path. The result would look like: \`staging/raw_2024-01-15.json\`. Using today's date in the filename means we never overwrite yesterday's raw data.
- \`with open(output, "w") as f:\` — Opens the file for writing. The \`with\` keyword ensures the file is automatically closed when the block finishes, even if an error occurs.
- \`json.dump(response.json(), f)\` — \`response.json()\` converts the API response from raw text into a Python dictionary. \`json.dump\` then writes that dictionary to our file as JSON text.

### Why ETL fails in production (and how to prevent it)

| Failure Type | Example | Prevention |
|---|---|---|
| Source unavailable | API is down at 2 AM | Retry logic + fallback to cache |
| Schema change | Column renamed upstream | Schema validation before transform |
| Data volume spike | 10x rows on sale day | Chunked processing, memory limits |
| Duplicate load | Pipeline ran twice | Upsert logic or idempotency keys |
| Silent data corruption | Wrong dtype after join | Row count + sum checks post-load |`,

      'scenario': `## Scenario: The "Where is the Money?" Crisis

**Context:** The CFO calls you at 9 AM — the dashboard shows ₦8M in yesterday's revenue, but the sales ops team says the actual figure is ₦10M. Two million naira is unaccounted for.

**Your investigation checklist:**

1. **Check the Extract:** Did all source systems deliver data?
\`\`\`python
# Check staging files for yesterday
from pathlib import Path
from datetime import date, timedelta

yesterday = date.today() - timedelta(days=1)
stage_files = list(Path("staging").glob(f"*{yesterday}*.json"))
print(f"Staging files found: {len(stage_files)}")
# Expected: 5 (one per region). If 4 — missing region = missing ₦2M
\`\`\`

**Beginner Breakdown — Checking Staging Files**
- \`date.today() - timedelta(days=1)\` — \`timedelta(days=1)\` represents "one day." Subtracting it from today gives us yesterday's date. This is much safer than manually typing a date string.
- \`Path("staging").glob(f"*{yesterday}*.json")\` — \`glob\` is a pattern-matching tool for finding files. The \`*\` is a wildcard meaning "match anything." So this line finds every \`.json\` file in the "staging" folder whose name contains yesterday's date. We wrap it in \`list()\` because \`glob\` returns a lazy generator, not an actual list.
- If you expected 5 files (one per region) but only found 4, you've immediately pinpointed that one region's data didn't arrive — and that's your missing ₦2M.

2. **Check the Transform:** Is any filter incorrectly excluding rows?
\`\`\`python
raw_count = len(raw_df)
clean_count = len(clean_df)
dropped = raw_count - clean_count
print(f"Dropped {dropped} rows during transform ({dropped/raw_count:.1%})")
# If >5% dropped, investigate the filter logic
\`\`\`

**Beginner Breakdown — Row Count Check**
- \`len(raw_df)\` and \`len(clean_df)\` — \`len()\` on a DataFrame returns the number of rows. By comparing the count before and after transformation, we can see how many rows were removed.
- \`dropped/raw_count:.1%\` — Inside an f-string, \`:.1%\` is a format code. It converts a decimal like \`0.24\` into a percentage string like \`24.0%\`. This makes it immediately human-readable.
- This single check can reveal whether your transform step has an overly aggressive filter silently removing valid transactions.

3. **Check the Load:** Did all rows make it to the warehouse?
\`\`\`python
warehouse_count = pd.read_sql(
    f"SELECT COUNT(*) as n FROM clean_transactions WHERE date = '{yesterday}'",
    warehouse_conn
).iloc[0]["n"]
print(f"Clean rows: {clean_count}, Warehouse rows: {warehouse_count}")
# These must match
\`\`\`

**Beginner Breakdown — Load Verification**
- \`SELECT COUNT(*) as n\` — A SQL query that counts rows instead of returning them all. This is much faster for large tables. \`as n\` gives the count column the name "n" so we can reference it in Python.
- \`.iloc[0]["n"]\` — The query returns a tiny DataFrame with one row and one column. \`.iloc[0]\` gets the first (and only) row by position. \`["n"]\` gets the value of the "n" column. Together they extract the single number we care about.
- If \`clean_count\` is 9,000 but \`warehouse_count\` is 7,500 — the load step dropped 1,500 rows, and that's where your investigation leads next.

The answer in this scenario: the Extract step was scheduled at 11 PM, but the Abuja branch closes their books at midnight. Their data hadn't arrived yet. The fix: move the extract to 1 AM, or add an explicit wait/retry for each branch's data.`,

      'quizzes': [
        {
          'question': "What is the purpose of a 'staging area' in ETL?",
          'options': [
            "A. To store transformed data before loading",
            "B. To save raw extracted data before any transformation — so you can re-run transformations if the logic had a bug without re-extracting",
            "C. A temporary table in the warehouse",
            "D. The server that runs the ETL script"
          ],
          'correct': 1,
          'explanation': "Staging preserves the original data. If your transform script has a bug, you don't need to re-hit the source system — you just fix the script and re-process the staged file."
        },
        {
          'question': "Which of these is a Transform step, not an Extract or Load step?",
          'options': [
            "A. Reading a CSV file into a DataFrame",
            "B. Writing clean data to a database table",
            "C. Converting '₦50,000' string values to float 50000.0 and calculating a fee column",
            "D. Connecting to the source database"
          ],
          'correct': 2,
          'explanation': "Cleaning data types, applying business rules (fee calculation), and creating derived columns are all Transform operations. Reading = Extract. Writing = Load."
        },
        {
          'question': "What is 'idempotency' in the context of ETL loading?",
          'options': [
            "A. The ability to run the load step multiple times and get the same result — no duplicates",
            "B. The speed of the load operation",
            "C. Loading data in alphabetical order",
            "D. Encrypting data during load"
          ],
          'correct': 0,
          'explanation': "If a pipeline crashes midway and reruns, idempotency ensures the same rows aren't loaded twice. Typically achieved with UPSERT (insert if not exists, update if exists) using a unique key."
        },
        {
          'question': "You run your ETL and the row count drops from 50,000 (extracted) to 38,000 (loaded). What should you do?",
          'options': [
            "A. Nothing — some rows always get lost",
            "B. Check each transformation step to find which filter or join is dropping 12,000 rows and verify it's intentional",
            "C. Re-extract the data",
            "D. Add the missing rows manually"
          ],
          'correct': 1,
          'explanation': "A 24% row drop is significant and could indicate a bug. Always add row-count assertions between ETL steps. If rows are legitimately excluded (e.g., cancelled orders), log the reason and count."
        },
        {
          'question': "What is wrong with this extract code in a production pipeline?",
          'code': "conn = sqlite3.connect('production.db')\ndf = pd.read_sql('SELECT * FROM transactions', conn)\n# ... transform ...",
          'options': [
            "A. pd.read_sql is not a valid function",
            "B. SELECT * on a large production table at any time can lock the table and slow down the app — should use incremental extraction with a WHERE clause and run during off-peak hours",
            "C. The connection is not closed",
            "D. Both B and C"
          ],
          'correct': 3,
          'explanation': "Two issues: SELECT * with no filter loads the entire history every run (wasteful and locks the table). The connection is also never closed — add conn.close() or use a context manager. Both are real production bugs."
        }
      ]
    },

    'The Extract Phase': {
      'lesson': `## The Extract Phase

Extraction is where your pipeline meets the real world, and the real world is messy. Source systems weren't designed for you to read from them. They're built to serve the app, and your extraction is a side effect.

### Common extraction sources and how to connect

\`\`\`python
import pandas as pd
import sqlite3
import requests

# 1. From a relational database (SQLite/PostgreSQL/MySQL)
conn = sqlite3.connect("source.db")
df = pd.read_sql(
    "SELECT id, amount, status, created_at FROM transactions WHERE created_at >= date('now', '-1 day')",
    conn,
    parse_dates=["created_at"]
)
conn.close()

# 2. From a REST API with pagination
def extract_from_api(base_url: str, api_key: str) -> list:
    all_records = []
    page = 1
    while True:
        r = requests.get(
            base_url,
            params={"page": page, "limit": 500},
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30
        )
        r.raise_for_status()
        batch = r.json().get("data", [])
        if not batch:
            break
        all_records.extend(batch)
        page += 1
    return all_records

# 3. From multiple CSV files
from pathlib import Path
frames = []
for f in Path("incoming").glob("*.csv"):
    frames.append(pd.read_csv(f, encoding="utf-8"))
df = pd.concat(frames, ignore_index=True)
\`\`\`

**Beginner Breakdown — Common Extraction Sources**

*Source 1: Reading from a Database*
- \`parse_dates=["created_at"]\` — By default, pandas reads date columns as plain text (strings). This parameter tells pandas to automatically convert the \`created_at\` column into proper Python date objects, which allows you to do date math on them later.
- \`date('now', '-1 day')\` inside the SQL — This is a SQLite built-in function that calculates yesterday's date. We use it in the WHERE clause so we only pull yesterday's new records, not the entire history of the table.

*Source 2: Paginated API*
- \`all_records = []\` — We start with an empty list. Think of this as an empty bucket we'll fill up page by page.
- \`while True:\` — An infinite loop. We keep going until we explicitly \`break\` out of it. This is the standard pattern for pagination when you don't know how many pages there are upfront.
- \`params={"page": page, "limit": 500}\` — These are URL query parameters. The final URL would look like: \`https://api.example.com/data?page=1&limit=500\`. Most APIs use this to let you request data in chunks.
- \`headers={"Authorization": f"Bearer {api_key}"}\` — APIs often require authentication. We pass our API key in the request header. "Bearer" is a standard prefix for token-based authentication.
- \`r.json().get("data", [])\` — \`r.json()\` parses the API response text into a Python dictionary. \`.get("data", [])\` safely retrieves the "data" key — if it doesn't exist (the API returned an unexpected format), it returns an empty list instead of crashing.
- \`if not batch: break\` — If the API returns an empty list, we've hit the last page. We break out of the while loop.
- \`all_records.extend(batch)\` — \`.extend()\` adds all items from \`batch\` into our \`all_records\` list one by one (unlike \`.append()\` which would add the whole list as a single nested item).

*Source 3: Multiple CSV Files*
- \`Path("incoming").glob("*.csv")\` — Find every file ending in \`.csv\` in the "incoming" folder.
- \`frames.append(pd.read_csv(f, encoding="utf-8"))\` — Read each file into its own DataFrame and add it to our list. \`encoding="utf-8"\` ensures special characters (like ₦) are read correctly.
- \`pd.concat(frames, ignore_index=True)\` — Stack all the DataFrames on top of each other into one big table. \`ignore_index=True\` resets the row numbers from 0 to the total count, instead of keeping the row numbers from each individual file (which would create duplicates like 0,1,2,0,1,2...).

### Incremental extraction: only pull what's new

\`\`\`python
import json
from pathlib import Path
from datetime import datetime

WATERMARK_FILE = Path("watermark.json")

def get_watermark() -> str:
    if WATERMARK_FILE.exists():
        return json.loads(WATERMARK_FILE.read_text())["last_extracted"]
    return "1970-01-01T00:00:00"   # first run: pull everything

def save_watermark(ts: str):
    WATERMARK_FILE.write_text(json.dumps({"last_extracted": ts}))

def incremental_extract(conn) -> pd.DataFrame:
    last_ts = get_watermark()
    df = pd.read_sql(
        f"SELECT * FROM transactions WHERE updated_at > '{last_ts}'",
        conn,
        parse_dates=["updated_at"]
    )
    if not df.empty:
        new_watermark = df["updated_at"].max().isoformat()
        save_watermark(new_watermark)
        print(f"Extracted {len(df)} new rows (watermark updated to {new_watermark})")
    return df
\`\`\`

**Beginner Breakdown — Incremental Extraction with Watermarks**

- \`WATERMARK_FILE = Path("watermark.json")\` — We declare the watermark file path as a module-level constant (written in CAPS by convention, meaning "this value doesn't change"). It's a simple JSON file on disk that remembers where we left off.
- \`WATERMARK_FILE.exists()\` — Returns True or False: does this file exist on disk? On the very first run, it won't, so we return the earliest possible timestamp to pull all historical data.
- \`"1970-01-01T00:00:00"\` — January 1st 1970 is the "Unix Epoch" — the origin point of time in computing. Using it as a default means "on first run, pull everything from the beginning of time."
- \`json.loads(WATERMARK_FILE.read_text())["last_extracted"]\` — Read the file as text, parse the JSON text into a Python dictionary, then grab the \`"last_extracted"\` key. This gives us the timestamp string from our last run.
- \`WATERMARK_FILE.write_text(json.dumps({...}))\` — \`json.dumps()\` converts a Python dictionary to a JSON string. \`.write_text()\` writes that string to the file, overwriting what was there before.
- \`df["updated_at"].max()\` — \`.max()\` on a date column finds the most recent date in that column. This becomes our new watermark — next run we'll only fetch records newer than this.
- \`.isoformat()\` — Converts the date object to a standard text string like \`"2024-01-15T14:30:00"\` that we can safely store in our JSON file.

### Schema validation: catch changes before they corrupt your pipeline

\`\`\`python
EXPECTED_COLUMNS = {"id", "amount", "status", "branch", "created_at"}
EXPECTED_DTYPES = {"amount": "float64", "status": "object"}

def validate_schema(df: pd.DataFrame) -> None:
    missing = EXPECTED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Schema change detected — missing columns: {missing}")

    for col, expected_dtype in EXPECTED_DTYPES.items():
        actual = str(df[col].dtype)
        if actual != expected_dtype:
            raise TypeError(f"Column '{col}': expected {expected_dtype}, got {actual}")

    print("Schema validation passed")
\`\`\`

**Beginner Breakdown — Schema Validation**

- \`EXPECTED_COLUMNS = {...}\` — A Python set (curly braces with no key:value pairs). Sets are perfect for this because they have a fast "is this item in here?" check.
- \`EXPECTED_COLUMNS - set(df.columns)\` — This is set subtraction: "what's in EXPECTED_COLUMNS that is NOT in the actual column list?" If the result is empty, all expected columns are present. If not, we've found the missing ones.
- \`raise ValueError(...)\` — This intentionally crashes the pipeline with a clear, descriptive message. A deliberate crash is far better than silently processing data with missing columns and loading corrupt results to the warehouse.
- \`EXPECTED_DTYPES.items()\` — Iterates over the dictionary as key-value pairs: \`("amount", "float64")\`, \`("status", "object")\`, etc.
- \`str(df[col].dtype)\` — Gets the data type of a column as a string (e.g., \`"float64"\`, \`"int32"\`, \`"object"\`). In pandas, \`"object"\` is the dtype for text/string columns.
- \`raise TypeError(...)\` — A specific error type for wrong data types. Using specific error classes makes automated error handling downstream much easier.

### Handling extraction errors gracefully

\`\`\`python
import time
import logging

logger = logging.getLogger(__name__)

def extract_with_retry(query: str, conn_factory, max_attempts=3) -> pd.DataFrame:
    for attempt in range(1, max_attempts + 1):
        try:
            conn = conn_factory()
            df = pd.read_sql(query, conn)
            conn.close()
            logger.info(f"Extracted {len(df)} rows on attempt {attempt}")
            return df
        except Exception as e:
            logger.warning(f"Extract attempt {attempt} failed: {e}")
            if attempt == max_attempts:
                raise
            time.sleep(30 * attempt)   # 30s, 60s, 90s
\`\`\`

**Beginner Breakdown — Retry Logic**

- \`logging.getLogger(__name__)\` — Creates a logger named after the current Python file. This is the professional standard for logging in Python. It means log messages from this file are clearly labelled, and you can control their output level (info, warning, error) from one central place.
- \`conn_factory\` — Instead of passing a connection directly, we pass a function that *creates* a connection. This is important for retries: if the connection itself failed, we need to create a fresh one on the next attempt, not reuse the broken one.
- \`range(1, max_attempts + 1)\` — Generates \`[1, 2, 3]\`. Starting from 1 (not 0) makes the log messages more human-readable: "attempt 1 failed" instead of "attempt 0 failed."
- \`try: ... except Exception as e:\` — The \`try\` block runs the code we hope works. If anything goes wrong (network error, database timeout, etc.), the \`except\` block catches the error and stores it in \`e\` so we can log the message.
- \`if attempt == max_attempts: raise\` — On the final attempt, instead of swallowing the error, we re-raise it. This lets the error bubble up to the calling code, which can then decide how to handle a total failure.
- \`time.sleep(30 * attempt)\` — Wait before retrying. Multiplying by attempt number gives us: 30 seconds, 60 seconds, 90 seconds. Waiting longer each time (backoff) gives the source system time to recover.`,

      'scenario': `## Scenario: The Locked Database

**Context:** Your nightly extract runs at 10 PM. The IT team has flagged that your queries are causing lock contention — online customers are experiencing slow checkouts between 10:00 and 10:45 PM.

**Root cause:** Your extract does \`SELECT * FROM transactions\` on a 50M-row table with no index hint, full table scan, holding a shared lock for 45 minutes.

**Fix 1 — Incremental extraction (pull only new rows):**
\`\`\`python
# Instead of full scan
df = pd.read_sql("SELECT * FROM transactions", conn)

# Use watermark — only rows since last run
df = pd.read_sql(
    "SELECT * FROM transactions WHERE id > :last_id",
    conn, params={"last_id": last_processed_id}
)
\`\`\`

**Beginner Breakdown — Incremental Fix**
- \`WHERE id > :last_id\` — The \`:\` prefix makes \`last_id\` a named parameter (a placeholder). This is safer than using an f-string to build the SQL, because named parameters protect against SQL injection attacks.
- \`params={"last_id": last_processed_id}\` — This dictionary provides the actual value for our \`:last_id\` placeholder. Pandas will safely substitute it into the query.
- The key insight: if the last run processed ID 4,500,000, then this query only fetches rows with IDs above that — maybe 5,000 new rows instead of 50,000,000.

**Fix 2 — Use a read replica:**
Most production databases have a replica server that mirrors the primary but handles read traffic. Point your extract at the replica so your full-table scan never touches the production system.

**Fix 3 — Schedule during off-peak hours:**
Move the extract to 2 AM when transaction volume is lowest. Add a check: if peak-hour traffic is detected (avg TPS > threshold), delay the extract automatically.

\`\`\`python
from datetime import datetime

def is_peak_hour() -> bool:
    hour = datetime.now().hour
    return 8 <= hour <= 22    # business hours

if is_peak_hour():
    logger.warning("Skipping extract during peak hours — will retry at 2 AM")
    sys.exit(0)
\`\`\`

**Beginner Breakdown — Peak Hour Guard**
- \`datetime.now().hour\` — Gets the current hour as an integer (0–23). So 2 PM is 14, and midnight is 0.
- \`8 <= hour <= 22\` — Python allows chained comparisons like this. It means "is the hour between 8 and 22 inclusive?" This is equivalent to \`hour >= 8 and hour <= 22\` but reads more naturally.
- \`sys.exit(0)\` — Exits the Python script immediately. The \`0\` is an exit code meaning "I exited on purpose, no error." Exit code \`1\` would signal an error. This tells any external scheduler that the script ended cleanly, just chose not to run.`,

      'quizzes': [
        {
          'question': "What is a 'watermark' in incremental extraction?",
          'options': [
            "A. A security stamp on exported files",
            "B. A saved timestamp or ID marking where the last extraction ended, used to pull only new/changed records next time",
            "C. A limit on how many rows to extract",
            "D. An encryption method for extracted data"
          ],
          'correct': 1,
          'explanation': "The watermark is your bookmark. Instead of re-reading 50M rows every night, you remember 'last time I stopped at row 4,872,104' and next time you only fetch rows after that point."
        },
        {
          'question': "What does this code do differently from `SELECT * FROM transactions`?",
          'code': "df = pd.read_sql(\n    \"SELECT * FROM transactions WHERE created_at > :ts\",\n    conn,\n    params={'ts': last_run_timestamp}\n)",
          'options': [
            "A. It runs faster because SQL is compiled",
            "B. It only extracts rows created after the last pipeline run — incremental extraction",
            "C. It extracts from a different table",
            "D. It validates the schema"
          ],
          'correct': 1,
          'explanation': "The WHERE clause filters at the database level before data is transferred to Python. This is far more efficient than pulling everything and filtering in Pandas — especially on tables with millions of rows."
        },
        {
          'question': "Why is hardcoding `SELECT *` dangerous in a production extract?",
          'options': [
            "A. It is slower than named columns",
            "B. If the source table adds a column with sensitive data (SSNs, passwords), your pipeline silently starts extracting it",
            "C. * is not valid SQL",
            "D. It returns too many rows"
          ],
          'correct': 1,
          'explanation': "Schema changes in source systems are common. SELECT * means you get whatever columns exist, including ones you don't want. Explicitly naming columns also documents your data contract and catches unexpected schema changes."
        },
        {
          'question': "You need to extract data from 5 different branch CSV files and combine them. What must you add to the combined DataFrame that's missing from the individual files?",
          'options': [
            "A. A row index",
            "B. A source identifier column (e.g., 'branch_name') so you know which file each row came from after merging",
            "C. A timestamp",
            "D. A hash column"
          ],
          'correct': 1,
          'explanation': "When you concat multiple files, all rows look identical structurally. Adding a source column before concatenation lets you filter, audit, and debug by source later."
        }
      ]
    },

    'Cleaning & Transforming Data': {
      'lesson': `## Cleaning & Transforming Data

Transformation is where raw data becomes business-grade data. The goal isn't just "make it clean" — it's to apply documented, reproducible rules that any analyst can understand and verify.

### The standard cleaning checklist

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("raw_transactions.csv")

# 1. Check what you're working with
print(df.shape)
print(df.dtypes)
print(df.isnull().sum())
print(df.duplicated().sum())

# 2. Fix column names (lowercase, underscores)
df.columns = df.columns.str.lower().str.replace(" ", "_").str.strip()

# 3. Fix data types
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
df["transaction_date"] = pd.to_datetime(df["transaction_date"], errors="coerce")

# 4. Standardize string values
df["status"] = df["status"].str.lower().str.strip()
df["branch"] = df["branch"].str.title().str.strip()

# 5. Handle nulls with intention
df = df.dropna(subset=["amount", "transaction_id"])   # required fields
df["notes"] = df["notes"].fillna("")                   # optional field
df["fee"] = df["fee"].fillna(0.0)                      # default to zero

# 6. Remove duplicates
before = len(df)
df = df.drop_duplicates(subset=["transaction_id"])
print(f"Removed {before - len(df)} duplicate transaction IDs")
\`\`\`

**Beginner Breakdown — The Standard Cleaning Checklist**

*Step 1: Understand what you have before changing anything*
- \`df.shape\` — Returns a tuple like \`(10000, 12)\` meaning 10,000 rows and 12 columns. Always check this first so you know your starting point.
- \`df.dtypes\` — Shows the data type of each column (e.g., \`float64\`, \`object\`, \`int64\`). This quickly reveals problems like an "amount" column that pandas read as text instead of numbers.
- \`df.isnull().sum()\` — For each column, counts how many values are missing (NULL/NaN). This tells you which columns have data quality problems and how severe they are.
- \`df.duplicated().sum()\` — Counts the total number of rows that are exact duplicates of another row. A high number here suggests a data extraction issue (the same data was fetched twice).

*Step 2: Fix column names*
- \`df.columns.str.lower().str.replace(" ", "_").str.strip()\` — This is a chain of string operations applied to all column names at once. \`.str.lower()\` makes everything lowercase. \`.str.replace(" ", "_")\` turns spaces into underscores (so "Transaction ID" becomes "transaction_id"). \`.str.strip()\` removes invisible whitespace. This standardization means you'll always write \`df["transaction_id"]\` instead of having to remember if it was "Transaction ID" or "TRANSACTION_ID" or "TransactionID."

*Step 3: Fix data types*
- \`pd.to_numeric(df["amount"], errors="coerce")\` — Tries to convert every value in the "amount" column to a number. \`errors="coerce"\` means "if a value can't be converted (like '₦50,000'), replace it with NaN instead of crashing." You can then handle those NaN values deliberately.
- \`pd.to_datetime(..., errors="coerce")\` — Same concept for dates. Converts text like "2024-01-15" to a real date object, and converts unparseable values to NaT (Not a Time — the date equivalent of NaN).

*Step 4: Standardize strings*
- \`str.title()\` — Capitalizes the first letter of each word. "lagos island" becomes "Lagos Island." This is useful for branch names or city names that came in with inconsistent capitalization.

*Step 5: Handle nulls with intention*
- The key word is "intention" — you make a conscious decision for each column. Required fields (\`amount\`, \`transaction_id\`) get \`dropna\` — a transaction without an amount is unusable. Optional fields (\`notes\`) get \`fillna("")\` — an empty string is a valid "no notes." Numeric optional fields (\`fee\`) get \`fillna(0.0)\` — a missing fee means no fee was charged.

*Step 6: Remove duplicates*
- \`before = len(df)\` — We save the row count before deduplication so we can report how many were removed. This creates an audit trail.
- \`subset=["transaction_id"]\` — Only consider the \`transaction_id\` column when identifying duplicates. Two rows are duplicates if they have the same ID, even if other columns differ.

### Applying business rules as transformations

\`\`\`python
# Categorize transaction sizes
def categorize_size(amount: float) -> str:
    if amount >= 1_000_000:  return "enterprise"
    if amount >= 100_000:    return "large"
    if amount >= 10_000:     return "medium"
    return "small"

df["size_tier"] = df["amount"].apply(categorize_size)

# Calculate net amount after fee
FEE_RATE = 0.015
df["fee"] = df.apply(
    lambda r: round(r["amount"] * FEE_RATE, 2) if r["status"] == "settled" else 0,
    axis=1
)
df["net_amount"] = df["amount"] - df["fee"]

# Flag suspicious records without deleting them
df["flagged"] = (
    (df["amount"] > 500_000) &
    (df["transaction_date"].dt.hour < 5)
)
\`\`\`

**Beginner Breakdown — Business Rules as Code**

- \`1_000_000\` — Python allows underscores in numbers for readability. \`1_000_000\` is exactly the same as \`1000000\` — it just looks cleaner to human eyes.
- \`df["amount"].apply(categorize_size)\` — \`apply\` passes each individual value in the "amount" column through the \`categorize_size\` function and collects the returned strings into a new column. It's like dragging a formula down in Excel but in code.
- \`FEE_RATE = 0.015\` — Writing the fee rate as a named constant at the top means if the rate ever changes, you change it in one place. If you had \`0.015\` scattered throughout your code, you'd have to find and change every occurrence and risk missing one.
- \`round(r["amount"] * FEE_RATE, 2)\` — \`round(..., 2)\` rounds to 2 decimal places, which is essential for currency calculations. Without this, floating-point math might give you \`₦750.0000000001\` instead of \`₦750.00\`.
- \`df["flagged"] = (df["amount"] > 500_000) & (df["transaction_date"].dt.hour < 5)\` — Creates a column of True/False values. \`&\` is the "AND" operator for pandas (not the regular Python \`and\`). \`.dt.hour\` extracts just the hour from a datetime column. This flags transactions over ₦500,000 that happened between midnight and 5 AM — suspicious, but not deleted. Flagging preserves the data while marking it for review.

### Currency and format normalization

\`\`\`python
def clean_currency(val) -> float:
    """Handle ₦1,250,000.00 or 1.250.000,00 or 1250000"""
    if pd.isnull(val):
        return np.nan
    s = str(val).strip()
    # Remove currency symbols and spaces
    for ch in ["₦", "$", "€", "£", ",", " "]:
        s = s.replace(ch, "")
    # European decimal comma
    if s.count(".") > 1:
        s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return np.nan

df["amount"] = df["raw_amount"].apply(clean_currency)
\`\`\`

**Beginner Breakdown — Currency Cleaning**

- \`pd.isnull(val)\` — Checks if the value is NaN or None. We return \`np.nan\` (Not a Number) early because we can't clean what doesn't exist.
- \`str(val).strip()\` — Convert the value to a string first (it might be a number, a float, or already a string). \`.strip()\` removes surrounding whitespace.
- \`for ch in [...]: s = s.replace(ch, "")\` — Loop through each "dirty" character and remove it from the string. After this loop, "₦1,250,000.00" becomes "1250000.00".
- \`if s.count(".") > 1:\` — European number formatting uses periods as thousands separators and commas as decimals: "1.250.000,00" means 1,250,000.00. If there's more than one period, we know it's European format. We remove the periods (thousands separators) and convert the comma to a period (decimal point).
- \`try: return float(s) except ValueError: return np.nan\` — After all the cleaning, we try to convert to a float. If it still fails (maybe the original was total garbage like "N/A"), we return NaN rather than crashing.

### Asserting data quality after transformation

\`\`\`python
def assert_quality(df: pd.DataFrame, source_count: int) -> None:
    """Run quality checks and raise if data doesn't meet expectations."""
    assert len(df) > 0, "Transform produced empty DataFrame"
    assert len(df) >= source_count * 0.95, \
        f"Too many rows dropped: {source_count} → {len(df)}"
    assert df["amount"].isnull().sum() == 0, \
        f"{df['amount'].isnull().sum()} null amounts after cleaning"
    assert (df["amount"] >= 0).all(), \
        "Negative amounts found — check refund handling logic"
    assert df["transaction_id"].nunique() == len(df), \
        "Duplicate transaction IDs after deduplication"
    print(f"Quality checks passed: {len(df)} rows")
\`\`\`

**Beginner Breakdown — Quality Assertions**

- \`assert condition, "error message"\` — Python's built-in testing tool. If the condition is False, it immediately raises an \`AssertionError\` with the message you provided. This intentionally stops the pipeline and tells you exactly what went wrong.
- \`source_count * 0.95\` — We allow up to 5% of rows to be dropped (for cleaning). If more than 5% disappeared, something is likely wrong with the transform logic. This threshold encodes a business decision: "we don't expect to lose more than 5% of our transactions to cleaning."
- \`df["amount"].isnull().sum() == 0\` — After cleaning, there should be zero null amounts (we either filled them or dropped those rows). This assertion verifies our earlier \`dropna\` actually worked.
- \`(df["amount"] >= 0).all()\` — \`(df["amount"] >= 0)\` returns a Series of True/False for each row. \`.all()\` returns True only if every value is True. If any amount is negative, this fails — which likely means a refund wasn't handled correctly.
- \`df["transaction_id"].nunique() == len(df)\` — \`nunique()\` counts distinct values. If every transaction ID is unique, this count equals the total row count. If they're not equal, we still have duplicates.`,

      'scenario': `## Scenario: The Duplicate Customer Disaster

**Context:** A "Refer a Friend" promo had a bug — users who clicked the referral link multiple times got registered multiple times. Your CRM now has 12,400 records but the marketing team can only find 9,800 unique email addresses. Management is about to announce "12,400 users" to investors.

**Your job:**

\`\`\`python
import pandas as pd

df = pd.read_csv("customers.csv")
print(f"Raw count: {len(df)}")   # 12,400

# Step 1: Understand the duplicates
dups = df[df.duplicated(subset=["email"], keep=False)]
print(f"Rows involved in email duplicates: {len(dups)}")

# Step 2: For each email, keep the earliest registration
df["created_at"] = pd.to_datetime(df["created_at"])
df_clean = (
    df.sort_values("created_at")
      .drop_duplicates(subset=["email"], keep="first")
      .reset_index(drop=True)
)
print(f"After deduplication: {len(df_clean)}")  # 9,800

# Step 3: Document what was removed
removed = df[~df["customer_id"].isin(df_clean["customer_id"])]
removed.to_csv("dedup_audit_log.csv", index=False)
print(f"Audit log: {len(removed)} duplicate records archived")
\`\`\`

**Beginner Breakdown — Deduplication Scenario**

- \`df.duplicated(subset=["email"], keep=False)\` — \`keep=False\` marks ALL rows that are part of a duplicate group, not just the extras. This lets you see the full extent of the problem. For example, if an email appears 3 times, all 3 rows get marked True.
- \`df[df.duplicated(...)]\` — Square brackets with a True/False condition filter the DataFrame to only show rows where the condition is True. This shows you only the duplicated rows.
- \`df.sort_values("created_at")\` — Sorts the entire DataFrame by the \`created_at\` column in ascending order (oldest first). This ensures that when we keep "first," we're keeping the original registration.
- \`.drop_duplicates(subset=["email"], keep="first")\` — After sorting, "first" now means "earliest registration date." We keep that one and drop all later duplicates.
- \`.reset_index(drop=True)\` — After dropping rows, the row numbers (index) have gaps (e.g., 0, 1, 5, 7...). \`reset_index(drop=True)\` renumbers them cleanly from 0. \`drop=True\` prevents the old index from being saved as a column.
- \`~df["customer_id"].isin(df_clean["customer_id"])\` — The \`~\` is the NOT operator in pandas. \`.isin()\` returns True for rows whose customer_id exists in the clean list. So \`~.isin()\` returns True for rows that were REMOVED (the duplicates). This gives us our audit trail.
- \`removed.to_csv("dedup_audit_log.csv", index=False)\` — Saves the removed rows to a CSV file. This is your paper trail: you can always show exactly which records were considered duplicates and why.

The audit log matters: you're not deleting data, you're archiving it with justification. This is how you defend your transformation logic if an auditor asks "where did those 2,600 customers go?"`,

      'quizzes': [
        {
          'question': "What does `pd.to_numeric(df['amount'], errors='coerce')` do to a value like '₦50,000'?",
          'options': [
            "A. Raises a ValueError",
            "B. Converts it to 50000.0",
            "C. Converts it to NaN because '₦50,000' cannot be parsed as a number directly",
            "D. Converts it to the string '50000'"
          ],
          'correct': 2,
          'explanation': "errors='coerce' turns unparseable values into NaN instead of crashing. '₦50,000' has a symbol and comma that float() can't handle. You must clean the string first (remove ₦ and commas), then convert."
        },
        {
          'question': "What is the difference between `dropna()` and `fillna()`?",
          'options': [
            "A. dropna removes rows with nulls; fillna replaces nulls with a specified value",
            "B. They are the same operation",
            "C. dropna is for columns; fillna is for rows",
            "D. dropna works on strings; fillna works on numbers"
          ],
          'correct': 0,
          'explanation': "Use dropna for fields where a missing value makes the entire row unusable (e.g., a transaction with no amount). Use fillna for optional fields where a default is valid (e.g., fill missing 'notes' with empty string)."
        },
        {
          'question': "What does `df.drop_duplicates(subset=['transaction_id'], keep='first')` do?",
          'options': [
            "A. Removes all rows with duplicate transaction IDs",
            "B. Keeps the first occurrence of each transaction ID and removes subsequent duplicates",
            "C. Sorts the DataFrame by transaction ID",
            "D. Raises an error if duplicates are found"
          ],
          'correct': 1,
          'explanation': "subset=['transaction_id'] means 'only consider this column when identifying duplicates'. keep='first' means 'for each group of duplicates, keep the row that appears first in the DataFrame'."
        },
        {
          'question': "Why should you save removed/excluded rows to an audit log rather than just deleting them?",
          'options': [
            "A. To save disk space",
            "B. So you can verify your transformation logic is correct and defend it to auditors or management",
            "C. It makes the pipeline run faster",
            "D. Pandas requires it"
          ],
          'correct': 1,
          'explanation': "In regulated industries (finance, healthcare), you must be able to prove why data was excluded. An audit log turns 'trust me, I cleaned the data' into 'here are the 2,600 rows that were duplicates and when they were created'."
        },
        {
          'question': "What is wrong with this transformation logic?",
          'code': "# Apply 15% fee to all transactions\ndf['fee'] = df['amount'] * 0.15",
          'options': [
            "A. The math is wrong",
            "B. The fee should only apply to certain statuses — applying it to pending/failed transactions silently inflates fee totals",
            "C. You cannot multiply a Series by a float",
            "D. Nothing is wrong"
          ],
          'correct': 1,
          'explanation': "Applying fees to all rows regardless of status is a business logic error. A pending transaction hasn't been settled — charging a fee on it produces incorrect financials. Transformation rules must encode the actual business definition, not just math."
        }
      ]
    },

    'Loading into a Warehouse': {
      'lesson': `## Loading into a Data Warehouse

Loading is the final step, but it's not just "save the file." The loading strategy you choose affects query performance, storage cost, freshness of data, and whether your pipeline can recover from failures.

### Load strategies

\`\`\`python
import pandas as pd
import sqlite3

# APPEND — add new rows to existing data
def append_load(df: pd.DataFrame, table: str, conn):
    df.to_sql(table, conn, if_exists="append", index=False)
    print(f"Appended {len(df)} rows to {table}")

# FULL REPLACE — delete all existing data and reload
def full_replace_load(df: pd.DataFrame, table: str, conn):
    df.to_sql(table, conn, if_exists="replace", index=False)
    print(f"Replaced {table} with {len(df)} rows")

# UPSERT — update if exists, insert if not (manual implementation for SQLite)
def upsert_load(df: pd.DataFrame, table: str, key_col: str, conn):
    cursor = conn.cursor()
    for _, row in df.iterrows():
        placeholders = ", ".join(["?"] * len(row))
        cols = ", ".join(row.index)
        cursor.execute(
            f"INSERT OR REPLACE INTO {table} ({cols}) VALUES ({placeholders})",
            tuple(row)
        )
    conn.commit()
    print(f"Upserted {len(df)} rows into {table}")
\`\`\`

**Beginner Breakdown — Load Strategies**

- \`if_exists="append"\` — Adds new rows to the bottom of the table. The existing data is untouched. Safe for event-style data (logs, transactions) where each record is new.
- \`if_exists="replace"\` — Drops the entire existing table and creates a fresh one with your data. Fast and simple, but there's a dangerous moment where the table is empty.
- *Upsert function explained step by step:*
  - \`cursor = conn.cursor()\` — A cursor is like a pen for writing to the database. While \`conn\` is the connection (the open book), \`cursor\` is what you use to actually write.
  - \`for _, row in df.iterrows():\` — Iterates through the DataFrame row by row. The \`_\` is a Python convention for "I don't care about this value" (it's the row index number, which we don't need).
  - \`", ".join(["?"] * len(row))\` — Creates a string of question marks separated by commas, like \`"?, ?, ?, ?"\`. The \`?\` symbols are SQLite's way of saying "value goes here." \`["?"] * len(row)\` creates a list with one "?" per column.
  - \`"INSERT OR REPLACE INTO ...\` — SQLite-specific syntax. If a row with this primary key already exists, replace it entirely. If not, insert a new row. This is the upsert behavior in one SQL command.
  - \`tuple(row)\` — Converts the pandas row (a Series object) into a plain Python tuple of values, which is the format SQLite expects for the placeholders.
  - \`conn.commit()\` — Saves all the changes to disk. Without this, your changes exist only in memory and are lost when the connection closes. Think of it like pressing "Save" in a document.

### When to use each strategy

| Strategy | Use When | Risk |
|---|---|---|
| Append | Source only produces new records (event logs) | Duplicates if pipeline reruns |
| Full Replace | Small reference tables (product catalog) | Downtime between delete and insert |
| Upsert | Records can be updated (customer profiles, order status) | Slower than append |
| Incremental Table | Partitioned warehouse tables (daily partitions) | Complex to implement |

### Post-load validation

\`\`\`python
def validate_load(df_sent: pd.DataFrame, table: str, conn, date_col: str, date_val: str):
    """Confirm what was sent matches what was received."""
    query = f"SELECT COUNT(*) as n, SUM(amount) as total FROM {table} WHERE {date_col} = '{date_val}'"
    result = pd.read_sql(query, conn).iloc[0]

    expected_count = len(df_sent)
    expected_total = df_sent["amount"].sum()

    if result["n"] != expected_count:
        raise ValueError(f"Row count mismatch: sent {expected_count}, got {result['n']}")

    if abs(result["total"] - expected_total) > 0.01:
        raise ValueError(f"Amount mismatch: sent {expected_total:.2f}, got {result['total']:.2f}")

    print(f"Load validated: {expected_count} rows, ₦{expected_total:,.2f} total")
\`\`\`

**Beginner Breakdown — Post-Load Validation**

- \`SELECT COUNT(*) as n, SUM(amount) as total\` — In one query we get both the row count AND the total amount from the warehouse for that specific date. This is our ground truth — what actually made it in.
- \`pd.read_sql(query, conn).iloc[0]\` — Runs the query and gets the first (only) row of results as a pandas Series. We can then access values by column name: \`result["n"]\` and \`result["total"]\`.
- \`abs(result["total"] - expected_total) > 0.01\` — \`abs()\` gives the absolute value (removes the negative sign). We allow a tiny tolerance of ₦0.01 for floating-point arithmetic rounding differences. Without this tolerance, a result of "₦500,000.000000001" would incorrectly fail the check.
- \`f"₦{expected_total:,.2f}"\` — The \`,.2f\` format code formats a number with comma separators and 2 decimal places. So \`500000.5\` becomes \`"500,000.50"\`. The leading \`₦\` adds the currency symbol.

### Separation of production from analytics

\`\`\`python
# Production database — serves the app
PROD_DB = "postgresql://user:pass@prod-server/appdb"

# Analytics warehouse — separate server, analysts only
WAREHOUSE_DB = "postgresql://user:pass@warehouse-server/analytics"

# ETL reads from production, writes to warehouse
# Analysts ONLY query the warehouse — never the production DB
def run_etl():
    raw = pd.read_sql(EXTRACT_QUERY, create_engine(PROD_DB))
    clean = transform(raw)
    clean.to_sql("clean_transactions", create_engine(WAREHOUSE_DB),
                 if_exists="append", index=False)
\`\`\`

**Beginner Breakdown — Separation of Concerns**

- \`"postgresql://user:pass@prod-server/appdb"\` — This is a database connection string (also called a DSN or URI). The format is: \`protocol://username:password@hostname/database_name\`. Never hardcode real passwords like this in production — use environment variables instead.
- \`create_engine(PROD_DB)\` — From the SQLAlchemy library, this creates a connection engine for the given database URL. \`pd.read_sql\` and \`df.to_sql\` both work with SQLAlchemy engines, which support all major databases (PostgreSQL, MySQL, etc.) with the same API.
- The architecture principle here: ETL reads from one server (production) and writes to another (warehouse). These are physically separate machines. If your analytics query takes 10 minutes to run, it only slows down the warehouse server — the customer-facing app is completely unaffected.`,

      'scenario': `## Scenario: The "App is Slow" Complaint

**Context:** The development team has flagged that customer-facing API response times spiked from 120ms to 4,200ms every night between 10 PM and midnight. They traced it to your analytics queries running against the production database.

**Your fix — separate the analytics load:**

1. Set up a lightweight SQLite warehouse locally (or use a cloud warehouse in production)
2. Update the pipeline to load clean data there instead of querying production
3. Point all reporting scripts at the warehouse

\`\`\`python
import sqlite3
import pandas as pd

# Create warehouse schema (run once)
warehouse = sqlite3.connect("analytics_warehouse.db")
warehouse.execute("""
    CREATE TABLE IF NOT EXISTS fact_transactions (
        transaction_id TEXT PRIMARY KEY,
        branch TEXT,
        amount REAL,
        fee REAL,
        net_amount REAL,
        status TEXT,
        channel TEXT,
        transaction_date TEXT,
        loaded_at TEXT
    )
""")
warehouse.commit()

# Nightly load: reads from prod, writes to warehouse
def nightly_etl():
    prod = sqlite3.connect("production.db")
    raw = pd.read_sql("SELECT * FROM transactions WHERE DATE(created_at) = DATE('now', '-1 day')", prod)
    prod.close()

    clean = transform(raw)
    clean["loaded_at"] = pd.Timestamp.now().isoformat()

    # Upsert to avoid duplicates on reruns
    warehouse = sqlite3.connect("analytics_warehouse.db")
    for _, row in clean.iterrows():
        warehouse.execute(
            "INSERT OR REPLACE INTO fact_transactions VALUES (?,?,?,?,?,?,?,?,?)",
            tuple(row[["transaction_id","branch","amount","fee","net_amount","status","channel","transaction_date","loaded_at"]])
        )
    warehouse.commit()
    warehouse.close()
\`\`\`

**Beginner Breakdown — Building a Separate Warehouse**

- \`CREATE TABLE IF NOT EXISTS\` — Creates the table only if it doesn't already exist. This makes the code safe to run multiple times (idempotent). On the first run, it creates the table. On subsequent runs, it does nothing.
- \`transaction_id TEXT PRIMARY KEY\` — \`PRIMARY KEY\` marks this column as the unique identifier for each row. No two rows can have the same \`transaction_id\`. SQLite uses this for the "INSERT OR REPLACE" logic — it finds matching primary keys when deciding whether to insert or replace.
- \`REAL\` — SQLite's data type for decimal numbers (equivalent to Python's \`float\`). Using the right types ensures numbers are stored as numbers, not text.
- \`pd.Timestamp.now().isoformat()\` — Gets the current date and time and converts it to a standard string like \`"2024-01-15T22:00:01.234567"\`. The \`loaded_at\` column gives us a complete audit trail of exactly when each batch of data was loaded.
- \`row[["transaction_id","branch",...]]\` — Explicitly selecting columns in a specific order ensures they match the order in our SQL INSERT statement. This prevents a bug where columns get shuffled and amounts land in the wrong fields.`,

      'quizzes': [
        {
          'question': "What does `if_exists='append'` do in `df.to_sql()`?",
          'options': [
            "A. Creates the table if it doesn't exist; fails if it does",
            "B. Adds new rows to the existing table without deleting existing data",
            "C. Replaces the entire table with the new data",
            "D. Updates existing rows"
          ],
          'correct': 1,
          'explanation': "if_exists has three options: 'fail' (raise error if table exists), 'replace' (drop and recreate), 'append' (add rows to existing). For incremental daily loads, 'append' is correct."
        },
        {
          'question': "Why do companies maintain a separate data warehouse instead of running analytics directly on the production database?",
          'options': [
            "A. Warehouses are more secure",
            "B. Heavy analytical queries (full-table scans, complex joins) slow down production databases and impact real users — separation protects app performance",
            "C. It is required by law",
            "D. Production databases can't run SQL"
          ],
          'correct': 1,
          'explanation': "An OLTP (Online Transaction Processing) database is optimized for fast writes and single-row reads. An OLAP (Online Analytical Processing) warehouse is optimized for aggregate queries. Mixing them on the same server creates contention."
        },
        {
          'question': "What is the risk of using `if_exists='replace'` for a daily load?",
          'options': [
            "A. It's too slow",
            "B. There's a window of time between dropping the old table and finishing the new insert where anyone querying the table gets no data",
            "C. It duplicates all rows",
            "D. It doesn't support large datasets"
          ],
          'correct': 1,
          'explanation': "Full replace creates a 'dark window' — for however long the new data takes to load, the table is empty or partially populated. Use staging tables (write to a temp table, then swap) to avoid this."
        }
      ]
    },

    'Handling Pipeline Failures': {
      'lesson': `## Handling Pipeline Failures

Production pipelines will fail. The question isn't whether, it's how often and how gracefully. A senior engineer is distinguished not by writing pipelines that never fail, but by writing pipelines that fail predictably, recover automatically, and communicate clearly.

### The four types of pipeline failures

1. **Transient failures** — network blip, API timeout, database briefly busy. Fix: retry with backoff.
2. **Data quality failures** — unexpected nulls, wrong types, out-of-range values. Fix: validation + alerting.
3. **Infrastructure failures** — disk full, memory exhausted, service down. Fix: monitoring + alerting.
4. **Logic failures** — bug in your transform code. Fix: unit tests, audit logs, rollback.

### Retry with exponential backoff

\`\`\`python
import time, logging

logger = logging.getLogger(__name__)

def retry(func, max_attempts=3, base_delay=10):
    """Retry a function with exponential backoff."""
    for attempt in range(1, max_attempts + 1):
        try:
            return func()
        except (ConnectionError, TimeoutError, OSError) as e:
            if attempt == max_attempts:
                logger.error(f"All {max_attempts} attempts failed: {e}")
                raise
            wait = base_delay * (2 ** (attempt - 1))   # 10s, 20s, 40s
            logger.warning(f"Attempt {attempt} failed: {e}. Retrying in {wait}s")
            time.sleep(wait)

# Usage
raw_data = retry(lambda: fetch_from_api(url))
\`\`\`

**Beginner Breakdown — Retry with Exponential Backoff**

- \`def retry(func, max_attempts=3, base_delay=10)\` — We pass a function as an argument (\`func\`). This is a powerful Python pattern: the retry logic doesn't need to know what it's retrying — it just calls whatever function you give it.
- \`except (ConnectionError, TimeoutError, OSError) as e:\` — We specifically catch network-related errors. We don't catch ALL exceptions (\`except Exception\`) because some errors (like a bug in our code) shouldn't trigger a retry — they should fail immediately.
- \`2 ** (attempt - 1)\` — \`**\` is Python's exponent operator. So: attempt 1: \`2^0 = 1\` → wait 10s. Attempt 2: \`2^1 = 2\` → wait 20s. Attempt 3: \`2^2 = 4\` → wait 40s. Each failure doubles the wait time.
- \`lambda: fetch_from_api(url)\` — A \`lambda\` with no arguments creates a "zero-argument function." We wrap \`fetch_from_api(url)\` in a lambda because \`retry\` expects a callable (something it can call with \`func()\`). The lambda delays the actual call until \`retry\` decides it's time to try.

### Checkpointing: resume from where you stopped

\`\`\`python
import json
from pathlib import Path

CHECKPOINT = Path("checkpoint.json")

def save_checkpoint(state: dict):
    CHECKPOINT.write_text(json.dumps(state))

def load_checkpoint() -> dict:
    if CHECKPOINT.exists():
        return json.loads(CHECKPOINT.read_text())
    return {}

def process_files(files: list):
    checkpoint = load_checkpoint()
    start_from = checkpoint.get("last_processed_index", 0)

    for i, file in enumerate(files[start_from:], start=start_from):
        logger.info(f"Processing {file.name} ({i+1}/{len(files)})")
        process_single_file(file)
        save_checkpoint({"last_processed_index": i + 1, "file": file.name})

    CHECKPOINT.unlink(missing_ok=True)   # clean up on success
    logger.info("All files processed")
\`\`\`

**Beginner Breakdown — Checkpointing**

- \`checkpoint.get("last_processed_index", 0)\` — \`.get(key, default)\` on a dictionary returns the value for the key if it exists, or the default value if not. On the first run, no checkpoint exists, so \`load_checkpoint()\` returns \`{}\` (empty dict), and \`.get\` returns \`0\` — we start from the beginning.
- \`files[start_from:]\` — Python list slicing. If \`start_from\` is 280, this gives us only items from index 280 onwards, skipping the first 280 files that were already processed.
- \`enumerate(files[start_from:], start=start_from)\` — \`enumerate\` adds a counter to each item. The \`start=start_from\` parameter makes the counter start at 280 instead of 0, so our log messages say "Processing file 281/365" instead of "Processing file 1/85."
- \`save_checkpoint({"last_processed_index": i + 1, ...})\` — We save \`i + 1\` (the NEXT index to process) so that if we crash mid-file, we restart at that file, not the one after it.
- \`CHECKPOINT.unlink(missing_ok=True)\` — Deletes the checkpoint file when all files are done. \`missing_ok=True\` prevents an error if the file was already deleted. Cleaning up prevents old checkpoints from confusing future runs.

### Alerting when things go wrong

\`\`\`python
import requests as req

def send_slack_alert(message: str, webhook_url: str):
    try:
        req.post(webhook_url, json={"text": message}, timeout=5)
    except Exception:
        pass   # Don't let alerting failure cascade into a bigger problem

def run_pipeline_with_alerts():
    webhook = os.environ["SLACK_WEBHOOK"]
    try:
        result = run_pipeline()
        # Only alert on success if something unusual happened
        if result["warnings"]:
            send_slack_alert(f"⚠️ Pipeline completed with warnings: {result['warnings']}", webhook)
    except Exception as e:
        send_slack_alert(f"🚨 PIPELINE FAILED\\n{type(e).__name__}: {e}", webhook)
        raise
\`\`\`

**Beginner Breakdown — Alerting**

- \`import requests as req\` — We alias \`requests\` as \`req\` here to avoid a naming conflict (since we imported \`requests\` earlier in the lesson under a different context).
- \`req.post(webhook_url, json={"text": message})\` — Sends an HTTP POST request to Slack's webhook URL. The \`json=\` parameter automatically converts the Python dictionary to JSON and sets the right content-type headers.
- \`except Exception: pass\` — We intentionally swallow all errors from the alert call. If Slack is down or our webhook expires, we don't want that to crash the pipeline. The \`pass\` statement does nothing — it's Python's way of having an empty code block.
- \`os.environ["SLACK_WEBHOOK"]\` — Reads the webhook URL from an environment variable. This is the correct way to handle secrets — never hardcode URLs or passwords in your source code.
- \`type(e).__name__\` — Gets the class name of the exception as a string. So \`ConnectionError\` becomes \`"ConnectionError"\`, making the alert message much clearer than just showing the error message alone.
- The final \`raise\` after the alert — We re-raise the exception so the pipeline still fails (and any external scheduler can see it failed). We just made sure the team was notified first.`,

      'scenario': `## Scenario: The Midnight Crash

**Context:** Your pipeline failed at 3 AM. It was processing 365 daily files to build the annual summary. It successfully processed 280 files, then crashed on file 281 due to a corrupted date column. By 8 AM, nobody had a report and nobody knew why.

**What you need to fix:**

1. Add checkpoint logic so if it fails on file 281, restarting picks up from 281, not from 1
2. Add per-file error handling — log the bad file and continue instead of stopping everything
3. Send an alert when a file is skipped

\`\`\`python
errors = []

for i, file in enumerate(files[start_from:], start=start_from):
    try:
        df = pd.read_csv(file, parse_dates=["date"])
        transformed = transform(df)
        results.append(transformed)
        save_checkpoint({"last_processed": i})
    except Exception as e:
        msg = f"Skipped {file.name}: {type(e).__name__}: {e}"
        logger.warning(msg)
        errors.append(msg)

if errors:
    send_slack_alert(f"Pipeline completed with {len(errors)} skipped files:\\n" + "\\n".join(errors), webhook)
else:
    logger.info("All files processed cleanly")
\`\`\`

**Beginner Breakdown — Fault-Tolerant File Processing**

- \`errors = []\` — We collect error messages in a list rather than sending an alert for every single bad file. This prevents "alert storms" where you get 50 Slack messages at 3 AM for 50 bad files.
- \`try: ... except Exception as e:\` — The try/except is now inside the loop. This means a single bad file is caught, logged, and skipped — but the loop continues to the next file. Without this structure, one bad file would crash the entire pipeline.
- \`errors.append(msg)\` — We collect all error messages. At the end, if there were any errors, we send ONE combined alert with all the skipped files listed. This is much more useful than 50 separate alerts.
- \`"\\n".join(errors)\` — Joins the list of error messages into a single string with newlines between them, creating a readable list in the Slack message.

This approach is called "fault tolerance" — the pipeline keeps moving even when individual inputs are bad, and it reports exactly what it skipped and why.`,

      'quizzes': [
        {
          'question': "What is exponential backoff and why is it better than retrying immediately?",
          'options': [
            "A. It retries faster each time",
            "B. It waits increasingly longer between retries — giving overloaded systems time to recover instead of hammering them with repeated requests",
            "C. It only retries once",
            "D. It's a database term"
          ],
          'correct': 1,
          'explanation': "If an API is overloaded and you immediately retry 3 times, you're adding to the problem. Exponential backoff (2s, 4s, 8s...) gives the system time to recover. It's the industry-standard approach for transient failures."
        },
        {
          'question': "What is the purpose of a checkpoint in a long-running pipeline?",
          'options': [
            "A. To measure pipeline performance",
            "B. To save progress so that if the pipeline fails mid-way, it can resume from where it stopped rather than starting over",
            "C. To validate data quality",
            "D. To compress the output files"
          ],
          'correct': 1,
          'explanation': "Without checkpointing, a failure at step 280 of 365 means reprocessing all 280 from scratch. With checkpointing, you restart from step 280. On large pipelines, this is the difference between a 5-minute recovery and a 3-hour re-run."
        },
        {
          'question': "Why should alerting failures (e.g., a failed Slack notification) not stop your pipeline?",
          'options': [
            "A. Alerts aren't important",
            "B. The pipeline's job is to process data — if alerting fails, that's secondary. A broken alert should never cascade into a broken pipeline",
            "C. Slack alerts always succeed",
            "D. Alerting runs in a separate process"
          ],
          'correct': 1,
          'explanation': "Wrapping your alert call in try/except and passing silently is intentional. You don't want a Slack API timeout to cause your financial reconciliation pipeline to fail."
        }
      ]
    },

    'Incremental vs Full Loads': {
      'lesson': `## Incremental vs Full Loads

This is a fundamental design decision that affects cost, speed, and complexity. Getting it wrong in either direction creates real problems.

### Full load: simple but expensive at scale

\`\`\`python
def full_load(source_conn, dest_conn, table: str):
    """Drop everything and reload. Simple. Only works for small tables."""
    df = pd.read_sql(f"SELECT * FROM {table}", source_conn)
    df.to_sql(table, dest_conn, if_exists="replace", index=False)
    print(f"Full load: {len(df)} rows")
\`\`\`

**Beginner Breakdown — Full Load**

- \`f"SELECT * FROM {table}"\` — An f-string lets us dynamically build the SQL query using the \`table\` variable. If \`table = "customers"\`, the query becomes \`"SELECT * FROM customers"\`. This makes the function reusable for any table.
- \`if_exists="replace"\` — Drops the entire destination table and rebuilds it from scratch with the new data. For a 100-row product catalog, this is fine. For a 100M-row transactions table, this would take hours.

**When full load makes sense:**
- Small reference tables (currencies, countries, product categories)
- Tables that change completely (daily snapshots)
- Initial loads when setting up a new warehouse

**When it breaks down:**
- A 100M-row transactions table takes 4 hours to reload
- Users get stale data during reload
- Cloud costs scale with data volume — reloading 1TB daily is expensive

### Incremental load: fast but requires discipline

\`\`\`python
from datetime import date, timedelta

def incremental_load(source_conn, dest_conn, table: str, ts_col: str):
    """Load only rows created/modified since last run."""
    # Get the latest timestamp already in the warehouse
    result = pd.read_sql(
        f"SELECT MAX({ts_col}) as last_ts FROM {table}",
        dest_conn
    ).iloc[0]["last_ts"]

    last_ts = result or "1970-01-01"

    # Extract only new/changed rows from source
    new_rows = pd.read_sql(
        f"SELECT * FROM {table} WHERE {ts_col} > '{last_ts}'",
        source_conn,
        parse_dates=[ts_col]
    )

    if new_rows.empty:
        print("No new rows")
        return 0

    new_rows.to_sql(table, dest_conn, if_exists="append", index=False)
    print(f"Loaded {len(new_rows)} new rows (watermark: {last_ts} → {new_rows[ts_col].max()})")
    return len(new_rows)
\`\`\`

**Beginner Breakdown — Incremental Load**

- \`SELECT MAX({ts_col}) as last_ts\` — \`MAX()\` is a SQL aggregate function that returns the largest value in a column. For timestamps, this means the most recent date. We use this to find our watermark: "what's the newest record already in the warehouse?"
- \`result or "1970-01-01"\` — Python's "or" operator returns the first truthy value. If \`result\` is \`None\` (the table is empty or doesn't exist yet), it falls back to the Unix epoch date. This handles the "first ever run" case gracefully.
- \`if new_rows.empty:\` — Pandas DataFrames have an \`.empty\` property that returns True if there are no rows. Checking this before attempting to load saves a database call when there's nothing to do.
- \`f"Loaded {len(new_rows)} new rows (watermark: {last_ts} → {new_rows[ts_col].max()})"\` — The arrow \`→\` visually shows the watermark advancing forward. In logs, this makes it immediately obvious that progress is being made.

### The duplicate problem with incremental loads

\`\`\`python
def idempotent_incremental_load(df: pd.DataFrame, table: str, key_col: str, conn):
    """Upsert: update if key exists, insert if not. Safe to run multiple times."""
    existing_keys = pd.read_sql(f"SELECT {key_col} FROM {table}", conn)[key_col].tolist()

    new_rows = df[~df[key_col].isin(existing_keys)]
    updated_rows = df[df[key_col].isin(existing_keys)]

    if not new_rows.empty:
        new_rows.to_sql(table, conn, if_exists="append", index=False)

    # Update existing rows (simplified — real impl uses SQL UPDATE)
    for _, row in updated_rows.iterrows():
        cols = ", ".join([f"{c} = ?" for c in row.index if c != key_col])
        values = [row[c] for c in row.index if c != key_col] + [row[key_col]]
        conn.execute(f"UPDATE {table} SET {cols} WHERE {key_col} = ?", values)
    conn.commit()
\`\`\`

**Beginner Breakdown — Idempotent Upsert**

- \`pd.read_sql(f"SELECT {key_col} FROM {table}", conn)[key_col].tolist()\` — We fetch only the key column (not all columns — that would be wasteful). \`[key_col]\` selects just that column, and \`.tolist()\` converts the pandas Series to a plain Python list for fast lookup.
- \`df[~df[key_col].isin(existing_keys)]\` — Rows in our new data that do NOT have a matching key in the warehouse = brand new records to insert.
- \`df[df[key_col].isin(existing_keys)]\` — Rows that DO have a matching key = records that already exist and need updating.
- \`[f"{c} = ?" for c in row.index if c != key_col]\` — A list comprehension that builds SQL SET clauses. For a row with columns \`name\`, \`status\`, \`amount\` and a key of \`id\`, this produces: \`["name = ?", "status = ?", "amount = ?"]\`.
- \`values = [...] + [row[key_col]]\` — We build the list of values for the UPDATE statement. The key column goes last because the SQL is: \`UPDATE table SET col=? WHERE key=?\` — the WHERE value comes at the end.

### Choosing the right strategy

\`\`\`
Table size:    < 100K rows  → Full load is fine
               > 1M rows    → Incremental required

Data changes:  Append-only (events, logs) → Simple incremental append
               Records updated (orders, customers) → Upsert incremental

Freshness:     Near-real-time needed → Micro-batch (every 5 min)
               Daily is fine → Nightly incremental
               Weekly is fine → Weekend full reload
\`\`\``,

      'scenario': `## Scenario: The Growing Cloud Bill

**Context:** Six months ago your ETL took 4 minutes and cost ₦800/day in cloud compute. Today it takes 3 hours and costs ₦45,000/day. The database grew from 2M rows to 180M rows. Nothing else changed — you're still doing a full reload every night.

**The fix — switch to incremental:**

\`\`\`python
# Before (full reload — ₦45,000/day)
df = pd.read_sql("SELECT * FROM transactions", prod_conn)   # 180M rows
df.to_sql("transactions", warehouse_conn, if_exists="replace")

# After (incremental — ~₦1,200/day)
df = pd.read_sql(
    "SELECT * FROM transactions WHERE updated_at > :last_ts",
    prod_conn,
    params={"last_ts": get_watermark()}
)   # ~50,000 rows (yesterday's activity)
df.to_sql("transactions", warehouse_conn, if_exists="append")
save_watermark(df["updated_at"].max())
\`\`\`

**Beginner Breakdown — The Cost Fix**

- The before code reads the entire 180M-row table into Python memory, then overwrites the entire warehouse table. Cloud providers charge by data processed — 180M rows × 6 months of growth = an ever-growing bill.
- The after code reads only rows updated since the last run (using the \`:last_ts\` watermark). On a typical day, maybe 50,000 transactions are new or updated. That's 3,600x fewer rows.
- \`df["updated_at"].max()\` — After loading, we immediately update our watermark to the newest timestamp in this batch, so next run knows where to start.
- The cost math: if processing 180M rows costs ₦45,000, then processing 50,000 rows (0.028% of the data) costs roughly ₦1,200. Same result, 37x cheaper.

**Expected results:**
- Query time: 3 hours → 4 minutes
- Cloud cost: ₦45,000/day → ₦1,200/day
- Source database impact: near zero (indexed WHERE clause vs full scan)

The financial impact alone justifies this change. In cloud billing, every GB processed costs money. Incremental loading is the single highest-ROI optimization in most ETL pipelines.`,

      'quizzes': [
        {
          'question': "What is the main advantage of incremental loading over full loading?",
          'options': [
            "A. It's easier to implement",
            "B. It only processes new or changed records, making it dramatically faster and cheaper for large tables",
            "C. It never produces duplicates",
            "D. It works without a database connection"
          ],
          'correct': 1,
          'explanation': "A full load of 100M rows takes the same time and cost every day regardless of how much data actually changed. Incremental loading scales with the change volume — if only 10,000 rows changed, that's all you process."
        },
        {
          'question': "Why is a watermark (timestamp or ID) essential for incremental loading?",
          'options': [
            "A. For security",
            "B. It marks where the last extraction ended so the next run only fetches records created after that point",
            "C. It validates data types",
            "D. It's required by the database driver"
          ],
          'correct': 1,
          'explanation': "Without a watermark, you can't know what's 'new'. You'd either reload everything (full load) or rely on fragile logic. The watermark is the bookmark that makes incremental loading precise and resumable."
        },
        {
          'question': "What problem occurs if you use simple APPEND for a table where records can be updated?",
          'options': [
            "A. Nothing — append always works",
            "B. You'll have multiple versions of the same record (old and new) in the warehouse, making aggregations wrong",
            "C. The table will become too large",
            "D. Append is not supported for updated records"
          ],
          'correct': 1,
          'explanation': "If order ID 12345 status changes from 'pending' to 'settled', a simple append adds a second row with the new status. Now you have two rows for order 12345 — counting them both gives wrong totals. Use UPSERT for mutable records."
        }
      ]
    },

    'ETL vs ELT': {
      'lesson': `## ETL vs ELT

The shift from ETL to ELT isn't just a reordering of letters — it represents a fundamental change in where computation happens, and it was enabled by the rise of cheap, powerful cloud data warehouses.

### ETL (Traditional): transform before loading

\`\`\`
Source DB → Python Transform → Clean Data → Warehouse
\`\`\`

\`\`\`python
# ETL: data is cleaned in Python before it touches the warehouse
def run_etl(source_conn, warehouse_conn):
    # Extract
    raw = pd.read_sql("SELECT * FROM orders", source_conn)

    # Transform (in Python)
    raw["amount"] = pd.to_numeric(raw["amount"], errors="coerce")
    raw = raw.dropna(subset=["amount"])
    raw["revenue_usd"] = raw["amount"] / exchange_rate

    # Load clean data only
    raw.to_sql("clean_orders", warehouse_conn, if_exists="append")
\`\`\`

**Beginner Breakdown — Traditional ETL Flow**

- In this pattern, every transformation happens in Python before a single row touches the warehouse. \`pd.to_numeric\`, \`dropna\`, and the \`revenue_usd\` calculation all run on your Python server.
- \`raw["amount"] / exchange_rate\` — A simple column division. Every value in the "amount" column is divided by the exchange rate to produce a USD column. Pandas applies this to all rows simultaneously (vectorized), which is much faster than a Python loop.
- The warehouse only ever receives clean, validated data. It never sees the raw mess. This is ETL's strength — and its limitation: the transform logic is hardcoded in Python, so if you need to add a new column later, you must re-run the entire pipeline from source.

**ETL is right when:**
- Data contains PII (credit cards, SSNs) that must be masked before leaving the secure environment
- The target warehouse is expensive per GB stored — don't load raw junk
- Legacy systems with limited compute at the destination

### ELT (Modern): load raw, transform inside the warehouse

\`\`\`
Source DB → Raw Data → Warehouse (raw layer) → SQL Transforms → Clean Views
\`\`\`

\`\`\`python
# ELT Step 1: load raw data as-is — no transformation in Python
def run_elt_extract_and_load(source_conn, warehouse_conn):
    raw = pd.read_sql("SELECT * FROM orders", source_conn)
    raw["_loaded_at"] = pd.Timestamp.now().isoformat()
    raw["_source"] = "orders_table"
    # Load raw — no cleaning
    raw.to_sql("raw__orders", warehouse_conn, if_exists="append", index=False)
    print(f"Loaded {len(raw)} raw rows")
\`\`\`

**Beginner Breakdown — ELT Raw Load**

- \`raw["_loaded_at"]\` and \`raw["_source"]\` — The underscore prefix (\`_\`) is a naming convention for metadata columns that were added by the pipeline, not from the original source. This distinguishes them from business columns.
- Notice what's NOT here: no \`dropna\`, no type conversion, no business rules. We load the data exactly as it came from the source. If it's messy, it goes in messy.
- \`"raw__orders"\` — The double underscore in the table name is an ELT convention indicating this is the raw layer. It signals to any analyst querying the warehouse: "this table is unprocessed, use the clean view instead."

\`\`\`sql
-- ELT Step 2: transform inside the warehouse using SQL (or dbt)
CREATE VIEW clean_orders AS
SELECT
    id,
    CAST(amount AS FLOAT) as amount,
    LOWER(TRIM(status)) as status,
    amount / (SELECT rate FROM exchange_rates WHERE currency = 'USD' ORDER BY date DESC LIMIT 1) as revenue_usd
FROM raw__orders
WHERE amount IS NOT NULL AND amount > 0;
\`\`\`

**Beginner Breakdown — ELT SQL Transform**

- \`CREATE VIEW\` — A View is not a table. It's a saved SQL query. Every time someone queries \`clean_orders\`, the database runs this SQL against the raw table in real time. This means the "transformation" always uses the latest logic.
- \`CAST(amount AS FLOAT)\` — SQL's equivalent of Python's \`pd.to_numeric()\`. Converts the stored text to a number inside the database.
- \`LOWER(TRIM(status))\` — SQL has the same string functions as pandas. \`LOWER\` = lowercase. \`TRIM\` = remove whitespace. These run inside the database.
- The subquery \`(SELECT rate FROM exchange_rates ... LIMIT 1)\` — This fetches the latest exchange rate dynamically every time the view is queried. No hardcoded rate, no stale values.
- The power of ELT: if the business changes the definition of "valid amount" from \`> 0\` to \`> 100\`, you just edit this SQL. No Python pipeline to re-run, no re-extraction from source.

### Why ELT won

| Factor | ETL | ELT |
|---|---|---|
| If transform logic changes | Re-extract from source | Re-run SQL on existing raw data |
| Storage cost | Lower (only clean data stored) | Higher (raw + clean both stored) |
| New question from business | May need re-extraction | Can answer from existing raw layer |
| Compute for transforms | Python server you maintain | Warehouse handles it (Snowflake, BigQuery) |
| Data history | Lost if you didn't plan for it | Always available |

### The key insight: raw data is an asset

\`\`\`python
# Scenario: 6 months ago you extracted orders but dropped the 'ip_address' column
# because you didn't think you'd need it. Now fraud team wants location analysis.
# With ETL: you're stuck — re-extract 6 months of data
# With ELT: ip_address is in the raw layer — just add it to the SQL transform

# ELT SQL addition (no re-extraction needed):
# SELECT ..., ip_address FROM raw__orders WHERE ...
\`\`\`

**Beginner Breakdown — Raw Data as an Asset**

- This code block is deliberately minimal because the point is conceptual. In ETL, you decided upfront what to keep — and if you were wrong, you've lost that data permanently (or must go back to the source).
- In ELT, the decision of what columns to expose is deferred to the SQL transform layer, which you can update at any time against the raw data that's already in the warehouse.
- The practical lesson: when in doubt, load more columns than you think you need. Storage is cheap. Re-extraction is expensive.`,

      'scenario': `## Scenario: The "Oops, We Forgot a Column" Problem

**Context:** Six months ago you built an ETL pipeline that drops the \`device_type\` column from mobile app transaction data because it seemed irrelevant. The product team now wants to know if mobile users have a higher average transaction value than desktop users. The raw data is gone.

**What you'd do differently with ELT:**

\`\`\`python
# ELT raw layer: load EVERYTHING
def elt_load_raw(df: pd.DataFrame, table_name: str, conn):
    """Load raw data with zero transformation — just add metadata columns."""
    df["_loaded_at"] = pd.Timestamp.now().isoformat()
    df["_pipeline_version"] = "1.0"
    df.to_sql(f"raw__{table_name}", conn, if_exists="append", index=False)

# 6 months later, answer the new question from existing raw data:
analysis = pd.read_sql("""
    SELECT
        device_type,
        COUNT(*) as txn_count,
        AVG(amount) as avg_amount,
        SUM(amount) as total_revenue
    FROM raw__transactions
    WHERE device_type IS NOT NULL
    GROUP BY device_type
""", warehouse_conn)
print(analysis)
\`\`\`

**Beginner Breakdown — Answering New Questions from Existing Raw Data**

- \`df["_pipeline_version"] = "1.0"\` — Versioning your pipeline load is good practice. If you later update the pipeline logic, rows loaded under different versions can be distinguished for debugging.
- \`AVG(amount)\` — A SQL aggregate function that calculates the average of the amount column per group. Combined with \`GROUP BY device_type\`, it gives us the average transaction value for mobile vs desktop users — exactly what the product team wanted.
- \`WHERE device_type IS NOT NULL\` — Excludes rows where the device type wasn't recorded. This is a much cleaner filter than "delete those rows" — the rows remain in the raw table for any future analysis.
- \`GROUP BY device_type\` — SQL's equivalent of a pivot table. It collapses all rows with the same \`device_type\` into one row, and the aggregate functions (\`COUNT\`, \`AVG\`, \`SUM\`) summarize them.

The ELT philosophy is: **you don't know what questions you'll be asked in 6 months, so keep the raw data and build answers with SQL.**`,

      'quizzes': [
        {
          'question': "What is the main practical advantage of ELT over ETL?",
          'options': [
            "A. ELT is faster for all operations",
            "B. Raw data is preserved — if business requirements change, you can re-transform without re-extracting",
            "C. ELT requires less storage",
            "D. ELT doesn't need Python"
          ],
          'correct': 1,
          'explanation': "In ETL, if you drop a column during transformation and later need it, you must re-extract from the source (which may be unavailable or very slow). In ELT, the raw data is in the warehouse and you just update the SQL transform."
        },
        {
          'question': "When should you choose ETL over ELT?",
          'options': [
            "A. Always — ETL is more professional",
            "B. When data contains sensitive PII that must be masked or removed before it reaches the cloud warehouse",
            "C. When you have large datasets",
            "D. When using Python"
          ],
          'correct': 1,
          'explanation': "Credit card numbers, national IDs, medical records — these should never land in a cloud warehouse in raw form. ETL allows you to encrypt or drop sensitive fields before the data ever leaves your secure environment."
        },
        {
          'question': "In ELT, where does the transformation happen?",
          'options': [
            "A. In Python before loading",
            "B. Inside the data warehouse using SQL (often with a tool like dbt)",
            "C. In Excel after export",
            "D. At the source system"
          ],
          'correct': 1,
          'explanation': "ELT loads raw data first, then uses the warehouse's compute power (SQL) to run transformations. This is why modern cloud warehouses like BigQuery and Snowflake are so central to ELT — they're fast enough to run complex SQL transforms on billions of rows."
        }
      ]
    },

    'ETL in a Real Nigerian Bank': {
      'lesson': `## ETL in a Real Nigerian Bank

Banking is the most data-intensive industry in Nigeria. Every transaction, every customer interaction, every regulatory report is a data pipeline problem. Understanding how these work gives you a real advantage when interviewing at or working for financial institutions.

### The banking data stack

\`\`\`
ATMs / POS / Mobile App / Internet Banking
            ↓
    Core Banking System (CBS)
    (Finacle, Flexcube, T24)
            ↓
    End-of-Day (EOD) ETL Process
            ↓
    Data Warehouse / Reporting Layer
            ↓
    Regulatory Reports (CBN) + Management Dashboards
\`\`\`

### End-of-Day (EOD) process: the most critical ETL in banking

The EOD runs every night after the banking day closes (usually after 11 PM). It calculates interest, applies charges, posts standing orders, and balances every account. If it fails, the next morning's opening balances are wrong.

\`\`\`python
from datetime import date, timedelta

def run_eod_pipeline(business_date: date):
    """Simplified representation of a banking EOD pipeline."""
    print(f"Starting EOD for {business_date}")

    # 1. Extract all transactions for the day
    transactions = extract_daily_transactions(business_date)
    print(f"  Transactions: {len(transactions)}")

    # 2. Calculate interest accruals
    interest = calculate_interest_accruals(business_date)

    # 3. Apply standing orders (scheduled payments)
    standing_orders = process_standing_orders(business_date)

    # 4. Post all journals to the general ledger
    all_postings = pd.concat([transactions, interest, standing_orders])
    post_to_ledger(all_postings)

    # 5. Balance check — total debits must equal total credits
    debits = all_postings[all_postings["entry_type"] == "DR"]["amount"].sum()
    credits = all_postings[all_postings["entry_type"] == "CR"]["amount"].sum()

    if abs(debits - credits) > 0.001:
        raise ValueError(f"EOD FAILED: Out of balance by ₦{abs(debits-credits):,.2f}")

    print(f"EOD complete: {len(all_postings)} postings, balanced ✓")
\`\`\`

**Beginner Breakdown — Banking EOD Pipeline**

- \`pd.concat([transactions, interest, standing_orders])\` — Stacks three separate DataFrames into one. Think of it as taking three piles of paper (transactions, interest calculations, and scheduled payments) and combining them into a single stack of all journal entries.
- \`all_postings[all_postings["entry_type"] == "DR"]["amount"].sum()\` — A two-step filter. First, \`all_postings["entry_type"] == "DR"\` creates a True/False mask for all debit rows. Then \`["amount"].sum()\` adds up the amounts of only those rows. This gives us the total debits for the day.
- \`abs(debits - credits) > 0.001\` — We use a small threshold (₦0.001 = 10 kobo) rather than checking for exact equality, because floating-point arithmetic can introduce microscopic rounding differences that are not real errors.
- \`raise ValueError(f"EOD FAILED: Out of balance by ₦{abs(debits-credits):,.2f}")\` — This is a hard stop. In banking, an unbalanced ledger means the numbers are wrong. The pipeline must not continue. The error message shows exactly how much it's off by.
- The double-entry principle: for every debit, there must be a matching credit. If a customer's account is debited ₦10,000 for a bill payment, the biller's account (or a suspense account) must be credited ₦10,000. Total debits always equal total credits. This is 500 years of accounting logic encoded in one if-statement.

### Reconciliation: the most important transform in banking

Reconciliation compares two independent records of the same events and flags differences.

\`\`\`python
def reconcile_nibss(internal_df: pd.DataFrame, nibss_df: pd.DataFrame) -> dict:
    """
    Compare internal transaction records against NIBSS settlement records.
    Every discrepancy represents money that is either missing or double-counted.
    """
    # Normalize both sides
    internal = internal_df.set_index("reference_no")[["amount", "status"]]
    nibss = nibss_df.set_index("reference_no")[["amount", "status"]]

    # Find differences
    merged = internal.join(nibss, lsuffix="_internal", rsuffix="_nibss", how="outer")
    merged["amount_diff"] = (merged["amount_internal"] - merged["amount_nibss"]).abs()

    # Categorize discrepancies
    in_internal_only = merged[merged["amount_nibss"].isnull()]
    in_nibss_only = merged[merged["amount_internal"].isnull()]
    amount_mismatch = merged[merged["amount_diff"] > 0.01].dropna()

    return {
        "matched": len(merged) - len(in_internal_only) - len(in_nibss_only) - len(amount_mismatch),
        "internal_only": in_internal_only,
        "nibss_only": in_nibss_only,
        "amount_mismatch": amount_mismatch,
        "total_discrepancy": amount_mismatch["amount_diff"].sum()
    }
\`\`\`

**Beginner Breakdown — NIBSS Reconciliation**

- \`.set_index("reference_no")\` — Makes the reference number the row label (index) instead of a regular column. When we join the two DataFrames, pandas automatically matches rows by this index — so internal transaction REF001 will be joined with NIBSS transaction REF001.
- \`[["amount", "status"]]\` — Double brackets select only these two columns. We don't need all the other columns for reconciliation — just the amounts and statuses that we're comparing.
- \`.join(..., how="outer")\` — An outer join includes ALL rows from both DataFrames, even if they have no match on the other side. This is essential for finding transactions that exist in only one system (our internal records vs NIBSS). A missing row on one side is a discrepancy.
- \`lsuffix="_internal", rsuffix="_nibss"\` — When both DataFrames have a column called "amount," pandas needs to rename them to avoid a collision. After the join, we'll have "amount_internal" and "amount_nibss" — clearly distinguishable.
- \`merged[merged["amount_nibss"].isnull()]\` — Rows where the NIBSS amount is null after an outer join means this transaction exists in our system but not in NIBSS. That's a potential missing settlement.
- Returning a dictionary instead of a DataFrame allows the caller to access specific categories of discrepancies by name: \`result["internal_only"]\`, \`result["total_discrepancy"]\`, etc.

### KYC (Know Your Customer) data pipeline

\`\`\`python
def kyc_compliance_check(customers_df: pd.DataFrame) -> pd.DataFrame:
    """Flag accounts that need KYC update per CBN regulations."""
    today = pd.Timestamp.today()

    customers_df["kyc_expiry"] = pd.to_datetime(customers_df["kyc_date"]) + pd.DateOffset(years=1)
    customers_df["kyc_status"] = "valid"

    # Expired KYC
    expired_mask = customers_df["kyc_expiry"] < today
    customers_df.loc[expired_mask, "kyc_status"] = "expired"

    # Expiring within 30 days
    expiring_mask = (customers_df["kyc_expiry"] >= today) & \
                    (customers_df["kyc_expiry"] <= today + pd.DateOffset(days=30))
    customers_df.loc[expiring_mask, "kyc_status"] = "expiring_soon"

    # High-value accounts (Tier 3) with missing documents
    missing_docs = (customers_df["account_tier"] == 3) & customers_df["bvn"].isnull()
    customers_df.loc[missing_docs, "kyc_status"] = "incomplete"

    return customers_df
\`\`\`

**Beginner Breakdown — KYC Compliance Pipeline**

- \`pd.DateOffset(years=1)\` — A pandas tool for date arithmetic. Adding \`DateOffset(years=1)\` to a date gives you exactly one year later, correctly handling leap years and month-end edge cases.
- \`customers_df["kyc_status"] = "valid"\` — We set a default of "valid" for all rows first. Then we selectively override specific rows. This "set default, then override" pattern is cleaner than writing nested if/else conditions.
- \`customers_df.loc[expired_mask, "kyc_status"] = "expired"\` — \`.loc\` is pandas' label-based row and column selector. \`[expired_mask, "kyc_status"]\` means "for all rows where \`expired_mask\` is True, set the \`kyc_status\` column." This only modifies the rows that match — all other rows keep their current value.
- \`pd.DateOffset(days=30)\` — 30 days from today. Accounts expiring within this window get flagged proactively so the bank can contact customers before their KYC actually expires.
- \`customers_df["bvn"].isnull()\` — BVN is Bank Verification Number, Nigeria's national bank identity system. A Tier 3 (high-value) account without a BVN is a serious compliance gap. This line identifies those accounts.`,

      'scenario': `## Scenario: The Failed ATM Settlement

**Context:** Monday morning, the settlement team at a major bank notices ₦23.7M is unaccounted for. Internal records say it was dispensed through ATMs. NIBSS (Nigeria Interbank Settlement System) records say it wasn't processed.

**Your investigation:**

\`\`\`python
import pandas as pd

internal = pd.read_csv("atm_transactions_friday.csv")
nibss = pd.read_csv("nibss_settlement_friday.csv")

recon = reconcile_nibss(internal, nibss)

print(f"Matched records: {recon['matched']}")
print(f"In our system only: {len(recon['internal_only'])} (₦{recon['internal_only']['amount_internal'].sum():,.0f})")
print(f"In NIBSS only: {len(recon['nibss_only'])}")
print(f"Amount mismatches: {len(recon['amount_mismatch'])}")
print(f"Total discrepancy: ₦{recon['total_discrepancy']:,.2f}")

# Save the discrepancy report for the refunds team
recon["internal_only"].to_csv("discrepancy_report.csv", index=False)
\`\`\`

**Beginner Breakdown — ATM Settlement Investigation**

- \`recon['internal_only']['amount_internal'].sum()\` — We access the "internal_only" DataFrame from our results dictionary, select the "amount_internal" column, and sum it. This gives us the total money that's in our records but missing from NIBSS — our ₦23.7M discrepancy.
- \`{value:,.0f}\` — The format code \`,.0f\` means: use comma separators, and 0 decimal places. So \`23700000\` prints as \`"23,700,000"\` — far more readable.
- \`recon["internal_only"].to_csv("discrepancy_report.csv")\` — Saves the problematic records to a CSV for the settlement team to investigate. Each row in this file is a transaction that needs to be re-submitted to NIBSS or manually reversed.

**Finding:** 847 ATM transactions appear in the internal system but not in NIBSS. These are transactions where cash was dispensed but the network response timed out before NIBSS confirmed it. The ₦23.7M represents those transactions. They need to be re-submitted to NIBSS or manually reversed. Your pipeline identified them in 3 seconds.`,

      'quizzes': [
        {
          'question': "What is the purpose of reconciliation in banking ETL?",
          'options': [
            "A. To speed up transactions",
            "B. To compare internal records against external partner records (NIBSS, Interswitch) to ensure every transaction is accounted for with no missing or duplicated money",
            "C. To format data for reporting",
            "D. To encrypt transaction data"
          ],
          'correct': 1,
          'explanation': "Reconciliation is the financial integrity check. In banking, the rule is: total debits must equal total credits, and internal records must match what settlement networks report. Any discrepancy represents real money."
        },
        {
          'question': "What happens if the EOD pipeline fails to balance (debits ≠ credits)?",
          'options': [
            "A. The difference is ignored",
            "B. The pipeline should halt immediately — an out-of-balance condition means incorrect data would flow into the next business day's opening balances",
            "C. The pipeline continues and fixes the balance automatically",
            "D. The difference is posted to a suspense account automatically"
          ],
          'correct': 1,
          'explanation': "An out-of-balance EOD is a critical failure. If allowed to pass, every subsequent calculation (interest, charges, regulatory reports) will be built on wrong numbers. The pipeline must stop and alert engineers immediately."
        },
        {
          'question': "What does a 'KYC expiry' check in a data pipeline help the bank achieve?",
          'options': [
            "A. Faster transaction processing",
            "B. CBN compliance — identifying accounts with expired customer identity verification before regulators flag them",
            "C. Lower ATM fees",
            "D. Better interest rates"
          ],
          'correct': 1,
          'explanation': "The Central Bank of Nigeria requires banks to periodically refresh customer identity documents. An automated pipeline that flags expiring KYC records lets the bank proactively contact customers rather than reactively blocking accounts when regulators audit."
        }
      ]
    },

    'Milestone Project': {
      'lesson': `## Milestone: The Chinook Music Store ETL Pipeline

You'll build a complete ETL pipeline on a real, publicly available relational database. This project demonstrates the full ETL lifecycle: multi-table extraction, business-rule transformation, warehouse loading, and reconciliation.

## The Business Problem

**"Chinook Digital Media"** has a music store with multiple data quality issues discovered during a financial audit: invoices linked to customers who don't exist in the system, tracks assigned to genres that were deleted, and revenue totals that don't match the sum of invoice line items. You must build an ETL pipeline that extracts from the relational source, identifies and handles these anomalies, loads a clean warehouse, and produces an auditable reconciliation report.

## The Data Source

**Chinook Database** — a real SQLite database modelling a digital media store:

\`\`\`
Download: https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
Tables: Customer, Invoice, InvoiceLine, Track, Album, Artist, Genre, Employee
\`\`\`

Foreign key relationships:
- Invoice.CustomerId → Customer.CustomerId
- InvoiceLine.InvoiceId → Invoice.InvoiceId
- InvoiceLine.TrackId → Track.TrackId
- Track.GenreId → Genre.GenreId
- Track.AlbumId → Album.AlbumId
- Album.ArtistId → Artist.ArtistId

## Project Tasks

**1. Extract all related tables:**
\`\`\`python
import sqlite3, pandas as pd

conn = sqlite3.connect("Chinook_Sqlite.sqlite")
tables = ["Customer","Invoice","InvoiceLine","Track","Album","Artist","Genre","Employee"]
data = {t: pd.read_sql(f"SELECT * FROM {t}", conn) for t in tables}
conn.close()
\`\`\`

**Beginner Breakdown: Extract Phase**
- \`import sqlite3, pandas as pd\`: We bring in two helpful tools. \`sqlite3\` lets Python talk to our database file, and \`pandas\` (nicknamed \`pd\`) is a powerful tool for working with data tables.
- \`conn = sqlite3.connect(...)\`: We are opening a direct connection (like opening a book) to our music store database file.
- \`tables = [...]\`: We make a list of all the different tables inside the database that we want to extract information from.
- \`data = {t: pd.read_sql(f"SELECT * FROM {t}", conn) for t in tables}\`: This is a "dictionary comprehension" — a compact way to build a dictionary by looping. For each table name \`t\` in our list, it runs a SQL query and stores the result with the table name as the key. After this line, \`data["Customer"]\` gives you the full customer table as a DataFrame, \`data["Invoice"]\` gives you invoices, and so on.
- \`conn.close()\`: Just like closing a book when you're done reading, we close the database connection to free up the computer's resources.

**2. Transform — join and validate:**
\`\`\`python
# Build the main fact table
fact = (data["InvoiceLine"]
    .merge(data["Invoice"][["InvoiceId","CustomerId","InvoiceDate","Total"]], on="InvoiceId")
    .merge(data["Customer"][["CustomerId","Country","FirstName","LastName"]], on="CustomerId")
    .merge(data["Track"][["TrackId","Name","GenreId","AlbumId","UnitPrice"]], on="TrackId")
    .merge(data["Genre"][["GenreId","Name"]].rename(columns={"Name":"Genre"}), on="GenreId", how="left")
    .merge(data["Album"][["AlbumId","ArtistId","Title"]].rename(columns={"Title":"Album"}), on="AlbumId", how="left")
    .merge(data["Artist"][["ArtistId","Name"]].rename(columns={"Name":"Artist"}), on="ArtistId", how="left")
)
fact["LineTotal"] = fact["Quantity"] * fact["UnitPrice"]
\`\`\`

**Beginner Breakdown: Transform Phase**
Here, we are bringing all the scattered data together into one big master table (often called a "fact table"). It is very similar to doing multiple VLOOKUPs in Excel to pull data from different sheets!
- \`fact = (data["InvoiceLine"]\`: We start our master table using the \`InvoiceLine\` data. Why? Because it represents every single individual song ever sold. It is the core of our business data.
- \`.merge(...)\`: This is the pandas command to glue tables together side-by-side.
- \`.merge(data["Invoice"][["InvoiceId"...]], on="InvoiceId")\`: We attach the main \`Invoice\` details to our lines, linking them using the common \`InvoiceId\` column. Notice the double brackets \`[[...]]\`: we are choosing to only select the specific columns we actually need (like CustomerId and Date) to keep our master table clean and save memory.
- \`how="left"\`: When joining tables like Genre, Album, or Artist, we use a "left join" (\`how="left"\`). This ensures that even if a song somehow doesn't have an artist recorded in the system, we *still keep the sale record*. If we used a regular join, sales missing an artist would disappear, and our total revenue would be wrong!
- \`.rename(columns={"Name":"Genre"})\`: Several tables have a generic column simply called "Name" (like the Genre Name, Artist Name, and Track Name). We rename them while merging so we don't get confused by having three columns all called "Name".
- \`fact["LineTotal"] = fact["Quantity"] * fact["UnitPrice"]\`: Finally, we calculate exactly how much money each line item made by multiplying the quantity sold by the price per unit, and we save that result in a brand new column.

**3. Data quality checks:**
- Invoices with no matching customer (orphaned records)
- Tracks with no genre (data gap)
- Invoice totals that don't match sum of their line items (financial discrepancy)

**4. Analytics to produce:**
- Top 10 artists by revenue
- Revenue by country
- Monthly revenue trend
- Most popular genre by units sold

**5. Deliverables:**
- \`etl_pipeline.py\` — the complete pipeline
- \`warehouse.db\` — SQLite warehouse with clean data
- \`reconciliation_report.csv\` — every discrepancy found
- \`README.md\` — run instructions + key findings
- GitHub repository with all files

## Expected Output
\`\`\`
========================================
  CHINOOK MEDIA — ETL PIPELINE REPORT
========================================
Extraction:    8 tables loaded
Fact rows:     2,240 invoice lines

DATA QUALITY:
  Orphaned invoices:    0
  Missing genres:       0
  Amount mismatches:    0 ✓

TOP ARTISTS BY REVENUE:
  1. Iron Maiden         $138.60
  2. U2                  $105.93
  3. Metallica            $90.09

PIPELINE STATUS: SUCCESS
========================================
\`\`\``,

      'scenario': `## Scenario: The Audit-Ready Repository

**The situation:** The external auditors want to see your ETL logic. They want to understand how you defined "revenue" and verify that no transactions were arbitrarily excluded.

**What you need to produce:**

1. A \`README.md\` explaining:
   - What each table represents
   - The join logic (which foreign keys connect which tables)
   - Every filter applied and the business reason
   - How to reproduce the results

2. A \`decisions.md\` documenting:
   - Why you used LEFT JOIN on Genre (tracks without genre are included but flagged)
   - How you handle the InvoiceLine.UnitPrice vs Track.UnitPrice discrepancy (use InvoiceLine — it's the billed price)

3. Git commit history showing the transformation logic evolved thoughtfully, not arbitrarily.

The auditor's job is to verify that the numbers are real. Your job is to make that verification as easy as possible. Code-based ETL is far more auditable than Excel because every rule is explicit, timestamped, and version-controlled.`,

      'quizzes': [
        {
          'question': "In the Chinook pipeline, you use `how='left'` when joining Track to Genre. Why?",
          'options': [
            "A. Left joins are faster",
            "B. A left join keeps all Track rows even if they have no matching Genre — ensuring no revenue lines are dropped due to a missing genre reference",
            "C. Right join would produce the same result",
            "D. Inner join is not supported for this operation"
          ],
          'correct': 1,
          'explanation': "An inner join would silently drop any InvoiceLine linked to a Track with no Genre. In financial reporting, dropping rows means underreporting revenue. A left join preserves them with NULL genre, which you can then flag and investigate separately."
        },
        {
          'question': "The Chinook Invoice table has a 'Total' column. You also calculate a total by summing InvoiceLines. What should you do if these don't match?",
          'options': [
            "A. Use the Invoice.Total — it's authoritative",
            "B. Use the sum of InvoiceLine amounts — it's calculated from actual line items",
            "C. Flag the discrepancy in your reconciliation report but don't arbitrarily pick one — escalate to the data owner",
            "D. Delete the invoice"
          ],
          'correct': 2,
          'explanation': "In financial data, discrepancies between header totals and line item sums indicate a data integrity issue. A data engineer doesn't decide which is 'right' — that's a business/audit decision. Your job is to find and document the discrepancy."
        },
        {
          'question': "What is the correct way to load the fact table to a SQLite warehouse so reruns don't create duplicates?",
          'options': [
            "A. if_exists='append' always",
            "B. if_exists='replace' — drop and reload the entire fact table on each run",
            "C. Use INSERT OR REPLACE with InvoiceLineId as the primary key",
            "D. Never reload — pipelines only run once"
          ],
          'correct': 2,
          'explanation': "Simple append creates duplicates if the pipeline reruns. Full replace works but causes a downtime window. Upsert with the primary key (InvoiceLineId) is idempotent — running it 10 times produces the same result as running it once."
        }
      ]
    }
  },

  'Apache Airflow': {
    'What is Airflow & Why it Exists': {
      'lesson': `## What is Apache Airflow?
Apache Airflow is a platform to programmatically author, schedule, and monitor workflows. In simple terms, it's a "Task Manager" for data jobs.

## Why should you care as an MIS student?
Businesses run on schedules. Payroll runs on the 25th, inventory reports run every night at 2 AM, and bank reconciliations run hourly. Airflow is the system that ensures these jobs happen in the right order and notifies you if they fail.

## How it actually works
1. **DAGs**: Directed Acyclic Graphs. This is just a fancy name for a "Workflow."
2. **Tasks**: The individual steps (e.g., "Download File", "Run SQL").
3. **Dependencies**: Defining which task must finish before the next one starts.
4. **Scheduler**: The brain that starts the tasks at the right time.

## Show me the code
\`\`\`python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def my_task():
    print("Running business report...")

with DAG('daily_report', start_date=datetime(2023, 1, 1), schedule='@daily') as dag:
    task1 = PythonOperator(task_id='generate_report', python_callable=my_task)
\`\`\`

**Beginner Breakdown — Your First Airflow DAG**

- \`from airflow import DAG\` — Imports the DAG class from the Airflow library. A DAG object is the container that holds all your tasks and their scheduling rules.
- \`from airflow.operators.python import PythonOperator\` — Imports the operator we'll use to run a Python function as a task.
- \`def my_task():\` — A plain Python function. This is the actual work — whatever you put here is what Airflow will execute when the task runs.
- \`with DAG('daily_report', start_date=datetime(2023, 1, 1), schedule='@daily') as dag:\` — This is Python's "context manager" syntax. Everything indented inside the \`with\` block automatically belongs to this DAG. Breaking down the parameters:
  - \`'daily_report'\` — The unique name (ID) of this DAG in the Airflow UI. Choose something descriptive.
  - \`start_date=datetime(2023, 1, 1)\` — The date Airflow considers this DAG's "start of life." Airflow uses this to determine if there are any historical runs that need to be caught up.
  - \`schedule='@daily'\` — A shorthand for "run once a day at midnight." Airflow supports \`@daily\`, \`@hourly\`, \`@weekly\`, and full cron expressions.
- \`task1 = PythonOperator(task_id='generate_report', python_callable=my_task)\` — Creates a task inside the DAG. \`task_id\` is its unique name within this DAG. \`python_callable=my_task\` tells the operator which function to run (note: we pass the function itself, not the result of calling it — no parentheses).

## Real life: How companies use this
**MTN Nigeria** has millions of call records. They use Airflow to schedule a "Billing Job" every night. 
Task 1: Extract records from masts. 
Task 2: Calculate costs. 
Task 3: Update customer balances. 
If Task 1 fails, Airflow stops Task 2 automatically and sends an alert to the engineers.

## Remember these three things
- Airflow is for *scheduling* and *organizing* tasks.
- A DAG is just a collection of tasks with a specific order.
- It is the industry standard for managing complex data pipelines.`,
      'scenario': `## Scenario: The 2 AM Pipeline Ghost
**The situation:** You are the data engineer for a large insurance firm. Every night at 2 AM, a job runs to update the "Claims Dashboard." For three days in a row, the dashboard has been empty when the CEO logs in at 8 AM.

**What you're seeing:**
When you log into Airflow, you see a DAG with 5 tasks. Task 1 (Get Data) is Green, but Task 2 (Process Data) is Red. Task 3, 4, and 5 didn't even run.

**Your job:**
1. Check the logs for Task 2 to see the error.
2. Figure out why it's failing only at night (is the database undergoing maintenance?).
3. Add a "Retry" rule so Airflow tries again automatically if it fails.

**Code to look at:**
\`\`\`python
# Currently, it only tries once.
task2 = PythonOperator(
    task_id='process_data',
    python_callable=do_math,
    # How do we add retries?
)
\`\`\`

**Beginner Breakdown — Adding Retries to a Task**
- The comment \`# How do we add retries?\` points to where the solution goes. The fix is to add two parameters: \`retries=3\` (try up to 3 times) and \`retry_delay=timedelta(minutes=5)\` (wait 5 minutes between each attempt).
- The complete fixed task would look like: \`PythonOperator(task_id='process_data', python_callable=do_math, retries=3, retry_delay=timedelta(minutes=5))\`
- Why tasks 3, 4, and 5 were skipped: Airflow saw that Task 2 (an upstream dependency) failed. Rather than trying to run tasks that depend on broken data, it marks them all as "upstream_failed" and skips them. This is a safety feature — running Task 3 on bad data from Task 2 would produce wrong results.
- How automated retries save your sleep: instead of being paged at 2 AM for a database that's briefly busy, Airflow quietly retries. If the database clears up within 15 minutes, the pipeline succeeds without you ever waking up.

**Think through these:**
- Why did tasks 3, 4, and 5 stay "skipped" instead of failing?
- How does "Automated Retries" save you from being woken up at 2 AM?
- Why is an Airflow log better than a text message saying "Something broke"?

**What the solution looks like:**
A senior engineer would set \`retries=3\` in the task definition. This tells Airflow: "If the database is busy, wait 5 minutes and try again." This usually solves 90% of random middle-of-the-night failures.`,
      'quizzes': [
        {
          'question': "What does 'DAG' stand for in Apache Airflow?",
          'options': ["A. Data Analysis Group", "B. Directed Acyclic Graph", "C. Daily Automated Gate", "D. Digital Asset Generator"],
          'correct': 1,
          'explanation': "A DAG is a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies."
        }
      ]
    },
    'DAGs - The Big Picture': {
      'lesson': `## What is a DAG?
DAG stands for **Directed Acyclic Graph**.
- **Directed**: There is a clear "Flow" (Task A → Task B).
- **Acyclic**: No "Loops." You can't go back to a previous task (A → B → A is not allowed).
- **Graph**: A collection of nodes (Tasks) and edges (Relationships).

## Why should you care as an MIS student?
Business processes are linear. You don't "pay" a vendor before you "approve" the invoice. A DAG is the digital map of these business rules. It ensures that data moves in one direction and that the logic never gets stuck in an infinite loop.

## How it actually works
1. **Nodes**: Each bubble in the graph is a piece of code (e.g., "Run Python script").
2. **Edges**: The arrows that say "Only run this if the previous one succeeded."
3. **Execution Date**: The specific "bucket" of time the DAG is working on (e.g., "Process data for Jan 1st").

## Show me the code
\`\`\`python
# A simple DAG structure
with DAG('business_flow', ...) as dag:
    extract = PythonOperator(task_id='extract_data', ...)
    transform = PythonOperator(task_id='clean_data', ...)
    load = PythonOperator(task_id='save_data', ...)
    
    # Defining the 'Graph'
    extract >> transform >> load
\`\`\`

**Beginner Breakdown — DAG Structure and Dependencies**

- \`extract = PythonOperator(task_id='extract_data', ...)\` — Each variable (\`extract\`, \`transform\`, \`load\`) is a task object. The variable name is just how we reference it in Python; the \`task_id\` is what appears in the Airflow UI.
- \`extract >> transform >> load\` — The \`>>\` operator defines the flow. Read it as "extract then transform then load." This single line tells Airflow three things: (1) run \`extract\` first, (2) only run \`transform\` if \`extract\` succeeded, (3) only run \`load\` if \`transform\` succeeded. It's the most important line in any DAG.
- Why not just run them in order in regular Python? Because Airflow handles scheduling, retries, parallel execution, logging, and monitoring. Regular Python code would run them once and give you nothing if they fail at 3 AM.

## Real life: How companies use this
**Kuda Bank** uses DAGs for their "Daily Reconciliation." 
Task 1: Pull card transactions from MasterCard. 
Task 2: Pull internal ledger records. 
Task 3: Compare them. 
Task 4: Alert the finance team if they don't match. 
The DAG ensures Task 4 never runs before Task 3 is finished.

## Remember these three things
- A DAG is the "Blueprint" of your data pipeline.
- "Acyclic" means your data pipeline won't get stuck in a circle.
- You can visualize a DAG as a flowchart where every box is a piece of code.`,
      'scenario': `## Scenario: The Infinite Loop Nightmare
**The situation:** You are designing a pipeline that updates customer balances. You accidentally create a rule: "If the balance update fails, go back to the 'Check Balance' step and try again."

**What you're seeing:**
Because you created a "Cycle" (a loop), Airflow refuses to run the code. It shows a "Cycle Detected" error. This is actually a good thing! If it had run, it might have stuck the server in a loop, crashing the system and costing thousands in cloud bills.

**Your job:**
1. Redesign the flow to be "Acyclic."
2. Instead of looping back, add a "Failure Task" that sends an alert.
3. Keep the data moving in one direction.

**Code to look at:**
\`\`\`python
# Bad (Cycle): check >> update >> check
# Good (DAG): check >> update >> [success_alert, failure_alert]
\`\`\`

**Beginner Breakdown — Fixing a Cycle**
- \`# Bad (Cycle): check >> update >> check\` — This creates a loop: \`check\` leads to \`update\`, which leads back to \`check\`. Airflow detects this and refuses to run it — the "Acyclic" rule is enforced at parse time.
- \`check >> update >> [success_alert, failure_alert]\` — The solution uses branching instead of looping. After \`update\`, the flow splits into two possible paths using a list. This is a directed, acyclic flow: it always moves forward, never backward.
- In real Airflow, you'd use a \`BranchPythonOperator\` to dynamically choose between the success and failure paths based on the outcome of \`update\`. The key insight is: "don't go back, go sideways."

**Think through these:**
- Why does Airflow forbid loops in a DAG?
- How does a one-way flow make it easier to "Debug" (find errors)?
- In business, why is it better to "Stop and Alert" than to "Loop and Guess"?

**What the solution looks like:**
By creating a proper DAG, you ensure your pipeline is predictable. If something fails, the DAG stops or takes a specific "Error Path." It never wanders back to the start, ensuring your business data stays consistent and your servers stay healthy.`,
      'quizzes': [
        {
          'question': "What does the 'Acyclic' part of DAG mean?",
          'options': ["A. The pipeline runs very fast", "B. The pipeline has no loops/cycles", "C. The pipeline only runs once a year", "D. The pipeline uses Python"],
          'correct': 1,
          'explanation': "Acyclic means 'no cycles'. This ensures that the workflow always moves forward and never gets caught in an infinite loop."
        }
      ]
    },
    'Operators & Tasks': {
      'lesson': `## What are Operators & Tasks?
- **Operator**: A "Template" or "Blueprint" for a job (e.g., "I am an operator that runs SQL").
- **Task**: A specific instance of an operator (e.g., "Run the 'Update_Revenue.sql' file").

## Why should you care as an MIS student?
Operators allow you to build complex systems by "snapping together" pre-made blocks. You don't have to write the code to "connect to AWS" or "send a Slack message" from scratch every time. You just use the \`S3Operator\` or the \`SlackOperator\`.

## How it actually works
1. **PythonOperator**: Runs any Python code.
2. **BashOperator**: Runs commands in the terminal.
3. **SQLExecuteQueryOperator**: Runs a query in a database.
4. **Sensor**: A special operator that "waits" for something to happen (like a file arriving).

## Show me the code
\`\`\`python
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

# A Task created from the BashOperator
task_bash = BashOperator(
    task_id='print_date',
    bash_command='date'
)

# A Task created from the PythonOperator
def hello(): print("Hello MIS Lab!")
task_python = PythonOperator(
    task_id='greet',
    python_callable=hello
)
\`\`\`

**Beginner Breakdown — Operators and Tasks**

- \`from airflow.operators.bash import BashOperator\` — Airflow's operators live in sub-packages. Each operator type has its own import path. You only import what you use.
- \`BashOperator(task_id='print_date', bash_command='date')\` — \`bash_command='date'\` runs the Linux \`date\` command in the terminal, which prints the current date and time. You can put any shell command or script here: \`bash_command='python my_script.py'\`, \`bash_command='./run_pipeline.sh'\`, etc.
- \`def hello(): print("Hello MIS Lab!")\` — Defined before the task. Note it's a regular Python function — no Airflow-specific code inside it. This separation keeps your business logic independent from Airflow, making it easier to test.
- \`python_callable=hello\` — We pass the function *object* (no parentheses). \`python_callable=hello\` means "here's the function, call it when the task runs." \`python_callable=hello()\` would mean "call it right now and pass the result," which is wrong.

## Real life: How companies use this
**Paystack** might use a \`Sensor\` to wait for a bank's settlement file to appear in a folder. As soon as the file arrives, the \`Sensor\` triggers a \`PythonOperator\` to clean the data, followed by a \`PostgresOperator\` to save it. They don't have to "check" manually; the operators do it for them.

## Remember these three things
- Operators are the "Tools"; Tasks are the "Jobs."
- Airflow has hundreds of pre-built operators for AWS, Google, Slack, and more.
- Using operators makes your code cleaner and less likely to have bugs.`,
      'scenario': `## Scenario: The Wrong Tool for the Job
**The situation:** You want to run a SQL query to delete old records. You are currently using a \`PythonOperator\` to write 20 lines of code that connects to the database, runs the query, and closes the connection.

**What you're seeing:**
The code is long, hard to read, and it failed because you forgot to "close" the connection properly. You are doing manually what a built-in operator does automatically.

**Your job:**
1. Switch to the \`SQLExecuteQueryOperator\`.
2. Simply provide the SQL string and the connection ID.
3. Let Airflow handle the "opening" and "closing" of the database.

**Code to look at:**
\`\`\`python
# Instead of 20 lines of Python...
delete_old_rows = SQLExecuteQueryOperator(
    task_id='cleanup',
    sql="DELETE FROM logs WHERE date < '2023-01-01'",
    conn_id='my_bank_db'
)
\`\`\`

**Beginner Breakdown — Using the Right Operator**
- \`SQLExecuteQueryOperator\` — A pre-built Airflow operator specifically designed to run SQL against a database. It handles connecting, executing, committing, and closing automatically.
- \`sql="DELETE FROM logs WHERE date < '2023-01-01'"\` — The SQL query to run. This deletes all log entries older than January 1st, 2023.
- \`conn_id='my_bank_db'\` — The key parameter. Instead of hardcoding database credentials in your code, Airflow has a "Connections" store (in its UI) where you save connection details once and give them a name. \`conn_id\` references that saved connection by name. This means no passwords in your code, and if the database password changes, you update it in one place in the UI.
- The 20-line Python alternative required manually: importing libraries, building a connection string, creating a cursor, executing SQL, calling commit(), calling cursor.close(), calling conn.close(), and handling exceptions at each step. The operator does all of this for you in 4 lines.

**Think through these:**
- Why is it safer to use an Operator than to write your own database connection code?
- How does using standard operators help other engineers understand your DAG?
- In MIS, why is "Standardization" better than "Custom Code" for common tasks?

**What the solution looks like:**
A smart engineer uses the "Built-in Tools." By using the right operator, you reduce the risk of system crashes, make the pipeline faster to build, and ensure it follows security best practices automatically.`,
      'quizzes': [
        {
          'question': "Which operator would you use if you want to run a simple script written in Python?",
          'options': ["A. BashOperator", "B. PythonOperator", "C. EmailOperator", "D. Sensor"],
          'correct': 1,
          'explanation': "The PythonOperator is specifically designed to execute Python functions as part of a DAG."
        }
      ]
    },
    'Scheduling with Cron': {
      'lesson': `## What is Scheduling?
Scheduling is telling Airflow exactly *when* and *how often* to run your DAG. We use **Cron Expressions**-a universal language for time.

## Why should you care as an MIS student?
Businesses don't want to click "Run" every morning. They want the "Payroll Report" to run at 6 AM every Monday, and the "Inventory Update" to run every 15 minutes. Mastering scheduling allows you to build systems that run themselves 24/7.

## How it actually works
A Cron expression has 5 parts:
- \`* * * * *\` (Minute, Hour, Day of Month, Month, Day of Week).
- \`0 9 * * *\`: Every day at 9:00 AM.
- \`0 0 * * 1\`: Every Monday at Midnight.
- \`*/15 * * * *\`: Every 15 minutes.

## Show me the code
\`\`\`python
with DAG(
    'daily_sales_sync',
    start_date=datetime(2023, 1, 1),
    # Run at 8:00 AM every single day
    schedule='0 8 * * *', 
    catchup=False
) as dag:
    # Tasks go here
\`\`\`

**Beginner Breakdown — Scheduling Parameters**

- \`schedule='0 8 * * *'\` — Breaking down this cron expression: \`0\` = at minute 0, \`8\` = at hour 8, \`*\` = every day of the month, \`*\` = every month, \`*\` = every day of the week. Combined: "every day at 8:00 AM." A good mental trick: read left to right and fill in "at minute X, at hour Y, on day Z, in month W, on weekday V."
- \`catchup=False\` — This is critically important. If today is January 10th and your \`start_date\` is January 1st, Airflow would normally try to "catch up" by running the DAG for every day from January 1st to today — 10 times. \`catchup=False\` tells Airflow: "Only run going forward from now, ignore the past."
- \`*/15\` in a cron expression means "every 15 units." So \`*/15 * * * *\` means "every 15 minutes." The \`/\` is the step operator.

## Real life: How companies use this
**MTN Nigeria** might have a billing DAG scheduled to run at \`0 0 * * *\` (Midnight). This ensures that exactly as the new day begins, they calculate the usage for the previous day and reset any daily data caps. Because it's scheduled, it never forgets, even on public holidays.

## Remember these three things
- The \`schedule\` parameter is the "Alarm Clock" of your DAG.
- \`catchup=False\` is important! It stops Airflow from trying to run "old" dates from the past.
- Cron is a standard skill used in Linux, AWS, and almost every IT system.`,
      'scenario': `## Scenario: The Double Billing Disaster
**The situation:** You scheduled a "Subscription Charge" DAG to run "Every Hour." However, the task takes 90 minutes to finish.

**What you're seeing:**
Because the first run hasn't finished when the next one starts, Airflow starts a *second* run of the same DAG. Some customers are being charged twice!

**Your job:**
1. Check the \`max_active_runs\` setting.
2. Set it to \`1\` so that a new run only starts if the old one is finished.
3. Adjust the schedule to be less frequent (e.g., every 2 hours) to give the code enough time.

**Code to look at:**
\`\`\`python
with DAG(
    'charge_customers',
    schedule='0 * * * *', # Hourly
    max_active_runs=1,    # Prevents overlap!
    ...
)
\`\`\`

**Beginner Breakdown — Preventing Concurrent Runs**
- \`schedule='0 * * * *'\` — Every hour, at minute 0. So: 1:00, 2:00, 3:00, etc.
- \`max_active_runs=1\` — The default value allows multiple runs of the same DAG to be active simultaneously. Setting it to \`1\` creates a queue: if the 1:00 AM run is still going at 2:00 AM, Airflow waits instead of starting a new run. The new run will begin as soon as the previous one finishes.
- The business consequence of NOT having this: a 90-minute billing job running hourly would have two concurrent runs processing the same customers, charging them twice. \`max_active_runs=1\` is a simple, one-line protection against this catastrophic outcome.

**Think through these:**
- Why is "Concurrency Control" (limiting active runs) critical in financial systems?
- What happens if the internet is slow and a task takes 3 hours instead of 1?
- How does the "Interval" between runs affect system stability?

**What the solution looks like:**
Scheduling isn't just about "When to start"; it's about "How to manage." By limiting active runs, you protect the business from processing the same data twice, ensuring that customers are only ever charged once, regardless of how slow the network is.`,
      'quizzes': [
        {
          'question': "What does the Cron expression '0 0 * * *' mean?",
          'options': ["A. Every minute", "B. Every hour", "C. Every day at midnight", "D. Every Sunday"],
          'correct': 2,
          'explanation': "The first zero is the minute (0) and the second is the hour (0), which corresponds to 12:00 AM (Midnight) every day."
        }
      ]
    },
    'Task Dependencies': {
      'lesson': `## What are Task Dependencies?
Dependencies define the "Order of Operations." They tell Airflow: "Don't run Task B until Task A has successfully finished."

## Why should you care as an MIS student?
Data has a logical sequence. You can't "Analyze" data that hasn't been "Cleaned," and you can't "Clean" data that hasn't been "Extracted." Dependencies prevent the system from trying to do math on empty files.

## How it actually works
1. **Bitshift Operators**: \`>>\` (Next) and \`<<\` (Previous).
2. **Upstream**: The task that must finish first.
3. **Downstream**: The task that waits.
4. **Branching**: Using logic to say "If A succeeds, do B. If A fails, do C."

## Show me the code
\`\`\`python
# Simple Chain
extract >> transform >> load

# Parallel Tasks (Processing 2 files at once)
extract_lagos >> transform_lagos
extract_abuja >> transform_abuja

# Merging them at the end
[transform_lagos, transform_abuja] >> combine_report
\`\`\`

**Beginner Breakdown — Defining Dependencies**

- \`extract >> transform >> load\` — Python's \`>>\` normally means "bitshift right" for numbers, but Airflow overrides it for task objects to mean "set as downstream." This is called "operator overloading" — same symbol, different meaning based on context.
- \`extract_lagos >> transform_lagos\` and \`extract_abuja >> transform_abuja\` on separate lines — These are independent chains. Airflow runs them in parallel simultaneously because there's no dependency between the Lagos and Abuja branches. This is how you process multiple regions at the same time.
- \`[transform_lagos, transform_abuja] >> combine_report\` — A list on the left side of \`>>\` means "combine_report depends on ALL of these." \`combine_report\` will only start once BOTH \`transform_lagos\` AND \`transform_abuja\` have succeeded. This is a "fan-in" pattern.

## Real life: How companies use this
**Jumia** has a "New Order" DAG. 
Task 1: Check if item is in stock. 
Task 2: Charge the customer's card. 
Task 3: Send order to the warehouse. 
Task 3 has a "Dependency" on Task 2. If the card charge fails, Task 3 is "Skipped." This prevents them from shipping items that haven't been paid for.

## Remember these three things
- Dependencies turn a "List of Tasks" into a "Workflow."
- \`A >> B\` means A is Upstream of B.
- If an upstream task fails, the downstream tasks are automatically "Skipped."`,
      'scenario': `## Scenario: The Empty Dashboard
**The situation:** You have a DAG that updates the company dashboard. You forgot to set a dependency between "Download Data" and "Update Dashboard."

**What you're seeing:**
Because there was no dependency, both tasks started at the exact same time. The "Update" task finished first, but since the "Download" wasn't done yet, it updated the dashboard with *yesterday's* data. The CEO is seeing 0 sales for today.

**Your job:**
1. Use the \`>>\` operator to link the tasks.
2. Ensure the "Update" task only starts if "Download" is successful.

**Code to look at:**
\`\`\`python
# Wrong: 
# download_task
# update_task

# Right:
download_task >> update_task
\`\`\`

**Beginner Breakdown — Why Undeclared Tasks Run in Parallel**
- When two tasks in a DAG have no declared relationship, Airflow assumes they're independent and runs them simultaneously. This maximizes efficiency — but it's catastrophic when one task actually depends on the output of the other.
- \`download_task >> update_task\` — This single line adds the dependency. Now Airflow's scheduler knows: "I must wait for \`download_task\` to show a green (success) status before I'm even allowed to put \`update_task\` in the queue."
- The "Wrong" code (just declaring the tasks without linking them) isn't a syntax error — it's a logic error. Airflow can't read your mind about which tasks need to wait for which.

**Think through these:**
- Why did the tasks run at the same time when there was no dependency?
- How does "Downstream Skipping" prevent wrong reports?
- In MIS, why is "Correct Sequence" more important than "Speed"?

**What the solution looks like:**
By setting a dependency, you've added "Safety" to your pipeline. Airflow now acts like a disciplined manager, ensuring that every step of the process is ready before moving to the next. The dashboard will now only update when the new data is actually ready.`,
      'quizzes': [
        {
          'question': "If Task A >> Task B, and Task A fails, what happens to Task B?",
          'options': ["A. Task B runs anyway", "B. Task B waits 10 minutes and then runs", "C. Task B is 'Upstream Failed' or 'Skipped'", "D. Task B deletes itself"],
          'correct': 2,
          'explanation': "Airflow will not run a downstream task if its upstream dependency has failed (unless you explicitly tell it to with a special 'Trigger Rule')."
        }
      ]
    },
    'XCom: Passing Data Between Tasks': {
      'lesson': `## What is XCom?
XCom stands for "Cross-Communication." It is a way for one task in Airflow to "send" a small piece of information (like a filename or a row count) to another task.

## Why should you care as an MIS student?
Tasks in Airflow are "Isolated"-they don't share variables. If Task 1 calculates the "Total Revenue," Task 2 doesn't know what that number is unless you use XCom to "Push" it into a shared space so Task 2 can "Pull" it.

## How it actually works
1. **Push**: Task A saves a value to the Airflow database.
2. **Pull**: Task B retrieves that value.
3. **Key**: The name of the variable (like 'sales_total').
4. **Limit**: XCom is for small metadata, not for moving giant datasets (use a file or a database for that!).

## Show me the code
\`\`\`python
def push_count(**kwargs):
    # This is Task 1
    kwargs['ti'].xcom_push(key='row_count', value=500)

def pull_count(**kwargs):
    # This is Task 2
    count = kwargs['ti'].xcom_pull(key='row_count', task_ids='push_task')
    print(f"I received count: {count}")

# Task A >> Task B (Task B can now pull from A)
\`\`\`

**Beginner Breakdown — XCom Push and Pull**

- \`**kwargs\` — The double asterisk means "accept any keyword arguments." Airflow automatically passes useful context (like the task instance, execution date, etc.) to your Python functions as keyword arguments. If you don't include \`**kwargs\`, your function won't receive this context.
- \`kwargs['ti']\` — \`ti\` stands for "Task Instance" — an object representing this specific run of this specific task. It has methods for interacting with Airflow's internal state, including XCom.
- \`.xcom_push(key='row_count', value=500)\` — Saves the number \`500\` to Airflow's database under the key \`'row_count'\`. Think of it like writing a Post-it note labeled "row_count: 500" and sticking it on a shared board.
- \`.xcom_pull(key='row_count', task_ids='push_task')\` — Reads the value from the shared board. \`task_ids='push_task'\` specifies which task wrote the value we want (since multiple tasks could push values with the same key name).

## Real life: How companies use this
A logistics firm might have Task 1 extract a "Batch ID" from a supplier's website. Task 2 needs that *specific* ID to download the correct file. They use XCom to pass the ID string from one step to the next.

## Remember these three things
- XCom is like a "Post-it Note" that tasks leave for each other.
- It is only for small values like IDs, counts, or dates.
- Without XCom, your tasks would be "Blind" to what the previous tasks did.`,
      'scenario': `## Scenario: The Missing Filename
**The situation:** Your extraction task downloads a file and gives it a unique name with a timestamp, like \`sales_2023_12_01_1430.csv\`. Your next task needs to clean this file, but it doesn't know what the filename is!

**What you're seeing:**
The cleaning task is looking for \`sales.csv\` and failing because the file is actually called \`sales_2023_...csv\`.

**Your job:**
1. Have the first task "Push" the final filename to XCom.
2. Have the second task "Pull" that filename before it starts cleaning.

**Code to look at:**
\`\`\`python
# Task 1:
ti.xcom_push(key='file_to_process', value=generated_name)

# Task 2:
file_path = ti.xcom_pull(key='file_to_process', task_ids='download_step')
pd.read_csv(file_path)
\`\`\`

**Beginner Breakdown — Dynamic Filenames with XCom**
- \`generated_name\` — This is a variable in Task 1 that holds the dynamically generated filename (e.g., \`"sales_2023_12_01_1430.csv"\`). The exact string is unknown until the task runs, which is why we can't hardcode it in Task 2.
- \`ti.xcom_push(key='file_to_process', value=generated_name)\` — At the end of the download task, we save the generated filename to XCom so future tasks can find it.
- \`file_path = ti.xcom_pull(key='file_to_process', task_ids='download_step')\` — At the start of the cleaning task, we retrieve the filename. Now \`file_path\` holds the exact filename the download task created.
- \`pd.read_csv(file_path)\` — We use the retrieved filename to open the correct file. If the XCom value is \`"sales_2023_12_01_1430.csv"\`, this becomes \`pd.read_csv("sales_2023_12_01_1430.csv")\`.

**Think through these:**
- Why is it better to use XCom than to hard-code a filename?
- What happens if the Push task fails? Can the Pull task still find the value?
- In MIS, how does "Dynamic Data" (like changing filenames) make systems more flexible?

**What the solution looks like:**
By using XCom, you've made your pipeline "Dynamic." It no longer cares what the filename is; it simply asks the previous step: "What should I work on next?" This makes the system robust and able to handle thousands of unique files without manual help.`,
      'quizzes': [
        {
          'question': "What is XCom primarily used for in Airflow?",
          'options': ["A. Moving 1GB of data between tasks", "B. Passing small pieces of metadata (like IDs or counts) between tasks", "C. Connecting to the internet", "D. Changing the color of the Airflow UI"],
          'correct': 1,
          'explanation': "XCom is designed for 'Cross-Communication' of small values. Giant datasets should be stored in a warehouse/S3 and only the 'path' should be passed via XCom."
        }
      ]
    },
    'Monitoring & Alerts': {
      'lesson': `## What are Monitoring & Alerts?
Monitoring is watching your DAGs to see if they are running correctly. Alerts are automatic notifications (Email, Slack, SMS) that trigger as soon as a task fails.

## Why should you care as an MIS student?
In a professional environment, you can't sit and watch the Airflow screen 24/7. You need to know if the "Morning Billing Job" failed while you were in a meeting. Good alerting turns a "Silent Disaster" into an "Actionable Task."

## How it actually works
1. **Airflow UI**: The "Tree View" and "Gantt Chart" show you exactly where time is being spent.
2. **On_Failure_Callback**: A function that runs only if a task fails.
3. **SLA (Service Level Agreement)**: An alert that triggers if a task takes longer than it's supposed to.

## Show me the code
\`\`\`python
from airflow.providers.slack.operators.slack import SlackAPIPostOperator

def notify_failure(context):
    # This runs only when something breaks
    alert = SlackAPIPostOperator(
        task_id='slack_alert',
        text=f"CRITICAL: DAG {context['dag'].dag_id} failed!",
        channel='#data-alerts'
    )
    return alert.execute(context=context)

with DAG(..., on_failure_callback=notify_failure) as dag:
    # All tasks in this DAG will now send a Slack alert if they fail
\`\`\`

**Beginner Breakdown — Failure Callbacks**

- \`def notify_failure(context):\` — Airflow calls this function with a \`context\` dictionary when any task in the DAG fails. The context contains everything: the DAG object, the task instance, the execution date, the exception that caused the failure, and more.
- \`context['dag'].dag_id\` — Drills into the context to get the DAG's ID string. For our alert message, this means the Slack message will show exactly which DAG failed by name.
- \`SlackAPIPostOperator(...).execute(context=context)\` — We instantiate the Slack operator and immediately call \`.execute()\` to trigger it. This is an unusual pattern (we're not adding it to the DAG graph — just calling it directly as a function) but it's the standard way to use operators inside callbacks.
- \`on_failure_callback=notify_failure\` — Registers our callback with the DAG. Note: this is at the DAG level, so any task within this DAG that fails will trigger the callback. You can also set \`on_failure_callback\` at the individual task level for more granular control.

## Real life: How companies use this
**MTN** has thousands of DAGs. They have a "Data War Room" with screens showing the Airflow UI. If a circle turns Red (Failure), an alert goes to the on-call engineer's phone immediately. This allows them to fix billing issues before customers even notice a problem.

## Remember these three things
- The Airflow UI is your "Control Center."
- Alerts should be "Noisy" for critical jobs and "Quiet" for minor ones.
- Monitoring helps you find "Bottlenecks" (tasks that are slow and need optimization).`,
      'scenario': `## Scenario: The Weekend Silence
**The situation:** On Friday night, a database password was changed. Your ETL pipeline failed every hour for the entire weekend. You only found out on Monday morning when the CEO asked for a report.

**What you're seeing:**
A screen full of Red circles in Airflow. 48 failed runs. Because there were no alerts, you enjoyed your weekend while the company's data stayed "dead."

**Your job:**
1. Configure an \`email_on_failure\` rule in the \`default_args\`.
2. Link it to your team's support email.
3. Add a "Retry" limit of 3 so it doesn't alert you for tiny internet hiccups.

**Code to look at:**
\`\`\`python
default_args = {
    'owner': 'mis_team',
    'email': ['support@bank.com'],
    'email_on_failure': True,
    'retries': 3,
}
\`\`\`

**Beginner Breakdown — Default Args**
- \`default_args\` — A Python dictionary that you pass to the DAG. Every task in the DAG automatically inherits these settings, so you don't have to set \`retries=3\` on every individual task.
- \`'owner': 'mis_team'\` — Labels the DAG in the Airflow UI. Useful when multiple teams share one Airflow instance — you can filter by owner to see only your team's DAGs.
- \`'email': ['support@bank.com']\` — A list of email addresses to notify. It's a list so you can add multiple recipients: \`['alice@bank.com', 'bob@bank.com']\`.
- \`'email_on_failure': True\` — Enables the automated email. When a task exhausts all its retries and still fails, Airflow sends an email to every address in the \`email\` list.
- \`'retries': 3\` — Before an alert email is sent, Airflow will try the task 3 more times. Only if all retries fail will it send the email. This prevents "alert fatigue" — being woken up at 2 AM for a 5-second network glitch that fixes itself.

**Think through these:**
- Why is an email alert better than just "checking the UI" every morning?
- How does the "Retry" setting reduce "Alert Fatigue" (too many annoying emails)?
- In MIS, what is the cost of "System Downtime" (not knowing a system is down)?

**What the solution looks like:**
By setting up automatic alerts, you move from "Reactive" (fixing things after someone complains) to "Proactive" (fixing things as soon as they break). This builds immense trust with the business, as they know you are always "On Top" of the data.`,
      'quizzes': [
        {
          'question': "What is the benefit of setting 'retries' before an alert is sent?",
          'options': ["A. It makes the code run faster", "B. It prevents alerts for temporary issues (like a 1-second network glitch)", "C. It deletes the error logs", "D. It pays the cloud bill"],
          'correct': 1,
          'explanation': "Retries allow the system to try again automatically. Often, a 'failure' is just a temporary glitch that fixes itself on the second try."
        }
      ]
    },
    'Real Pipeline Examples': {
      'lesson': `## Real Pipeline Examples
Let's look at how a complete Airflow DAG looks in the real world. A typical "Retail Daily Sync" pipeline combines everything we've learned: Extraction, Transformation, Loading, and Alerting.

## Why should you care as an MIS student?
Seeing the "Big Picture" helps you understand why we learn individual tools like Python, SQL, and Cron. A pipeline is the "Finished Product" of a Data Engineer.

## The "Standard" Pipeline Structure:
1. **T1: Check_Source** (Sensor - Is the file there?)
2. **T2: Extract** (Python - Pull to staging)
3. **T3: Transform** (dbt/SQL - Clean it up)
4. **T4: Load_Warehouse** (SQL - Move to production)
5. **T5: Notify_Success** (Email - Tell the manager it's ready)

## Show me the code
\`\`\`python
# A complete (simplified) DAG
with DAG('daily_shop_sync', schedule='@daily', ...) as dag:
    
    wait_for_file = FileSensor(task_id='wait', filepath='/data/sales.csv')
    
    clean_data = PythonOperator(task_id='clean', python_callable=my_cleaning_func)
    
    update_db = PostgresOperator(task_id='load', sql="INSERT INTO...")
    
    send_done_email = EmailOperator(task_id='done', to='manager@shop.com', ...)

    # Dependency Chain
    wait_for_file >> clean_data >> update_db >> send_done_email
\`\`\`

**Beginner Breakdown — A Complete Production DAG**

- \`FileSensor(task_id='wait', filepath='/data/sales.csv')\` — A Sensor is a special type of operator that keeps "poking" (checking a condition) on a schedule until it's True. This one checks if a file exists at the given path. It will keep checking every minute (configurable) until the file appears, then it succeeds and the downstream tasks run.
- \`PostgresOperator(task_id='load', sql="INSERT INTO...")\` — A database-specific operator for PostgreSQL. It uses a stored Airflow connection (no credentials in code) to run the SQL. The \`"INSERT INTO..."\` is abbreviated here — in real usage you'd provide the full SQL or a path to a \`.sql\` file.
- \`EmailOperator(task_id='done', to='manager@shop.com', ...)\` — Sends an email when the load is complete. This is the "success notification" — different from failure alerts, this proactively tells stakeholders the data is ready.
- \`wait_for_file >> clean_data >> update_db >> send_done_email\` — The whole pipeline in one line. Read it as a story: "Wait for the file, then clean it, then load it to the database, then tell the manager it's done." This is the beauty of Airflow — the entire pipeline logic is readable as plain English.

## Real life: How companies use this
**Aviation/Airlines**: Every night, an Airflow DAG pulls the "Flight Logs" from every plane. 
- **Task 1**: Get logs. 
- **Task 2**: Find any "Engine Warnings." 
- **Task 3**: If a warning is found, create a "Maintenance Ticket" in another system automatically. 
- **Task 4**: Alert the head of engineering. 
This pipeline literally saves lives by ensuring no warning is missed.

## Remember these three things
- Pipelines connect different systems together.
- Every task should do **one thing** and do it well.
- A good pipeline is invisible-it just works.`,
      'scenario': `## Scenario: The "Jollof Express" Logistics Flow
**The situation:** You are the lead analyst for a food delivery startup. You need to build a pipeline that calculates "Driver Bonuses" every Sunday at 11:59 PM.

**What you're seeing:**
Data is in two places: "Completed Orders" are in a SQL database, but "Driver Ratings" are in a CSV file uploaded by the managers.

**Your job:**
1. Design a DAG that waits for the manager's CSV file.
2. Extracts the SQL orders for that week.
3. Joins them together (using Python/Pandas) to find which drivers had high ratings AND high orders.
4. Loads the bonus list into the "Payout" table.
5. Sends an alert if the CSV file is missing by 11:00 PM.

**Code to look at:**
\`\`\`python
# The Logic:
# sensor >> [extract_sql, read_csv] >> calculate_bonuses >> load_payouts
\`\`\`

**Beginner Breakdown — Multi-Source Pipeline Design**
- \`sensor >> [extract_sql, read_csv]\` — After the sensor confirms the CSV has arrived, TWO tasks start in parallel: one extracts from the SQL database and another reads the CSV file. Using a list on the right side of \`>>\` means "both of these start as soon as the sensor succeeds."
- \`[extract_sql, read_csv] >> calculate_bonuses\` — The \`calculate_bonuses\` task waits for BOTH sources to be ready before it starts. This is a "fan-out then fan-in" pattern: one → two parallel → one.
- \`calculate_bonuses >> load_payouts\` — The bonus calculation results are then loaded to the payout table. By this point, all data is verified and ready.
- The architecture principle: each task does one thing. The sensor waits, extractors pull data, the calculator joins and applies logic, the loader saves. Each step is independently testable and debuggable.

**Think through these:**
- Why is it important to "Join" data from two different sources?
- What happens if a driver has high orders but a very low rating? (Business logic)
- How does this automated system prevent "Favoritism" in the bonus process?

**What the solution looks like:**
By building this pipeline, you've created a "Fair and Transparent" business process. The computer doesn't have favorites; it simply follows your DAG. This improves driver morale and ensures the company's money is spent on the best performers, all while requiring zero manual work from you.`,
      'quizzes': [
        {
          'question': "What is the best way to handle a pipeline that requires data from BOTH a SQL database and a CSV file?",
          'options': ["A. It's impossible", "B. Create two separate tasks to extract each, then a third task to merge them", "C. Copy-paste the CSV into the SQL database manually", "D. Use Excel"],
          'correct': 1,
          'explanation': "Airflow excels at this. You run parallel extraction tasks and then a third task (like a PythonOperator) to combine the data and perform logic."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Autonomous Data Engineer
In this milestone, you are going to orchestrate a multi-step business process using Apache Airflow. You will move from "writing scripts" to "building an autonomous system" that monitors itself.

## The Broad Business Problem
Your Brazilian e-commerce company, **"Olist,"** is suffering from massive seller turnover. Sellers are quitting because their performance reports and payments are calculated late due to manual data processing delays. The company's operations are fundamentally broken because there is no orchestration across your 8 different databases (Customers, Payments, Reviews, etc.). You must build an autonomous Airflow system that automatically detects when new Olist data arrives, orchestrates the joins, and ensures the daily report is ready before 6:00 AM.

## Your Project Tasks:
0. **The Data**: Download the [Brazilian E-Commerce Relational Dataset by Olist (Kaggle)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) which contains 8 linked tables (Orders, Customers, Payments, etc).
1. **The DAG**: Create a Python file representing your Airflow DAG.
2. **The Sensor**: Add a task that "waits" for the daily delivery CSV to arrive.
3. **The Transformation**: Add a task that calculates the KPIs for the CEO.
4. **The Dashboard**: Add a task that prints a "Markdown Dashboard" into a log file.
5. **The GitHub Submission**: Upload your \`dags/\` folder and a screenshot of your "Executive Dashboard" (as a markdown file) to GitHub.

## Show me the code (DAG Template)
\`\`\`python
# How your final project structure should look:
with DAG('ceo_morning_report', start_date=datetime(2023,1,1), schedule='0 6 * * *') as dag:
    
    wait_for_data = FileSensor(task_id='wait_for_csv', filepath='/data/today.csv')
    
    generate_metrics = PythonOperator(task_id='calc_kpis', python_callable=analyze_data)
    
    # This is the "Dashboard" step
    log_to_dashboard = BashOperator(task_id='update_gh', bash_command='cat report.txt >> github_readme.md')

    wait_for_data >> generate_metrics >> log_to_dashboard
\`\`\`

**Beginner Breakdown — Milestone DAG Template**

- \`schedule='0 6 * * *'\` — Run at 6:00 AM every day (minute 0, hour 6, every day). The business requirement says "ready before 6 AM" — so the pipeline runs at 6 AM to prepare the report for when executives log in.
- \`FileSensor(task_id='wait_for_csv', filepath='/data/today.csv')\` — The pipeline's first job is to wait. It keeps checking \`/data/today.csv\` until the file appears, meaning the previous night's data has been delivered. Only then does it proceed.
- \`python_callable=analyze_data\` — The \`analyze_data\` function (which you write separately) would load the Olist datasets, join the 8 tables, calculate KPIs (revenue, orders, satisfaction scores), and save results.
- \`bash_command='cat report.txt >> github_readme.md'\` — A shell command that appends (\`>>\`) the contents of \`report.txt\` to \`github_readme.md\`. This creates an automatically updated dashboard on GitHub. The \`cat\` command reads a file and outputs its contents. \`>>\` redirects that output to append to another file (unlike \`>\` which would overwrite it).
- \`wait_for_data >> generate_metrics >> log_to_dashboard\` — The three-stage pipeline: wait → calculate → publish.

## Presenting to Executives
Say: "This system is now autonomous. It checks for data, processes it, and updates our shared GitHub dashboard while we sleep. It's the highest level of data maturity for a modern logistics business."`,
      'scenario': `## Scenario: The "3 AM Alert"
**The situation:** It's 3 AM. The "File Sensor" task in your DAG has been spinning for 2 hours because the branch office forgot to upload the CSV.

**Your job:**
1. Configure an "SLA Miss" alert in your Airflow DAG.
2. Write a function that sends a "Critical Warning" to the branch manager automatically.
3. Show the CEO how Airflow "Caught the error" before it became a crisis.

**Think through these:**
- Why is it better for the system to "Wait and Alert" than to just "Fail and Crash"?
- How does "Automated Monitoring" reduce the stress of an MIS manager?

**Beginner Breakdown — SLA Miss Alerts**
- An SLA (Service Level Agreement) Miss in Airflow triggers when a task takes longer than a defined time to complete. You set it with \`sla=timedelta(hours=2)\` on the sensor task — meaning "if this sensor is still waiting after 2 hours, fire an alert."
- "Wait and Alert" vs "Fail and Crash": A sensor that just fails gives you a red circle in the UI but no context. A sensor with an SLA miss callback sends a targeted message to the branch manager saying "your file is missing — please upload it." The problem gets solved proactively by the right person.
- The cascade of automated monitoring: sensor waits → SLA fires after 2 hours → branch manager gets alerted → uploads file → sensor detects file → pipeline proceeds. No manual intervention from the data engineer required.`,
      'quizzes': [
        {
          'question': "What is the role of a 'Dependency' ( >> ) in an Airflow Milestone project?",
          'options': ["A. It makes the code harder to read", "B. It ensures that the 'Report Generation' task doesn't start until the 'Data Cleaning' task is finished", "C. It is used to add numbers together", "D. It is for deleting old files"],
          'correct': 1,
          'explanation': "Dependencies are the 'Roadmap'. They tell Airflow the correct order to run your business tasks so that you don't try to report on data that hasn't been cleaned yet."
        }
      ]
    }
  }
};

module.exports = courseContent;
