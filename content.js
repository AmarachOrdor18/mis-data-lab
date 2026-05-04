// MIS Data Analytics Engineering Lab - Static Content Database
const STATIC_CONTENT = {
  'Python': {
    'Variables & Data Types': {
      'lesson': `## What is Variables & Data Types?
Variables are like labeled containers where you store information. Data types are the "rules" for what kind of information fits in those containers—like numbers, text, or lists.

## Why should you care as an MIS student?
In an ERP system or a banking app, every piece of data has a type. An account balance must be a number (float), while a customer's name must be text (string). If you try to add a name to a balance, the system crashes. Understanding this is the foundation of data integrity.

## How it actually works
1. **Assignment**: You give a name to a value using \`=\`.
2. **Strings**: Text wrapped in quotes, used for names, addresses, or IDs.
3. **Integers/Floats**: Whole numbers or decimals, used for quantities and prices.
4. **Booleans**: True/False values, used for "Is Active?" or "Is Paid?" checks.

## Show me the code
\`\`\`python
# Storing customer data
customer_name = "Chidi Okafor"  # String
account_balance = 25050.75      # Float
is_premium_member = True         # Boolean
transaction_count = 14           # Integer

# Quick calculation
new_balance = account_balance + 5000
print(f"Update: {customer_name} now has ₦{new_balance}")
\`\`\`

## Real life: How companies use this
A company like **Interswitch** processes millions of transactions. Their code must strictly define that a "Transaction ID" is a string but the "Amount" is a decimal. If a variable type is wrong, reconciliations fail, and money goes missing from reports.

## Remember these three things
- Variables store data; Data Types define what that data is.
- Python is "smart" and guesses the type, but you must keep track of it.
- Correct data types are the first step to accurate business reporting.`,
      'scenario': `## Scenario: The Corrupted Payroll Export
**The situation:** You are working at a fintech startup in Lagos. The HR department just exported a CSV of employee bonuses, but when you try to calculate the total payout, the system throws a "TypeError."

**What you're seeing:**
The system says: \`TypeError: can only concatenate str (not "float") to str\`.
Looking at the data, the bonus column looks like this: \`"₦50,000.00"\`.

**Your job:**
1. Identify why the math is failing.
2. Figure out how to strip the "₦" and the commas.
3. Convert the resulting text into a proper Float so you can sum it up.

**Code to look at:**
\`\`\`python
bonus_text = "₦50,000.00"
# Current failing line:
# total = bonus_text + 500.0 
\`\`\`

**Think through these:**
- Why did the export include the currency symbol inside the data field?
- How does "dirty data" like this affect automated financial reports?
- In MIS, why is it better to store raw numbers and handle formatting in the UI layer?

**What the solution looks like:**
A senior engineer would use \`.replace()\` to remove the currency symbol and commas, then use the \`float()\` function to convert the cleaned text into a number. This turns "dirty" text back into usable financial data for the business.`,
      'quizzes': [
        {
          'question': "Which data type would you use to store a customer's 'Email Address' in a marketing database?",
          'options': ["A. Integer", "B. Float", "C. String", "D. Boolean"],
          'correct': 2,
          'explanation': "Email addresses are text-based, so a String is the correct choice. Integers and Floats are for numbers you do math with."
        },
        {
          'question': "If you see the error 'TypeError: unsupported operand type(s) for +: int and str', what happened?",
          'options': ["A. The variable name is wrong", "B. You tried to add a number to a piece of text", "C. The database is offline", "D. The internet is slow"],
          'correct': 1,
          'explanation': "This error happens when you try to perform math between a number and text. Python doesn't know how to 'add' a number to a word."
        }
      ]
    },
    'Lists, Dicts & Loops': {
      'lesson': `## What is Lists, Dicts & Loops?
Lists are ordered collections of items (like a shopping list). Dictionaries (Dicts) are pairs of Keys and Values (like a contact list where a Name points to a Number). Loops are the "engines" that go through these collections one by one.

## Why should you care as an MIS student?
Business data is rarely just one number; it's a list of customers, a dictionary of product prices, or a loop that processes every invoice in a month. This is how you automate repetitive tasks.

## How it actually works
1. **Lists**: \`['Apple', 'Samsung', 'Google']\`. Good for simple sequences.
2. **Dicts**: \`{'ID': 101, 'Name': 'Kuda'}\`. Good for structured records.
3. **For Loops**: "For every item in this list, do this action."

## Show me the code
\`\`\`python
# A list of daily sales
sales = [1200, 4500, 3200, 8000]
total_revenue = 0

# A loop to calculate total
for sale in sales:
    total_revenue += sale

# A dictionary for a specific branch
branch_info = {
    "name": "Ikeja Branch",
    "manager": "Mrs. Adeyemi",
    "active": True
}

print(f"{branch_info['name']} total revenue: ₦{total_revenue}")
\`\`\`

## Real life: How companies use this
**Jumia** uses loops and dictionaries for their inventory. When you search for a phone, the system loops through a list of thousands of products. Each product is a dictionary containing its price, specs, and stock level. Without loops, an employee would have to check each item manually.

## Remember these three things
- Lists keep things in order; Dicts keep things labeled.
- Loops save you hours of manual work by repeating code.
- Combining these three allows you to process entire business datasets at once.`,
      'scenario': `## Scenario: The Bulk Discount Automation
**The situation:** You work for a large retail distributor in Onitsha. The manager wants to apply a 10% discount to every item in a shipment list that costs more than ₦10,000. There are 500 items.

**What you're seeing:**
A list of prices. Some are low, some are high. Doing this in Excel takes time and is prone to human error if items are added later.

**Your job:**
1. Create a loop to look at each price.
2. Use an "If" statement to find prices over 10,000.
3. Update those specific prices in the list.

**Code to look at:**
\`\`\`python
prices = [5000, 12000, 8500, 25000]
# How do we loop and change only the big ones?
\`\`\`

**Think through these:**
- Why is it better to automate this rather than doing it manually in a spreadsheet?
- What happens if the discount rule changes to 15% tomorrow? How fast can you fix it?
- How does this help maintain "one version of truth" in your pricing data?

**What the solution looks like:**
A data analyst would write a short \`for\` loop that checks each item. If the item qualifies, the code does the math and updates the value. This ensures the 10% discount is applied perfectly to every single eligible item in seconds.`,
      'quizzes': [
        {
          'question': "Which data structure is best for storing a user's profile where you need to access their 'Age' by its label?",
          'options': ["A. List", "B. Dictionary", "C. Integer", "D. String"],
          'correct': 1,
          'explanation': "Dictionaries use 'Key-Value' pairs, making it easy to look up data by a label (the key) like 'Age'."
        },
        {
          'question': "What is the primary purpose of a 'For Loop' in data engineering?",
          'options': ["A. To store a single value", "B. To repeat an action for every item in a collection", "C. To delete a database", "D. To change a variable name"],
          'correct': 1,
          'explanation': "Loops are used to iterate through collections (lists, dicts, rows) and perform actions on each item automatically."
        }
      ]
    }
  },
  'ETL Pipelines': {
    'What is ETL? (Plain English)': {
      'lesson': `## What is ETL?
ETL stands for **Extract, Transform, and Load**. It is the process of moving data from one place (like a sales app), cleaning it up, and putting it into another place (like a dashboard).

## Why should you care as an MIS student?
Business data is messy. Your sales might be in an Oracle database, your marketing data in a CSV, and your website hits in an API. ETL is the "bridge" that brings them all together into one clean report so management can make decisions.

## How it actually works
1. **Extract**: Grabbing the raw data from the source.
2. **Transform**: The "cooking" phase. Fixing typos, changing date formats, or calculating totals.
3. **Load**: Saving the finished, clean data into its final home (a Data Warehouse).

## Show me the code
\`\`\`python
# A very simple ETL process
# 1. EXTRACT
raw_data = "John Doe, 5000, 2023-01-01"

# 2. TRANSFORM
name, amount, date = raw_data.split(", ")
clean_amount = float(amount)
clean_date = date.replace("-", "/")

# 3. LOAD
print(f"Loading to Warehouse: {name} | ₦{clean_amount} | {clean_date}")
\`\`\`

## Real life: How companies use this
**Zenith Bank** uses ETL to generate your monthly statement.
1. **Extract**: They pull every transaction you made from their core banking system.
2. **Transform**: They sort them by date, calculate your final balance, and add your name.
3. **Load**: They generate the PDF you see in your email.
Without ETL, your statement would just be a list of raw computer codes.

## Remember these three things
- Extract = Get; Transform = Clean; Load = Save.
- ETL is how "raw data" becomes "business information."
- Most of an engineer's time is spent in the Transform phase fixing errors.`,
      'scenario': `## Scenario: The Multi-Branch Revenue Mess
**The situation:** You are the MIS lead for a retail chain with branches in Lagos, Abuja, and Port Harcourt. Every evening, each branch sends a CSV of their sales.

**What you're seeing:**
- Lagos uses \`DD-MM-YYYY\` for dates.
- Abuja uses \`YYYY/MM/DD\`.
- Port Harcourt sends their sales in US Dollars ($) while the others use Naira (₦).

**Your job:**
1. Extract the data from all three files.
2. Transform: Standardize the dates and convert the Dollars to Naira using a fixed rate.
3. Load: Combine them into one "Master Sales" table for the CEO.

**Code to look at:**
\`\`\`python
# Abuja Date: "2023/12/01"
# Lagos Date: "01-12-2023"
# How do we make them look the same?
\`\`\`

**Think through these:**
- Why can't the CEO just look at the three separate files?
- What happens if the conversion rate from USD to Naira changes?
- How does ETL protect the "integrity" of the final report?

**What the solution looks like:**
You would build a pipeline that reads each file and applies "cleaning rules." It would re-format every date to a single standard and multiply the USD values by the current exchange rate. The CEO then sees one clean, accurate number instead of a confusing mess.`,
      'quizzes': [
        {
          'question': "In ETL, what happens during the 'Transform' phase?",
          'options': ["A. Data is deleted", "B. Data is cleaned, formatted, or calculated", "C. Data is sent to the printer", "D. The database is turned off"],
          'correct': 1,
          'explanation': "Transform is where you fix errors, change formats, and prepare the data for the final report."
        },
        {
          'question': "Which of these is an example of the 'Extract' phase?",
          'options': ["A. Saving a file to a folder", "B. Downloading sales data from a website API", "C. Calculating a 10% tax", "D. Changing a font color"],
          'correct': 1,
          'explanation': "Extracting is the act of pulling data out of a source system so it can be processed."
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
    }
  },
  'APIs & REST': {
    'What is an API? (Really)': {
      'lesson': `## What is an API?
An API (Application Programming Interface) is a "messenger" that takes a request from one system and brings back a response from another. Think of it as a waiter in a restaurant taking your order to the kitchen.

## Why should you care as an MIS student?
Modern business is built on APIs. When you pay with "Paystack," your website talks to Paystack via an API. When you see a "Google Map" on a real estate app, it's an API. Mastering APIs allows you to connect any business system to another.

## How it actually works
1. **Endpoint**: The "address" of the API (like a URL).
2. **Method**: What you want to do (GET = Read, POST = Create).
3. **JSON**: The format of the data (simple text that looks like a list).
4. **Auth**: The "key" that proves you have permission to access the data.

## Show me the code
\`\`\`python
import requests

# Getting the current price of Bitcoin
url = "https://api.coindesk.com/v1/bpi/currentprice.json"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    price = data['bpi']['USD']['rate']
    print(f"Current Bitcoin Price: ${price}")
\`\`\`

## Real life: How companies use this
**Kuda Bank** doesn't own every mast or payment network. They use APIs to talk to NIBSS (for transfers), to Telcos (for airtime), and to AWS (for cloud storage). APIs allow them to act like a giant bank while keeping their internal team small and focused on code.

## Remember these three things
- APIs allow different apps to "talk" to each other.
- JSON is the universal language of API data.
- 404 means 'Not Found', 200 means 'Success', 401 means 'No Permission'.`,
      'scenario': `## Scenario: The Broken Payment Webhook
**The situation:** You are the MIS analyst for an e-commerce site. Customers are complaining that they pay for items, but the website still says "Pending Payment."

**What you're seeing:**
The payment provider (like Flutterwave) is sending an API "POST" request to your server after every success, but your server is returning a "500 Internal Server Error."

**Your job:**
1. Check if your API endpoint is actually "listening" for requests.
2. Verify if the JSON data being sent matches what your code expects.
3. Fix the code so it saves the "Paid" status to your database correctly.

**Code to look at:**
\`\`\`python
# We expect 'status': 'success'
# But the provider sends 'transaction_status': 'successful'
incoming_data = {"transaction_status": "successful"}

if incoming_data.get('status') == 'success':
    print("Marking as paid!")
else:
    print("Still pending...")
\`\`\`

**Think through these:**
- Why did a simple name change (status vs transaction_status) break the business?
- Why is it important to "log" every incoming API request?
- How do APIs help businesses scale without hiring more manual data entry staff?

**What the solution looks like:**
You would update your code to match the exact labels the payment provider uses. You'd also add "error handling" so that if the data looks weird, the system sends an alert instead of just silently failing.`,
      'quizzes': [
        {
          'question': "Which HTTP method is used to 'Read' or 'Fetch' data from an API?",
          'options': ["A. POST", "B. DELETE", "C. GET", "D. PUT"],
          'correct': 2,
          'explanation': "GET is used to retrieve data. POST is used to create new data, PUT is used to update, and DELETE is for removing data."
        }
      ]
    }
  },
  'Cloud Computing': {
    'Cloud Basics for MIS': {
      'lesson': `## What is Cloud Computing?
Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software—over the internet ("the cloud"). Instead of buying physical servers, you rent them.

## Why should you care as an MIS student?
Businesses no longer build "Server Rooms." They use AWS, Azure, or Google Cloud. Understanding the cloud is essential because it's where all modern business data lives. It allows a small startup in Yaba to have the same computing power as a global bank.

## How it actually works
1. **IaaS**: Infrastructure as a Service. Renting the "virtual computer."
2. **SaaS**: Software as a Service. Using apps like Gmail or Salesforce.
3. **Storage**: Like a giant hard drive in the sky (AWS S3).
4. **Compute**: The "brain" that runs your code (AWS Lambda, EC2).

## Show me the code
\`\`\`python
import boto3

# Uploading a file to AWS S3 (Cloud Storage)
s3 = boto3.client('s3')
filename = 'daily_sales.csv'
bucket_name = 'mis-datalab-backups'

s3.upload_file(filename, bucket_name, filename)
print(f"File {filename} backed up to the cloud!")
\`\`\`

## Real life: How companies use this
**Netflix** doesn't own any servers. They run everything on AWS. When millions of people in Nigeria start watching a new show at 8 PM, Netflix's "Cloud" automatically adds more servers to handle the traffic. When people go to sleep, the servers "turn off" to save money.

## Remember these three things
- The Cloud is just "someone else's computer" that you rent.
- It is cheaper and more reliable than buying physical hardware.
- Security and "Pay-as-you-go" are the two biggest reasons businesses switch.`,
      'scenario': `## Scenario: The Server Room Flood
**The situation:** You are the IT manager for a local manufacturing company. A pipe burst in the office, and the server room is flooded. All your physical servers are destroyed. The CEO is asking when the payroll system will be back up.

**What you're seeing:**
The physical hardware is dead. If your data was only on those servers, it's gone. If you had a "Cloud Backup," you could be back online in minutes.

**Your job:**
1. Identify which services could have been moved to the cloud (Email, ERP, File Storage).
2. Calculate the "Downtime Cost" of having physical servers vs Cloud.
3. Propose a migration to AWS or Azure to prevent this from ever happening again.

**Code to look at:**
\`\`\`python
# Check if cloud backup exists
backup_status = check_cloud_storage("payroll_backup_v1")
if backup_status == "OK":
    print("Restore initiated. We will be back in 15 mins.")
else:
    print("Data lost. This is a disaster.")
\`\`\`

**Think through these:**
- Why is "Physical Security" (like floods or theft) a bigger risk for on-premise servers?
- How does the cloud help with "Disaster Recovery"?
- Why is it easier to "Scale" a cloud server when your business grows from 10 to 1000 employees?

**What the solution looks like:**
A smart MIS student would have already pushed daily backups to an "Object Store" like AWS S3. Even if the office burns down, the business data is safe and can be restored to a new virtual server in any part of the world in under an hour.`,
      'quizzes': [
        {
          'question': "What is the main benefit of 'Pay-as-you-go' pricing in Cloud Computing?",
          'options': ["A. You pay a large upfront fee", "B. You only pay for the resources you actually use", "C. You get free hardware", "D. It is more expensive than buying servers"],
          'correct': 1,
          'explanation': "Pay-as-you-go allows businesses to start small and only pay for what they use, which is much cheaper than buying expensive hardware upfront."
        }
      ]
    }
  },
  'dbt & Modeling': {
    'Modern Data Modeling': {
      'lesson': `## What is dbt & Modeling?
dbt (data build tool) is a development framework that combines SQL with software engineering best practices. It's used to transform raw data in your warehouse into "clean" tables for analytics.

## Why should you care as an MIS student?
Raw database tables are confusing for business users. dbt allows you to create "Models" (clean tables) with clear names like \`fct_sales\` or \`dim_customers\`. It's the standard tool for the "Transform" layer of ETL.

## How it actually works
1. **Models**: SQL files that define how a clean table should look.
2. **Version Control**: Saving your SQL in Git so you can see changes over time.
3. **Testing**: Automatically checking if data is missing or wrong.
4. **Documentation**: Generating a website that explains what every column means.

## Show me the code
\`\`\`sql
-- A simple dbt model (dim_customers.sql)
with raw_customers as (
    select * from {{ source('sales_app', 'customers') }}
),
final as (
    select
        id as customer_id,
        first_name || ' ' || last_name as full_name,
        email,
        created_at
    from raw_customers
)
select * from final
\`\`\`

## Real life: How companies use this
**Cowrywise** has millions of rows of transaction data. They use dbt to create a "Verified Revenue" model. Instead of 20 analysts writing 20 different SQL queries to find the total, they all use the one dbt model. This ensures everyone sees the exact same "Single Version of Truth."

## Remember these three things
- dbt turns SQL into a professional engineering process.
- It lives inside your data warehouse (like BigQuery or Snowflake).
- Tests and Documentation are built-in, not afterthoughts.`,
      'scenario': `## Scenario: The "Which Number is Right?" War
**The situation:** In the Monday morning meeting, the Marketing Manager says sales were ₦5M last week. The Finance Manager says they were ₦4.2M. The CEO is angry because nobody knows the real number.

**What you're seeing:**
Marketing is counting "Orders Placed" (including ones not yet paid). Finance is counting "Bank Settlements" (only paid ones). Both are using different SQL queries.

**Your job:**
1. Create a single dbt model called \`fct_sales\`.
2. Define exactly what a "Successful Sale" means in the SQL.
3. Point both managers to use this new model instead of their own queries.

**Code to look at:**
\`\`\`sql
-- The 'One Version of Truth' SQL
select * 
from raw_orders
where status = 'completed' 
  and payment_confirmed = true
\`\`\`

**Think through these:**
- Why is it dangerous for a company to have two different "sales" numbers?
- How does dbt help stop people from writing their own (possibly wrong) SQL?
- Why is "Consistency" more important than "Speed" in business reporting?

**What the solution looks like:**
You would use dbt to "lock down" the definition of a sale. Once the CEO approves your \`fct_sales\` model, it becomes the only number that matters. Marketing and Finance now have to use your model, ending the disagreement and ensuring the business makes decisions based on one accurate number.`,
      'quizzes': [
        {
          'question': "What is the primary language used in dbt (data build tool)?",
          'options': ["A. Python", "B. Java", "C. SQL", "D. C++"],
          'correct': 2,
          'explanation': "dbt is built primarily on SQL, allowing analysts to use the language they already know to do professional data engineering."
        }
      ]
    }
  }
};
