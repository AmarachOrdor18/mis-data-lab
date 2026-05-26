// MIS Data Analytics Engineering Lab - Static Content Database
const STATIC_CONTENT = {
  'Python': {
    'Variables & Data Types': {
      'lesson': `## Variables & Data Types

Every program you will ever write — whether it's a banking script, an ETL pipeline, or a machine learning model — starts with this: storing a piece of data and giving it a name. That's a variable. And every piece of data has a type, which determines what you can do with it.

### What's actually happening in memory

When you write \`balance = 25000\`, Python doesn't just "store the number." It creates an integer object in memory and binds the name \`balance\` to it. If you later write \`balance = balance + 5000\`, Python creates a *new* integer object (30000) and rebinds the name. The old object gets garbage collected. This is why Python variables behave differently from variables in lower-level languages — you're working with names and objects, not memory slots.

### The core types you'll use daily

\`\`\`python
# Strings — any sequence of characters
customer_name = "Adaeze Okonkwo"
account_id = "NG-2024-00341"    # Even though it "looks" like a number, it's text

# Integers — whole numbers, no decimal point
transaction_count = 47
branch_code = 3

# Floats — numbers with decimals
account_balance = 125_450.75   # Python allows underscores for readability
vat_rate = 0.075

# Booleans — True or False, nothing else
is_premium = True
is_suspended = False

# None — the absence of a value (not zero, not empty string, literally nothing)
last_login = None
\`\`\`

### Type conversion: when and how

Python won't automatically mix types in math operations. If you try to add a number to a string, it raises a \`TypeError\`. You have to convert explicitly.

\`\`\`python
# This is what you get from a CSV or API — numbers stored as strings
raw_amount = "50000"
raw_vat = "3750.00"

# Wrong: "50000" + "3750.00" = "500003750.00" (string concatenation!)
# Right: convert first
amount = int(raw_amount)          # 50000
vat = float(raw_vat)              # 3750.0
total = amount + vat              # 53750.0

# Going the other direction
formatted = f"Total: ₦{total:,.2f}"   # "Total: ₦53,750.00"
print(formatted)
\`\`\`

### f-strings: the professional way to format output

\`\`\`python
name = "Emeka"
balance = 1_234_567.89
tier = "Gold"

# Basic
print(f"Account holder: {name}")

# Number formatting
print(f"Balance: ₦{balance:,.2f}")      # ₦1,234,567.89
print(f"Balance: ₦{balance:>15,.2f}")   # right-aligned in 15-char field

# Expressions inside f-strings
print(f"After 10% fee: ₦{balance * 0.9:,.2f}")
\`\`\`

### Checking types at runtime

\`\`\`python
value = "₦50,000"

print(type(value))          # <class 'str'>
print(isinstance(value, str))   # True
print(isinstance(value, float)) # False

# Checking before you operate
if isinstance(value, str):
    # clean it before converting
    cleaned = float(value.replace("₦", "").replace(",", ""))
    print(cleaned)   # 50000.0
\`\`\`

### Where this breaks in real data work

The most common real-world bug in data engineering is a number stored as a string. It loads fine, looks fine, and then silently produces wrong results — like string concatenation instead of addition.

\`\`\`python
# Looks correct but wrong
sales = ["5000", "12000", "8000"]
total = sum(sales)        # TypeError: unsupported operand type(s)

# Or worse — this doesn't crash but gives wrong output
a = "100"
b = "200"
print(a + b)              # "100200" — not 300

# The fix
sales = [float(s) for s in sales]
total = sum(sales)        # 25000.0
\`\`\`

### None vs zero vs empty string

These three are different things. Confusing them causes silent bugs in financial calculations.

\`\`\`python
balance_a = 0       # The customer exists and has zero balance
balance_b = None    # We don't know the balance — data is missing
balance_c = ""      # Empty string — wrong type for a financial field

# Checking for None
if balance_b is None:
    print("Missing data — cannot calculate")
elif balance_b == 0:
    print("Account exists but is empty")
\`\`\`

### Type annotations (how production code looks)

In professional codebases, functions declare what types they expect. You won't be forced to do this, but you will see it constantly.

\`\`\`python
def calculate_vat(amount: float, rate: float = 0.075) -> float:
    return amount * rate

def format_naira(value: float) -> str:
    return f"₦{value:,.2f}"

# Calling it
tax = calculate_vat(50000)
print(format_naira(tax))    # ₦3,750.00
\`\`\``,

      'scenario': `## Scenario: The Corrupted Payroll Export

**Context:** You're the data analyst at a mid-size fintech. Every Friday, Payroll exports a CSV from their HR system. Your job is to read that file, calculate the total payout for the finance director, and flag any anomalies.

This week, the script throws a \`TypeError\` before it even gets to the calculations. The error message is:

\`\`\`
TypeError: unsupported operand type(s) for +: 'int' and 'str'
\`\`\`

**The raw data looks like this:**

\`\`\`
employee_id,name,base_salary,bonus
E001,Chidi Okafor,"₦180,000.00","₦25,000"
E002,Ngozi Adeyemi,"₦220,000","₦0"
E003,Fatima Bello,175000,None
\`\`\`

**What you're dealing with:**
- Row 1 and 2: currency symbol embedded in the number field
- Row 2: "₦0" — a string, not a zero
- Row 3: salary is a clean number but bonus is the string "None" not Python's \`None\`
- The mix of formats is causing your \`sum()\` to fail

**Your job:**

1. Write a cleaning function that takes any salary string and returns a clean float:
\`\`\`python
def clean_currency(value) -> float:
    if value is None or str(value).strip() == "None":
        return 0.0
    cleaned = str(value).replace("₦", "").replace(",", "").strip()
    return float(cleaned)
\`\`\`

2. Apply it to both columns and compute:
   - Total base salary payout
   - Total bonus payout
   - Combined total with 7.5% employer pension contribution

3. Flag any employee where salary is below ₦150,000 (potential data entry error).

**Think about this:** The root cause is that the HR system formats display values for humans, not machines. In a well-designed system, the database stores a raw float (175000.0), and the UI adds the ₦ symbol. Your cleaning function is compensating for a system design flaw — which you'll encounter constantly in real data work.`,

      'quizzes': [
        {
          'question': "What does Python actually create when you write `x = 42`?",
          'options': [
            "A. A memory slot named x containing the bits for 42",
            "B. An integer object in memory, with the name 'x' bound to that object",
            "C. A string 'x' with the value '42'",
            "D. A reference to the number 42 stored in a global registry"
          ],
          'correct': 1,
          'explanation': "Python uses a name-binding model. The integer object 42 is created first, then the name 'x' is bound to it. This matters when you reassign — the old object can be garbage collected if nothing else references it."
        },
        {
          'question': "What does this code print?",
          'code': "a = '100'\nb = '200'\nprint(a + b)",
          'options': ["A. 300", "B. '300'", "C. 100200", "D. TypeError"],
          'correct': 2,
          'explanation': "Both a and b are strings. The + operator on strings is concatenation, not addition. It silently joins them into '100200'. This is one of the most dangerous silent bugs in data engineering."
        },
        {
          'question': "Which line of code will raise a TypeError?",
          'code': "name = 'Kemi'\nage = 28\nresult_a = name + ' is here'\nresult_b = str(age) + ' years'\nresult_c = name + age",
          'options': [
            "A. result_a = name + ' is here'",
            "B. result_b = str(age) + ' years'",
            "C. result_c = name + age",
            "D. None of them — Python auto-converts"
          ],
          'correct': 2,
          'explanation': "result_c tries to add a string ('Kemi') to an integer (28). Python does not auto-convert. You must explicitly write str(age) or use an f-string."
        },
        {
          'question': "You receive a column from a CSV where all values look like '₦1,250,000.00'. What is the correct sequence of operations to convert one value to a usable float?",
          'options': [
            "A. float(value)",
            "B. int(value.replace('₦', ''))",
            "C. float(value.replace('₦', '').replace(',', ''))",
            "D. value.strip('₦')"
          ],
          'correct': 2,
          'explanation': "You need to remove both the ₦ symbol and the comma separators before float() can parse it. Removing only the symbol still leaves commas, which float() cannot handle."
        },
        {
          'question': "What is the difference between `balance = 0` and `balance = None`?",
          'options': [
            "A. None and 0 are the same in Python",
            "B. balance = 0 means the account exists with an empty balance; balance = None means the data is missing or unknown",
            "C. None is faster than 0 for calculations",
            "D. 0 is for integers, None is for strings"
          ],
          'correct': 1,
          'explanation': "This is a critical data quality distinction. Zero means 'we know the value and it is zero.' None means 'we don't have this data.' Treating missing data as zero leads to incorrect totals in financial reports."
        }
      ]
    },

    'Lists, Dicts & Loops': {
      'lesson': `## Lists, Dicts & Loops

If variables are single containers, lists and dictionaries are the shelves and filing cabinets. Almost every dataset you work with in data engineering is fundamentally a collection of items — a list of transactions, a dictionary of customer records, a list of dictionaries representing rows in a table.

### Lists: ordered, mutable sequences

\`\`\`python
# Creating lists
daily_sales = [12500, 44000, 8200, 67000, 31500]
branch_names = ["Lagos", "Abuja", "Kano", "PH"]
mixed = [101, "Kuda", True, 45000.0]   # valid, but avoid in real data

# Indexing (zero-based)
print(daily_sales[0])    # 12500 — first element
print(daily_sales[-1])   # 31500 — last element
print(daily_sales[-2])   # 67000 — second from last

# Slicing: [start:stop:step] — stop is exclusive
print(daily_sales[1:4])  # [44000, 8200, 67000]
print(daily_sales[:3])   # [12500, 44000, 8200]
print(daily_sales[::2])  # [12500, 8200, 31500] — every other element
\`\`\`

### Mutating lists

\`\`\`python
transactions = [500, 1200, 800]

transactions.append(2500)           # add to end → [500, 1200, 800, 2500]
transactions.insert(1, 750)         # insert at index 1 → [500, 750, 1200, 800, 2500]
transactions.remove(800)            # remove first occurrence of 800
popped = transactions.pop()         # removes and returns last item → 2500
transactions.sort(reverse=True)     # sort descending in-place
print(len(transactions))            # count of items
\`\`\`

### Dictionaries: key-value storage

\`\`\`python
# A dictionary is like a row in a database table
customer = {
    "id": "C-0042",
    "name": "Amara Eze",
    "balance": 250_000.0,
    "tier": "Gold",
    "active": True
}

# Accessing values
print(customer["name"])               # "Amara Eze"
print(customer.get("email"))          # None — safe access, no KeyError
print(customer.get("email", "N/A"))   # "N/A" — with a default

# Modifying
customer["balance"] += 10_000
customer["email"] = "amara@example.com"   # add new key
del customer["tier"]                       # remove a key

# Iterating over a dict
for key, value in customer.items():
    print(f"{key}: {value}")
\`\`\`

### For loops: from basic to production patterns

\`\`\`python
# Basic loop over a list
totals = [5000, 12000, 3400, 8800]
running_total = 0
for amount in totals:
    running_total += amount
print(f"Total: ₦{running_total:,}")

# enumerate — when you need the index too
for i, amount in enumerate(totals):
    print(f"Transaction {i+1}: ₦{amount:,}")

# zip — looping two lists in parallel
branches = ["Lagos", "Abuja", "Kano"]
revenues = [450_000, 280_000, 190_000]
for branch, revenue in zip(branches, revenues):
    print(f"{branch}: ₦{revenue:,}")
\`\`\`

### List comprehensions: concise and fast

List comprehensions are not just "shorter loops" — they are significantly faster than regular for loops for building lists. You'll see them constantly in production code.

\`\`\`python
amounts = [5000, 500, 120000, 85000, 300, 42000]

# Regular loop version
large_transactions = []
for a in amounts:
    if a > 10000:
        large_transactions.append(a)

# List comprehension — same result, one line
large_transactions = [a for a in amounts if a > 10000]
# [120000, 85000, 42000]

# With transformation
discounted = [a * 0.9 for a in amounts if a > 50000]
# [108000.0, 76500.0]

# Dict comprehension
branch_lookup = {name: rev for name, rev in zip(branches, revenues)}
# {"Lagos": 450000, "Abuja": 280000, "Kano": 190000}
\`\`\`

### Lists of dictionaries: the real data structure

In practice, your data almost always comes as a list of dictionaries — which is exactly what a Pandas DataFrame is under the hood, and exactly what an API returns as JSON.

\`\`\`python
transactions = [
    {"id": "T001", "branch": "Lagos", "amount": 45000, "status": "settled"},
    {"id": "T002", "branch": "Abuja", "amount": 12000, "status": "pending"},
    {"id": "T003", "branch": "Lagos", "amount": 89000, "status": "settled"},
    {"id": "T004", "branch": "Kano",  "amount": 3000,  "status": "failed"},
]

# Filter settled transactions
settled = [t for t in transactions if t["status"] == "settled"]

# Total for Lagos branch
lagos_total = sum(t["amount"] for t in transactions if t["branch"] == "Lagos")
print(f"Lagos total: ₦{lagos_total:,}")    # ₦134,000

# Group by branch — build a dict of totals
branch_totals = {}
for t in transactions:
    branch = t["branch"]
    branch_totals[branch] = branch_totals.get(branch, 0) + t["amount"]
# {"Lagos": 134000, "Abuja": 12000, "Kano": 3000}
\`\`\`

### Nested data structures

\`\`\`python
# A company structure: dict of dicts
company = {
    "Lagos": {
        "manager": "Mrs. Adeyemi",
        "revenue": 450_000,
        "staff_count": 12
    },
    "Abuja": {
        "manager": "Mr. Okafor",
        "revenue": 280_000,
        "staff_count": 8
    }
}

# Accessing nested data
print(company["Lagos"]["manager"])    # "Mrs. Adeyemi"

# Looping nested
for branch, info in company.items():
    print(f"{branch} — Manager: {info['manager']}, Revenue: ₦{info['revenue']:,}")
\`\`\``,

      'scenario': `## Scenario: The Bulk Discount Automation

**Context:** You work for a wholesale distributor. Pricing rules change quarterly, and the pricing team is manually updating a 500-row spreadsheet every time. They've asked you to automate it.

**Current rules:**
- Items over ₦10,000: apply 10% discount
- Items over ₦50,000: apply 15% discount (the higher rule wins)
- Items in the "clearance" category: apply 25% regardless

**The data:**
\`\`\`python
inventory = [
    {"sku": "P001", "name": "Laptop Stand", "price": 8500,  "category": "office"},
    {"sku": "P002", "name": "Monitor",      "price": 85000, "category": "electronics"},
    {"sku": "P003", "name": "USB Hub",      "price": 3200,  "category": "clearance"},
    {"sku": "P004", "name": "Desk Chair",   "price": 55000, "category": "furniture"},
    {"sku": "P005", "name": "Webcam",       "price": 12500, "category": "clearance"},
]
\`\`\`

**Your job:**

1. Write a function \`apply_discount(item)\` that takes a single item dict and returns the discounted price.
2. Use a list comprehension to build a new list with a "discounted_price" key added to each item.
3. Calculate: total original value, total discounted value, and total savings.
4. Print the results with proper formatting.

**The output you're aiming for:**
\`\`\`
=== PRICING REPORT ===
P001 Laptop Stand     ₦8,500.00  → ₦8,500.00   (0% off)
P002 Monitor          ₦85,000.00 → ₦72,250.00  (15% off)
P003 USB Hub          ₦3,200.00  → ₦2,400.00   (25% off)
P004 Desk Chair       ₦55,000.00 → ₦46,750.00  (15% off)
P005 Webcam           ₦12,500.00 → ₦9,375.00   (25% off)

Original Total:    ₦164,200.00
After Discounts:   ₦139,275.00
Total Savings:     ₦24,925.00
\`\`\`

The key insight is that the pricing logic lives in one function. When the rules change next quarter, you change one function — not 500 rows in a spreadsheet.`,

      'quizzes': [
        {
          'question': "What is the output of this code?",
          'code': "prices = [100, 200, 300, 400]\nprint(prices[-2])",
          'options': ["A. 200", "B. 300", "C. 400", "D. IndexError"],
          'correct': 1,
          'explanation': "Negative indexing counts from the end. prices[-1] is 400, prices[-2] is 300. This is useful when you need the last or second-to-last item without knowing the list length."
        },
        {
          'question': "What does `.get()` on a dictionary do that direct bracket access `[]` does not?",
          'options': [
            "A. It returns the value faster",
            "B. It returns None (or a default) instead of raising a KeyError if the key doesn't exist",
            "C. It creates the key if it doesn't exist",
            "D. It only works on nested dictionaries"
          ],
          'correct': 1,
          'explanation': "customer['email'] raises a KeyError if 'email' is not in the dict. customer.get('email') returns None. customer.get('email', 'N/A') returns 'N/A'. In data pipelines where fields may be missing, .get() prevents crashes."
        },
        {
          'question': "What does this list comprehension produce?",
          'code': "amounts = [500, 8000, 12000, 3000, 45000]\nresult = [a for a in amounts if a > 5000]",
          'options': [
            "A. [8000, 12000, 45000]",
            "B. [500, 3000]",
            "C. True, True, True",
            "D. [8000, 12000, 3000, 45000]"
          ],
          'correct': 0,
          'explanation': "The comprehension filters the list to only include values greater than 5000. 500 and 3000 are excluded."
        },
        {
          'question': "You have a list of transaction dicts and want to total amounts for a specific branch. Which approach is correct?",
          'code': "txns = [\n  {'branch': 'Lagos', 'amount': 5000},\n  {'branch': 'Abuja', 'amount': 3000},\n  {'branch': 'Lagos', 'amount': 8000}\n]",
          'options': [
            "A. sum(txns['amount'] for t in txns if t['branch'] == 'Lagos')",
            "B. sum(t['amount'] for t in txns if t['branch'] == 'Lagos')",
            "C. txns.sum('amount', where='Lagos')",
            "D. for t in txns: sum(t['amount'])"
          ],
          'correct': 1,
          'explanation': "A generator expression inside sum() is the idiomatic Python approach. Option A has a bug — it references 'txns' instead of 't' inside the loop variable."
        },
        {
          'question': "What is the difference between `list.append(x)` and `list.insert(0, x)`?",
          'options': [
            "A. There is no difference",
            "B. append adds x to the end; insert(0, x) adds x to the beginning",
            "C. append is for strings, insert is for numbers",
            "D. insert is faster than append"
          ],
          'correct': 1,
          'explanation': "append always adds to the end in O(1) time. insert(0, x) adds to the beginning but must shift every existing element, making it O(n) — much slower for large lists."
        }
      ]
    },

    'Functions': {
      'lesson': `## Functions

A function is a named, reusable block of code that takes inputs, performs a defined task, and optionally returns an output. The reason functions exist isn't just to "avoid repetition" — it's to isolate logic so that a change in business rules means changing one place, not hunting across a thousand lines of code.

### The anatomy of a function

\`\`\`python
def calculate_vat(amount: float, rate: float = 0.075) -> float:
    """
    Calculate VAT on a given amount.
    Nigeria's standard VAT rate is 7.5%.
    """
    if amount < 0:
        raise ValueError(f"Amount cannot be negative: {amount}")
    return amount * rate

# Calling it
vat = calculate_vat(50000)          # uses default rate → 3750.0
vat_uk = calculate_vat(50000, 0.20) # custom rate → 10000.0
\`\`\`

### Parameters: positional, keyword, default

\`\`\`python
def generate_report(branch: str, date: str, include_vat: bool = True) -> str:
    vat_note = "incl. VAT" if include_vat else "excl. VAT"
    return f"Report for {branch} on {date} ({vat_note})"

# Positional — order matters
generate_report("Lagos", "2024-01-15")

# Keyword — order doesn't matter
generate_report(date="2024-01-15", branch="Abuja")

# Override the default
generate_report("Kano", "2024-01-15", include_vat=False)
\`\`\`

### *args and **kwargs

When you don't know ahead of time how many arguments a function will receive:

\`\`\`python
def total_transactions(*amounts: float) -> float:
    """Accept any number of transaction amounts."""
    return sum(amounts)

total_transactions(5000, 12000, 8500)            # 25500.0
total_transactions(500, 200)                      # 700.0

# **kwargs — variable keyword arguments
def create_customer_record(**fields):
    return {k: v for k, v in fields.items()}

record = create_customer_record(name="Chidi", tier="Gold", balance=100_000)
# {"name": "Chidi", "tier": "Gold", "balance": 100000}
\`\`\`

### Return values

A function can return any Python object — a number, a string, a list, a dictionary, or even another function. If you don't write a \`return\` statement, the function returns \`None\` silently, which is a common source of bugs.

\`\`\`python
def analyze_transactions(transactions: list) -> dict:
    """Returns a summary dictionary — not just a single number."""
    amounts = [t["amount"] for t in transactions]
    return {
        "count": len(amounts),
        "total": sum(amounts),
        "average": sum(amounts) / len(amounts) if amounts else 0,
        "max": max(amounts) if amounts else 0,
        "min": min(amounts) if amounts else 0,
    }

txns = [
    {"id": "T1", "amount": 5000},
    {"id": "T2", "amount": 32000},
    {"id": "T3", "amount": 8500},
]

summary = analyze_transactions(txns)
print(f"Total: ₦{summary['total']:,}")    # ₦45,500
print(f"Avg:   ₦{summary['average']:,.2f}")
\`\`\`

### Lambda functions

Lambdas are anonymous one-line functions. They're most useful as arguments to sorting or filtering operations.

\`\`\`python
transactions = [
    {"id": "T1", "amount": 32000},
    {"id": "T2", "amount": 8500},
    {"id": "T3", "amount": 67000},
]

# Sort by amount
sorted_txns = sorted(transactions, key=lambda t: t["amount"])
# Sort descending
sorted_txns = sorted(transactions, key=lambda t: t["amount"], reverse=True)

# Filter with a lambda (less common — list comp is usually cleaner)
large = list(filter(lambda t: t["amount"] > 20000, transactions))
\`\`\`

### Variable scope

\`\`\`python
tax_rate = 0.075   # module-level (global)

def calculate_total(subtotal: float) -> float:
    # Reads the global tax_rate, but does not modify it
    tax = subtotal * tax_rate   # tax_rate is accessible here
    return subtotal + tax

# If you need to modify a global (generally avoid this pattern)
count = 0
def increment():
    global count
    count += 1
\`\`\`

### Functions as arguments (higher-order functions)

\`\`\`python
def apply_rule(transactions: list, rule_func) -> list:
    """Apply any rule function to filter transactions."""
    return [t for t in transactions if rule_func(t)]

# Define different rules
def is_large(t):
    return t["amount"] > 50000

def is_suspicious(t):
    return t["amount"] > 100000 and t.get("hour", 12) < 5

# Use them interchangeably
large = apply_rule(transactions, is_large)
suspicious = apply_rule(transactions, is_suspicious)
\`\`\`

### The DRY principle in practice

The real cost of duplicated logic isn't the lines of code — it's the maintenance. When a tax rate changes from 7.5% to 10%, if that logic is in 20 places you will miss one. That one becomes a financial discrepancy nobody can explain.

\`\`\`python
# Bad: logic duplicated in 3 places
# In script A: total = amount * 1.075
# In script B: total = amount + (amount * 0.075)
# In script C: vat = amount / 13.33 * 1  # someone's creative interpretation

# Good: one place
VAT_RATE = 0.075

def add_vat(amount: float) -> float:
    return amount * (1 + VAT_RATE)

# When rate changes, change VAT_RATE — everything else updates automatically
\`\`\``,

      'scenario': `## Scenario: The Messy Discount Logic

**Context:** The company has pricing rules that were written by different people at different times. The rules are now spread across 8 scripts, inconsistently implemented, and the Finance team has flagged a discrepancy — some customers got 2% more discount than others for identical orders.

**Current state (the mess):**
\`\`\`python
# Script A
if is_premium: discount = 0.07
if amount > 100000: discount += 0.02
final = amount * (1 - discount)

# Script B
if customer_tier == "premium": disc = 0.07
elif customer_tier == "gold": disc = 0.05
final = amount - (amount * disc)   # forgot the bulk discount entirely

# Script C
vip_disc = 0.07 if vip else 0
big_disc = 0.02 if amount > 100000 else 0
result = amount * (1 - vip_disc - big_disc)   # double-counting issue
\`\`\`

**Your job:**

1. Write a single authoritative function \`calculate_final_price(amount, tier, quantity=1)\` that implements the correct logic:
   - "standard" tier: 0% base discount
   - "gold" tier: 5% base discount
   - "premium" tier: 7% base discount
   - Order over ₦100,000: additional 2% (stacks with tier discount)
   - Quantity >= 100 units: flat 3% bulk discount (does not stack with other discounts — takes effect only if higher than combined)

2. The function should return a dict: \`{"original": ..., "discount_pct": ..., "final": ...}\`

3. Write at least 4 test cases that confirm the logic is correct before you replace all 8 scripts.

This is a real pattern in MIS work — not writing new features, but consolidating fragmented business logic into a single, testable source of truth.`,

      'quizzes': [
        {
          'question': "What does this function return when called as `result = greet()`?",
          'code': "def greet(name='World'):\n    message = 'Hello, ' + name + '!'\n\nresult = greet()\nprint(result)",
          'options': ["A. 'Hello, World!'", "B. None", "C. ''", "D. NameError"],
          'correct': 1,
          'explanation': "The function builds the message string but never returns it. Without a return statement, Python functions implicitly return None. This is a very common bug — don't forget the 'return' keyword."
        },
        {
          'question': "What will this print?",
          'code': "def add_fee(amount, fee=50):\n    return amount + fee\n\nprint(add_fee(1000))\nprint(add_fee(1000, 100))",
          'options': [
            "A. 1050 then 1100",
            "B. 1000 then 1000",
            "C. 1050 then 1050",
            "D. TypeError on the second call"
          ],
          'correct': 0,
          'explanation': "The first call uses the default fee=50, so 1000+50=1050. The second call passes fee=100 explicitly, overriding the default, so 1000+100=1100."
        },
        {
          'question': "What is wrong with this code?",
          'code': "total = 0\n\ndef add_transaction(amount):\n    total = total + amount\n    return total\n\nadd_transaction(5000)",
          'options': [
            "A. Nothing is wrong",
            "B. UnboundLocalError — Python sees 'total = ...' inside the function and treats 'total' as local, but it's used before assignment",
            "C. total will be updated to 5000 globally",
            "D. The function should use *args"
          ],
          'correct': 1,
          'explanation': "When Python sees any assignment to a variable inside a function (total = total + amount), it marks that variable as local to the function. Then the right side of the assignment tries to read 'total' before it's been assigned locally — hence UnboundLocalError. Fix: either pass total as a parameter, or declare 'global total' (though global state is usually the wrong solution)."
        },
        {
          'question': "What is the output of this code?",
          'code': "def process(items, multiplier=2):\n    return [x * multiplier for x in items]\n\nprint(process([1, 2, 3]))\nprint(process([1, 2, 3], 3))",
          'options': [
            "A. [2, 4, 6] then [3, 6, 9]",
            "B. [1, 2, 3] then [1, 2, 3]",
            "C. [2, 4, 6] then [2, 4, 6]",
            "D. TypeError"
          ],
          'correct': 0,
          'explanation': "First call uses default multiplier=2: [1*2, 2*2, 3*2] = [2, 4, 6]. Second call uses multiplier=3: [1*3, 2*3, 3*3] = [3, 6, 9]."
        },
        {
          'question': "Which is the correct way to call this function for the Abuja branch?",
          'code': "def get_branch_report(branch, date, currency='NGN'):\n    return f'{branch} report for {date} in {currency}'",
          'options': [
            "A. get_branch_report('2024-01-01', 'Abuja')",
            "B. get_branch_report(date='2024-01-01', branch='Abuja')",
            "C. get_branch_report('Abuja', currency='USD', date='2024-01-01')",
            "D. Both B and C are correct"
          ],
          'correct': 3,
          'explanation': "Keyword arguments can be passed in any order. B and C are both valid. A is wrong because the first positional parameter is 'branch', so it would set branch='2024-01-01'."
        }
      ]
    },

    'Reading & Writing Files': {
      'lesson': `## Reading & Writing Files

Data engineering starts with files. Before you can analyze anything in Pandas or load it into a database, you need to read it from wherever it lives. Mastering file I/O — and understanding the failure modes — is the difference between a script that works on your laptop and a pipeline that runs reliably at 2 AM.

### Basic open/read/write

\`\`\`python
# Writing a file — 'w' creates the file or overwrites it
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("Sales Report — 2024-01-15\\n")
    f.write("Lagos Branch: ₦450,000\\n")

# Reading back
with open("report.txt", "r", encoding="utf-8") as f:
    content = f.read()        # entire file as one string
    print(content)

# Read line by line (memory-efficient for large files)
with open("report.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())   # strip() removes trailing newline

# Appending — never use 'w' when you want to add to existing content
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("New entry added\\n")
\`\`\`

### Always specify encoding

If you don't specify \`encoding="utf-8"\`, Python uses the system default, which on Windows might be cp1252. This will silently corrupt Nigerian names with special characters (è, ọ, etc.) or break entirely.

### Working with CSV files properly

\`\`\`python
import csv

# Writing a CSV
employees = [
    {"id": "E001", "name": "Chidi Okafor", "salary": 180000},
    {"id": "E002", "name": "Ngozi Adeyemi", "salary": 220000},
]

with open("employees.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "salary"])
    writer.writeheader()
    writer.writerows(employees)

# Reading a CSV
with open("employees.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)    # each row is a dict, keys from header
    for row in reader:
        print(row["name"], row["salary"])
\`\`\`

### Working with JSON files

JSON is the native format of APIs and modern configuration. Knowing how to read and write it is essential.

\`\`\`python
import json

# Writing JSON
config = {
    "database": "warehouse_prod",
    "host": "db.company.ng",
    "port": 5432,
    "tables": ["transactions", "customers", "products"]
}

with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2)   # indent makes it human-readable

# Reading JSON
with open("config.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
    print(loaded["database"])   # "warehouse_prod"
    print(loaded["tables"][0])  # "transactions"
\`\`\`

### Using pathlib for path handling

The old way (\`os.path\`) works but pathlib is cleaner and more reliable cross-platform.

\`\`\`python
from pathlib import Path

# Define paths
data_dir = Path("data")
input_file = data_dir / "raw_sales.csv"
output_file = data_dir / "clean_sales.csv"

# Check before reading
if not input_file.exists():
    raise FileNotFoundError(f"Expected input not found: {input_file}")

# List all CSV files in a folder
csv_files = list(data_dir.glob("*.csv"))
print(f"Found {len(csv_files)} CSV files")

# Get file info
print(input_file.stem)     # "raw_sales" (name without extension)
print(input_file.suffix)   # ".csv"
print(input_file.parent)   # "data"
\`\`\`

### Handling multiple files: the archive merge pattern

\`\`\`python
import csv
from pathlib import Path

def merge_daily_files(input_dir: str, output_file: str) -> int:
    """Merge all CSV files in a directory into one output file."""
    input_path = Path(input_dir)
    csv_files = sorted(input_path.glob("sales_*.csv"))

    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {input_dir}")

    rows_written = 0
    header_written = False

    with open(output_file, "w", newline="", encoding="utf-8") as out:
        writer = None

        for file in csv_files:
            with open(file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                if not header_written:
                    writer = csv.DictWriter(out, fieldnames=reader.fieldnames)
                    writer.writeheader()
                    header_written = True
                for row in reader:
                    writer.writerow(row)
                    rows_written += 1

    return rows_written

count = merge_daily_files("data/daily", "data/annual_sales.csv")
print(f"Merged {count} records")
\`\`\`

### Common file errors and how to handle them

\`\`\`python
from pathlib import Path

def safe_read_csv(filepath: str) -> list:
    path = Path(filepath)

    if not path.exists():
        print(f"Warning: {filepath} does not exist — skipping")
        return []

    if path.stat().st_size == 0:
        print(f"Warning: {filepath} is empty — skipping")
        return []

    try:
        with open(path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            return list(reader)
    except UnicodeDecodeError:
        # Try latin-1 fallback for legacy Windows exports
        with open(path, "r", encoding="latin-1") as f:
            reader = csv.DictReader(f)
            return list(reader)
\`\`\``,

      'scenario': `## Scenario: The Yearly Sales Archive

**Context:** Your company's file server has 365 daily sales files for 2023, each named like \`sales_2023_01_01.csv\` through \`sales_2023_12_31.csv\`. The Finance Director wants a single merged file for the external auditors, and she needs it by end of day.

The files have a known problem: the Abuja office uses commas as decimal separators (European format — "1.250,00" instead of "1,250.00"). If you don't handle this, your totals will be off by a factor of 1000 for some rows.

**Your job:**

1. Scan the folder and count how many files are there (should be 365 — report any missing dates).
2. Write a \`normalize_amount(raw: str) -> float\` function that handles both "1,250.00" and "1.250,00" formats.
3. Merge all files, applying the normalization to the \`amount\` column.
4. Write the result to \`2023_annual_sales.csv\` and print a summary:
   - Total rows merged
   - Total revenue (₦)
   - Any dates with missing files
   - Processing time in seconds

**Hint for detecting European format:**
\`\`\`python
def normalize_amount(raw: str) -> float:
    raw = str(raw).strip()
    # European: last separator is comma and has dot as thousands
    if raw.count(',') == 1 and raw.index(',') > raw.rfind('.'):
        raw = raw.replace('.', '').replace(',', '.')
    else:
        raw = raw.replace(',', '')
    return float(raw)
\`\`\`

This is real data engineering — the messy, undocumented format differences that nobody tells you about until a number is wrong.`,

      'quizzes': [
        {
          'question': "What happens if you open a file in 'w' mode when the file already exists?",
          'options': [
            "A. Python raises a FileExistsError",
            "B. Python appends to the existing content",
            "C. The existing file is completely overwritten and its content is lost",
            "D. Python creates a backup file first"
          ],
          'correct': 2,
          'explanation': "'w' mode truncates the file to zero bytes before writing. The original content is permanently lost. Use 'a' mode to preserve existing content, or check with Path.exists() first if you're unsure."
        },
        {
          'question': "What is the purpose of `newline=''` when writing a CSV file?",
          'code': "with open('data.csv', 'w', newline='', encoding='utf-8') as f:\n    writer = csv.writer(f)\n    writer.writerow(['name', 'amount'])",
          'options': [
            "A. It makes the file smaller",
            "B. It prevents Python from adding extra blank lines between rows on Windows",
            "C. It tells Python to use Unix line endings",
            "D. It is optional and makes no difference"
          ],
          'correct': 1,
          'explanation': "On Windows, Python's universal newline handling adds a \\r\\n, and the csv module adds its own \\r\\n, resulting in double blank lines between rows. newline='' disables Python's translation and lets the csv module control line endings."
        },
        {
          'question': "What does this code print?",
          'code': "import json\ndata = '{\"name\": \"Aisha\", \"score\": 95}'\nparsed = json.loads(data)\nprint(type(parsed), parsed['name'])",
          'options': [
            "A. <class 'str'> Aisha",
            "B. <class 'dict'> Aisha",
            "C. <class 'json'> Aisha",
            "D. KeyError: 'name'"
          ],
          'correct': 1,
          'explanation': "json.loads() converts a JSON string into a Python dictionary. After parsing, parsed is a dict, and you access it with bracket notation. Note: json.loads() parses a string; json.load() reads from a file object."
        },
        {
          'question': "You need to check if a file exists before reading it. Which is the correct modern approach?",
          'options': [
            "A. try: open(file) except: pass",
            "B. if os.path.isfile(file): open(file)",
            "C. from pathlib import Path; if Path(file).exists(): ...",
            "D. Both B and C work correctly"
          ],
          'correct': 3,
          'explanation': "Both work. pathlib (option C) is the modern, recommended approach — it's more readable and cross-platform. os.path (option B) is the older way but still valid. Option A works too but swallows all exceptions including permissions errors."
        },
        {
          'question': "Why should you always specify `encoding='utf-8'` when opening files?",
          'options': [
            "A. UTF-8 files are smaller than other encodings",
            "B. Without it, Python uses the system default which can vary by OS and corrupt non-ASCII characters like Nigerian names",
            "C. It makes the file read faster",
            "D. The csv module requires it"
          ],
          'correct': 1,
          'explanation': "Windows systems often default to cp1252 or similar encodings. A file containing 'Adéọlá' might read fine on the system that wrote it but corrupt on another. Explicitly specifying UTF-8 makes your code consistent everywhere."
        }
      ]
    },

    'Pandas Basics': {
      'lesson': `## Pandas Basics

Pandas is the foundation of data analysis in Python. Its core object — the DataFrame — is a two-dimensional table where each column can hold a different data type, and every operation is vectorized (applies to the whole column at once, not row by row). This is what makes it orders of magnitude faster than using Python lists for data work.

### Getting started: loading data

\`\`\`python
import pandas as pd

# From a CSV
df = pd.read_csv("sales.csv")

# From a CSV with options
df = pd.read_csv(
    "sales.csv",
    parse_dates=["transaction_date"],    # convert date column automatically
    dtype={"customer_id": str},          # keep IDs as strings, not integers
    encoding="utf-8"
)

# From Excel
df = pd.read_excel("report.xlsx", sheet_name="Q1 Sales")

# From a list of dicts (what you'd get from an API)
data = [
    {"branch": "Lagos", "amount": 45000, "date": "2024-01-15"},
    {"branch": "Abuja", "amount": 28000, "date": "2024-01-15"},
]
df = pd.DataFrame(data)
\`\`\`

### First look at your data

When you load a new dataset, always run these five commands before doing anything else:

\`\`\`python
df.shape            # (rows, columns) — how big is it?
df.dtypes           # what type is each column?
df.head(10)         # first 10 rows
df.info()           # non-null counts + dtype for every column
df.describe()       # count, mean, std, min, quartiles, max for numeric cols
\`\`\`

### Column selection

\`\`\`python
# Single column — returns a Series (1D)
amounts = df["amount"]

# Multiple columns — returns a DataFrame (2D)
subset = df[["branch", "amount", "date"]]

# All column names
print(df.columns.tolist())
\`\`\`

### Basic statistics

\`\`\`python
df["amount"].sum()       # total
df["amount"].mean()      # average
df["amount"].median()    # median (more robust to outliers than mean)
df["amount"].max()       # highest transaction
df["amount"].min()       # lowest transaction
df["amount"].std()       # standard deviation
df["amount"].count()     # count of non-null values

# Count occurrences of each value
df["branch"].value_counts()
df["status"].value_counts(normalize=True)  # as percentages
\`\`\`

### Handling missing values

\`\`\`python
# Detect missing data
df.isnull().sum()       # count of nulls per column
df.isnull().any()       # True/False per column

# Remove rows where specific column is null
df_clean = df.dropna(subset=["amount"])

# Fill nulls with a value
df["notes"] = df["notes"].fillna("No notes")
df["amount"] = df["amount"].fillna(0)

# Forward-fill (use previous value — common for time series)
df["price"] = df["price"].ffill()
\`\`\`

### Sorting and ranking

\`\`\`python
# Sort by amount descending
df_sorted = df.sort_values("amount", ascending=False)

# Sort by multiple columns
df_sorted = df.sort_values(["branch", "date"], ascending=[True, False])

# Reset the index after sorting
df_sorted = df_sorted.reset_index(drop=True)
\`\`\`

### Adding and modifying columns

\`\`\`python
# Add a calculated column
df["amount_with_vat"] = df["amount"] * 1.075

# Conditional column
df["size_category"] = df["amount"].apply(
    lambda x: "large" if x > 50000 else ("medium" if x > 10000 else "small")
)

# Rename columns
df = df.rename(columns={"amt": "amount", "dt": "date"})

# Drop a column
df = df.drop(columns=["temp_column"])
\`\`\`

### Exporting results

\`\`\`python
df.to_csv("output.csv", index=False, encoding="utf-8")
df.to_excel("output.xlsx", sheet_name="Results", index=False)

# JSON (useful for APIs)
df.to_json("output.json", orient="records", indent=2)
\`\`\`

### Understanding dtypes — why they matter

\`\`\`python
# Example of dtype problem
df = pd.read_csv("transactions.csv")
print(df["amount"].dtype)    # object (string!) — not float

# Try to sum it
df["amount"].sum()    # "5000100002500..." — string concatenation

# Fix: convert
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
# errors="coerce" turns anything that can't convert into NaN instead of crashing

# Check for conversion failures
failed = df["amount"].isnull().sum()
print(f"{failed} rows could not be converted to numeric")
\`\`\``,

      'scenario': `## Scenario: The Mystery Average

**Context:** Your manager drops a file on your desk — 87,000 rows of transaction data for Q1 2024. She wants to know:
1. Average transaction size per branch
2. Which branch had the single highest transaction
3. How many transactions failed vs settled
4. Any branches where the average failed transaction is larger than the average settled one (potential fraud signal)

The file has these columns: \`transaction_id\`, \`branch\`, \`amount\`, \`status\`, \`datetime\`, \`channel\`

**Your job — write the complete analysis:**

\`\`\`python
import pandas as pd

df = pd.read_csv("q1_transactions.csv", parse_dates=["datetime"])

# 1. Average per branch
branch_avg = df.groupby("branch")["amount"].mean().sort_values(ascending=False)

# 2. Single highest transaction
max_row = df.loc[df["amount"].idxmax()]
print(f"Highest: ₦{max_row['amount']:,.0f} at {max_row['branch']} on {max_row['datetime'].date()}")

# 3. Status breakdown
status_counts = df["status"].value_counts()

# 4. Fraud signal check — branches where avg failed > avg settled
pivot = df.groupby(["branch", "status"])["amount"].mean().unstack()
if "failed" in pivot.columns and "settled" in pivot.columns:
    flagged = pivot[pivot["failed"] > pivot["settled"]]
    print("\\nBranches flagging for review:")
    print(flagged[["failed", "settled"]])
\`\`\`

The point of this exercise isn't just getting the numbers — it's recognizing that a 2-line Pandas query can answer a question that would take an analyst 30 minutes in Excel, and that you can answer the fraud-signal question without writing a single loop.`,

      'quizzes': [
        {
          'question': "What does `df.info()` show that `df.describe()` does not?",
          'options': [
            "A. Statistical summaries like mean and standard deviation",
            "B. Non-null counts and data types for every column — it tells you where data is missing",
            "C. The first 5 rows of data",
            "D. The file size on disk"
          ],
          'correct': 1,
          'explanation': "df.describe() gives statistics for numeric columns. df.info() shows you the dtype of every column and how many non-null values are in each — essential for spotting missing data and wrong types before you start analysis."
        },
        {
          'question': "What is the difference between `df['amount']` and `df[['amount']]`?",
          'options': [
            "A. No difference — both select the amount column",
            "B. Single brackets return a Series (1D); double brackets return a DataFrame (2D with one column)",
            "C. Double brackets select two columns",
            "D. Single brackets are faster"
          ],
          'correct': 1,
          'explanation': "This is a subtle but important distinction. A Series and a single-column DataFrame behave differently when you try to merge, apply functions, or write to file. Many Pandas operations require a DataFrame, not a Series."
        },
        {
          'question': "What does `errors='coerce'` do in `pd.to_numeric(df['amount'], errors='coerce')`?",
          'options': [
            "A. It raises an error and stops processing",
            "B. It skips invalid values silently",
            "C. It converts invalid values (like '₦5,000') to NaN instead of raising an exception",
            "D. It forces the entire column to be integers"
          ],
          'correct': 2,
          'explanation': "Without errors='coerce', a single un-parseable value crashes your entire pipeline. With it, bad values become NaN, which you can then handle (fill, drop, flag) without crashing."
        },
        {
          'question': "You have a DataFrame and call `df['status'].value_counts()`. What does this return?",
          'code': "# status column contains: 'settled', 'pending', 'failed', 'settled', 'settled', 'pending'",
          'options': [
            "A. A count of all rows in the DataFrame",
            "B. A Series with each unique status as index and its count as value, sorted by count descending",
            "C. A list of unique statuses",
            "D. The percentage of each status"
          ],
          'correct': 1,
          'explanation': "value_counts() is one of the most useful exploratory tools. It shows you the distribution of a categorical column. For the given data it returns: settled=3, pending=2, failed=1."
        },
        {
          'question': "What is wrong with this code?",
          'code': "df = pd.read_csv('sales.csv')\ntotal = df['amount'] + df['tax']\nprint(total.sum())",
          'options': [
            "A. Nothing — this is correct",
            "B. You can't add two columns directly — you must use df.apply()",
            "C. If either column has NaN values, the addition will produce NaN for those rows, silently undercounting the total",
            "D. sum() requires a numeric argument, not a Series"
          ],
          'correct': 2,
          'explanation': "NaN + any_number = NaN in Pandas. If 100 rows have a missing tax value, those rows contribute nothing to the total. You should check for nulls first with df[['amount','tax']].isnull().sum() and decide how to handle them before summing."
        }
      ]
    },

    'DataFrames & Filtering': {
      'lesson': `## DataFrames & Filtering

Filtering is how you go from "all the data" to "the data that answers a specific question." In Pandas, filtering uses boolean indexing — you create a condition that evaluates to True or False for every row, then pass that condition back to the DataFrame to keep only the True rows.

### Boolean indexing: how it works

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "branch": ["Lagos", "Abuja", "Lagos", "Kano", "Abuja"],
    "amount": [45000, 12000, 89000, 5000, 67000],
    "status": ["settled", "pending", "settled", "failed", "settled"],
    "channel": ["web", "atm", "web", "pos", "atm"]
})

# Step 1: The condition creates a boolean Series
condition = df["amount"] > 40000
# 0    True
# 1    False
# 2    True
# 3    False
# 4    True

# Step 2: Pass it to the DataFrame to filter
big_txns = df[condition]
# or in one line:
big_txns = df[df["amount"] > 40000]
\`\`\`

### String conditions

\`\`\`python
# Exact match
lagos_txns = df[df["branch"] == "Lagos"]

# Multiple values (isin)
southern = df[df["branch"].isin(["Lagos", "PH", "Enugu"])]

# Contains (case-insensitive)
web_channels = df[df["channel"].str.contains("web", case=False)]

# Starts/ends with
ng_ids = df[df["customer_id"].str.startswith("NG-")]
\`\`\`

### Combining conditions

\`\`\`python
# AND (both must be true) — use & not 'and'
high_value_settled = df[(df["amount"] > 50000) & (df["status"] == "settled")]

# OR (at least one must be true) — use | not 'or'
flagged = df[(df["amount"] > 100000) | (df["status"] == "failed")]

# NOT — use ~ not 'not'
not_failed = df[~(df["status"] == "failed")]
# Same as: df[df["status"] != "failed"]

# Complex: settled AND (Lagos OR Abuja) AND amount > 20000
result = df[
    (df["status"] == "settled") &
    (df["branch"].isin(["Lagos", "Abuja"])) &
    (df["amount"] > 20000)
]
\`\`\`

### .loc and .iloc: precise selection

\`\`\`python
# .loc: label-based — use column names and index labels
df.loc[df["branch"] == "Lagos", "amount"]   # amounts for Lagos rows only
df.loc[0:2, ["branch", "amount"]]            # rows 0-2, specific columns

# .iloc: position-based — use integer positions
df.iloc[0]          # first row
df.iloc[0:5]        # first 5 rows
df.iloc[:, 1:3]     # all rows, columns at positions 1 and 2
df.iloc[-1]         # last row
\`\`\`

### .query(): readable syntax for complex filters

\`\`\`python
# Equivalent to df[(df["amount"] > 50000) & (df["status"] == "settled")]
result = df.query("amount > 50000 and status == 'settled'")

# Using variables in query
threshold = 50000
branch_name = "Lagos"
result = df.query("amount > @threshold and branch == @branch_name")
\`\`\`

### GroupBy: aggregating by category

\`\`\`python
# Total revenue per branch
branch_totals = df.groupby("branch")["amount"].sum()

# Multiple aggregations at once
branch_stats = df.groupby("branch")["amount"].agg(
    total="sum",
    average="mean",
    count="count",
    max_txn="max"
)

# GroupBy on multiple columns
channel_branch = df.groupby(["branch", "channel"])["amount"].sum().unstack()
\`\`\`

### apply(): row-level logic when vectorized isn't enough

\`\`\`python
def classify_risk(row) -> str:
    if row["amount"] > 500000 and row["channel"] == "atm":
        return "HIGH"
    elif row["amount"] > 100000:
        return "MEDIUM"
    return "LOW"

df["risk_level"] = df.apply(classify_risk, axis=1)
# axis=1 means apply to each row; axis=0 would apply to each column
\`\`\`

### between() and cut(): range filtering and binning

\`\`\`python
# Filter for a range
mid_range = df[df["amount"].between(10000, 50000)]

# Bin continuous values into categories (bucketing)
df["amount_bucket"] = pd.cut(
    df["amount"],
    bins=[0, 10000, 50000, 200000, float("inf")],
    labels=["micro", "small", "medium", "large"]
)

# How many transactions in each bucket?
df["amount_bucket"].value_counts()
\`\`\`

### Pivot tables: the executive summary format

\`\`\`python
# Revenue by branch and status
pivot = df.pivot_table(
    values="amount",
    index="branch",
    columns="status",
    aggfunc="sum",
    fill_value=0
)
# This produces a table where rows are branches,
# columns are statuses (settled, pending, failed),
# and each cell is the total amount
\`\`\``,

      'scenario': `## Scenario: The Fraud Alert System

**Context:** The compliance team has asked you to build an automated script that runs every morning and produces three outputs from the previous night's transaction log:

1. **High-risk transactions:** amount > ₦500,000, between midnight and 5 AM, through ATM channel
2. **Velocity alerts:** any account_id appearing more than 5 times in a single hour
3. **Cross-border anomalies:** transactions where the IP address country code doesn't match the branch country

**The dataset columns:**
\`transaction_id, account_id, branch, amount, channel, datetime, ip_country\`

**Your job:**

\`\`\`python
import pandas as pd

df = pd.read_csv("overnight_transactions.csv", parse_dates=["datetime"])

# 1. High-risk transactions
df["hour"] = df["datetime"].dt.hour
high_risk = df[
    (df["amount"] > 500_000) &
    (df["hour"] < 5) &
    (df["channel"] == "atm")
][["transaction_id", "account_id", "branch", "amount", "datetime"]]

# 2. Velocity alerts
df["hour_bucket"] = df["datetime"].dt.floor("h")
velocity = (
    df.groupby(["account_id", "hour_bucket"])
    .size()
    .reset_index(name="txn_count")
)
alerts = velocity[velocity["txn_count"] > 5]

# 3. Cross-border (assuming branch country code is the first 2 chars of branch column)
df["branch_country"] = df["branch"].str[:2].str.upper()
cross_border = df[df["ip_country"] != df["branch_country"]]
\`\`\`

Write these three DataFrames to separate sheets in an Excel file: \`compliance_report_{today}.xlsx\`. This kind of script runs every morning at 6 AM and feeds the compliance team their daily review queue.`,

      'quizzes': [
        {
          'question': "Why must you use `&` instead of `and` when combining Pandas filter conditions?",
          'options': [
            "A. 'and' is reserved for Python 2 only",
            "B. 'and' operates on two boolean values; '&' operates element-wise on two boolean Series",
            "C. They are interchangeable — both work",
            "D. '&' is faster"
          ],
          'correct': 1,
          'explanation': "Python's 'and' keyword compares two objects as a single boolean — it cannot handle a Series of True/False values. '&' is the bitwise AND operator that applies element-by-element across two Series. Using 'and' with Series raises a ValueError."
        },
        {
          'question': "What does this code return?",
          'code': "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3,4,5], 'y': ['a','b','a','b','a']})\nresult = df[df['y'] == 'a']['x'].sum()",
          'options': ["A. 6", "B. 9", "C. 15", "D. 3"],
          'correct': 1,
          'explanation': "df['y'] == 'a' selects rows 0, 2, 4 (where y is 'a'). The x values for those rows are 1, 3, 5. Their sum is 9."
        },
        {
          'question': "What is the difference between `.loc` and `.iloc`?",
          'options': [
            "A. .loc is for columns, .iloc is for rows",
            "B. .loc uses label-based indexing (column names, index values); .iloc uses integer position-based indexing",
            "C. .iloc is faster than .loc for large DataFrames",
            "D. They are identical"
          ],
          'correct': 1,
          'explanation': "If your DataFrame index is [10, 20, 30], df.loc[10] gets the row labeled 10. df.iloc[0] gets the first row regardless of its label. The distinction matters most after filtering, when row labels no longer match positions."
        },
        {
          'question': "What does `groupby('branch')['amount'].agg(['sum', 'mean', 'count'])` produce?",
          'options': [
            "A. Three separate DataFrames",
            "B. A DataFrame with branch as index and columns sum, mean, count for the amount",
            "C. A list of three numbers",
            "D. A syntax error — agg doesn't accept lists"
          ],
          'correct': 1,
          'explanation': "agg() with a list of function names creates a multi-column result. You get one row per unique branch and one column for each aggregation function — a clean summary table ready for reporting."
        },
        {
          'question': "Which filter correctly selects rows where amount is between 10,000 and 50,000 inclusive?",
          'options': [
            "A. df[df['amount'] > 10000 and df['amount'] < 50000]",
            "B. df[(df['amount'] >= 10000) & (df['amount'] <= 50000)]",
            "C. df[df['amount'].between(10000, 50000)]",
            "D. Both B and C are correct"
          ],
          'correct': 3,
          'explanation': "Both work. .between(a, b) is inclusive by default, equivalent to (col >= a) & (col <= b). Option A fails because 'and' doesn't work element-wise on Series."
        }
      ]
    },

    'The Requests Library': {
      'lesson': `## The Requests Library

The requests library lets your Python code talk to the internet the same way a web browser does — but instead of rendering a webpage, you get the raw data back to work with programmatically. This is how you pull live exchange rates, query public APIs, send data to external services, or build integrations between systems.

### The basics: GET request

\`\`\`python
import requests

# Simple GET — fetch data from a URL
response = requests.get("https://restcountries.com/v3.1/name/nigeria")

# Always check status code before using the data
print(response.status_code)    # 200 = success

# Get the response body as JSON
data = response.json()
print(data[0]["name"]["common"])    # "Nigeria"
print(data[0]["population"])        # 218541212
\`\`\`

### Status codes you need to know

| Code | Meaning | What to do |
|------|---------|------------|
| 200 | OK | Proceed |
| 201 | Created | Data was saved (for POST) |
| 400 | Bad Request | Your request has an error |
| 401 | Unauthorized | Wrong or missing API key |
| 403 | Forbidden | You don't have permission |
| 404 | Not Found | Wrong URL or resource doesn't exist |
| 429 | Too Many Requests | Slow down — you're rate limited |
| 500 | Server Error | Their problem, not yours |

### Query parameters

\`\`\`python
# Without query params: requests.get(url)
# With query params — the clean way
params = {
    "base": "USD",
    "symbols": "NGN,GHS,KES",
    "format": "json"
}
response = requests.get("https://api.exchangerate.host/latest", params=params)
# This builds: https://api.exchangerate.host/latest?base=USD&symbols=NGN,GHS,KES&format=json

data = response.json()
ngn_rate = data["rates"]["NGN"]
print(f"1 USD = ₦{ngn_rate:,.2f}")
\`\`\`

### Headers: authentication and content type

\`\`\`python
import os

# Most production APIs require an API key in the Authorization header
api_key = os.environ.get("EXCHANGE_API_KEY")    # never hardcode keys

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

response = requests.get(
    "https://api.provider.com/data",
    headers=headers
)
\`\`\`

### POST requests: sending data

\`\`\`python
# POST — sending JSON to an API (e.g., creating a record)
payload = {
    "amount": 50000,
    "currency": "NGN",
    "reference": "TXN-2024-00341",
    "email": "customer@example.com"
}

response = requests.post(
    "https://api.paymentprovider.com/transactions",
    json=payload,        # automatically sets Content-Type: application/json
    headers={"Authorization": f"Bearer {api_key}"}
)

if response.status_code == 201:
    result = response.json()
    print(f"Transaction created: {result['id']}")
else:
    print(f"Failed: {response.status_code} — {response.text}")
\`\`\`

### Session objects: reusing connections

\`\`\`python
# Instead of creating a new connection for every request (slow),
# use a Session to reuse the connection and set headers once
session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
})

# Now all requests use the same connection and headers
r1 = session.get("https://api.example.com/products")
r2 = session.get("https://api.example.com/customers")
r3 = session.get("https://api.example.com/orders")
\`\`\`

### Handling pagination

Real APIs don't return 100,000 records in one call. They paginate.

\`\`\`python
def fetch_all_pages(base_url: str, headers: dict) -> list:
    """Fetch all pages from a paginated API."""
    all_records = []
    page = 1

    while True:
        response = requests.get(
            base_url,
            params={"page": page, "per_page": 100},
            headers=headers
        )
        response.raise_for_status()    # raises exception for 4xx/5xx

        data = response.json()
        records = data.get("data", [])

        if not records:
            break                       # no more pages

        all_records.extend(records)
        page += 1

        print(f"Fetched page {page - 1}: {len(records)} records")

    return all_records
\`\`\`

### Robust error handling for production pipelines

\`\`\`python
import requests
import time

def fetch_with_retry(url: str, headers: dict = None, max_retries: int = 3) -> dict:
    """Fetch a URL with automatic retry on transient failures."""
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=30)

            if response.status_code == 429:
                wait = int(response.headers.get("Retry-After", 60))
                print(f"Rate limited — waiting {wait}s")
                time.sleep(wait)
                continue

            response.raise_for_status()    # raises for 4xx/5xx
            return response.json()

        except requests.exceptions.ConnectionError:
            print(f"Attempt {attempt}: Connection failed")
        except requests.exceptions.Timeout:
            print(f"Attempt {attempt}: Timed out after 30s")
        except requests.exceptions.HTTPError as e:
            print(f"HTTP error: {e}")
            raise    # don't retry client errors (4xx)

        if attempt < max_retries:
            time.sleep(2 ** attempt)    # exponential backoff: 2s, 4s, 8s

    raise Exception(f"All {max_retries} attempts failed for {url}")
\`\`\``,

      'scenario': `## Scenario: The Dynamic Currency Converter

**Context:** You're building an automated pricing pipeline for an import-export company. Their product prices are stored in USD (supplier pricing), but invoices go out in NGN. They want prices updated every morning at 7 AM before the sales team starts work.

**Your job:**

1. Fetch the live USD→NGN rate from the World Bank API (free, no auth needed):
   \`https://api.worldbank.org/v2/country/NG/indicator/PA.NUS.FCRF?format=json&per_page=1\`

2. Load the product catalog CSV (columns: \`sku, name, cost_usd, markup_pct\`)

3. Calculate: \`selling_price_ngn = cost_usd * ngn_rate * (1 + markup_pct) * 1.075\` (includes VAT)

4. Write the updated catalog with a timestamp column showing when prices were last refreshed.

5. If the API fails, fall back to the last successful rate stored in \`last_rate.json\`, and log a warning.

\`\`\`python
import requests, json, os
from datetime import datetime
from pathlib import Path

RATE_CACHE = Path("last_rate.json")

def get_ngn_rate() -> float:
    try:
        r = requests.get(
            "https://api.worldbank.org/v2/country/NG/indicator/PA.NUS.FCRF",
            params={"format": "json", "per_page": 1},
            timeout=10
        )
        r.raise_for_status()
        rate = r.json()[1][0]["value"]
        RATE_CACHE.write_text(json.dumps({"rate": rate, "fetched": str(datetime.now())}))
        return float(rate)
    except Exception as e:
        print(f"Warning: live rate fetch failed ({e}) — using cached rate")
        if RATE_CACHE.exists():
            return json.loads(RATE_CACHE.read_text())["rate"]
        raise RuntimeError("No cached rate available — cannot proceed")
\`\`\`

This pattern — try live, fall back to cache, raise only if both fail — is the standard approach for any pipeline that depends on an external API.`,

      'quizzes': [
        {
          'question': "What does `response.raise_for_status()` do?",
          'options': [
            "A. Prints the status code",
            "B. Raises an HTTPError exception if the status code is 4xx or 5xx",
            "C. Returns True if the request was successful",
            "D. Retries the request automatically"
          ],
          'correct': 1,
          'explanation': "raise_for_status() is a clean way to check for errors. Instead of writing 'if response.status_code >= 400: raise Exception(...)' every time, this one method handles it. The exception includes the status code and message."
        },
        {
          'question': "What does this code print if the API returns `{\"rate\": 1580.5, \"currency\": \"NGN\"}`?",
          'code': "import requests\nr = requests.get('https://api.example.com/rate')\ndata = r.json()\nprint(type(data), data['rate'] * 100)",
          'options': [
            "A. <class 'str'> 158050.0",
            "B. <class 'dict'> 158050.0",
            "C. <class 'dict'> 1580.5100",
            "D. TypeError"
          ],
          'correct': 1,
          'explanation': "r.json() returns a Python dictionary. data['rate'] is 1580.5 (a float). 1580.5 * 100 = 158050.0. The type() of data is <class 'dict'>."
        },
        {
          'question': "Why is it dangerous to pass query parameters by appending them directly to the URL string?",
          'code': "# Option A\nrequests.get(f'https://api.com/data?user={username}&key={api_key}')\n\n# Option B\nrequests.get('https://api.com/data', params={'user': username, 'key': api_key})",
          'options': [
            "A. Option A is actually safer — it gives you more control",
            "B. Option A risks injection attacks if username contains special characters like '&' or '='; Option B handles encoding automatically",
            "C. Both options are identical",
            "D. Option A is faster"
          ],
          'correct': 1,
          'explanation': "If username is 'john&admin=true', Option A would append that as-is, injecting a new parameter. The requests library's params dict URL-encodes values automatically, escaping special characters."
        },
        {
          'question': "You call an API and get status code 429. What should your code do?",
          'options': [
            "A. Immediately retry the request",
            "B. Raise an exception and stop",
            "C. Wait (using the Retry-After header if present) and then retry",
            "D. Switch to a different API endpoint"
          ],
          'correct': 2,
          'explanation': "429 means you've exceeded the rate limit. Immediately retrying will just get you another 429. The correct response is to pause for the time indicated by the Retry-After header (or a reasonable backoff) before retrying."
        },
        {
          'question': "What is wrong with this code for a production pipeline?",
          'code': "API_KEY = 'sk_live_abc123xyz'\nresponse = requests.get(url, headers={'Authorization': f'Bearer {API_KEY}'})",
          'options': [
            "A. The header format is wrong",
            "B. The API key is hardcoded in the source code — it will be exposed if the code is shared or pushed to GitHub",
            "C. requests.get() doesn't support headers",
            "D. f-strings can't be used in dictionaries"
          ],
          'correct': 1,
          'explanation': "Hardcoded credentials are a major security risk. If this file gets committed to GitHub (even a private repo), the key is compromised. Use os.environ.get('API_KEY') or a .env file with python-dotenv."
        }
      ]
    },

    'Writing Automation Scripts': {
      'lesson': `## Writing Automation Scripts

Automation is about replacing a person clicking through a process with code that does it reliably, every time, without being asked. A well-written automation script is invisible — it runs silently in the background, does its job, and only draws attention to itself when something goes wrong.

### The anatomy of a production script

\`\`\`python
import logging
import os
from pathlib import Path
from datetime import datetime

# Logging: the professional alternative to print()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(levelname)s — %(message)s",
    handlers=[
        logging.FileHandler("pipeline.log"),
        logging.StreamHandler()     # also print to console
    ]
)
logger = logging.getLogger(__name__)

def main():
    logger.info("Pipeline started")
    try:
        run_pipeline()
        logger.info("Pipeline completed successfully")
    except Exception as e:
        logger.error(f"Pipeline failed: {e}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
\`\`\`

### The os and pathlib modules for file system work

\`\`\`python
import os
from pathlib import Path

# Listing files in a directory
data_dir = Path("data/incoming")
files = list(data_dir.glob("*.csv"))
print(f"Found {len(files)} files to process")

# Working with paths safely
for file in files:
    if file.stat().st_size == 0:
        logger.warning(f"Skipping empty file: {file.name}")
        continue

    processed_dir = Path("data/processed")
    processed_dir.mkdir(parents=True, exist_ok=True)   # create if doesn't exist

    output_path = processed_dir / f"clean_{file.stem}_{datetime.today().strftime('%Y%m%d')}.csv"
    # process and save...
    file.rename(Path("data/archive") / file.name)    # move original to archive
\`\`\`

### The datetime module

\`\`\`python
from datetime import datetime, timedelta, date

# Current time
now = datetime.now()
today = date.today()

# Formatting for filenames
filename = f"report_{today.strftime('%Y-%m-%d')}.csv"   # "report_2024-01-15.csv"

# Date arithmetic
yesterday = today - timedelta(days=1)
last_week = today - timedelta(weeks=1)
next_month = today + timedelta(days=30)

# Parsing a date string
date_str = "2024-01-15"
parsed = datetime.strptime(date_str, "%Y-%m-%d")
\`\`\`

### Building a real automation: daily sales report

\`\`\`python
import pandas as pd
import requests
import logging
from datetime import date, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)

def extract_sales(report_date: date) -> pd.DataFrame:
    """Pull sales for a specific date from the API."""
    response = requests.get(
        "https://api.company.com/sales",
        params={"date": str(report_date)},
        headers={"Authorization": f"Bearer {os.environ['SALES_API_KEY']}"},
        timeout=30
    )
    response.raise_for_status()
    return pd.DataFrame(response.json()["transactions"])

def transform(df: pd.DataFrame) -> dict:
    """Compute the summary statistics."""
    return {
        "date": str(df["date"].iloc[0]),
        "total_revenue": df["amount"].sum(),
        "transaction_count": len(df),
        "top_branch": df.groupby("branch")["amount"].sum().idxmax(),
        "failed_count": (df["status"] == "failed").sum(),
    }

def save_report(summary: dict, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"daily_report_{summary['date']}.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        for key, value in summary.items():
            f.write(f"{key}: {value}\\n")
    return output_file

def run_daily_report():
    yesterday = date.today() - timedelta(days=1)
    logger.info(f"Running daily report for {yesterday}")

    df = extract_sales(yesterday)
    logger.info(f"Extracted {len(df)} transactions")

    summary = transform(df)
    output = save_report(summary, Path("reports"))
    logger.info(f"Report saved to {output}")
    return summary
\`\`\`

### Environment variables: the right way to handle secrets

\`\`\`python
import os
from dotenv import load_dotenv   # pip install python-dotenv

load_dotenv()    # reads .env file into environment

DB_HOST = os.environ["DB_HOST"]         # raises KeyError if missing
DB_PASS = os.environ.get("DB_PASS", "") # returns "" if missing

# In your .env file (never commit this to git):
# DB_HOST=prod-db.company.ng
# DB_PASS=supersecret123
# SALES_API_KEY=sk_live_abc123
\`\`\`

### Command-line arguments: making scripts flexible

\`\`\`python
import argparse

parser = argparse.ArgumentParser(description="Daily sales pipeline")
parser.add_argument("--date", help="Date to process (YYYY-MM-DD)", default=None)
parser.add_argument("--dry-run", action="store_true", help="Run without saving output")
args = parser.parse_args()

target_date = args.date or str(date.today() - timedelta(days=1))
\`\`\`

Now you can run \`python pipeline.py --date 2024-01-10\` to reprocess a specific day.`,

      'scenario': `## Scenario: The Monday Morning Report

**Context:** Every Monday at 8:45 AM, your manager manually opens 5 Excel files from 5 regional managers, copies the data into a master sheet, and emails it to the Executive Committee. It takes 2 hours. He's missed the 9 AM meeting twice because of this.

**Your brief:** Build a script that runs automatically every Monday at 8 AM, collects the files, merges them, generates the report, and emails it — all without human involvement.

**Technical requirements:**
1. Scan a shared folder for files matching \`weekly_*_<YYYY-MM-DD>.xlsx\`
2. Verify all 5 regional files are present — if not, send a warning email listing which are missing and exit gracefully
3. Merge the data with a \`source_region\` column added
4. Calculate summary: total revenue per region, WoW growth (compare to the file from last Monday), top 3 products by revenue
5. Generate a formatted text report and send it via the \`smtplib\` email library

**Key pattern to use:**

\`\`\`python
from pathlib import Path
from datetime import date, timedelta

EXPECTED_REGIONS = ["Lagos", "Abuja", "Kano", "PH", "Enugu"]
report_date = date.today() - timedelta(days=date.today().weekday() + 7)  # last Monday

present = [
    r for r in EXPECTED_REGIONS
    if (Path("reports") / f"weekly_{r}_{report_date}.xlsx").exists()
]
missing = [r for r in EXPECTED_REGIONS if r not in present]

if missing:
    send_warning_email(missing)
    exit(1)
\`\`\`

The bigger lesson: a good automation script doesn't just "do the happy path" — it also knows when it can't complete its job safely and communicates that clearly instead of silently producing a partial result.`,

      'quizzes': [
        {
          'question': "Why is `logging.info()` better than `print()` in a production automation script?",
          'options': [
            "A. logging is faster than print",
            "B. logging adds timestamps, severity levels, and can write to files or monitoring systems — print just writes to the terminal",
            "C. print() doesn't work in automated scripts",
            "D. logging doesn't require an import"
          ],
          'correct': 1,
          'explanation': "When a pipeline runs at 2 AM with no one watching, print() output disappears. Logging writes timestamped, leveled records to files you can review later. It's also easy to route to monitoring systems like CloudWatch or Datadog."
        },
        {
          'question': "What does this code do?",
          'code': "from datetime import date, timedelta\nyesterday = date.today() - timedelta(days=1)\nprint(yesterday.strftime('%Y%m%d'))",
          'options': [
            "A. Prints yesterday's date as 'YYYY-MM-DD'",
            "B. Prints yesterday's date as 'YYYYMMDD' with no separators",
            "C. Raises a TypeError",
            "D. Prints today's date"
          ],
          'correct': 1,
          'explanation': "timedelta(days=1) subtracted from today gives yesterday. strftime('%Y%m%d') formats it without separators — useful for filenames like 'report_20240115.csv'."
        },
        {
          'question': "Why should secrets like API keys never be hardcoded in a Python script?",
          'options': [
            "A. Python can't parse them correctly",
            "B. They will accidentally be committed to version control where anyone with access can read them",
            "C. They make the script run slower",
            "D. They expire after 24 hours"
          ],
          'correct': 1,
          'explanation': "Even 'private' GitHub repos can be accidentally made public. Even local scripts can be shared. The right approach is os.environ.get() with values stored in a .env file that's excluded from version control via .gitignore."
        },
        {
          'question': "What does `processed_dir.mkdir(parents=True, exist_ok=True)` do?",
          'options': [
            "A. Raises an error if the directory already exists",
            "B. Creates the directory (and any missing parent directories) if they don't exist; does nothing if they already do",
            "C. Deletes and recreates the directory",
            "D. Creates a file called 'processed_dir'"
          ],
          'correct': 1,
          'explanation': "parents=True means it will create intermediate directories (e.g., 'data/processed/2024' creates 'data' and 'data/processed' if they don't exist). exist_ok=True prevents an exception if the directory already exists."
        },
        {
          'question': "What is the purpose of the `if __name__ == '__main__':` pattern?",
          'options': [
            "A. It makes the script run faster",
            "B. It means the code inside only runs when the file is executed directly, not when it's imported as a module by another script",
            "C. It's required for all Python scripts",
            "D. It sets the script's display name"
          ],
          'correct': 1,
          'explanation': "If you have a function `run_pipeline()` in your script, and another script imports it, you don't want the pipeline to auto-run on import. The `if __name__ == '__main__':` guard prevents that. It only runs when you execute the file directly."
        }
      ]
    },

    'Error Handling': {
      'lesson': `## Error Handling

In production, data pipelines deal with missing files, unreachable APIs, malformed data, and network timeouts on a regular basis. Error handling isn't optional — a script with no error handling will eventually crash silently and leave you with a broken dashboard and no idea why.

### The try/except structure

\`\`\`python
try:
    result = do_something_risky()
except SomeSpecificError as e:
    handle_the_error(e)
else:
    # Runs only if no exception was raised
    process_result(result)
finally:
    # Runs always — exception or not
    cleanup()
\`\`\`

### Catching specific exceptions (not everything)

\`\`\`python
# Bad: catches everything, hides bugs
try:
    data = load_data()
except:
    print("Something went wrong")

# Good: catch specific, expected errors
try:
    with open("sales.csv", "r") as f:
        data = csv.DictReader(f)
except FileNotFoundError:
    logger.error("sales.csv is missing — check the data source")
    raise    # re-raise so the pipeline knows to stop
except PermissionError:
    logger.error("Cannot read sales.csv — check file permissions")
    raise
except UnicodeDecodeError as e:
    logger.error(f"Encoding error in sales.csv: {e}")
    raise
\`\`\`

### Common exceptions in data work

\`\`\`python
# FileNotFoundError — file doesn't exist
# PermissionError — can't read/write the file
# ValueError — conversion failed: int("hello")
# KeyError — dict key doesn't exist: d["missing_key"]
# IndexError — list position doesn't exist: lst[999]
# TypeError — wrong type for operation: 5 + "hello"
# requests.exceptions.ConnectionError — no internet
# requests.exceptions.Timeout — took too long
# json.JSONDecodeError — response isn't valid JSON

# Catching requests errors
import requests

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()
except requests.exceptions.Timeout:
    logger.error("API request timed out after 10s")
    raise
except requests.exceptions.ConnectionError:
    logger.error("Cannot reach API — check internet/VPN")
    raise
except requests.exceptions.HTTPError as e:
    logger.error(f"API returned error: {e.response.status_code}")
    raise
except requests.exceptions.JSONDecodeError:
    logger.error(f"API returned non-JSON: {response.text[:200]}")
    raise
\`\`\`

### Custom exceptions for business logic

\`\`\`python
class DataQualityError(Exception):
    """Raised when incoming data fails quality checks."""
    pass

class MissingBranchError(Exception):
    """Raised when an expected branch has no data."""
    def __init__(self, branch: str, date: str):
        self.branch = branch
        self.date = date
        super().__init__(f"No data for branch '{branch}' on {date}")

def validate_daily_data(df, expected_branches: list):
    missing = set(expected_branches) - set(df["branch"].unique())
    if missing:
        raise MissingBranchError(list(missing)[0], df["date"].iloc[0])

    if df["amount"].isnull().sum() > 0:
        raise DataQualityError(f"{df['amount'].isnull().sum()} null amounts in dataset")
\`\`\`

### The retry pattern

\`\`\`python
import time
import functools

def retry(max_attempts: int = 3, delay: float = 2.0, backoff: float = 2.0):
    """Decorator that retries a function on failure."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            wait = delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except (ConnectionError, TimeoutError) as e:
                    if attempt == max_attempts:
                        raise
                    logger.warning(f"{func.__name__} failed (attempt {attempt}): {e}")
                    time.sleep(wait)
                    wait *= backoff    # 2s, 4s, 8s...
        return wrapper
    return decorator

@retry(max_attempts=3, delay=5.0)
def fetch_transactions():
    return requests.get(url, timeout=10).json()
\`\`\`

### Logging errors properly

\`\`\`python
import logging
import traceback

logger = logging.getLogger(__name__)

try:
    process_file("data.csv")
except Exception as e:
    # exc_info=True attaches the full stack trace to the log
    logger.error("Failed to process file", exc_info=True)

    # For alerting systems: structured log
    logger.error("PIPELINE_FAILURE", extra={
        "file": "data.csv",
        "error_type": type(e).__name__,
        "error_message": str(e)
    })
\`\`\`

### Finally: cleanup that always runs

\`\`\`python
import sqlite3

conn = None
try:
    conn = sqlite3.connect("warehouse.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO transactions VALUES (?, ?)", (1, 5000))
    conn.commit()
    logger.info("Transaction saved")
except sqlite3.Error as e:
    logger.error(f"Database error: {e}")
    if conn:
        conn.rollback()
finally:
    if conn:
        conn.close()    # always close, even if an exception occurred
\`\`\``,

      'scenario': `## Scenario: The Silent Pipeline Failure

**Context:** Your pipeline runs every night at 2 AM. Last Tuesday, the API it calls was down for maintenance from 1:30–3:00 AM. Your pipeline crashed at 2:00 AM, the morning report was empty, and nobody knew why until 9 AM when the regional managers started calling.

**The current code (no error handling):**
\`\`\`python
def run_pipeline():
    data = fetch_from_api()
    clean = transform(data)
    load_to_database(clean)
    generate_report(clean)
\`\`\`

**Your job:**

1. Wrap each step in appropriate try/except blocks
2. Add retry logic (3 attempts, 5-minute backoff) for the API fetch
3. If the fetch fails all 3 times, fall back to yesterday's cached data (save it daily)
4. Send a Slack alert via webhook if the pipeline uses fallback data
5. Log every step with timestamps and outcomes

**Expected behavior after your changes:**
- API is down: retries 3×, falls back to cache, sends Slack warning, pipeline completes with stale data
- API returns corrupted data: \`DataQualityError\` is raised, Slack alert with details, pipeline stops gracefully
- Everything works: silent success, summary logged

A pipeline that "fails gracefully and communicates" is worth ten times a pipeline that "works perfectly until it doesn't."`,

      'quizzes': [
        {
          'question': "What is wrong with this error handling?",
          'code': "try:\n    result = call_external_api()\nexcept:\n    pass",
          'options': [
            "A. Nothing — ignoring errors is fine in simple scripts",
            "B. The bare except: catches everything including KeyboardInterrupt and SystemExit, and pass silently hides all errors — you'll never know the pipeline failed",
            "C. You need to specify 'Exception' not leave it blank",
            "D. try/except blocks can't be used with API calls"
          ],
          'correct': 1,
          'explanation': "A bare 'except: pass' is sometimes called 'Pokemon exception handling' (gotta catch 'em all). It swallows every possible error, including keyboard interrupts. The pipeline continues as if nothing happened with whatever partial result it had — often producing wrong output silently."
        },
        {
          'question': "What does this code print?",
          'code': "try:\n    x = int('hello')\nexcept ValueError:\n    print('caught')\nelse:\n    print('success')\nfinally:\n    print('done')",
          'options': [
            "A. caught, done",
            "B. success, done",
            "C. caught, success, done",
            "D. done"
          ],
          'correct': 0,
          'explanation': "int('hello') raises a ValueError, so the except block runs: prints 'caught'. The else block only runs if no exception was raised — so it's skipped. finally always runs: prints 'done'. Output: 'caught' then 'done'."
        },
        {
          'question': "When should you use `raise` inside an except block?",
          'options': [
            "A. Never — catching an exception means you've handled it",
            "B. When you want to log the error but still propagate it up to the caller to decide what to do",
            "C. Only when using custom exceptions",
            "D. When the error was caused by user input"
          ],
          'correct': 1,
          'explanation': "A common pattern is: log the error (for observability), then re-raise it (so the caller can decide whether to retry, use fallback data, or halt). If you swallow the exception without re-raising, the calling code thinks everything worked."
        },
        {
          'question': "What is the difference between `except Exception as e` and `except BaseException as e`?",
          'options': [
            "A. They are identical",
            "B. Exception catches most runtime errors; BaseException also catches SystemExit and KeyboardInterrupt — you almost never want to catch those",
            "C. BaseException is for database errors; Exception is for network errors",
            "D. BaseException only works in Python 3"
          ],
          'correct': 1,
          'explanation': "SystemExit is raised by sys.exit(). KeyboardInterrupt is raised by Ctrl+C. If you catch BaseException and your pipeline is stuck, Ctrl+C won't work to stop it. Always use 'except Exception' unless you have a specific reason to catch system events."
        },
        {
          'question': "What is the purpose of the `finally` clause?",
          'options': [
            "A. It runs only if an exception was raised",
            "B. It runs only if no exception was raised",
            "C. It always runs, regardless of whether an exception occurred — used for cleanup like closing database connections",
            "D. It suppresses the exception"
          ],
          'correct': 2,
          'explanation': "finally is for cleanup that must happen no matter what — closing files, releasing database connections, removing temp files. Without it, if an exception occurs before your cleanup code, the connection stays open or the file stays locked."
        }
      ]
    },

    'Milestone Project': {
      'lesson': `## Milestone: The Corporate Sales Intelligence Pipeline

This is your first capstone project. You're not building a toy — you're building a data pipeline that reads from a real relational database, merges multiple tables, performs analysis, and produces an executive-ready report.

## The Business Problem

**"Northwind Traders"** is an international import/export company whose management team is making pricing decisions based on gut instinct. Their data lives in a relational SQLite database with 8 interconnected tables, and nobody on the business side can query it. You've been asked to build an automated Python analysis system that extracts insights from the relational data and produces a daily executive summary.

## The Data Source (Public Relational Database)

Download the **Northwind SQLite database** — it's a classic relational database used throughout the industry for learning:

\`\`\`
URL: https://github.com/jpwhite3/northwind-SQLite3/raw/main/Northwind_large.sqlite
Tables: Categories, Products, Suppliers, Orders, OrderDetails, Customers, Employees, Shippers
\`\`\`

This is real relational data: Products belong to Categories, OrderDetails reference both Orders and Products, Customers are linked to Orders, etc.

## Project Tasks

**1. Connect to the SQLite database using Python:**
\`\`\`python
import sqlite3
import pandas as pd

conn = sqlite3.connect("Northwind_large.sqlite")

# Load related tables
orders = pd.read_sql("SELECT * FROM Orders", conn)
details = pd.read_sql("SELECT * FROM OrderDetails", conn)
products = pd.read_sql("SELECT * FROM Products", conn)
categories = pd.read_sql("SELECT * FROM Categories", conn)
customers = pd.read_sql("SELECT * FROM Customers", conn)
conn.close()
\`\`\`

**2. Join the tables using their foreign keys:**
\`\`\`python
# OrderDetails links Orders and Products
merged = details.merge(products[["ProductID", "ProductName", "CategoryID", "UnitPrice"]],
                       on="ProductID")
merged = merged.merge(categories[["CategoryID", "CategoryName"]],
                       on="CategoryID")
merged = merged.merge(orders[["OrderID", "CustomerID", "OrderDate", "ShipCountry"]],
                       on="OrderID")
# Calculate line total
merged["LineTotal"] = merged["Quantity"] * merged["UnitPrice"] * (1 - merged["Discount"])
\`\`\`

**3. Answer these business questions:**
- Total revenue per product category (sorted descending)
- Top 10 customers by total spend
- Month-over-month revenue trend
- Which country generates the most revenue?
- Average order value by ShipCountry

**4. Build the Executive Dashboard output:**
\`\`\`
==========================================
   NORTHWIND TRADERS — EXECUTIVE SUMMARY
==========================================
Report Generated: 2024-01-15 08:00:00
Reporting Period: All Time

TOP REVENUE CATEGORIES:
  1. Beverages        $102,074.31
  2. Dairy Products    $76,294.77
  3. Confections       $55,277.60

TOP CUSTOMER:         QUICK-Stop ($117,483.39)
HIGHEST REVENUE MARKET: Germany ($230,284.90)
AVG ORDER VALUE:      $1,525.05
==========================================
\`\`\`

**5. Data quality checks before reporting:**
- Flag any OrderDetail rows with missing ProductID (orphaned records)
- Flag any orders with no matching customer
- Report the count of cleaned/excluded rows

**6. Deliver to GitHub:**
- \`pipeline.py\` — the main script
- \`analysis.ipynb\` — Jupyter notebook with visualizations (optional)
- \`README.md\` — explains what the pipeline does, how to run it, and the key business insights found

## Presenting This Work

Don't show the code first. Start with the dashboard output and say: "This script connects to the company's relational database, joins 5 tables, performs quality checks, and produces this summary. It runs in under 3 seconds. What used to take an analyst half a day can now be run by anyone with one command: \`python pipeline.py\`."`,

      'scenario': `## Scenario: The CEO's Reprocessing Request

**The situation:** The CEO has seen your pipeline and wants the same analysis for a specific time window: "Can you show me just Q3 2013? And I want to compare it to Q3 2012."

Your script currently processes all-time data. You need to make it flexible enough to accept date range parameters.

**Your job:**
1. Add command-line arguments for \`--start-date\` and \`--end-date\`
2. Filter the orders DataFrame to only include orders in that range
3. Run the same analysis on the filtered data
4. Print both periods side by side:
   - Q3 2013 Total Revenue vs Q3 2012 Total Revenue
   - % change YoY
   - Any new customers acquired in Q3 2013 who weren't active in Q3 2012

\`\`\`python
import argparse
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument("--start-date", required=True)
parser.add_argument("--end-date", required=True)
args = parser.parse_args()

orders["OrderDate"] = pd.to_datetime(orders["OrderDate"])
mask = (orders["OrderDate"] >= args.start_date) & (orders["OrderDate"] <= args.end_date)
filtered_orders = orders[mask]
\`\`\``,

      'quizzes': [
        {
          'question': "In the Northwind database, you want to find the total revenue for each product category. Which table join sequence is correct?",
          'options': [
            "A. Orders → OrderDetails → Customers",
            "B. OrderDetails → Products → Categories — because revenue (Quantity × Price) is in OrderDetails, Products holds the name, Categories holds the group",
            "C. Categories → Suppliers → Products",
            "D. Customers → Orders → Shippers"
          ],
          'correct': 1,
          'explanation': "OrderDetails contains the actual transaction lines (Quantity, UnitPrice, Discount). Products gives you ProductName and CategoryID. Categories gives you CategoryName. You join them in this chain using their foreign keys."
        },
        {
          'question': "Why is it better to use SQLite with Python than to load the data as CSV files?",
          'options': [
            "A. SQLite is faster for single-table operations",
            "B. SQLite maintains the relational structure and foreign key constraints — you query only what you need rather than loading entire tables",
            "C. CSV files can't be opened with pandas",
            "D. SQLite is required for production deployments"
          ],
          'correct': 1,
          'explanation': "With SQL you can filter before loading: SELECT * FROM Orders WHERE ShipCountry = 'Germany'. With CSV you load everything then filter in Python. For large databases this makes a significant performance difference."
        },
        {
          'question': "What does `merge(df1, df2, on='ProductID', how='left')` do vs `how='inner'`?",
          'options': [
            "A. They are identical",
            "B. left keeps all rows from df1 even if there's no matching ProductID in df2 (filling with NaN); inner only keeps rows where ProductID exists in both",
            "C. left is faster than inner",
            "D. inner adds a new column; left replaces existing ones"
          ],
          'correct': 1,
          'explanation': "In data analysis, a left join is usually what you want — it keeps your 'base' table complete and adds information from the second table where available. An inner join silently drops rows that don't match, which can cause underreporting if there's a data quality issue."
        }
      ]
    }
  },

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
  },
  'APIs & REST': {
    'The "Why" of APIs': {
      'lesson': `## Why are we learning APIs?
In modern business, no app is an island. Your website needs to talk to **Paystack** for payments, **SMS Live247** for notifications, and **Google Maps** for deliveries. 

An **API** (Application Programming Interface) is the "Messenger" that allows these different systems to talk to each other. Mastering APIs allows you to build a "Connected Business" instead of a bunch of isolated spreadsheets.

## Step-by-Step Tutorial: The Connector
1. **Endpoint**: The "URL" or address of the system you want to talk to.
2. **JSON**: The universal language of APIs. It looks like a Python dictionary.
3. **Authentication**: The "API Key" or password that proves you have permission to access the data.

## Let's look at a Real Business Example
**Kuda Bank** doesn't build its own SMS system. When you receive an alert, Kuda's server sends an API request to a provider like **Twilio**. 
- Kuda sends: "Hey Twilio, send 'Your balance is ₦5,000' to 08012345678."
- Twilio sends back: "Got it! SMS sent. That will cost you ₦2."
This happens in milliseconds using APIs.

## Common Mistakes to Avoid
- **Hard-coding Keys**: Never put your API secret key directly in your code. If you upload it to GitHub, hackers can steal your money or data in minutes.
- **Ignoring Status Codes**: If an API fails, it sends a "Code" (like 404 or 500). If you don't check these codes, your app will crash silently.`,
      'scenario': `## Scenario: The Silent Payment Failure
**The situation:** Customers are paying on your website, but their accounts aren't being upgraded. You check the database and realize the "Payment Success" data isn't arriving.

**Your job:**
1. Use Python to test the **Paystack API**.
2. Check the "Webhook" (the API message Paystack sends to you).
3. Realize that Paystack is sending the transaction ID as \`reference\`, but your code is looking for \`id\`.

**What the solution looks like:**
You've identified a "Data Mapping" error. By updating your API logic to match the provider's labels, you restore the flow of revenue. This is the #1 job of a modern MIS analyst.`,
      'quizzes': [
        {
          'question': "What is the universal data format used by almost all modern APIs?",
          'options': ["A. PDF", "B. Excel (.xlsx)", "C. JSON", "D. Word (.docx)"],
          'correct': 2,
          'explanation': "JSON (JavaScript Object Notation) is lightweight and can be read by any programming language, making it the standard for APIs."
        }
      ]
    },
    'Methods: GET vs POST': {
      'lesson': `## Why are we learning HTTP Methods?
When you talk to an API, you must use the right "Verb" (Method). 
- **GET**: Used to "Read" or "Fetch" data (e.g., Get today's exchange rate).
- **POST**: Used to "Send" or "Create" data (e.g., Send a new order to the warehouse).

## Step-by-Step Tutorial: The Request
1. **GET Request**: Use the \`requests.get()\` function. It's like looking at a menu.
2. **POST Request**: Use the \`requests.post()\` function. It's like placing an order.
3. **Payload**: In a POST request, the "Payload" is the JSON data you are sending to the server.

## Let's look at a Real Business Example
**Flutterwave** uses these methods:
- **GET**: To show a merchant their total sales for the month.
- **POST**: When a customer enters their card details to pay for a pizza.
Using the wrong method (trying to POST to a GET endpoint) will result in a **405 Method Not Allowed** error.

## Common Mistakes to Avoid
- **Sensitive Data in GET**: Never put passwords or credit card numbers in a GET request (they appear in the URL!). Always use POST for sensitive data.
- **No Error Handling**: If the internet is down, your \`requests.get()\` will crash. Always use a \`try/except\` block.`,
      'scenario': `## Scenario: The Duplicate Order
**The situation:** A customer clicked "Buy" once, but was charged twice. You realize the "Buy" button was sending a GET request, and the customer's browser "Refreshed" the page, triggering the charge again.

**Your job:**
1. Switch the API call from GET to **POST**.
2. Ensure the server checks for a unique "Transaction Token" to prevent duplicates.

**What the solution looks like:**
You've implemented **Idempotency**. By using the correct API method and a security token, you ensure that even if a customer clicks "Buy" ten times, they are only charged once.`,
      'quizzes': [
        {
          'question': "Which HTTP method should you use to fetch a list of products from a supplier's API?",
          'options': ["A. POST", "B. GET", "C. DELETE", "D. PUT"],
          'correct': 1,
          'explanation': "GET is for retrieving data. Since you are 'fetching' a list, GET is the correct verb."
        }
      ]
    },
    'Authentication & Security': {
      'lesson': `## Why are we learning API Auth?
Business data is private. You don't want the world to see your bank balance. APIs use **API Keys** and **Bearer Tokens** as "Digital Passports."

## Step-by-Step Tutorial: Securing the Pipe
1. **API Key**: A long string of random characters (e.g., \`sk_live_abc123\`).
2. **Headers**: This is where you hide the key. You don't put it in the URL; you put it in the "Envelope" of the request.
3. **Environment Variables**: Storing keys in a hidden file (\`.env\`) so they aren't visible in your code.

## Let's look at a Real Business Example
**Google Maps** charges for every "Map View." They give you an API Key to track your usage. If you leak your key and a stranger uses it, *you* get the bill. 
Companies like **Interswitch** use "Secret Keys" and "Public Keys" to ensure that even if someone sees your website code, they can't perform an unauthorized transfer.

## Common Mistakes to Avoid
- **Leaking Keys on GitHub**: If you push a file with an API key to GitHub, it will be stolen within seconds by automated bots.
- **Using 'Root' Keys**: If an API allows it, create "Limited" keys that can only do one thing (e.g., a key that can read data but not delete it).`,
      'scenario': `## Scenario: The ₦1 Million Surprise
**The situation:** You wake up to find your company's SMS account balance is zero. Someone stole your API key and used it to send spam messages to millions of people.

**Your job:**
1. Revoke the stolen key immediately in the provider dashboard.
2. Generate a new key.
3. Move the key to an **Environment Variable**.
4. Add \`.env\` to your \`.gitignore\` file.

**What the solution looks like:**
You've "Hardened" your security. By moving the secrets out of the code and into the environment, you ensure that even if someone steals your computer, they don't have the keys to the company's money.`,
      'quizzes': [
        {
          'question': "Where is the safest place to store an API Secret Key?",
          'options': ["A. In a comment at the top of the script", "B. In a separate .env file that is hidden from GitHub", "C. In the URL of the API request", "D. On a public Trello board"],
          'correct': 1,
          'explanation': "Environment variables (.env) keep secrets out of your source code, preventing accidental leaks."
        }
      ]
    },
    'JSON: The Language of Business': {
      'lesson': `## Why are we learning JSON?
JSON (JavaScript Object Notation) is how computers exchange data. It's clean, fast, and easy for both humans and machines to read.

## Step-by-Step Tutorial: Parsing JSON
1. **The Object**: Starts and ends with \`{ }\`.
2. **The Key-Value Pair**: \`"name": "Chidi"\`.
3. **The List**: Starts and ends with \`[ ]\`.
4. **The Parse**: Using \`response.json()\` in Python to turn a string of text into a usable dictionary.

## Let's look at a Real Business Example
When you check your "Order History" on **Jumia**, the server doesn't send a pretty webpage. It sends a **JSON** file like this:
\`\`\`json
{
  "orders": [
    {"id": 101, "item": "iPhone 13", "status": "Delivered"},
    {"id": 102, "item": "Powerbank", "status": "Shipped"}
  ]
}
\`\`\`
Your phone app reads this JSON and draws the list you see on the screen.

## Common Mistakes to Avoid
- **Incorrect Quotes**: JSON requires **Double Quotes** (\`"\`). Single quotes (\`'\`) will cause the API to crash.
- **Trailing Commas**: Putting a comma after the last item in a list will break many JSON parsers.`,
      'scenario': `## Scenario: The "Empty Dashboard" Mystery
**The situation:** Your dashboard says "Total Sales: ₦0", but the sales team says they sold millions today. You check the API response and it looks like this: \`{"sales_data": []}\`.

**Your job:**
1. Use \`print(response.json())\` to see the raw data.
2. Realize the API changed the label from \`sales_data\` to \`daily_sales\`.
3. Update your code to look for the new label.

**What the solution looks like:**
By "Inspecting the Payload," you found the disconnect. Labels in JSON are case-sensitive and exact. One tiny spelling change can break an entire business system.`,
      'quizzes': [
        {
          'question': "Which of these is a valid JSON entry?",
          'options': ["A. name: 'Aisha'", "B. \"name\": \"Aisha\"", "C. name = Aisha", "D. {name -> Aisha}"],
          'correct': 1,
          'explanation': "JSON requires double quotes for both the key and the string value."
        }
      ]
    },
    'Pulling API Data into Pandas': {
      'lesson': `## Why are we learning API to Pandas?
APIs give you raw JSON. Business analysts need **Tables**. Turning an API response into a Pandas DataFrame allows you to perform math, create charts, and join it with other data sources.

## Step-by-Step Tutorial: The Data Pipeline
1. **Fetch**: Use \`requests.get()\` to get the data.
2. **Convert**: Use \`response.json()\` to get the list of objects.
3. **Load**: Use \`pd.DataFrame(data)\` to turn it into a table.
4. **Clean**: Fix columns, handle missing values, and calculate totals.

## Let's look at a Real Business Example
A marketing manager at **PiggyVest** wants to see a chart of "Signups per Hour." The signups live in an API. 
The analyst writes a script that pulls the last 24 hours of signups from the API, loads them into Pandas, and uses \`.groupby('hour').count()\` to create the report in seconds.

## Common Mistakes to Avoid
- **Overloading the API**: Don't call the API 1,000 times in a loop. Try to get all the data in one call if possible.
- **Nesting Issues**: If the JSON is "Nested" (objects inside objects), a simple \`pd.DataFrame()\` might look messy. You might need \`pd.json_normalize()\` to flatten it.`,
      'scenario': `## Scenario: The "Excel is too Small" Problem
**The situation:** Your boss wants a report on 500,000 transactions. Excel keeps crashing when you try to import the JSON file.

**Your job:**
1. Skip Excel entirely.
2. Use Python and Pandas to read the API data directly.
3. Filter the data down to just the "Summary" the boss needs.
4. Export the summary (only 10 rows) to Excel.

**What the solution looks like:**
You've used Python as a "Power Tool." By processing the heavy data in memory and only giving the boss the final result, you saved hours of time and avoided the frustration of crashing computers.`,
      'quizzes': [
        {
          'question': "Which Pandas function is used to turn a list of JSON objects into a table?",
          'options': ["A. pd.read_csv()", "B. pd.DataFrame()", "C. pd.to_excel()", "D. pd.merge()"],
          'correct': 1,
          'explanation': "pd.DataFrame() takes a list of dictionaries (JSON) and turns it into a rows-and-columns table."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Currency Arbitrage Bot
In this milestone, you will build a professional tool that connects to a live Financial API to solve a real-world Nigerian business problem: **Exchange Rate Transparency.**

## The Broad Business Problem
**"Enugu Import-Export Ltd"** buys goods from China in USD but sells them in Nigeria in Naira. Because the exchange rate changes every hour, they are accidentally selling items for less than they cost to buy. They need an automated system that checks the live API rate every morning and updates their "Price List" automatically to protect their profit margins.

## Your Project Tasks:
1. **The Request**: Connect to the [Free Currency API](https://freecurrencyapi.com/) or similar.
2. **The Extraction**: Pull the live exchange rate for **USD to NGN**.
3. **The Logic**: Multiply the "Cost in USD" by the "API Rate" to find the "Break-even Price" in Naira.
4. **The Dashboard**: Print a summary showing:
   - Today's Date.
   - Live Exchange Rate.
   - Recommended Selling Price (with a 20% profit margin).
5. **The Delivery**: Push your \`exchange_bot.py\` and a screenshot of your terminal output to GitHub.

## Presenting to Executives
Tell the CEO: "We no longer guess our prices. This bot checks the global markets every hour and ensures that every item we sell is profitable, regardless of how the Naira fluctuates. It's an automated insurance policy for our revenue."`,
      'scenario': `## Scenario: The "Audit-Ready" Keys
**The situation:** An external auditor asks: "How do you ensure that only authorized people are accessing the financial API?"

**Your job:**
1. Show them your \`.env\` file (but don't open it!).
2. Explain how the API key is kept separate from the code.
3. Show the "Secret Rotation" log in the API provider's dashboard.

**What the solution looks like:**
You've proven that you are a professional. You understand that "Data Engineering" isn't just about moving numbers; it's about doing it **Securely** and **Accountably**.`,
      'quizzes': [
        {
          'question': "In your Currency Bot project, why is it better to use an API than to just Google the rate manually?",
          'options': ["A. It is not better", "B. The API allows for 'Automation'—the computer can check the rate and update prices 24/7 without a human doing any work", "C. APIs are always more accurate than Google", "D. APIs use less battery"],
          'correct': 1,
          'explanation': "Automation is the goal of MIS. An API turns a manual task into a 'System'."
        }
      ]
    }
  },
  'Cloud Computing': {
    'Cloud Basics for MIS': {
      'lesson': `## Why are we learning Cloud Computing?
In the old days, companies had "Server Rooms" with expensive computers and air conditioning. Today, businesses rent these computers over the internet from companies like **Amazon (AWS)** or **Microsoft (Azure)**. 

This is **Cloud Computing**. It allows a small business in Nigeria to have the same power as a global bank without buying any hardware.

## Step-by-Step Tutorial: The 3 Models
1. **IaaS (Infrastructure)**: Renting the "Virtual Computer" (e.g., AWS EC2). You manage the operating system.
2. **PaaS (Platform)**: Renting a tool to build apps without worrying about the server (e.g., Google App Engine).
3. **SaaS (Software)**: Using software over the web (e.g., Gmail, Salesforce, Slack).

## Let's look at a Real Business Example
**Paystack** doesn't have a server room in their office. All their code runs on **AWS**. This means if their office loses power, the payment system stays online for millions of customers. This "Reliability" is the main reason businesses switch to the cloud.

## Common Mistakes to Avoid
- **Leaving Servers On**: In the cloud, you pay for every minute. If you leave a powerful server running all weekend while you aren't using it, you are wasting the company's money.
- **No Backups**: Just because it's in the "Cloud" doesn't mean it's magic. You still need to schedule backups to prevent accidental deletion.`,
      'scenario': `## Scenario: The "Office Flood"
**The situation:** A pipe burst in your office and the server room is destroyed. The company's payroll data was on those servers. The CEO is in a panic.

**Your job:**
1. Explain how a **Cloud Backup** strategy would have saved the day.
2. Propose a plan to move the company's data to **AWS S3** (Cloud Storage).
3. Show the CEO how we can recover the data in minutes from any laptop, anywhere in the world.

**What the solution looks like:**
You've introduced **Business Continuity**. By moving to the cloud, the business is no longer vulnerable to "Local Disasters" (fire, flood, theft). The data is now globally distributed and indestructible.`,
      'quizzes': [
        {
          'question': "What is the main financial benefit of Cloud Computing for a new startup?",
          'options': ["A. You pay a large upfront cost", "B. You only pay for what you use (Pay-as-you-go), saving money on expensive hardware", "C. It is always free", "D. You don't have to pay for internet"],
          'correct': 1,
          'explanation': "Cloud computing turns 'Capital Expenditure' (buying hardware) into 'Operating Expenditure' (renting resources), which is much easier for businesses to manage."
        }
      ]
    },
    'AWS S3 - The Digital Vault': {
      'lesson': `## Why are we learning S3?
S3 stands for **Simple Storage Service**. It is an "Object Store"—a giant, infinite hard drive in the sky. It is where 90% of the world's data is stored before it gets analyzed.

## Step-by-Step Tutorial: The Bucket
1. **Bucket**: A "Folder" in the cloud. It must have a unique name in the entire world.
2. **Object**: Any file you upload (CSV, Image, PDF).
3. **IAM (Identity & Access Management)**: Rules that define who can "Read" or "Write" to the bucket.
4. **Permissions**: Keeping your bucket **Private** to prevent data leaks.

## Let's look at a Real Business Example
**Instagram** uses S3 to store every photo you upload. When you scroll your feed, the app asks S3 for the image. S3 is designed to be "11 Nines" reliable—meaning it is virtually impossible for your data to ever be lost.

## Common Mistakes to Avoid
- **Public Buckets**: This is the #1 cause of data breaches. Never click "Make Public" unless you want the entire world to see your files.
- **Messy Folders**: Use a clear naming convention (e.g., \`2023/Sales/Lagos_Jan.csv\`) so you can find your data later.`,
      'scenario': `## Scenario: The Leaked Salary List
**The situation:** You uploaded the company payroll to S3. 10 minutes later, you find a link to the file on a public forum. Anyone can see the CEO's salary!

**Your job:**
1. Immediately turn off **Public Access** in the AWS Console.
2. Set a policy that only allows your specific office IP address to see the files.
3. Use **Presigned URLs** if you need to share a file with someone for only 10 minutes.

**What the solution looks like:**
You've mastered **Cloud Security**. You understand that "The Cloud" is secure, but only if *you* set the locks correctly. This is the mark of a professional MIS analyst.`,
      'quizzes': [
        {
          'question': "What is an S3 'Bucket'?",
          'options': ["A. A physical server in your office", "B. A container for storing files (objects) in the cloud", "C. A type of database for SQL queries", "D. A programming language for the cloud"],
          'correct': 1,
          'explanation': "Buckets are the fundamental containers for data in S3. Everything you store in S3 is contained in a bucket."
        }
      ]
    },
    'AWS Lambda - Serverless Logic': {
      'lesson': `## Why are we learning Lambda?
Imagine you want to run a Python script every time a new customer signs up. In the old days, you'd need a server running 24/7. With **AWS Lambda**, you only pay for the **seconds** the code is actually running.

## Step-by-Step Tutorial: Functions in the Sky
1. **Trigger**: What starts the code? (e.g., A new file arrives in S3, or a user clicks a button).
2. **The Function**: Your Python script.
3. **Serverless**: You don't manage the computer. Amazon manages everything; you just provide the code.
4. **Scaling**: If 1,000 customers sign up at the same time, Lambda automatically runs 1,000 copies of your code.

## Let's look at a Real Business Example
**PiggyVest** might use Lambda to send a "Welcome Email." 
- **Trigger**: New user record created in the database.
- **Action**: Lambda wakes up, sends the email via an API, and then "Disappears."
- **Cost**: ₦0.0001.

## Common Mistakes to Avoid
- **Long Running Tasks**: Lambda is for short tasks (under 15 minutes). Don't use it for heavy data processing that takes hours.
- **No Monitoring**: If your Lambda fails, you need to check the **CloudWatch Logs** to see why.`,
      'scenario': `## Scenario: The "Night Owl" Automator
**The situation:** Your boss wants a daily sales summary at 6 AM. Currently, you wake up at 5:45 AM to run a script manually.

**Your job:**
1. Upload your script to **AWS Lambda**.
2. Set a **CloudWatch Event** (a timer) to trigger the function every morning at 6 AM automatically.
3. Go back to sleep.

**What the solution looks like:**
You've achieved **Operational Excellence**. By using Serverless automation, you've ensured the report is always on time, costs the company almost nothing, and requires zero manual effort.`,
      'quizzes': [
        {
          'question': "What is the main benefit of 'Serverless' computing like AWS Lambda?",
          'options': ["A. It is faster than any other computer", "B. You don't have to manage servers and you only pay for the time the code is actually running", "C. It doesn't use the internet", "D. It is only for storing images"],
          'correct': 1,
          'explanation': "Serverless allows you to focus on the code while the cloud provider handles the scaling and infrastructure, saving both time and money."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Disaster-Proof Backup System
In this final project, you will move your company's data security to the next level by building an automated, cloud-based backup system. You will ensure that even if the physical office is destroyed, the business continues.

## The Broad Business Problem
Your digital media company, **"Chinook Store,"** is operating under extreme existential risk. The entire company's intellectual property—a heavily linked relational database of Artists, Albums, and Tracks—is stored on a single physical server in a basement in Lagos. If a hardware failure occurs or the room floods, the business goes bankrupt instantly. You have been tasked with solving this critical infrastructure vulnerability by designing an automated, serverless "Cloud Bridge" that securely backs up every local file to an indestructible AWS S3 vault.

## Your Project Tasks:
1. **The Bucket**: Create a uniquely named S3 bucket in your AWS account (simulated in code).
2. **The Script**: Write a Python script using \`boto3\` to detect a new log file in your local "Production" folder.
3. **The Upload**: Automatically upload the file to S3 with a "Private" access policy.
4. **The Dashboard**: Print a "Cloud Status Dashboard" showing:
   - Total Files Backed Up.
   - Last Sync Timestamp.
   - A "Security Check" confirming the bucket is not public.
5. **The Delivery**: Push your \`cloud_sync.py\` and a screenshot of your terminal dashboard to GitHub.

## Show me the code (Cloud Logic)
\`\`\`python
# Example of the final Dashboard Output you should generate:
print("=========================================")
print("   CHINOOK STORE - CLOUD SECURITY DASHBOARD")
print("=========================================")
print(f"SYNC STATUS:     [SUCCESS]")
print(f"FILES PROTECTED: {file_count} Tables")
print(f"S3 DESTINATION:  s3://chinook-secure-vault/")
print("-----------------------------------------")
print("Action: Project files pushed to GitHub.")
\`\`\`

## Presenting to Executives
Tell the CEO: "We are no longer vulnerable to local disasters. Our business intelligence is now stored in a globally distributed, encrypted digital vault. We can restore our entire operation in under 30 minutes from anywhere in the world."`,
      'scenario': `## Scenario: The "Oops, I Deleted It" Recovery
**The situation:** A manager accidentally deleted the "June Sales Report" from the local computer. He is panicking. He needs it for a meeting in 10 minutes.

**Your job:**
1. Use your script (or the AWS CLI) to "Pull" the backup from S3 back to the local computer.
2. Verify that the file is the correct version.
3. Show the manager how the "Cloud History" allows you to recover any version of a file from any date.`,
      'quizzes': [
        {
          'question': "What is the primary reason for moving backups from a local computer to a service like AWS S3?",
          'options': ["A. To make the files harder to find", "B. To protect the data from local disasters (fire, theft, hardware failure) by storing it in a remote, secure location", "C. To save money on internet costs", "D. Because the CEO likes the word 'Cloud'"],
          'correct': 1,
          'explanation': "The Cloud provides 'Durability'. Services like S3 are designed to never lose a file, even if entire buildings are destroyed."
        }
      ]
    }
  },
  'dbt & Data Modeling': {
    'Modern Data Modeling': {
      'lesson': `## Why are we learning Data Modeling?

## Step-by-Step Tutorial: The Layers of Modeling
1. **The Raw Layer (Source)**: The messy data exactly as it came from the database. We never touch this directly.
2. **The Staging Layer (Stg)**: This is where we rename columns (e.g., \`C_123_TX\` becomes \`transaction_amount\`) and fix data types.
3. **The Mart Layer (fct/dim)**: The final, beautiful tables used for dashboards.
   - **Fact Tables (fct)**: These contain "Events" that happened (e.g., a sale, a click, a payment).
   - **Dimension Tables (dim)**: These contain "Descriptions" (e.g., the name of the customer, the color of the product).

## Let's look at a Real Business Example
Imagine a company like **Jumia**. Their raw database has a million rows of transactions. An MIS Analyst uses dbt to "Model" this into a clean \`fct_daily_sales\` table. Now, instead of a CEO writing a 100-line SQL query, they just type \`SELECT * FROM fct_daily_sales\` to get the answer.

## Common Mistakes to Avoid
- **Modeling in the Dashboard**: Beginners often try to fix data inside Power BI. Pros fix it in dbt first so that the "Clean" data can be used by *every* tool, not just one.
- **Nesting Logic**: Don't build models on top of models on top of models. It makes the system slow and hard to debug.`,
      'scenario': `## Scenario: The "Which Number is Right?" War
**The situation:** In the Monday meeting, the Marketing Manager says sales were ₦5M last week. The Finance Manager says they were ₦4.2M. The CEO is angry because nobody knows the real number.

**What you're seeing:**
Marketing is counting "Orders Placed" (including ones not yet paid). Finance is counting "Bank Settlements" (only paid ones). Both are using different, custom SQL queries.

**Your job:**
1. Create a single dbt model called \`fct_sales\`.
2. Define exactly what a "Successful Sale" means in the SQL code.
3. Tell both managers to use this new model instead of their own queries.

**What the solution looks like:**
You would use dbt to "lock down" the business rules. Once the CEO approves your model, it becomes the official law. Marketing and Finance now have to use your model, ending the confusion and ensuring the business makes decisions based on one accurate number.`,
      'quizzes': [
        {
          'question': "What is a 'Single Version of Truth' in data modeling?",
          'options': ["A. A database that never has errors", "B. A situation where everyone in the company uses the same, agreed-upon definitions for their numbers", "C. A book that everyone must read", "D. A very fast SQL query"],
          'correct': 1,
          'explanation': "dbt helps achieve this by centralizing the logic. Instead of everyone having their own query, everyone uses the same 'Model'."
        }
      ]
    },
    'Tables vs Views': {
      'lesson': `## Why are we learning Materialization?
In dbt, when you "run" a model, you have to decide how it lives in the database. This is a critical "Cost vs. Speed" business decision.

## Step-by-Step Tutorial: Tables vs. Views
1. **Views (The Default)**:
   - **What it is**: A "Virtual Table." It doesn't actually store data; it just runs the SQL query every time you open the dashboard.
   - **Pros**: Uses zero storage space.
   - **Cons**: Can be very slow if the data is large.
2. **Tables**:
   - **What it is**: The data is actually calculated and stored on the disk.
   - **Pros**: Lightning fast for dashboards to read.
   - **Cons**: Takes up storage space and needs to be "refreshed" (re-run) to show new data.
3. **The Pro Choice (Incremental)**:
   - Only processes *new* data since the last run. This is how billion-dollar companies handle massive data.

## Let's look at a Real Business Example
A bank like **Kuda** might use a **Table** for "Daily Account Balances" because thousands of employees look at it all day and it needs to be fast. They use a **View** for the "Staff Directory" because it's small and only changes once a month.

## Common Mistakes to Avoid
- **Everything as a Table**: If you make every single model a table, your storage costs will explode and your "dbt run" will take hours.
- **Everything as a View**: Your dashboards will be so slow that users will stop using them.`,
      'scenario': `## Scenario: The "Spinning Wheel" Dashboard
**The situation:** You built a beautiful dashboard for the Sales Team. However, every time they open it, the screen stays blank for 30 seconds with a spinning wheel. The Sales VP is complaining that it's "too slow."

**What you're seeing:**
Your dbt model is currently a **View**. Every time the dashboard opens, the warehouse has to re-calculate 2 years of sales data from scratch.

**Your job:**
1. Change the dbt configuration from \`materialized='view'\` to \`materialized='table'\`.
2. Run \`dbt run\` to build the table once.
3. Watch the dashboard load in under 1 second.

**What the solution looks like:**
By understanding "Materialization," you've improved the "User Experience" (UX). You've realized that the Sales Team's time is more valuable than a few pennies of storage cost.`,
      'quizzes': [
        {
          'question': "If you have a very complex query that takes 5 minutes to run, how should you save it in dbt to make it fast for users?",
          'options': ["A. As a View", "B. As a Table", "C. As a text file", "D. Don't save it at all"],
          'correct': 1,
          'explanation': "Saving it as a table means the '5-minute work' is done once by dbt. When the user looks at the table, it is instant."
        }
      ]
    },
    'Writing Tests for Data': {
      'lesson': `## Why are we learning Data Testing?
In software, we test if buttons work. In data engineering, we test if the numbers are "Sane." Is the price negative? Is the customer ID missing? dbt allows you to write automatic tests to catch these "Data Quality" issues.

## Step-by-Step Tutorial: The 4 Core Tests
1. **Unique**: Ensures a column has no duplicates (e.g., Every user must have a unique ID).
2. **Not_Null**: Ensures a column is never empty (e.g., Every sale must have a Price).
3. **Accepted_Values**: Ensures a column only contains allowed options (e.g., Status must be 'Paid' or 'Pending', never 'Banana').
4. **Relationships**: Ensures a "Customer ID" in a sale actually exists in the "Customers" table.

## Let's look at a Real Business Example
A Fintech like **Flutterwave** might have a test on their "Transaction Amount" column. If a bug in the app tries to save a transaction for -₦500,000, the dbt test will "Fail" and alert the engineers before that negative number messes up the total revenue report.

## Common Mistakes to Avoid
- **Not Testing Sources**: Beginners only test the final tables. Pros test the *raw* data as it comes in so they can catch errors at the very beginning.
- **Ignoring Failures**: If a test fails, don't just ignore it. It means your dashboard is likely showing wrong information!`,
      'scenario': `## Scenario: The Duplicate Customer Disaster
**The situation:** Your company ran a "Refer a Friend" promotion. A bug in the system allowed some people to sign up twice with the same email. Now your "Total Customers" report is showing 10,000 people, but there are only 8,000 real humans.

**What you're seeing:**
The CEO is happy about the 10,000 users, but the Marketing team is confused because they can only find 8,000 emails in their mailing list. You look like you're "Faking the numbers."

**Your job:**
1. Add a \`unique\` test to the \`email\` column in your dbt model.
2. Run \`dbt test\`. It will show you exactly which emails are duplicates.
3. Fix the SQL to only pick the "first" signup for each email.

**What the solution looks like:**
By adding automated tests, you've created a "Safety Net." You no longer have to manually "check" the data every morning. If there's a duplicate, the computer tells you.`,
      'quizzes': [
        {
          'question': "Which dbt test would you use to ensure that every order has a valid 'customer_id'?",
          'options': ["A. unique", "B. not_null", "C. accepted_values", "D. color_check"],
          'correct': 1,
          'explanation': "The 'not_null' test ensures that there are no empty (null) values in a critical column."
        }
      ]
    },
    'Documentation: The Data Dictionary': {
      'lesson': `## What is Data Documentation?
Documentation is the "Manual" for your data. It explains what \`tx_status_code\` actually means (e.g. 1 = Paid, 0 = Failed). dbt automatically generates a beautiful website that serves as a searchable **Data Dictionary** for your whole company.

## Why should you care as an MIS student?
Data is useless if people don't understand it. If a new analyst joins the company, they shouldn't have to ask you 100 questions about what every column means. They should be able to look at the "Docs."

## How it actually works
1. **Write**: You add descriptions to your YAML files.
2. **Generate**: You run \`dbt docs generate\`.
3. **Serve**: You run \`dbt docs serve\` to see the website.

## Show me the code
\`\`\`yaml
# Adding a description to a column
models:
  - name: fct_orders
    description: "This table contains one row per successful customer order."
    columns:
      - name: amount_ngn
        description: "The total price paid by the customer in Nigerian Naira."
\`\`\`

## Real life: How companies use this
**Kuda Bank** has hundreds of tables. They use dbt docs to create a "Self-Service" portal. If a manager in the Finance team wants to know where "Merchant Fees" are stored, they search the dbt docs website instead of calling an engineer. This saves everyone hours of time.

## Remember these three things
- Documentation makes you a "Team Player," not just a coder.
- The dbt lineage graph shows you a "Map" of how data flows.
- Good documentation is the difference between a "Black Box" and a "Transparent Business."`,
      'scenario': `## Scenario: The "Knowledge Silo" Risk
**The situation:** You are the only person who knows how the "Commission" is calculated. You are planning to go on a 2-week vacation to Obudu Cattle Ranch. The CFO is terrified that if something breaks while you're away, the whole company will stop.

**What you're seeing:**
Everyone depends on your "Secret Knowledge." This makes you important, but it also makes you "Stuck"-you can't even take a holiday without worry.

**Your job:**
1. Document every column of your dbt models.
2. Explain the "Commission Logic" in the model description.
3. Generate the dbt docs website and share the link with the team.

**Think through these:**
- Why is it bad for a company to have "Secret Knowledge" that only one person knows?
- How does documentation help you "Scale" your own time?
- Why is a "Lineage Graph" (showing which table feeds which) helpful for troubleshooting?

**What the solution looks like:**
By documenting your work, you've "cloned" your knowledge. The team can now support themselves while you're away. You've proven that you are a **Leader**, not just a worker. You've built a system that survives without you, which is the mark of a truly great MIS professional.`,
      'quizzes': [
        {
          'question': "What is the primary benefit of the dbt 'Lineage Graph'?",
          'options': ["A. It looks cool in a presentation", "B. It shows the visual map of how raw data is transformed into final reports, showing all dependencies", "C. It tells you which employees are working hardest", "D. It calculates the cloud bill"],
          'correct': 1,
          'explanation': "The Lineage Graph is a 'Map'. If you change a raw table, the graph shows you exactly which reports will be affected."
        }
      ]
    },
    'Career: The Analytics Engineer': {
      'lesson': `## What is an Analytics Engineer?
This is one of the newest and highest-paying roles in MIS. An Analytics Engineer sits right in the middle. They know enough **Data Engineering** to build pipelines (dbt, Airflow) and enough **Data Analysis** to understand what the business needs.

## Why should you care as an MIS student?
This role is perfect for MIS graduates. You don't just "write code" and you don't just "make charts." You build the **Systems** that allow the business to grow. In Nigeria, companies like Moniepoint, Interswitch, and Kuda are constantly looking for people with this specific "Hybrid" skill.

## The Skill Stack:
1. **Advanced SQL**: (Window functions, CTEs).
2. **dbt**: For modeling and testing.
3. **Version Control (Git)**: For collaborating with others.
4. **Business Context**: Understanding *why* a company cares about "Churn" or "LTV."

## Real life: How companies use this
An Analytics Engineer at **Jumia** might spend their morning writing SQL to clean up "Delivery Time" data. In the afternoon, they meet with the Logistics Head to decide if "Weekend Deliveries" should be a new category in the dashboard. They are the "Bridge" between the raw data and the executive's brain.

## Remember these three things
- Analytics Engineering is about "Quality" and "Scale."
- It is a mix of Software Engineering and Data Analysis.
- Mastering dbt is the #1 way to enter this career path.`,
      'scenario': `## Scenario: The "Career Pivot"
**The situation:** You've been working as a "Data Entry Clerk" for a year. You're bored, and the pay is low. You see a job posting for an "Analytics Engineer" that pays 4x your current salary.

**What you're seeing:**
The job description asks for "dbt experience," "SQL mastery," and "Data Modeling skills." You have the "MIS Degree," but you haven't proven you can use these tools.

**Your job:**
1. Use this MIS Data Lab to master the dbt and SQL modules.
2. Build a small "Portfolio Project" on GitHub showing how you modeled some raw sales data.
3. Apply for the job, emphasizing how your MIS background helps you understand the "Business Logic" behind the code.

**Think through these:**
- Why are "Hybrid Skills" (Tech + Business) more valuable than "Tech only"?
- How does having a "GitHub Portfolio" prove you are ready for a high-level role?
- Why is the "Analytics Engineer" role a natural fit for someone with an MIS degree?

**What the solution looks like:**
By focusing on this high-value career path, you've "upgraded" your future. You've realized that the world doesn't need more "Clickers"; it needs "Builders." You are now a professional who can walk into any boardroom, understand their problems, and go back to your desk to build the technical solution.`,
      'quizzes': [
        {
          'question': "What defines the role of an 'Analytics Engineer'?",
          'options': ["A. They only fix broken computers", "B. They use software engineering best practices (like dbt) to build clean, reliable data models for the business", "C. They only work in Excel", "D. They are in charge of office security"],
          'correct': 1,
          'explanation': "The Analytics Engineer is the bridge. They bring order to the chaos of raw data, making it useful for everyone else."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Executive Decision Portal
In this final milestone, you will use dbt to create a professional "Data Mart" that serves as the "Single Version of Truth" for your entire company. You will transform chaos into clarity.

## The Broad Business Problem
Your fast-food chain, **"Jaffle Shop,"** is paralyzed by internal conflict. Every board meeting ends in an argument because Marketing, Finance, and Operations all bring different "Revenue" numbers due to messy, duplicated customer and order records. The company cannot secure its next round of funding because investors don't trust the data. You must solve this "Multiple Versions of Truth" crisis by using dbt to unify the raw customers, orders, and payments tables into a single, rigorously tested, and fully documented master data model.

## Your Project Tasks:
0. **The Data**: Fork the [Official Jaffle Shop dbt Tutorial Dataset on GitHub](https://github.com/dbt-labs/jaffle_shop) to use as your raw e-commerce data.
1. **The Models**: Create three dbt "Staging" models to clean the raw data from Jumia, Konga, and the Website.
2. **The Mart**: Create a final "Mart" model that uses \`union all\` to combine them into one clean table.
3. **The Testing**: Write at least two dbt tests (\`not_null\` and \`unique\`) to ensure the data is perfect.
4. **The Documentation**: Generate a "Data Dictionary" using \`dbt docs generate\` explaining each column to the CEO.
5. **The GitHub Submission**: Upload your entire \`dbt_project/\` folder (including your \`schema.yml\` and \`models/\`) to GitHub.

## Show me the code (dbt SQL Template)
\`\`\`sql
-- Your final executive mart: fct_total_sales.sql
{{ config(materialized='table') }}

with jumia as (select * from {{ ref('stg_jumia_sales') }}),
     konga as (select * from {{ ref('stg_konga_sales') }}),
     web as (select * from {{ ref('stg_web_sales') }})

select * from jumia
union all
select * from konga
union all
select * from web
\`\`\`

## Presenting to Executives
Tell the CEO: "We no longer have three different revenue numbers. This dbt model is the official record. It is tested for accuracy every day, and here is the documentation that explains exactly how we calculated every Naira."`,
      'scenario': `## Scenario: The "Data Quality" Crisis
**The situation:** Just before the big quarterly board meeting, your dbt tests fail! They detect that the "Revenue" column has negative numbers (which should be impossible).

**Your job:**
1. Use the dbt test logs to identify which source (Jumia, Konga, or Web) is sending the bad data.
2. Fix the "Transformation" logic in your staging model to handle these errors.
3. Re-run the tests and show the CEO the "Green" checkmarks.
4. Explain how dbt "Caught the error" before the board saw the wrong numbers.

**Think through these:**
- Why is a "Failed Test" actually a "Success" for a data engineer?
- How does "Automated Testing" protect your reputation as an MIS professional?`,
      'quizzes': [
        {
          'question': "Why is it important to upload your dbt models and schema.yml to GitHub for this project?",
          'options': ["A. To show off your SQL skills", "B. To allow other engineers to review your logic, collaborate on improvements, and maintain the 'Single Version of Truth' as a team", "C. Because the CEO likes reading SQL", "D. To make the database run faster"],
          'correct': 1,
          'explanation': "dbt + GitHub = Reliability. By version controlling your models, you ensure that every change to the business logic is tracked, tested, and approved before it hits the executive dashboard."
        }
      ]
    }
  },
  'Power BI & Visualization': {
    'Connecting to Data Sources': {
      'lesson': `## Why are we learning Data Connectivity?
In Excel, you usually open a file and start typing. In Power BI, you **connect** to data. This is critical because it allows your dashboard to refresh automatically when the underlying source changes, without you ever having to re-copy and re-paste.

## Step-by-Step Tutorial: Connecting your first source
1. **The "Get Data" Button**: Open Power BI Desktop. On the Home ribbon, click **Get Data**. You will see over 100 connectors (Excel, SQL, Web, Google BigQuery, etc.).
2. **Import vs. DirectQuery**:
   - **Import (Beginner)**: Power BI takes a "snapshot" of the data and stores it in its own memory. This is the fastest and most common method.
   - **DirectQuery (Pro)**: Power BI doesn't store the data; it asks the database for the answer every time you click a chart. Use this for massive datasets (billions of rows).
3. **Connecting to the Web**:
   - Select **Web** from the connectors.
   - Paste a URL (like a GitHub CSV raw link).
   - Click **Transform Data** (Never click "Load" immediately; always clean your data first!).

## Let's look at a Real Business Example
Imagine a Nigerian Fintech like **OPay**. They have millions of transactions stored in a SQL database. Instead of exporting a CSV every day, an MIS Analyst connects Power BI directly to the SQL Server using **DirectQuery**. Now, the CEO can look at a dashboard at 10:00 AM and see exactly how many people have performed transactions in the last 5 minutes.

## Common Mistakes to Avoid
- **Hard-coding file paths**: If you connect to \`C:\\Users\\Amarachi\\data.csv\`, the dashboard will break when you share it with your boss because she doesn't have your "Amarachi" folder. Use Cloud storage (OneDrive/SharePoint) instead.
- **Loading Dirty Data**: Beginners click "Load" immediately. Pros always click "Transform" to check for errors first.`,
      'scenario': `## Scenario: The "Stale Data" Complaint
**The situation:** The Sales Director is angry. He says your dashboard shows ₦5M in sales for yesterday, but his team's manual spreadsheet shows ₦7M.

**What you're seeing:**
You check Power BI and realize you imported the data from an Excel file that was downloaded at 10:00 AM yesterday. The ₦2M in late sales are missing.

**Your job:**
1. Change the Data Source from the static Excel file to a direct connection to the CRM Database.
2. Set up "Scheduled Refresh" so it updates automatically every hour.

**What the solution looks like:**
By connecting directly to the source system, you remove human error and timing issues. The Director never complains about "stale data" again.`,
      'quizzes': [
        {
          'question': "What is the main difference between 'Import Mode' and 'DirectQuery' in Power BI?",
          'options': ["A. Import is for Excel, DirectQuery is for Word", "B. Import copies the data into Power BI's memory, DirectQuery leaves it in the database and queries it live", "C. DirectQuery is always faster than Import", "D. Import is only for cloud databases"],
          'correct': 1,
          'explanation': "Importing takes a 'snapshot' that must be refreshed. DirectQuery is a live pipe to the database."
        }
      ]
    },
    'Data Cleaning in Power Query': {
      'lesson': `## Why are we learning Power Query?
Raw data is almost always "dirty." Dates are stored as text, columns have messy names, and there are empty rows at the bottom. **Power Query** is the "Kitchen" of Power BI where you clean the ingredients before cooking the meal (the dashboard).

## Step-by-Step Tutorial: The "M" Power Cleaning
1. **The Recipe (Applied Steps)**: Every time you delete a column or filter a row, Power Query records that action in the **Applied Steps** pane. It is like a "Macro" that records itself.
2. **Promoting Headers**: Sometimes your data starts on Row 2. Click **"Use First Row as Headers"** to fix this.
3. **Changing Data Types**: This is the #1 cause of errors. Ensure your "Date" columns actually have the little calendar icon 📅 and "Sales" has the number icon 1.2.
4. **Unpivoting**: If you have columns for "Jan", "Feb", "Mar", highlight them and click **Unpivot Columns**. This turns 12 columns into 2 (Month and Value), which is required for professional modeling.

## Let's look at a Real Business Example
A retailer like **Shoprite** receives sales data from 20 different branches. Some branches use \`DD/MM/YYYY\` and others use \`MM/DD/YYYY\`. An MIS Analyst uses Power Query to detect the "Locale" and standardize all dates into one format. Without this, the "Total Sales" chart would be completely wrong.

## Common Mistakes to Avoid
- **Deleting the wrong step**: If you delete a step in the middle of the "Applied Steps" list, it might break all the steps that came after it.
- **Manual Cleaning**: Never clean the data in Excel before importing. Use Power Query so that when the data refreshes next month, the cleaning happens automatically!`,
      'scenario': `## Scenario: The "Dirty Dates" Crisis
**The situation:** Your dashboard crashed. The total sales chart is blank. 

**What you're seeing:**
You look at the raw data and see the new regional manager typed dates as "Jan 5th 2024" instead of "05/01/2024". Power BI thinks this is text, not a date.

**Your job:**
1. Open Power Query.
2. Select the Date column and use "Change Type -> Date" or extract the text properly.
3. Save the step so the system knows how to handle this format next week.

**What the solution looks like:**
You've created a robust cleaning step. The dashboard is fixed, and the data pipeline is now resilient against this specific human error.`,
      'quizzes': [
        {
          'question': "Why is Power Query described as an 'Automated Recipe'?",
          'options': ["A. Because it only works with food data", "B. Because it records every cleaning step you make and automatically applies them to new data", "C. Because it writes SQL for you", "D. Because it creates charts instantly"],
          'correct': 1,
          'explanation': "The magic of Power Query is the 'Applied Steps' list. You clean the data once, and it remembers how to do it forever."
        }
      ]
    },
    'DAX Basics (Calculated Columns vs Measures)': {
      'lesson': `## What is DAX?
DAX (Data Analysis Expressions) is the formula language of Power BI. It's like Excel formulas on steroids. 

## Why should you care as an MIS student?
You can't just drag and drop everything. If the CEO wants "Year-to-Date Profit Margin compared to Last Year," that number doesn't exist in the database. You have to write a DAX formula to calculate it dynamically.

## How it actually works
- **Calculated Column**: Computes a value for *every single row* in a table (e.g., Price - Cost = Profit). Uses up memory.
- **Measure**: Calculates a result *on the fly* based on what you click in the dashboard (e.g., Total Sales). Extremely fast and flexible.

## Show me the code (DAX)
\`\`\`dax
-- A simple Measure
Total Revenue = SUM(Sales[Revenue])

-- A more advanced Measure (Time Intelligence)
Revenue YTD = CALCULATE(
    [Total Revenue], 
    DATESYTD('DateTable'[Date])
)
\`\`\`

## Real life: How companies use this
A telecom company uses DAX Measures to calculate "Churn Rate." Because they used a Measure instead of a Column, a manager can click "Lagos" on the map, and the Churn Rate instantly recalculates for just the Lagos customers.

## Remember these three things
- DAX is how you create complex business logic.
- Use **Columns** for things you want to slice/filter by (like "Age Group").
- Use **Measures** for numbers you want to calculate (like "Total Profit").`,
      'scenario': `## Scenario: The "Slow Dashboard"
**The situation:** The CEO complains that the dashboard takes 30 seconds to load every time he clicks a button.

**What you're seeing:**
You look at the Power BI file and realize someone created 50 "Calculated Columns" for complex math. The file size is huge, and the computer is struggling to process every row.

**Your job:**
1. Delete the Calculated Columns.
2. Rewrite the logic using **Measures**.
3. Watch the file size drop and the speed increase instantly.

**What the solution looks like:**
By understanding the difference between row-context (Columns) and filter-context (Measures), you optimized the system. The dashboard now loads in 1 second.`,
      'quizzes': [
        {
          'question': "When should you use a DAX Measure instead of a Calculated Column?",
          'options': ["A. When you want to calculate a dynamic aggregate (like Total Sales) that changes based on what the user clicks in the dashboard", "B. When you want to create a new category to group data (like 'High Income' vs 'Low Income')", "C. When you want to make the file size larger", "D. Never, they are the exact same thing"],
          'correct': 0,
          'explanation': "Measures are calculated on the fly based on the user's filters. Columns are calculated once for every row and take up memory."
        }
      ]
    },
    'Building Interactive Dashboards': {
      'lesson': `## Why are we learning Dashboard Design?
A dashboard is not just a collection of charts; it is a story. If a CEO looks at your dashboard and can't find the "Total Profit" in 5 seconds, you have failed as an MIS Analyst.

## Step-by-Step Tutorial: The "5-Second Rule"
1. **Visual Hierarchy**: Put your most important numbers (KPI Cards) at the top left. This is where the human eye starts reading.
2. **Slicers (Interactivity)**: Add a **Date Slicer** and a **Region Slicer**. This allows managers to "self-serve"—they don't have to call you to ask for "Lagos Sales"; they just click the button themselves.
3. **Cross-Filtering**: In Power BI, clicking a bar in one chart automatically filters all other charts on the page. This allows you to find "Hidden Patterns."
4. **Tooltips**: Create a small "hover" page. When a user hovers over a city, a tiny chart pops up showing the sales trend for just that city.

## Let's look at a Real Business Example
**Flutterwave** has a "Global Merchant Dashboard." The top left shows "Total Transaction Volume (GTV)." Below that is a map. If the Head of Sales clicks on "Ghana" on the map, the rest of the page instantly changes to show only Ghana's top merchants. This allows for rapid, data-driven strategy meetings.

## Common Mistakes to Avoid
- **Chart Junk**: Don't use 3D pie charts or 50 different colors. Keep it clean. Use a maximum of 3 main colors that match the company brand.
- **Too many visuals**: If you put 20 charts on one page, the user will be overwhelmed. Focus on the 4 or 5 most important questions the business needs to answer.`,
      'scenario': `## Scenario: The "Wall of Numbers"
**The situation:** You present your new dashboard. It's basically just a giant table with 50 columns of numbers. The executives look bored and confused.

**Your job:**
1. Replace the giant table with high-level KPI "Cards" (Total Sales, Total Profit).
2. Add a Bar Chart for "Sales by Region."
3. Add a Line Chart for "Sales Trend over Time."
4. Add a Slicer so they can filter by Month.

**What the solution looks like:**
You changed data into a story. Instead of staring at numbers, the CEO immediately sees that the trend line dipped in March and clicks to investigate. You made the data actionable.`,
      'quizzes': [
        {
          'question': "What is the primary purpose of a 'Slicer' in a Power BI dashboard?",
          'options': ["A. To cut the data in half and delete it", "B. To allow the user to easily filter the data shown on the dashboard interactively", "C. To change the colors of the charts", "D. To connect to a new database"],
          'correct': 1,
          'explanation': "Slicers are visual filters. They allow non-technical users to 'slice' the data by region, date, or category with a simple click."
        }
      ]
    },
    'Publishing & Workspaces': {
      'lesson': `## Why are we learning Publishing?
Power BI Desktop is for you (the developer). The **Power BI Service (Cloud)** is for the rest of the company. You don't email a Power BI file; you **Publish** it to a secure website where everyone can view it on their phone or laptop.

## Step-by-Step Tutorial: The Journey to the Cloud
1. **The Publish Button**: Click **Publish** in the top right. This uploads your report to your account at \`app.powerbi.com\`.
2. **Workspaces**: These are like "Shared Folders" for your team. You might have an "HR Workspace" and a "Finance Workspace." Only people in those teams can see the reports.
3. **Scheduled Refresh**: Go to the settings of your dataset and set it to refresh at 8:00 AM every day. Now, you never have to manually update the data again!
4. **Mobile Optimization**: Use the **Mobile Layout** view to rearrange your charts for someone looking at the dashboard on an iPhone or Android device.

## Let's look at a Real Business Example
A bank uses **Row-Level Security (RLS)** in the Power BI Service. When the Lagos Branch Manager logs into the published dashboard, he only sees Lagos data. When the National Director logs into the exact same dashboard link, she sees all of Nigeria. This ensures data privacy across the entire organization.

## Common Mistakes to Avoid
- **Publishing to "My Workspace"**: If you publish to your personal workspace, no one else can see it. Always use a "Pro" Workspace for company projects.
- **Forgetting the Gateway**: If your data is on a local PC and you publish to the cloud, the "Refresh" will fail unless you install a **Power BI Gateway** to bridge the gap.`,
      'scenario': `## Scenario: The "Wrong Eyes" Problem
**The situation:** You built an HR dashboard showing employee salaries. You accidentally emailed the raw Power BI file to the entire company. Panic ensues.

**Your job:**
1. Stop emailing files!
2. Publish the dashboard to a secure "HR Only" Workspace in the Power BI Service.
3. Grant "Viewer" access only to the HR Director.

**What the solution looks like:**
By using the Cloud Service, you maintain strict security. The data stays in the cloud, users can't edit the calculations, and you can revoke access at any time.`,
      'quizzes': [
        {
          'question': "Why is it better to 'Publish' a dashboard to the Power BI Service rather than emailing the .pbix file to your boss?",
          'options': ["A. It is not better, emailing is faster", "B. Publishing ensures security, allows automatic refreshing, and ensures everyone looks at the same version", "C. Because the Power BI service prints the dashboard on paper", "D. Because emails cannot handle data"],
          'correct': 1,
          'explanation': "Publishing creates a 'Single Version of Truth' in the cloud. Emailing files leads to security risks and multiple conflicting versions of the dashboard."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Global Performance Control Center
In this final visualization project, you are stepping into the shoes of a Lead BI Developer. You must solve a broad, strategic problem: The company is drowning in data but starving for insights.

## The Broad Business Problem
Your global manufacturing company, **"AdventureWorks,"** operates in 40 countries. The executive board is frustrated. Currently, they receive 15 different static Excel reports every Friday. It takes them hours to figure out if the company is actually making a profit, and by the time they do, the data is a week old. They are losing market share because they cannot make fast decisions about which products or regions to expand.

## Your Project Tasks:
0. **The Data**: Download the [AdventureWorks Relational Database](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases/adventure-works) (Sales, Customers, Products, and Territories).
1. **The Connection & Cleaning**: Connect Power BI to the tables. Use Power Query to clean the data (remove empty columns, ensure dates are formatted correctly).
2. **The Data Model**: Create a Star Schema by linking the Tables together using their Foreign Keys.
3. **The DAX Logic**: Create strategic Measures: Total Revenue, Profit Margin %, and Year-over-Year Growth.
4. **The Dashboard**: Build an interactive Control Center. It must include:
   - A Map showing global revenue.
   - High-level KPI Cards for the CEO.
   - Slicers for Year and Region so the board can drill down instantly.
5. **The Delivery**: Upload a PDF export of your final dashboard and a summary of the business insights you found to your GitHub portfolio.

## Presenting to Executives
Tell the Board: "We have replaced 15 static spreadsheets with one live control center. You no longer have to wait until Friday to know our profit margins. If you want to know why Europe is underperforming, you simply click on Europe, and the entire data model recalculates instantly to show you the exact products failing in that region."`,
      'scenario': `## Scenario: The "Mobile CEO"
**The situation:** The CEO calls you. She says the dashboard is amazing on her laptop, but she is currently at an airport trying to look at it on her iPhone, and the charts are too small to read.

**Your job:**
1. Open your Power BI Desktop file.
2. Switch to the "Mobile Layout" view.
3. Rearrange your KPI cards and charts into a vertical, phone-friendly stack.
4. Re-publish the report.

**What the solution looks like:**
You understand that executives are rarely sitting at desks. By optimizing for mobile, you ensure that strategic data is always in the CEO's pocket, cementing your value to the company.`,
      'quizzes': [
        {
          'question': "When building a Star Schema data model in Power BI, how should your tables be organized?",
          'options': ["A. Put everything into one giant table", "B. Have a central 'Fact' table (like Sales) surrounded by 'Dimension' tables (like Customers, Products, Dates) linked by relationships", "C. Don't use tables, use folders", "D. Delete all tables except the biggest one"],
          'correct': 1,
          'explanation': "The Star Schema is the gold standard for BI. Facts (the numbers/events) go in the middle, and Dimensions (the descriptive filters) surround them like a star."
        }
      ]
    }
  }
};

