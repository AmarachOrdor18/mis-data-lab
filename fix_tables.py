import sys

def fix_tables():
    with open('content.js', 'r', encoding='utf-8') as f:
        content = f.read()

    table1 = """| Failure Type | Example | Prevention |
|---|---|---|
| Source unavailable | API is down at 2 AM | Retry logic + fallback to cache |
| Schema change | Column renamed upstream | Schema validation before transform |
| Data volume spike | 10x rows on sale day | Chunked processing, memory limits |
| Duplicate load | Pipeline ran twice | Upsert logic or idempotency keys |
| Silent data corruption | Wrong dtype after join | Row count + sum checks post-load |"""

    table1_replacement = """**Why ETL fails in production:**
- **Source unavailable** (e.g., API is down at 2 AM) — Prevent with Retry logic + fallback to cache
- **Schema change** (e.g., Column renamed upstream) — Prevent with Schema validation before transform
- **Data volume spike** (e.g., 10x rows on sale day) — Prevent with Chunked processing, memory limits
- **Duplicate load** (e.g., Pipeline ran twice) — Prevent with Upsert logic or idempotency keys
- **Silent data corruption** (e.g., Wrong dtype after join) — Prevent with Row count + sum checks post-load"""

    table2 = """| Strategy | Use When | Risk |
|---|---|---|
| Append | Source only produces new records (event logs) | Duplicates if pipeline reruns |
| Full Replace | Small reference tables (product catalog) | Downtime between delete and insert |
| Upsert | Records can be updated (customer profiles, order status) | Slower than append |
| Incremental Table | Partitioned warehouse tables (daily partitions) | Complex to implement |"""

    table2_replacement = """**Strategies:**
- **Append**: Use when source only produces new records (event logs). Risk: Duplicates if pipeline reruns
- **Full Replace**: Use when small reference tables (product catalog). Risk: Downtime between delete and insert
- **Upsert**: Use when records can be updated (customer profiles, order status). Risk: Slower than append
- **Incremental Table**: Use when partitioned warehouse tables (daily partitions). Risk: Complex to implement"""

    table3 = """| Factor | ETL | ELT |
|---|---|---|
| If transform logic changes | Re-extract from source | Re-run SQL on existing raw data |
| Storage cost | Lower (only clean data stored) | Higher (raw + clean both stored) |
| New question from business | May need re-extraction | Can answer from existing raw layer |
| Compute for transforms | Python server you maintain | Warehouse handles it (Snowflake, BigQuery) |
| Data history | Lost if you didn't plan for it | Always available |"""

    table3_replacement = """**ETL vs ELT:**
- **If transform logic changes**: ETL requires re-extract from source. ELT just re-runs SQL on existing raw data.
- **Storage cost**: ETL is lower (only clean data stored). ELT is higher (raw + clean both stored).
- **New question from business**: ETL may need re-extraction. ELT can answer from existing raw layer.
- **Compute for transforms**: ETL uses Python server you maintain. ELT uses Warehouse handles it (Snowflake, BigQuery).
- **Data history**: ETL lost if you didn't plan for it. ELT always available."""

    c1 = content.count('| Failure Type | Example | Prevention |')
    content = content.replace(table1, table1_replacement)
    
    c2 = content.count('| Strategy | Use When | Risk |')
    content = content.replace(table2, table2_replacement)
    
    c3 = content.count('| Factor | ETL | ELT |')
    content = content.replace(table3, table3_replacement)

    with open('content.js', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Table replacements done. Found tables: {c1}, {c2}, {c3}")

if __name__ == '__main__':
    fix_tables()
