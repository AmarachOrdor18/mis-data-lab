// MIS Data Analytics Engineering Lab - Static Content Database
const STATIC_CONTENT = {
  'Python': {
    'Variables & Data Types': {
      'lesson': `## What is Variables & Data Types?
Variables are like labeled containers where you store information. Data types are the "rules" for what kind of information fits in those containers-like numbers, text, or lists.

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
    },
    'Functions': {
      'lesson': `## What is a Function?
A function is a reusable block of code that performs a specific task. Think of it as a "Recipe." Instead of writing the same steps every time you want to make jollof rice, you just call the "Jollof Recipe."

## Why should you care as an MIS student?
In business, we repeat tasks constantly. Calculating tax, formatting currency, or checking if an account is overdrawn. If you write that logic 20 times and the tax rate changes, you have to fix it 20 times. With a function, you fix it once.

## How it actually works
1. **Definition**: Use \`def\` to name your function.
2. **Parameters**: The "inputs" the function needs (like the amount to tax).
3. **Logic**: The code inside that does the work.
4. **Return**: Sending the final answer back to the main program.

## Show me the code
\`\`\`python
def calculate_vat(amount):
    """Calculates 7.5% VAT for Nigerian business"""
    vat_rate = 0.075
    return amount * vat_rate

# Using the function
order_total = 50000
tax = calculate_vat(order_total)
print(f"Total: ₦{order_total} | VAT: ₦{tax}")
\`\`\`

## Real life: How companies use this
**Flutterwave** uses functions for every transaction. They have a function called \`process_payment(card_info, amount)\`. Whether you are paying for a movie ticket or a flight, the system calls that same "recipe" every time. This makes their system reliable and easy to update.

## Remember these three things
- Functions stop you from repeating yourself (DRY principle).
- They make your code organized and easy for others to read.
- Inputs go in (parameters), an answer comes out (return).`,
      'scenario': `## Scenario: The Messy Discount Logic
**The situation:** Your company has a rule: "Give 5% discount if the customer is premium, and another 2% if they spend over ₦100,000." This logic is currently copy-pasted in 10 different scripts.

**What you're seeing:**
The company just changed the premium discount to 7%. You now have to find every script and change the number manually. You've already missed two scripts, and customers are complaining.

**Your job:**
1. Write one function called \`get_final_price(price, is_premium)\`.
2. Put all the "if/else" logic inside it.
3. Update all your scripts to just call this one function.

**Code to look at:**
\`\`\`python
def get_final_price(price, is_premium):
    discount = 0
    if is_premium:
        discount += 0.07 # Updated rate
    if price > 100000:
        discount += 0.02
    return price * (1 - discount)
\`\`\`

**Think through these:**
- How does putting logic in one place reduce "Human Error"?
- Why is a function name like \`calculate_tax\` better than just writing math directly?
- How does this help a team of 5 engineers work on the same app?

**What the solution looks like:**
A senior MIS analyst would "encapsulate" this logic. By having one source of truth for the discount math, the whole company stays consistent. If the rule changes again, you change one line of code and the entire system is updated instantly.`,
      'quizzes': [
        {
          'question': "Look at this code. What will it print?",
          'code': "def greet(name):\n    return 'Hello ' + name\n\nprint(greet('Amarachi'))",
          'options': ["A. Hello name", "B. Hello Amarachi", "C. Amarachi", "D. Error"],
          'correct': 1,
          'explanation': "The function takes 'Amarachi' as the 'name' parameter and returns the string 'Hello Amarachi'."
        }
      ]
    },
    'Reading & Writing Files': {
      'lesson': `## What is Reading & Writing Files?
Data engineering is mostly about moving data from point A to point B. This often involves opening files (Reading) and saving results (Writing), usually in CSV, JSON, or TXT formats.

## Why should you care as an MIS student?
Not all data is in a database. Many bank reports, inventory lists, and payroll exports are sent as CSV files. If you can't automate reading these, you'll spend your whole career copy-pasting into Excel.

## How it actually works
1. **Open**: Python "grabs" the file from your computer.
2. **Mode**: Tell Python if you want to 'r' (read), 'w' (write), or 'a' (append).
3. **Content**: Reading the lines or writing new text.
4. **Close**: Releasing the file so other apps can use it.

## Show me the code
\`\`\`python
# Writing a new report
with open('report.txt', 'w') as f:
    f.write("Daily Sales Report - Lagos Branch\n")
    f.write("Total: ₦450,000")

# Reading it back
with open('report.txt', 'r') as f:
    content = f.read()
    print(content)
\`\`\`

## Real life: How companies use this
A logistics company like **GIG Logistics** might receive a manifest of 1,000 packages in a CSV file every morning. Instead of a person typing this into their system, a Python script reads the file, extracts the tracking numbers, and updates their database automatically.

## Remember these three things
- The \`with\` keyword is best because it closes the file for you automatically.
- CSV is the most common "Data Language" for business files.
- Always be careful with 'w' mode-it will erase the old file before writing!`,
      'scenario': `## Scenario: The Yearly Archive
**The situation:** You have 365 daily sales files in a folder. Your boss wants one single file that contains every single sale from the entire year.

**What you're seeing:**
A folder full of files like \`sales_jan_01.csv\`, \`sales_jan_02.csv\`, etc. Opening each one manually would take days.

**Your job:**
1. Create a "Master" file in 'Append' mode.
2. Loop through every file in the folder.
3. Read the content of the daily file and write it into the Master file.

**Code to look at:**
\`\`\`python
# Example of appending
with open('master_sales.csv', 'a') as master:
    with open('daily_file.csv', 'r') as daily:
        master.write(daily.read())
\`\`\`

**Think through these:**
- Why is 'a' (append) better than 'w' (write) for this task?
- What happens if one of the daily files is corrupted or empty?
- How much time did you just save compared to a manual Excel merge?

**What the solution looks like:**
You would use a loop combined with \`open(..., 'a')\`. This "stitches" the files together into one large dataset. This is the first step in almost every data engineering pipeline: gathering raw files into one place.`,
      'quizzes': [
        {
          'question': "Which 'mode' should you use if you want to add new data to the END of an existing file without deleting what is already there?",
          'code': "with open('logs.txt', mode='?') as f:\n    f.write('New log entry')",
          'options': ["A. 'r'", "B. 'w'", "C. 'a'", "D. 'x'"],
          'correct': 2,
          'explanation': "'a' stands for Append. It adds to the end of the file. 'w' (Write) would overwrite/delete the existing content."
        }
      ]
    },
    'Pandas Basics': {
      'lesson': `## What is Pandas?
Pandas is a Python library that gives you "Excel-like" powers inside your code. Its main tool is the **DataFrame**, which is essentially a high-performance table.

## Why should you care as an MIS student?
Excel is great, but it gets slow and crashes when you have 500,000 rows. Pandas can handle millions of rows in seconds. It is the "Industry Standard" tool for cleaning and analyzing business data.

## How it actually works
1. **Import**: Bringing the library into your script.
2. **Read**: Loading data from CSV, Excel, or SQL.
3. **Head/Tail**: Quickly looking at the top or bottom of your data.
4. **Summary**: Using \`.describe()\` to get the average, min, and max of your numbers.

## Show me the code
\`\`\`python
import pandas as pd

# Loading a sales file
df = pd.read_csv('sales_data.csv')

# Look at the first 5 rows
print(df.head())

# Get total revenue
total = df['amount'].sum()
print(f"Total Revenue: ₦{total}")

# Get average sale
avg = df['amount'].mean()
print(f"Average Sale: ₦{avg}")
\`\`\`

## Real life: How companies use this
A company like **Shoprite** uses Pandas to analyze what people buy. They might load a week's worth of transactions and use Pandas to find which branch sold the most milk or which day had the lowest customer traffic. It turns a giant "ocean" of numbers into a clear report.

## Remember these three things
- Pandas makes Python feel like a super-powered version of Excel.
- A 'DataFrame' is just a table with rows and columns.
- Use it when your data is too big or the math is too complex for basic Python lists.`,
      'scenario': `## Scenario: The Mystery Average
**The situation:** Your manager gives you a CSV of 50,000 sales and asks: "What was the average transaction size for the Ikeja branch?"

**What you're seeing:**
A file with columns: \`branch_name\`, \`product\`, \`amount\`, and \`date\`. If you used Excel, you'd have to filter, copy, and then calculate. 

**Your job:**
1. Load the data using Pandas.
2. Filter the data to show only "Ikeja".
3. Use the \`.mean()\` method on the "amount" column.

**Code to look at:**
\`\`\`python
import pandas as pd
df = pd.read_csv('all_sales.csv')

# How do we filter for Ikeja?
ikeja_sales = df[df['branch_name'] == 'Ikeja']
print(ikeja_sales['amount'].mean())
\`\`\`

**Think through these:**
- Why is it faster to type two lines of code than to set up filters in Excel?
- What happens if the manager then asks for the Abuja branch? How fast can you change the code?
- How does this help ensure that the "Average" is calculated correctly every single time?

**What the solution looks like:**
By using Pandas, you can answer complex business questions in seconds. You don't just "calculate" the answer; you create a "reusable script" that can generate the same report for any branch or any date range by changing one word.`,
      'quizzes': [
        {
          'question': "What does the .head() method do in Pandas?",
          'code': "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())",
          'options': ["A. Deletes the first row", "B. Shows the last 5 rows", "C. Shows the first 5 rows", "D. Prints the column names only"],
          'correct': 2,
          'explanation': ".head() is used to take a 'peek' at the first few rows of your data to make sure it loaded correctly."
        }
      ]
    },
    'DataFrames & Filtering': {
      'lesson': `## What is DataFrames & Filtering?
Filtering is the act of selecting specific rows from a DataFrame based on a condition (like "All sales over ₦50k" or "All customers in Kano").

## Why should you care as an MIS student?
MIS is about getting the *right* information to the *right* people. A CEO doesn't want to see 100,000 individual sales; they want to see "High-Value Sales" or "Pending Shipments." Filtering is how you slice the data to reveal these insights.

## How it actually works
1. **Conditions**: Using \`==\`, \`>\`, \`<\`, or \`!=\` to define your rule.
2. **Boolean Masking**: Pandas creates a list of True/False for every row.
3. **Selection**: You pass that list back to the DataFrame to keep only the 'True' rows.

## Show me the code
\`\`\`python
import pandas as pd
df = pd.read_csv('customers.csv')

# 1. Filter for big spenders
big_spenders = df[df['total_spend'] > 100000]

# 2. Filter for customers in a specific city
lagos_customers = df[df['city'] == 'Lagos']

# 3. Multiple conditions (Lagos AND Big Spenders)
vip_list = df[(df['city'] == 'Lagos') & (df['total_spend'] > 200000)]

print(vip_list)
\`\`\`

## Real life: How companies use this
**MTN** uses filtering to find "Churn Risks." They might filter their database for customers who haven't made a call in 30 days and have a balance of less than ₦100. They then send these specific people a "We miss you" discount SMS.

## Remember these three things
- Filtering doesn't delete data; it creates a new view of the data.
- Use \`&\` for AND, and \`|\` for OR when using multiple filters.
- Mastering this is how you turn "Big Data" into "Targeted Information."`,
      'scenario': `## Scenario: The Fraud Alert
**The situation:** Your bank's security team wants a list of every transaction that happened between 12 AM and 4 AM that was over ₦500,000.

**What you're seeing:**
A massive table of every single transaction. Looking for these manually is impossible.

**Your job:**
1. Filter the "amount" column for values > 500,000.
2. Filter the "time" column for the early morning hours.
3. Export the list to the security team as a "Potential Fraud" report.

**Code to look at:**
\`\`\`python
# Hint: Combining conditions
suspicious = df[(df['amount'] > 500000) & (df['hour'] < 4)]
\`\`\`

**Think through these:**
- Why is speed so important in this specific business scenario?
- What happens if you accidentally filter for \`<\` 500,000? How does that affect the security team?
- In MIS, how does "Filtering" help in risk management?

**What the solution looks like:**
You would write a script that "slices" the main database down to just the high-risk rows. This is much more accurate than manual checking and can be set to run automatically every hour, keeping the bank's money safe.`,
      'quizzes': [
        {
          'question': "Which line of code correctly filters a DataFrame 'df' for rows where the 'status' column is 'Paid'?",
          'options': ["A. df['status'] == 'Paid'", "B. df[df['status'] == 'Paid']", "C. df.filter('Paid')", "D. df.select('Paid')"],
          'correct': 1,
          'explanation': "The correct syntax is to pass the condition inside square brackets: df[condition]."
        }
      ]
    },
    'The Requests Library': {
      'lesson': `## What is the Requests Library?
Requests is a Python library used to "talk" to the internet. It allows your script to visit a URL and pull data down, just like your browser does, but in a way that code can understand.

## Why should you care as an MIS student?
Many modern business systems don't give you a file; they give you an **API Endpoint**. If you want to get live exchange rates from a bank, weather data for a farm, or stock levels from a supplier, you use Requests to "fetch" that data automatically.

## How it actually works
1. **GET**: Asking for data from a URL.
2. **POST**: Sending data to a URL (like submitting a form).
3. **Status Code**: Checking if the request worked (200 = OK, 404 = Missing).
4. **JSON**: Converting the response into a Python dictionary.

## Show me the code
\`\`\`python
import requests

# Fetching data from a public API
response = requests.get("https://api.kuda.com/v1/rates")

if response.status_code == 200:
    data = response.json()
    print("Rates loaded successfully!")
else:
    print(f"Error: {response.status_code}")
\`\`\`

## Real life: How companies use this
A price comparison site like **PriceCheck** uses the Requests library to "scrape" or pull prices from various retail websites. Every hour, their script visits hundreds of URLs, gets the latest prices, and updates their own site. This is how they always show the cheapest deal without a person checking manually.

## Remember these three things
- Requests is the "Messenger" of the internet for Python.
- Always check the \`status_code\` before trying to use the data.
- It turns the entire web into a database you can query with code.`,
      'scenario': `## Scenario: The Dynamic Currency Converter
**The situation:** You are building a dashboard for an import-export business in Lagos. The owner wants to see their costs in both Naira and Dollars, but the exchange rate changes every day.

**What you're seeing:**
The owner currently types the exchange rate into Excel every morning. Sometimes they forget, and the calculations are wrong.

**Your job:**
1. Find a currency API.
2. Use the Requests library to fetch the live rate at 9 AM every day.
3. Automatically update the dashboard with the new rate.

**Code to look at:**
\`\`\`python
import requests
# How do we get the 'naira_rate' from this response?
response = requests.get("https://api.exchangerate.host/latest?base=USD")
data = response.json()
naira_val = data['rates']['NGN']
\`\`\`

**Think through these:**
- Why is an automated API better than a human typing in a rate?
- What happens if the API website goes down? How should your code handle that?
- How does "Real-Time Data" improve business decision-making?

**What the solution looks like:**
You would build a "Data Connector." Instead of relying on a human, your script talks directly to a financial data provider. This eliminates human error and ensures the business is always working with the most accurate, up-to-date financial information.`,
      'quizzes': [
        {
          'question': "What does a status code of '200' mean when using the Requests library?",
          'code': "response = requests.get(url)\nprint(response.status_code)",
          'options': ["A. Page Not Found", "B. Server Error", "C. Success / OK", "D. Access Denied"],
          'correct': 2,
          'explanation': "200 is the standard HTTP response for a successful request. It means the data was found and sent correctly."
        }
      ]
    },
    'Writing Automation Scripts': {
      'lesson': `## What is Automation?
Automation is writing a script that performs a repetitive task without any human intervention. It's the "Holy Grail" of MIS-making the computer do the boring work while you focus on strategy.

## Why should you care as an MIS student?
Business is full of "Monkey Work." Downloading a file, renaming it, calculating a total, and emailing it to a boss. If you can automate this, you become 10x more productive than your peers. You don't "do" the work; you "build" the worker.

## How it actually works
1. **Schedule**: Setting a time for the script to run (e.g., every morning at 8 AM).
2. **Logic**: The script performs the steps (Download → Clean → Save → Email).
3. **Logging**: The script writes a "diary" of what it did so you can check it later.
4. **Alerts**: Sending you an email only if something goes wrong.

## Show me the code
\`\`\`python
import pandas as pd
import datetime

def run_daily_report():
    # 1. Get Data
    df = pd.read_csv('raw_sales.csv')
    
    # 2. Process
    daily_total = df['amount'].sum()
    
    # 3. Save with Today's Date
    today = datetime.date.today()
    with open(f'report_{today}.txt', 'w') as f:
        f.write(f"Total Sales for {today}: ₦{daily_total}")
    
    print("Report Generated Successfully!")

# This could be scheduled to run every night
run_daily_report()
\`\`\`

## Real life: How companies use this
A bank like **Kuda** might have an automation script that runs at midnight. It looks for any customer who had a failed transfer, automatically retries the transfer, and sends a "Your transfer is now successful" notification to the customer's phone-all while the bank's employees are asleep.

## Remember these three things
- Automation is about replacing "Human Effort" with "Computer Logic."
- A good automation script is "Silent"-it only talks to you if it fails.
- It turns a 2-hour daily task into a 0-second task.`,
      'scenario': `## Scenario: The Monday Morning Panic
**The situation:** Every Monday, your boss spends 3 hours gathering Excel files from 5 different managers to create a "Weekly Summary." He hates it and is always late for the 11 AM meeting.

**What you're seeing:**
Five different managers emailing five different files. Your boss has to open each one, copy the data, and paste it into a master sheet.

**Your job:**
1. Write a script that "watches" the email folder or a shared drive.
2. Automatically reads the five files when they arrive.
3. Merges them and emails the finished "Weekly Summary" to the boss at 9 AM.

**Code to look at:**
\`\`\`python
# Steps to automate:
# 1. Use os.listdir() to find files
# 2. Use pd.concat() to merge them
# 3. Use an email library to send the result
\`\`\`

**Think through these:**
- How does this change your boss's opinion of your MIS skills?
- What happens to the "Accuracy" of the report when a human is no longer copy-pasting the numbers?
- How much "Value" did you just create for the company in terms of saved hours?

**What the solution looks like:**
You would build a "Data Pipeline." By automating the collection and merging of data, you've removed a major bottleneck in the company's information flow. The report is now always on time, always accurate, and requires zero manual effort.`,
      'quizzes': [
        {
          'question': "What is the most important rule for a production-ready automation script?",
          'options': ["A. It must have a pretty user interface", "B. It must handle errors and notify you if it fails", "C. It must be written in the most complex language possible", "D. It must be run manually every time"],
          'correct': 1,
          'explanation': "Since automation runs without you watching, it MUST be able to handle errors (like a missing file) and alert you, otherwise, the business might rely on wrong or missing data."
        }
      ]
    },
    'Error Handling': {
      'lesson': `## What is Error Handling?
Error handling is the art of predicting when your code might fail and telling the computer what to do instead of just crashing. We use **Try / Except** blocks for this.

## Why should you care as an MIS student?
Real-world data is messy. A file might be missing, a website might be down, or a user might type a word where a number should be. If your script crashes, the business process stops. Error handling makes your systems "Resilient."

## How it actually works
1. **Try**: "Try to run this code."
2. **Except**: "If it crashes with this specific error, do this instead."
3. **Finally**: "No matter what happens (success or failure), do this last action" (like closing a database connection).

## Show me the code
\`\`\`python
try:
    # Trying to open a file that might not exist
    with open('important_data.csv', 'r') as f:
        print(f.read())
except FileNotFoundError:
    print("Error: The file is missing! Please check the source folder.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
finally:
    print("Cleanup: System check complete.")
\`\`\`

## Real life: How companies use this
An ATM uses massive error handling. 
**Try**: Dispense cash. 
**Except (No Cash in Machine)**: Show "Temporarily Out of Cash" message. 
**Except (Network Down)**: Show "System Offline." 
Without error handling, the ATM would just show a "Blue Screen of Death" or a computer code that customers wouldn't understand.

## Remember these three things
- Never let your code "Fail Silently"-always log what happened.
- Error handling turns a "Crash" into a "Handled Situation."
- It is the difference between a "Toy Script" and a "Professional Business Tool."`,
      'scenario': `## Scenario: The Silent Pipeline Failure
**The situation:** You built a script that downloads sales data from an API. One day, the API website was down for maintenance. Your script crashed halfway through, and the daily report was never sent.

**What you're seeing:**
A "ConnectionError" in your terminal. Because the script crashed, the steps that come *after* the download (cleaning and saving) never happened.

**Your job:**
1. Wrap the API call in a \`try/except\` block.
2. If it fails, wait 10 minutes and try again (Retry logic).
3. If it still fails, send a Slack message to the team saying "API is down, report will be late."

**Code to look at:**
\`\`\`python
import requests
import time

try:
    response = requests.get("https://api.business.com/data")
    response.raise_for_status() # Check for 404/500 errors
except requests.exceptions.RequestException as e:
    print(f"Warning: API is down. Retrying... {e}")
    # Logic to retry or alert goes here
\`\`\`

**Think through these:**
- Why is it better to send a "Warning" than to just let the script stop working?
- How does this build "Trust" with the business users who rely on your data?
- In MIS, what is the cost of "System Downtime"?

**What the solution looks like:**
You would build a "Self-Healing" script. By adding error handling, your pipeline becomes smart enough to navigate common internet problems. If a critical failure happens, it "raises an alarm" properly so you can fix it, rather than leaving everyone in the dark.`,
      'quizzes': [
        {
          'question': "What happens if an error occurs inside a 'try' block that has a matching 'except' block?",
          'options': ["A. The program stops and shows a red error message", "B. The computer restarts", "C. The code in the 'except' block runs, and the program continues", "D. The error is ignored completely"],
          'correct': 2,
          'explanation': "The 'except' block catches the error, allowing you to handle it (like showing a friendly message) instead of letting the program crash."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Corporate Sales Reporter
This is your first major project. You are going to build an automated Python system that reads messy sales data, cleans it, and generates a formatted "Executive Dashboard" report.

## The Business Case
Your company, **"Lagos Retail Hub,"** has 5 branches. Each branch saves its sales in a messy text file. Currently, an intern spends 4 hours every Monday copying these into Excel. You are going to automate this.

## Your Project Tasks:
0. **The Data**: Download the [Northwind Relational Database from GitHub](https://github.com/pthom/northwind_psql) (Specifically the Orders, Order Details, and Products CSVs).
1. **The Script**: Write a Python script using Pandas to read these separate tables and `MERGE` them using their Foreign Keys (e.g., `product_id`).
2. **The Cleaning**: Handle missing values and ensure the Data Types match before joining (an ID must be an integer in both tables).
3. **The Analytics**: Calculate Total Revenue per Category by joining the merged data.
4. **The Dashboard**: Print a clean, formatted text-based dashboard that an executive can read in 10 seconds.
5. **The Delivery**: Create a new GitHub repository, upload your \`main.py\` and a \`README.md\` explaining how the "Dashboard" works.

## Show me the code (Project Template)
\`\`\`python
# Example of the final Dashboard Output you should generate:
print("=========================================")
print("   LAGOS RETA HUB - WEEKLY EXECUTIVE REPORT")
print("=========================================")
print(f"TOTAL REVENUE:   ₦{total_rev:,.2f}")
print(f"TOP BRANCH:      {top_branch}")
print("-----------------------------------------")
print("Action: Pushing clean report to GitHub...")
\`\`\`

## Presenting to Executives
When you present this, don't show the code. Show the **Dashboard**. Explain how you've reduced a 4-hour manual task to a 2-second automated process. This is how you prove your value as an MIS professional.`,
      'scenario': `## Scenario: The CEO's GitHub Request
**The situation:** You showed the CEO your automated report. He is impressed but says, "Chidi, what if you're not in the office? How do we see the latest version of the code and the report?"

**Your job:**
1. Initialize a Git repository in your project folder.
2. Commit your code with a professional message.
3. Push it to a public GitHub repository.
4. Send the link to the CEO (and your instructor).

**Think through these:**
- Why is GitHub a better "Single Version of Truth" than sending files over Email?
- How does a "Public Portfolio" help your career growth in MIS?`,
      'quizzes': [
        {
          'question': "Why is it important to include a README.md file when you upload your project to GitHub?",
          'options': ["A. It makes the code run faster", "B. It explains to other people (and your boss) what the project does and how to use it", "C. It is required by the Nigerian government", "D. It stores the customer passwords"],
          'correct': 1,
          'explanation': "The README is the 'front door' of your project. It translates your code into business value for anyone viewing your portfolio."
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
    },
    'The Extract Phase': {
      'lesson': `## What is the Extract Phase?
Extraction is the first step of ETL. It involves connecting to a source system-like a database, an API, or a folder of CSVs-and pulling the raw data out into your processing environment.

## Why should you care as an MIS student?
Data is often "locked" inside different systems that don't talk to each other. Your sales are in one app, and your expenses are in another. Extraction is how you "free" that data so you can combine it for business intelligence.

## How it actually works
1. **Source Identification**: Finding where the data lives.
2. **Connection**: Using a "driver" or a "key" to access the system.
3. **Data Pull**: Copying the data without changing it (we save the "cooking" for the Transform phase).
4. **Staging**: Putting the raw data into a temporary "waiting room" (Staging Area).

## Show me the code
\`\`\`python
import pandas as pd

# Extracting from a CSV file
df_csv = pd.read_csv('branch_a_sales.csv')

# Extracting from a JSON API
import requests
response = requests.get('https://api.branch-b.com/orders')
df_json = pd.DataFrame(response.json())

# Combining them in the staging area
staging_area = pd.concat([df_csv, df_json])
print(f"Extracted {len(staging_area)} rows total.")
\`\`\`

## Real life: How companies use this
A fintech like **Kuda** extracts data from thousands of mobile phones every second. They don't process it on the phone; they "Extract" the transaction details and send it to their central servers. This keeps the phone app fast while allowing the bank to run complex fraud checks on their own big computers.

## Remember these three things
- Extraction should be as fast as possible to avoid slowing down the source system.
- Don't try to "fix" the data during extraction; just get it out safely.
- If extraction fails, the entire pipeline stops-it is the foundation of ETL.`,
      'scenario': `## Scenario: The Locked Database
**The situation:** Your company's main database is very old and slow. Every time you try to "Extract" data for your daily report, the database crashes, and the sales team can't use the app for 10 minutes.

**What you're seeing:**
Angry emails from the sales team. Your extraction script is "locking" the tables, preventing anyone else from reading or writing data while you are pulling it.

**Your job:**
1. Figure out how to extract "incrementally" (only getting new rows since yesterday).
2. Schedule the extraction for 2 AM when nobody is using the system.
3. Use a "Read-Only" connection to reduce the load on the database.

**Code to look at:**
\`\`\`python
# Instead of: select * from sales
# Use: select * from sales where transaction_date = '2023-12-01'
\`\`\`

**Think through these:**
- Why is "Impact on Source" a major concern for an MIS manager?
- How does moving extraction to "Off-Peak Hours" improve business operations?
- What happens if you need "Real-Time" data? How does that change your extraction strategy?

**What the solution looks like:**
A professional engineer would implement "Incremental Extraction." By only pulling the 500 new rows from today instead of all 10 million rows from history, the process finishes in seconds, uses very little power, and doesn't crash the company's main system.`,
      'quizzes': [
        {
          'question': "Which of these best describes the goal of the 'Extract' phase?",
          'options': ["A. To calculate the final profit of the company", "B. To pull raw data from a source system into a processing area", "C. To delete old customer records", "D. To design a new user interface"],
          'correct': 1,
          'explanation': "Extract is solely about getting the raw, unchanged data out of the source system so it can be used later."
        }
      ]
    },
    'Cleaning & Transforming Data': {
      'lesson': `## What is Cleaning & Transforming?
Transformation is the "T" in ETL. It is where raw, messy data is turned into clean, useful information. This includes fixing typos, removing duplicates, converting currencies, and joining tables together.

## Why should you care as an MIS student?
"Garbage In, Garbage Out." If your raw data says a customer's age is "-5" or their name is "Null", your final report will be wrong. Transformation is the "Filter" that ensures only high-quality data reaches the CEO's dashboard.

## How it actually works
1. **Standardization**: Making sure all dates look the same (e.g., YYYY-MM-DD).
2. **Deduplication**: Removing the same sale that was accidentally recorded twice.
3. **Enrichment**: Adding extra info (like adding a "Region" column based on a "City").
4. **Validation**: Checking if the data makes sense (e.g., "Is the price greater than zero?").

## Show me the code
\`\`\`python
import pandas as pd
df = pd.read_csv('raw_data.csv')

# 1. Fix missing values (Fill with 'Unknown')
df['customer_name'] = df['customer_name'].fillna('Unknown')

# 2. Remove duplicates
df = df.drop_duplicates()

# 3. Data Type conversion
df['sale_date'] = pd.to_datetime(df['sale_date'])

# 4. Calculation (Adding a 5% Tax column)
df['tax_amount'] = df['price'] * 0.05

print("Transformation Complete!")
\`\`\`

## Real life: How companies use this
An e-commerce giant like **Jumia** receives thousands of reviews. Their "Transformation" pipeline might automatically remove "spam" reviews, correct common spelling mistakes in product names, and convert all prices into a single currency (Naira) before showing the data to the marketing team.

## Remember these three things
- Transformation is where the "Business Rules" are applied to the data.
- It is often the most complex and time-consuming part of data engineering.
- Good transformation prevents "Wrong Numbers" from ruining business decisions.`,
      'scenario': `## Scenario: The Duplicate Disaster
**The situation:** Your marketing report says you have 10,000 "New Leads" this month. However, when the sales team calls them, they find out it's actually the same 2,000 people who signed up 5 times each to get a discount code.

**What you're seeing:**
Inflated numbers. The CEO is happy, but the sales team is frustrated and wasting time. The "Data Quality" is low because of duplicates.

**Your job:**
1. Identify unique customers using their Email or Phone Number.
2. Remove the duplicates during the Transform phase.
3. Report the *true* number of unique leads.

**Code to look at:**
\`\`\`python
# Use Pandas to keep only the FIRST time an email appears
df_clean = df.drop_duplicates(subset=['email'], keep='first')
\`\`\`

**Think through these:**
- Why did the users sign up 5 times? (Business problem)
- What is the cost to the company of the sales team calling the same person 5 times?
- How does "Data Deduplication" improve the company's "Return on Investment" (ROI)?

**What the solution looks like:**
By adding a "Deduplication Step" to your pipeline, you provide the business with the truth. Marketing now knows their actual reach, and the sales team is 5x more efficient because they aren't repeating work. In MIS, "Accuracy" is always more valuable than "Big Numbers."`,
      'quizzes': [
        {
          'question': "What is 'Garbage In, Garbage Out' (GIGO) in the context of ETL?",
          'options': ["A. If you have a slow computer, your data will be slow", "B. If your raw data is poor quality, your final reports will be wrong/useless", "C. You should throw away your old databases", "D. Data should be deleted after it is processed"],
          'correct': 1,
          'explanation': "GIGO is a core principle: the quality of your output is strictly limited by the quality of your input. This is why the 'Transform' phase is so critical."
        }
      ]
    },
    'Loading into a Warehouse': {
      'lesson': `## What is the Loading Phase?
Loading is the final step of ETL. It is where the cleaned, transformed data is moved into its permanent home-usually a Data Warehouse like BigQuery, Snowflake, or a SQL database.

## Why should you care as an MIS student?
Extraction and Transformation happen "behind the scenes." The Load phase is what the business actually "sees." This is the data that powers the Power BI dashboards, the executive reports, and the machine learning models.

## How it actually works
1. **Full Load**: Deleting the old data and replacing it entirely with the new data.
2. **Incremental Load**: Only adding the *new* rows that happened since the last load.
3. **Upsert**: A mix. If the record is new, add it. If it already exists, update the information.
4. **Verification**: Checking that the number of rows you "Transformed" matches the number of rows you "Loaded."

## Show me the code
\`\`\`python
import pandas as pd
from sqlalchemy import create_engine

# 1. Create a connection to the Warehouse (Database)
engine = create_engine('postgresql://user:password@warehouse_host:5432/mis_db')

# 2. Load the cleaned DataFrame into a table called 'fact_sales'
# 'if_exists=append' means we are adding to the table, not replacing it.
df_clean.to_sql('fact_sales', engine, if_exists='append', index=False)

print("Data successfully loaded into the warehouse!")
\`\`\`

## Real life: How companies use this
**MTN** loads billions of "Call Detail Records" into their data warehouse every night. They don't overwrite the whole database; they "Incrementally Load" today's calls at the bottom of the list. This allows them to look back at years of history without having to reload the whole thing every day.

## Remember these three things
- Loading is the point of "No Return"-once it's in the warehouse, the business starts using it.
- Incremental loading is much faster and cheaper for large datasets.
- Always check for "Data Loss" during the load step.`,
      'scenario': `## Scenario: The Missing Monday
**The situation:** You loaded the weekly sales data into the dashboard. On Tuesday morning, the CEO calls you: "Why are our sales for Monday showing as ₦0?"

**What you're seeing:**
You check the "Staging Area" (Transform phase) and the data for Monday is there. But in the "Data Warehouse" (Load phase), Monday is missing. The "Load" step failed halfway through, and nobody noticed.

**Your job:**
1. Figure out why the load stopped (Was the database full? Did the internet cut out?).
2. Re-load the missing data for Monday.
3. Add a "Row Count Check" to your script so it alerts you if the numbers don't match next time.

**Code to look at:**
\`\`\`python
# Check if counts match
rows_transformed = 1000
rows_in_warehouse = check_warehouse_count()

if rows_transformed != rows_in_warehouse:
    send_alert("ERROR: Data Load Incomplete!")
\`\`\`

**Think through these:**
- Why is a "Silent Failure" more dangerous than a "Loud Crash"?
- How does a missing day of data affect "Year-on-Year" growth reports?
- In MIS, how do we build "Trust" in our systems?

**What the solution looks like:**
A professional analyst would implement "Audit Checks." By comparing the source count to the target count, you ensure that every single row made the journey safely. If even one row is missing, the system sends an alert, ensuring the CEO never sees a wrong number again.`,
      'quizzes': [
        {
          'question': "What is an 'Incremental Load' in a data warehouse?",
          'options': ["A. Deleting the whole database and starting over", "B. Adding only the new data that was created since the last update", "C. Changing the font of the dashboard", "D. Moving data from the cloud to a physical hard drive"],
          'correct': 1,
          'explanation': "Incremental loading saves time and resources by only processing the 'new' records, rather than re-processing everything."
        }
      ]
    },
    'Handling Pipeline Failures': {
      'lesson': `## What is Handling Pipeline Failures?
In data engineering, things *will* break. A source database might go offline, a column name might change, or the internet might cut out. Handling failures is the practice of building systems that can recover gracefully without losing data.

## Why should you care as an MIS student?
Reliability is a core MIS concern. If a pipeline fails and isn't fixed, business dashboards stay "stale" (outdated). Managers make decisions based on old data, which is just as dangerous as wrong data.

## How it actually works
1. **Retries**: If a task fails, wait 5 minutes and try again (often solves network issues).
2. **Alerting**: Sending an email or Slack message immediately so an engineer can look.
3. **Idempotency**: Ensuring that if you run a failed job again, it doesn't create duplicate data.
4. **Logging**: Recording exactly *where* and *why* the failure happened.

## Show me the code
\`\`\`python
import time

def load_data():
    # Simulate a flakey connection
    raise Exception("Database Connection Timeout")

# Simple Retry Logic
max_retries = 3
for i in range(max_retries):
    try:
        load_data()
        print("Success!")
        break
    except Exception as e:
        print(f"Attempt {i+1} failed. Retrying in 10s...")
        time.sleep(10)
else:
    print("FAILED after 3 attempts. Sending Alert to Slack...")
\`\`\`

## Real life: How companies use this
**Flutterwave** processes payments 24/7. Their pipelines use "Dead Letter Queues." If a transaction record fails to process, it isn't deleted; it is moved to a special "Error Table." Every morning, engineers look at that table, fix the issues, and "Re-run" only those specific failed rows.

## Remember these three things
- Failure is expected; the goal is "Recovery."
- "Retries" solve temporary problems; "Alerts" solve permanent ones.
- Never let a failure go unnoticed-visibility is the key to a reliable system.`,
      'scenario': `## Scenario: The Midnight Crash
**The situation:** You have an ETL pipeline that runs at midnight to update the "Daily P&L" (Profit and Loss) report. You wake up at 8 AM and find out the report is empty. The pipeline crashed at 12:05 AM because the source file was renamed.

**What you're seeing:**
An error message: \`FileNotFoundError: sales_final.csv not found\`. The manager who sends the file renamed it to \`sales_final_v2.csv\` without telling you.

**Your job:**
1. Fix the script to look for the new filename.
2. Add a "File Check" step at the beginning that sends a Slack message *immediately* if the file is missing.
3. Re-run the job manually to get the data for today.

**Code to look at:**
\`\`\`python
import os
if not os.path.exists('sales_final.csv'):
    send_alert("CRITICAL: Source file is missing! Pipeline stopped.")
    # Stop the script here so it doesn't crash later
    exit()
\`\`\`

**Think through these:**
- Why is it important to "Fail Fast" (stop at the beginning) rather than "Fail Late"?
- How does "Communication" between departments affect data engineering?
- In MIS, what is the impact of a missing financial report on a Monday morning?

**What the solution looks like:**
You would implement "Pre-Flight Checks." By verifying that all "dependencies" (files, connections, permissions) exist *before* starting the heavy work, you prevent 90% of pipeline crashes. If something is wrong, you know at 12:01 AM instead of 8:00 AM.`,
      'quizzes': [
        {
          'question': "What is 'Idempotency' in a data pipeline?",
          'options': ["A. The ability to run the same job multiple times and get the same result without creating duplicates", "B. The speed at which data moves", "C. The cost of running a cloud server", "D. The process of deleting data after use"],
          'correct': 0,
          'explanation': "Idempotency is critical. If a job fails halfway, you should be able to run it again safely without doubling the data that was already loaded."
        }
      ]
    },
    'Incremental vs Full Loads': {
      'lesson': `## What is Incremental vs Full Loads?
A **Full Load** deletes everything in the destination table and replaces it with all the data from the source. An **Incremental Load** only pulls and adds the records that have changed or been created since the last time the job ran.

## Why should you care as an MIS student?
Efficiency is everything. If you have 10 years of sales data (100 million rows) and you only want to add today's sales (1,000 rows), a Full Load would be a massive waste of time, money, and computing power. Incremental loading is how big companies keep their data fresh.

## How it actually works
1. **Full Load**: Simple to build, but slow and expensive. Best for small tables (like "List of Branch Cities").
2. **Incremental Load**: Complex to build, but fast and cheap. Requires a "Watermark" (like a \`last_updated\` timestamp) to know where to start.
3. **The Trade-off**: Incremental loads can sometimes miss data if rows are deleted, so engineers often do a "Full Refresh" once a week just to be safe.

## Show me the code
\`\`\`python
# 1. Get the last time we loaded data
last_load_time = get_last_timestamp_from_warehouse()

# 2. Extract only NEW data
query = f"SELECT * FROM sales WHERE updated_at > '{last_load_time}'"
new_rows = pd.read_sql(query, source_db)

# 3. Load only those new rows
new_rows.to_sql('fact_sales', warehouse_engine, if_exists='append')
\`\`\`

## Real life: How companies use this
**Uber** doesn't reload every ride since 2010 every time you finish a trip. They use "Incremental Loading." As soon as your ride ends, that one row is "Extracted" and "Loaded" into their analytics warehouse. This allows them to see city-wide traffic patterns in near real-time.

## Remember these three things
- Full Load = Replace everything; Incremental Load = Add only new.
- Incremental loads require a "Watermark" (usually a date/time column).
- Use Incremental for "Transaction" tables and Full for "Dimension" (lookup) tables.`,
      'scenario': `## Scenario: The Growing Bill
**The situation:** You work for a fintech that is growing fast. You are currently doing a "Full Load" of every transaction every night. Last month, your cloud bill was ₦50,000. This month, it jumped to ₦250,000 because you have 5x more data.

**What you're seeing:**
The job used to take 5 minutes. Now it takes 1 hour. Most of that time is spent re-reading data from 2 years ago that hasn't changed.

**Your job:**
1. Identify a "Watermark" column (like \`created_at\`).
2. Update your script to only pull rows where \`created_at\` is "Yesterday".
3. Change the load mode to \`append\` instead of \`replace\`.

**Code to look at:**
\`\`\`python
# Before (Full Load):
# df = read_all()
# df.to_sql('sales', mode='replace')

# After (Incremental):
# df = read_since('2023-12-01')
# df.to_sql('sales', mode='append')
\`\`\`

**Think through these:**
- Why is "Scalability" a key MIS concept?
- How does "Cost Optimization" affect your value as an engineer?
- What happens if a record from 2 weeks ago is updated? Does your incremental load catch it?

**What the solution looks like:**
By switching to Incremental Loading, you've "Future-Proofed" the pipeline. It doesn't matter if the company has 1 million or 1 billion rows; your daily job only ever processes the 1,000 new ones. The bill goes back down, and the reports are ready much earlier.`,
      'quizzes': [
        {
          'question': "What is the primary requirement for an 'Incremental Load' to work correctly?",
          'options': ["A. A very fast internet connection", "B. A 'Watermark' column (like a timestamp or ID) to track progress", "C. A high-resolution monitor", "D. Deleting the source data after reading"],
          'correct': 1,
          'explanation': "Without a watermark, the system doesn't know where the last load ended and where the new one should begin."
        }
      ]
    },
    'ETL vs ELT': {
      'lesson': `## What is ETL vs ELT?
**ETL** (Extract, Transform, Load) cleans the data *before* it reaches the warehouse. **ELT** (Extract, Load, Transform) moves the raw data into the warehouse first and uses the power of the warehouse itself (like BigQuery or Snowflake) to do the cleaning later using SQL.

## Why should you care as an MIS student?
The "Modern Data Stack" is moving toward **ELT**. Why? Because modern cloud warehouses are incredibly fast at processing data. It is often faster and cheaper to just "dump" everything into the warehouse and then clean it up using SQL tools like **dbt**.

## How it actually works
1. **ETL**: Good for sensitive data (you can "mask" or hide credit card numbers before they are ever saved).
2. **ELT**: Good for massive scale. You don't have to worry about your Python script crashing on 10 million rows; the warehouse handles it.
3. **The Logic**: In ELT, the "Transformation" happens *at the destination*.

## Show me the code
\`\`\`sql
-- In ELT, you load the raw data first, then run this in the warehouse:
CREATE TABLE clean_sales AS
SELECT 
    id,
    UPPER(customer_name) as name,
    price * 1.075 as total_with_vat
FROM raw_sales_table;
\`\`\`

## Real life: How companies use this
A startup like **Paystack** might use ELT. They pipe every raw event (clicks, logins, payments) into a "Data Lake" (Load). Then, their analysts use SQL to build "Models" (Transform) that show conversion rates and revenue. This allows them to change their "cleaning rules" without having to re-fetch the raw data.

## Remember these three things
- ETL = Clean then Save; ELT = Save then Clean.
- ELT is the standard for modern Cloud Data Warehouses.
- ELT allows you to keep your "Raw History" in case you need to re-process it later.`,
      'scenario': `## Scenario: The "Oops, We Forgot a Column" Problem
**The situation:** You used **ETL** to process sales data. During the "Transform" phase, you deleted the "Customer IP Address" column because you thought nobody needed it. 6 months later, the CEO wants a report on "Which city has the most fraud?", but you don't have the IP addresses to find the cities.

**What you're seeing:**
Because you cleaned the data *before* loading it, the "Raw" information is gone forever. You'd have to re-extract 6 months of data from the source, which might be impossible.

**Your job:**
1. Propose a switch to **ELT**.
2. Load the "Raw" JSON/CSV data directly into the warehouse first.
3. Use SQL to create "Clean Views" while keeping the raw data safe in a separate table.

**Code to look at:**
\`\`\`sql
-- Keep this safe: raw_transactions (everything)
-- Create this for users: view_clean_transactions (filtered)
\`\`\`

**Think through these:**
- Why is "Data Preservation" important in MIS?
- How does ELT give you more "Flexibility" for future business questions?
- Why is ELT becoming more popular as Cloud storage becomes cheaper?

**What the solution looks like:**
By adopting ELT, you've created a "Time Machine." Since you have the raw data safely stored in the warehouse, you can change your "Transformation Logic" at any time. If the CEO asks for a new report next year, you just write a new SQL query against the raw data you already have.`,
      'quizzes': [
        {
          'question': "What is the main difference between ETL and ELT?",
          'options': ["A. ETL is faster, ELT is slower", "B. The order and location of where the data is 'Transformed'", "C. ETL uses Python, ELT only uses Excel", "D. ETL is for the cloud, ELT is for physical servers"],
          'correct': 1,
          'explanation': "The key is where the 'T' happens. In ETL, it happens in a processing engine (like Python) before the warehouse. In ELT, it happens inside the warehouse itself."
        }
      ]
    },
    'ETL in a Real Nigerian Bank': {
      'lesson': `## ETL in a Real Nigerian Bank
In a Nigerian bank (like GTBank or Access Bank), ETL is the "Heartbeat" of the organization. It's how thousands of separate branch transactions become a single "Consolidated Financial Statement" for the Central Bank of Nigeria (CBN).

## Why should you care as an MIS student?
Banking is the biggest employer of MIS professionals in Nigeria. Understanding their specific ETL challenges-like unreliable internet in rural branches, power outages, and strict CBN regulations-makes you a top-tier candidate.

## How it actually works
1. **Core Banking System (CBS)**: The main source (e.g., Flexcube or Finacle).
2. **EOD (End of Day)**: A massive ETL process that runs every night at 10 PM.
3. **Reconciliation**: Comparing internal logs with NIBSS or Interswitch data to make sure no money is "missing."
4. **Regulatory Reporting**: Automatically formatting data for the CBN "Electronic Financial Analysis and Surveillance System" (e-FASS).

## Show me the code
\`\`\`python
# Simple Bank Recon logic
def reconcile_transactions(internal_list, interswitch_list):
    """Finds transactions that are in our bank but missing from Interswitch"""
    mismatches = []
    for tx in internal_list:
        if tx['id'] not in [itx['id'] for itx in interswitch_list]:
            mismatches.append(tx)
    return mismatches

# Loading mismatches to an 'Exception Report' for the Audit team
\`\`\`

## Real life: How companies use this
**First Bank** uses ETL to manage "Know Your Customer" (KYC) data. They extract photos and IDs from branch scanners, "Transform" them into compressed digital files, and "Load" them into a central database. This allows you to walk into a branch in Kano and have them see the account you opened in Lagos instantly.

## Remember these three things
- In banking, ETL is primarily about **Accuracy** and **Audit Trails**.
- "Reconciliation" is the most critical ETL task in fintech/banking.
- Regulatory compliance (CBN) is the biggest driver of data engineering projects in Nigeria.`,
      'scenario': `## Scenario: The Failed ATM Settlement
**The situation:** It's Monday morning at **Zenith Bank**. The "Settlement Team" noticed that ₦20 Million is missing from the weekend's ATM reports. The internal database says the money was given out, but the Interswitch report says those transactions failed.

**What you're seeing:**
A massive "Mismatched" list. Thousands of customers probably didn't get their cash, but their accounts were still debited. The ETL process that "Reconciles" these two systems failed to run on Sunday night.

**Your job:**
1. Manually trigger the "Reconciliation Pipeline."
2. Generate an "Exception Report" showing every customer who needs a refund.
3. Automate the "Reversal Request" so the money goes back to the customers' accounts without a human doing it one by one.

**Code to look at:**
\`\`\`python
# Steps:
# 1. Extract GTB_Internal_Log.csv
# 2. Extract Interswitch_Log.csv
# 3. Transform: Find rows where (GTB == SUCCESS) AND (Interswitch == FAIL)
# 4. Load: To Refund_Queue table
\`\`\`

**Think through these:**
- What happens to the bank's "Reputation" if these refunds aren't processed automatically?
- Why is "Data Integrity" a matter of national financial security?
- How does ETL help a bank pass an audit from the CBN?

**What the solution looks like:**
By building a robust Reconciliation Pipeline, you ensure that "Digital Money" always matches "Physical Reality." You turn a ₦20 Million crisis into an automated 10-minute cleanup, protecting both the bank and its customers. This is the ultimate goal of MIS in the financial sector.`,
      'quizzes': [
        {
          'question': "What is the primary purpose of 'Reconciliation' in banking ETL?",
          'options': ["A. To make the dashboard look pretty", "B. To ensure that internal records match external partners (like Interswitch/NIBSS)", "C. To delete old bank accounts", "D. To increase the interest rates for customers"],
          'correct': 1,
          'explanation': "Reconciliation is the act of proving that two sets of records (ours and theirs) match perfectly. If they don't, ETL identifies the 'exceptions' so they can be fixed."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Fintech Reconciliation Engine
In this project, you will build a complete ETL pipeline that handles the most critical task in banking: **Reconciliation**. You will move data from two sources (Bank Internal Log vs Payment Gateway Log) and find the "Lost Money."

## The Business Case
Your startup, **"NaijaPay,"** is seeing "ghost transactions"-where a user says they were debited, but the payment gateway says they didn't receive the money. You need to build a pipeline that finds these mismatches automatically for the Finance VP.

## Your Project Tasks:
0. **The Data**: Use the [Instacart Relational Database on Kaggle](https://www.kaggle.com/c/instacart-market-basket-analysis/data) (specifically the Orders, Products, and Departments tables).
1. **EXTRACT**: Pull the raw data from the separate tables into your Python environment.
2. **TRANSFORM**: Use Pandas to `JOIN` the tables and identify "Data Anomalies" (e.g., products missing a department_id, or orders with zero items).
3. **LOAD**: Save this cleaned, joined dataset into a final \`unified_warehouse.csv\` table.
4. **THE DASHBOARD**: Create a simple summary showing:
   - Total Clean Orders Processed.
   - Total Anomalies Removed.
   - A list of the Top 5 Departments.
5. **THE DELIVERY**: Push your \`etl_pipeline.py\` and a sample \`dashboard_screenshot.md\` to GitHub.

## Show me the code (ETL Logic)
\`\`\`python
# Example logic for your Transform step:
def find_lost_money(internal, gateway):
    internal_ids = {tx['id'] for tx in internal}
    gateway_ids = {tx['id'] for tx in gateway}
    
    # IDs we have that the gateway DOES NOT have
    lost_ids = internal_ids - gateway_ids
    return [tx for tx in internal if tx['id'] in lost_ids]
\`\`\`

## Presenting to Executives
Tell the VP: "Instead of having 5 accountants manually check Excel files all day, this pipeline identifies every single discrepancy in 3 seconds. It protects our ₦20M daily revenue and ensures customer trust."`,
      'scenario': `## Scenario: The "Audit-Ready" Repository
**The situation:** The external auditors are coming. They want to see the "Logic" you used to calculate the refunds. They don't want a PowerPoint; they want to see the code and the version history.

**Your job:**
1. Ensure your GitHub repo has a \`/docs\` folder explaining the ETL logic.
2. Tag your current code as \`v1.0-Audit-Ready\`.
3. Provide the auditors with the GitHub link.

**Think through these:**
- Why is "Transparency" in code important for financial audits?
- How does GitHub's "Commit History" prove that you didn't just "fake the numbers" this morning?`,
      'quizzes': [
        {
          'question': "In your ETL Milestone project, what is the 'Business Value' of the Load phase?",
          'options': ["A. It makes the code look complex", "B. It saves the results in a permanent place (CSV/Database) so other systems can use it to issue refunds", "C. It deletes the raw data", "D. It sends an email to everyone in the company"],
          'correct': 1,
          'explanation': "The Load phase is where the 'Clean Data' is delivered. Without it, your transformation work is lost as soon as the script finishes."
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

## The Business Case
Your company, **"Abuja Logistics,"** delivers 10,000 packages a day. The CEO wants a report every morning at 6:00 AM showing:
1. Total Deliveries.
2. Failed Deliveries (and why).
3. Driver Efficiency.
If the data is missing or the pipeline fails, you need to know before the CEO wakes up.

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
- How does "Automated Monitoring" reduce the stress of an MIS manager?`,
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
    print(f"Current Bitcoin Price: \${price}")
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
    },
    'HTTP Methods - GET, POST, PUT, DELETE': {
      'lesson': `## What are HTTP Methods?
HTTP methods are the "Verbs" of the internet. They tell the server exactly what action you want to take with a piece of data.
- **GET**: "Give me this info." (Read)
- **POST**: "Create this new record." (Create)
- **PUT**: "Update this existing record." (Update)
- **DELETE**: "Remove this record." (Delete)

## Why should you care as an MIS student?
Every business action maps to one of these verbs. 
- Opening a bank statement = **GET**.
- Sending money to a friend = **POST** (Creating a transaction).
- Changing your profile picture = **PUT**.
- Canceling a subscription = **DELETE**.
Knowing which one to use is the difference between a working app and a broken one.

## How it actually works
1. **Request**: You send the Method + URL + Headers (and a "Body" for POST/PUT).
2. **Response**: The server sends back a Status Code (200, 201, 404, etc.) and the data.

## Show me the code
\`\`\`python
import requests

# 1. GET (Read)
res_get = requests.get("https://api.shop.com/products/1")

# 2. POST (Create)
res_post = requests.post("https://api.shop.com/orders", json={"item": "Phone", "price": 50000})

# 3. DELETE (Remove)
res_del = requests.delete("https://api.shop.com/orders/99")

print(f"Status of Create: {res_post.status_code}") # Should be 201 (Created)
\`\`\`

## Real life: How companies use this
**Twitter (X)** uses these methods for everything.
- **GET** /tweets: To show your timeline.
- **POST** /tweets: When you click "Post" to send a new tweet.
- **DELETE** /tweets/123: When you delete a tweet.
By using these standard verbs, Twitter allows developers all over the world to build "Third-party apps" that work perfectly with their system.

## Remember these three things
- GET is the only method that doesn't "change" anything on the server.
- POST, PUT, and DELETE are "Dangerous" and usually require an API Key.
- Use GET for dashboards and POST for transaction processing.`,
      'scenario': `## Scenario: The Duplicate Order Bug
**The situation:** Your e-commerce app is accidentally creating two orders every time a customer clicks "Buy" once.

**What you're seeing:**
The "Buy" button is using a **GET** request instead of a **POST** request. Because it's a GET, the customer's browser is "Pre-loading" the page, which triggers the order creation before they even click!

**Your job:**
1. Switch the button logic from GET to **POST**.
2. Ensure that the server only creates an order when it receives a proper POST request with a "Body."
3. Add a "Unique ID" to the POST request so that even if they click twice, the second one is ignored.

**Code to look at:**
\`\`\`python
# WRONG: Creating an order on a 'GET' link
# https://shop.com/buy?item=123 (Browser might visit this automatically!)

# RIGHT: Requiring a 'POST' with a secret token
# requests.post(url, json={"item": 123, "token": "abc"})
\`\`\`

**Think through these:**
- Why is it dangerous to change data (like creating an order) using a GET request?
- How does the "Verb" (GET vs POST) protect the business from accidental orders?
- In MIS, why is "Standardized Communication" key to system security?

**What the solution looks like:**
By following the rules of HTTP, you protect the business. You ensure that "Destructive" or "Creative" actions only happen when the user explicitly intends them. This reduces customer complaints and keeps your database clean.`,
      'quizzes': [
        {
          'question': "Which HTTP method should you use if you want to change a customer's phone number in the database?",
          'options': ["A. GET", "B. DELETE", "C. PUT (or PATCH)", "D. POST"],
          'correct': 2,
          'explanation': "PUT is the standard method for updating existing data. POST is for creating new data, and GET is only for reading."
        }
      ]
    },
    'JSON: The Language of APIs': {
      'lesson': `## What is JSON?
JSON (JavaScript Object Notation) is a lightweight format for storing and transporting data. It looks like a Python dictionary, using \`{"key": "value"}\` pairs.

## Why should you care as an MIS student?
JSON is the "International Language" of the internet. It doesn't matter if one system is written in Java and another in Python; they both speak JSON. If you want to move data between a mobile app and a bank server, you use JSON.

## How it actually works
1. **Objects**: Wrapped in \`{ }\`.
2. **Arrays (Lists)**: Wrapped in \`[ ]\`.
3. **Types**: Supports Strings, Numbers, Booleans, and Null.
4. **Nesting**: You can put a list inside an object, or an object inside a list.

## Show me the code
\`\`\`python
import json

# A JSON string (what an API sends you)
raw_json = '{"name": "Ikeja Mall", "open": true, "stores": 45}'

# Converting JSON to a Python Dictionary
data = json.loads(raw_json)
print(data['name']) # Prints: Ikeja Mall

# Converting Dictionary back to JSON (to send to an API)
new_json = json.dumps({"status": "success", "code": 200})
\`\`\`

## Real life: How companies use this
**Netflix** uses JSON to tell your TV which movies to show. When you open the app, your TV sends a request and receives a giant JSON file containing the titles, images, and descriptions of 50 movies. Your TV then "Parses" (reads) that JSON to draw the screen you see.

## Remember these three things
- JSON is easy for humans to read and easy for computers to parse.
- It is the most common format for API data.
- In Python, \`json.loads()\` turns text into a dictionary.`,
      'scenario': `## Scenario: The Corrupted Customer Profile
**The situation:** You are trying to update a customer's address via an API. You sent the data, but the server returned a "400 Bad Request" error.

**What you're seeing:**
You sent: \`"address": Lagos, Nigeria\`. 
The server failed because you forgot the quotes around the text. JSON is very strict-all text *must* be in double quotes.

**Your job:**
1. Fix the formatting of the JSON object.
2. Ensure the "Boolean" values are lowercase (\`true\` not \`True\`).
3. Re-send the request and verify it returns a 200 OK.

**Code to look at:**
\`\`\`json
// WRONG:
{
    name: Amarachi,
    age: 25,
    active: True
}

// RIGHT:
{
    "name": "Amarachi",
    "age": 25,
    "active": true
}
\`\`\`

**Think through these:**
- Why is JSON so "Strict" about quotes and commas?
- How does a "Format Error" prevent two systems from talking to each other?
- In MIS, why is "Syntax" just as important as "Logic"?

**What the solution looks like:**
By mastering JSON syntax, you ensure that your "Data Packages" are always accepted by other systems. You become a bridge-builder, allowing your company's software to connect smoothly to external partners like banks, shippers, and maps.`,
      'quizzes': [
        {
          'question': "Which of these is a valid JSON object?",
          'options': ["A. {name: 'Chidi'}", "B. {'name': 'Chidi'}", "C. {\"name\": \"Chidi\"}", "D. [name = Chidi]"],
          'correct': 2,
          'explanation': "In valid JSON, keys and string values MUST be wrapped in double quotes (\"). Single quotes or no quotes will cause an error."
        }
      ]
    },
    'API Keys & Authentication': {
      'lesson': `## What is API Authentication?
API Authentication is the "Identity Card" for your code. It proves to the server that you are who you say you are and that you have permission to access the data. The most common method is the **API Key** or **Bearer Token**.

## Why should you care as an MIS student?
Business data is private. You don't want just anyone to be able to "GET" your company's bank balance or "DELETE" your customer list. Authentication is the lock on the door. If you lose your API Key, your data is at risk. If you forget to include it, your code won't work.

## How it actually works
1. **Headers**: You usually send the key in the "Secret" part of the request (the Header), not in the URL.
2. **API Key**: A long string of random letters (e.g., \`sk_live_12345...\`).
3. **Bearer Token**: A temporary key that expires after a few hours for extra security.

## Show me the code
\`\`\`python
import requests

# Sending a request with a Secret Key in the Header
url = "https://api.paystack.co/transaction/verify/T123"
headers = {
    "Authorization": "Bearer sk_test_your_secret_key_here",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

if response.status_code == 401:
    print("Error: Your API Key is wrong or missing!")
\`\`\`

## Real life: How companies use this
**Google Maps** gives every developer an API Key. Every time a developer's app shows a map, Google checks the Key. If the developer hasn't paid their bill, Google "Revokes" (turns off) the Key, and the maps stop working. This is how they control who uses their data and how they get paid.

## Remember these three things
- **NEVER** share your API keys in public (like on GitHub).
- If an API returns a 401 or 403 error, check your authentication.
- Headers are the standard place to put "Secret" information.`,
      'scenario': `## Scenario: The Leaked Secret
**The situation:** You just finished a Python script that connects to the company's SMS provider. You uploaded the code to GitHub so your team can see it. 10 minutes later, the company has a ₦100,000 bill for "Spam SMS" sent from your account.

**What you're seeing:**
You hard-coded your \`API_KEY = "sk_12345..."\` inside the script. A "Bot" on the internet scanned your GitHub, found the key, and used it to send thousands of spam messages.

**Your job:**
1. Immediately "Rotate" (change) the API Key in the provider's dashboard.
2. Delete the key from the code.
3. Use an "Environment Variable" (.env file) to hide the key so it's never uploaded to the internet.

**Code to look at:**
\`\`\`python
# WRONG: Hardcoded
# key = "secret_123"

# RIGHT: Load from a hidden file
import os
key = os.getenv("MY_API_KEY")
\`\`\`

**Think through these:**
- Why is a "Hardcoded Key" a massive security risk?
- How do "Environment Variables" help keep secrets safe?
- In MIS, what is the cost of a "Security Breach" caused by a developer's mistake?

**What the solution looks like:**
You've learned a critical lesson in "Cybersecurity." By using environment variables, you separate your *Logic* from your *Secrets*. This allows you to share your code with the world while keeping the company's keys (and money) safe behind a locked door.`,
      'quizzes': [
        {
          'question': "If an API returns a '401 Unauthorized' error, what is the most likely cause?",
          'options': ["A. The server is offline", "B. The URL is spelled wrong", "C. Your API Key is missing, invalid, or expired", "D. Your internet is too slow"],
          'correct': 2,
          'explanation': "401 specifically means 'I don't know who you are.' It's an authentication error."
        }
      ]
    },
    'Pulling Data into Python': {
      'lesson': `## What is Pulling Data into Python?
This is the "Bread and Butter" of data engineering. It's the act of using the \`requests\` library to fetch data from an API and then using \`pandas\` to turn that JSON data into a clean table for analysis.

## Why should you care as an MIS student?
Static files (CSVs) are old news. Modern data lives in APIs. If you want to build a "Live Dashboard" for a business, you need to pull data directly from their sales app, their ad accounts, and their bank. This is how you build a "Real-Time" MIS.

## How it actually works
1. **Request**: Fetch the JSON.
2. **Convert**: Turn the JSON text into a Python List.
3. **DataFrame**: Pass that list to \`pd.DataFrame()\`.
4. **Export**: Save it as a CSV or Excel for the business team.

## Show me the code
\`\`\`python
import requests
import pandas as pd

# 1. Get the data
url = "https://api.coinbase.com/v2/prices/spot?currency=USD"
data = requests.get(url).json()

# 2. Extract the specific piece of data
price_info = [data['data']] # Putting it in a list for Pandas

# 3. Create a table
df = pd.DataFrame(price_info)
df['pulled_at'] = pd.Timestamp.now()

# 4. Save
df.to_csv('crypto_prices.csv', index=False)
\`\`\`

## Real life: How companies use this
A marketing agency might pull "Ad Spend" from the **Facebook API** and "Sales" from their **Shopify API**. They use Python to pull both, merge them together, and calculate the "Return on Ad Spend" (ROAS) every single morning. This replaces 5 hours of manual report-building.

## Remember these three things
- APIs provide the "Raw Material"; Python is the "Factory."
- \`requests.get().json()\` is the most common starting line.
- Turning JSON into a DataFrame is the first step of the "Transform" phase.`,
      'scenario': `## Scenario: The Manual Reconciler
**The situation:** An accountant at your firm spends every morning downloading a "Bank Statement" from a website, then downloading a "Sales Report" from another website, and manually comparing them in Excel.

**What you're seeing:**
The accountant is tired and prone to making mistakes. It takes them 2 hours to do what code can do in 2 seconds.

**Your job:**
1. Write a script that uses APIs to pull the "Bank Data" and the "Sales Data" directly.
2. Use Pandas to "Join" the two tables based on a transaction ID.
3. Highlight any rows that are in the Sales report but NOT in the Bank (Missing Money!).

**Code to look at:**
\`\`\`python
# Fetch both
sales = requests.get(sales_api).json()
bank = requests.get(bank_api).json()

# Compare with Pandas
df_sales = pd.DataFrame(sales)
df_bank = pd.DataFrame(bank)

# Find missing transactions
missing = df_sales[~df_sales['id'].isin(df_bank['id'])]
\`\`\`

**Think through these:**
- How does "Direct API Integration" reduce human error?
- Why is it better to have the computer find the "Missing Rows" than a human?
- In MIS, what is the value of "Reclaiming Time" for high-level employees?

**What the solution looks like:**
You've automated a critical financial process. Instead of 2 hours of "Drudgery," the accountant now has a "Live Reconciliation Dashboard" that refreshes instantly. You've moved the company from "Manual Work" to "Automated Oversight."`,
      'quizzes': [
        {
          'question': "What is the best library to use for fetching data from a URL in Python?",
          'options': ["A. pandas", "B. requests", "C. math", "D. random"],
          'correct': 1,
          'explanation': "The 'requests' library is the standard tool for making HTTP requests (GET, POST, etc.) to APIs."
        }
      ]
    },
    'Handling Errors & Timeouts': {
      'lesson': `## What are API Errors & Timeouts?
The internet is unreliable. An API might be slow (**Timeout**), the server might be overloaded (**500 Error**), or you might be sending too many requests too fast (**Rate Limiting / 429 Error**). Good code expects these problems and handles them.

## Why should you care as an MIS student?
If your "Daily Report" script crashes because the internet flickered for 1 second, the whole company misses its data. Handling errors makes your systems "Production Grade." It means they can survive a messy, real-world environment.

## How it actually works
1. **Timeout**: Setting a limit (e.g., "If the server doesn't answer in 10 seconds, give up").
2. **Raise for Status**: Automatically checking if the status code is an error.
3. **Try / Except**: Catching the error so the script doesn't crash.
4. **Retries**: Waiting a moment and trying again.

## Show me the code
\`\`\`python
import requests
from requests.exceptions import Timeout, HTTPError

try:
    # 1. Set a timeout (5 seconds)
    response = requests.get("https://api.slow-bank.com/data", timeout=5)
    
    # 2. Check if the server sent an error code (like 404 or 500)
    response.raise_for_status()
    
    data = response.json()
except Timeout:
    print("Error: The server took too long to answer.")
except HTTPError as e:
    print(f"Error: The server returned an error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
\`\`\`

## Real life: How companies use this
**Amazon** has "Circuit Breakers" in their code. If an API that shows "Product Recommendations" is slow, Amazon doesn't let the whole page hang. Their code "Times Out" after 0.5 seconds and simply hides the recommendations. It's better to show a partial page than to make the customer wait 10 seconds for a broken one.

## Remember these three things
- Always set a \`timeout\` in your \`requests.get()\` calls.
- Use \`response.raise_for_status()\` to catch hidden errors.
- Good error handling is what separates a "School Project" from a "Business System."`,
      'scenario': `## Scenario: The "Busy" API
**The situation:** You are pulling data from a popular government API. Every Friday at 10 AM, their server gets overwhelmed and returns a "503 Service Unavailable" error. Your script currently crashes every Friday.

**What you're seeing:**
Your terminal shows a "503 Error." You have to manually restart the script 5 or 6 times until it finally works. This is a waste of your time.

**Your job:**
1. Add a loop that "Retries" the request up to 5 times.
2. Use "Exponential Backoff" (Wait 1 second, then 2, then 4, then 8) to give the server time to breathe.
3. Only give up if all 5 retries fail.

**Code to look at:**
\`\`\`python
import time

for i in range(5):
    try:
        res = requests.get(url)
        res.raise_for_status()
        return res.json()
    except:
        print(f"Server busy. Retrying in {2**i} seconds...")
        time.sleep(2**i)
\`\`\`

**Think through these:**
- Why is it better to "Wait and Retry" than to just give up immediately?
- How does "Exponential Backoff" help an overloaded server?
- In MIS, how do "Resilient Systems" reduce the workload of IT staff?

**What the solution looks like:**
You've built a "Smart Agent." Instead of crashing, your code intelligently waits for the server to become available. This makes your automation truly "hands-off"-it handles the Friday rush without you ever having to look at it.`,
      'quizzes': [
        {
          'question': "What is the purpose of the 'timeout' parameter in requests.get(url, timeout=5)?",
          'options': ["A. It makes the internet faster", "B. It tells the script to wait a maximum of 5 seconds for a response before giving up", "C. It schedules the request for 5 PM", "D. It deletes the request after 5 seconds"],
          'correct': 1,
          'explanation': "Without a timeout, your script might 'hang' or wait forever if a server is unresponsive, blocking all other tasks."
        }
      ]
    },
    'Pagination - Getting All the Data': {
      'lesson': `## What is Pagination?
APIs rarely give you 1,000,000 rows in one go. Instead, they give you the data in "Pages" (e.g., 50 rows at a time), just like Google Search shows you 10 results and asks you to click "Next."

## Why should you care as an MIS student?
If you only pull the first request, you are only seeing a tiny fraction of the data. To get the "Full Picture" (e.g., every sale this month), you must write a loop that "turns the pages" until there are no more left.

## How it actually works
1. **Request**: Get Page 1.
2. **Check**: Does the JSON say there is a \`next_page\`?
3. **Loop**: If yes, update the URL and get the next page.
4. **Append**: Add the new data to your master list.

## Show me the code
\`\`\`python
import requests

results = []
page = 1
while True:
    url = f"https://api.shop.com/orders?page={page}"
    data = requests.get(url).json()
    
    # Add this page's items to our list
    results.extend(data['items'])
    
    # Is there a next page?
    if not data['has_more']:
        break # Exit the loop
        
    page += 1

print(f"Total items gathered: {len(results)}")
\`\`\`

## Real life: How companies use this
A social media manager pulling "Comments" from an **Instagram post** with 5,000 comments. The API will only give 20 at a time. Their Python script loops 250 times, following the "next" link each time, until every single comment is gathered for analysis.

## Remember these three things
- Never assume an API gave you "all" the data on the first try.
- Check the documentation for words like "limit", "offset", or "page".
- A \`while\` loop is the best tool for handling unknown page counts.`,
      'scenario': `## Scenario: The Incomplete Audit
**The situation:** You are auditing a company's expenses. The API says there are 2,500 transactions. You ran your script, and it only saved 100 transactions. The auditor is asking where the other 2,400 are.

**What you're seeing:**
You only made one request. The API's default "Page Size" is 100. Because you didn't "Paginate," you missed 96% of the data!

**Your job:**
1. Identify the "Pagination Key" in the response (it might be called \`next_url\` or \`page_count\`).
2. Wrap your request in a \`while\` loop.
3. Automatically "Turn the pages" until you have all 2,500 transactions.

**Code to look at:**
\`\`\`python
# Look for something like this in the JSON:
# "pagination": {"next_page_number": 2, "total_pages": 25}
\`\`\`

**Think through these:**
- Why do APIs use pagination instead of sending everything at once? (Hint: Speed and Memory)
- What is the business risk of an "Incomplete Audit"?
- How does a "While Loop" ensure you never miss a page, even if the number of pages changes?

**What the solution looks like:**
You've moved from "Sampling" data to "Consolidating" data. By mastering pagination, you ensure that your reports are 100% complete. You can now confidently tell the auditor: "I have every single record," because your code didn't stop until the API told it to.`,
      'quizzes': [
        {
          'question': "Why do most professional APIs use 'Pagination'?",
          'options': ["A. To make it harder for developers to use", "B. To save server memory and make responses faster by sending small chunks at a time", "C. To save electricity", "D. Because they don't know how many rows they have"],
          'correct': 1,
          'explanation': "Sending 1 million rows in one JSON file would likely crash the browser or the script. Pagination keeps things fast and manageable."
        }
      ]
    },
    'APIs in Banking & Fintech': {
      'lesson': `## APIs in Banking & Fintech
In Nigeria, the "Fintech Revolution" (companies like Paystack, Flutterwave, Moniepoint, and Kuda) is built entirely on APIs. These companies don't wait for banks to send them files; they talk to each other in real-time using APIs.

## Why should you care as an MIS student?
Fintech is the most lucrative sector for MIS graduates in Africa. Understanding "Open Banking" and "API Standards" (like NIBSS) makes you a highly valuable "Technical Business Analyst."

## How it actually works
1. **Core Banking API**: How a bank allows other apps to check a balance.
2. **Webhooks**: A special API where the Bank "Calls You" as soon as a payment happens.
3. **Virtual Accounts**: APIs that allow you to generate a unique bank account for every customer.
4. **BVN / KYC APIs**: Using an API to verify a customer's identity with the government database.

## Show me the code
\`\`\`python
# Simple Webhook Receiver (Simplified)
# This is an API YOU build that the Bank calls!

def receive_payment_notification(payload):
    if payload['status'] == 'success':
        customer_id = payload['customer_id']
        amount = payload['amount']
        update_customer_balance(customer_id, amount)
        return "OK", 200

# The bank calls this URL: https://api.your-shop.com/webhooks/payments
\`\`\`

## Real life: How companies use this
**PiggyVest** uses APIs to "Pull" money from your bank account when you save. They talk to a "Payment Gateway" (like Paystack) via an API. Paystack then talks to your Bank's API. The money moves in seconds because the computers are "talking" to each other directly.

## Remember these three things
- In Fintech, APIs = Money.
- A "Webhook" is the fastest way to know a transaction happened.
- Security (Encryption and Keys) is 10x more important in Banking APIs.`,
      'scenario': `## Scenario: The "Instant" Refund Problem
**The situation:** Your startup promises "Instant Refunds." Currently, when a customer asks for a refund, an employee has to log into the bank portal, type the details, and click "Send." This takes 2 days.

**What you're seeing:**
Angry customers on Twitter. The "Manual Process" is too slow for a modern business.

**Your job:**
1. Connect to your bank's "Transfer API."
2. Write a script that triggers as soon as a refund is approved in your system.
3. Automatically send the "POST" request to the bank to move the money.

**Code to look at:**
\`\`\`python
# The POST request to the bank:
refund_data = {
    "account_number": "0123456789",
    "bank_code": "058", # GTBank
    "amount": 5000,
    "remark": "Automated Refund"
}
requests.post("https://api.bank.com/transfer", json=refund_data, headers=auth_headers)
\`\`\`

**Think through these:**
- How does an "API-First" approach improve the "Customer Experience"?
- What security checks should you add to a script that can move real money?
- Why is an "API Audit Log" more reliable than a human's memory?

**What the solution looks like:**
You've transformed the business. By replacing a manual portal login with an API call, "Instant" actually means instant. The business scales without hiring more accountants, and customers are happy because their money returns in seconds. This is the power of MIS in the digital economy.`,
      'quizzes': [
        {
          'question': "What is a 'Webhook' in the context of fintech APIs?",
          'options': ["A. A type of fishing net", "B. An API where the server 'pushes' data to you as soon as an event happens (instead of you asking)", "C. A very slow API", "D. A way to delete a bank account"],
          'correct': 1,
          'explanation': "Webhooks are 'Reverse APIs'. Instead of your script asking 'Did I get paid?', the bank calls your script and says 'Hey, you just got paid!'"
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Relational API Dashboard
In this project, you will pull relational data (Users and Posts) from two separate API endpoints, join them together in memory, and generate an executive report.

## The Business Case
Your company, **"Lagos Media Group,"** has a platform with thousands of Users and Posts. The Marketing Director needs a report showing which authors are generating the most content. The database team is busy, so you need to pull this data directly from the live API endpoints, join the Users and Posts manually, and generate a dashboard.

## Your Project Tasks:
0. **The Data**: We will use the [JSONPlaceholder Relational API](https://jsonplaceholder.typicode.com/) to simulate linked business systems.
1. **The Request**: Write a Python script to call the \`/users\` endpoint and the \`/posts\` endpoint.
2. **The Extraction & Join**: Parse the JSON responses and link the data together (matching the \`userId\` in a Post to the \`id\` in the Users list).
3. **The Analytics**: Calculate the total number of posts made by each specific user.
4. **The Dashboard**: Create a formatted text output showing:
   - Today's Date.
   - Top 3 Most Active Users.
   - Any users who have 0 posts (System Alert).
5. **The Delivery**: Push your \`api_join_bot.py\` and a \`README.md\` with a screenshot of your dashboard to GitHub.

## Show me the code (API Logic)
\`\`\`python
# Example of joining API data:
import requests

users = requests.get("https://jsonplaceholder.typicode.com/users").json()
posts = requests.get("https://jsonplaceholder.typicode.com/posts").json()

# Match the foreign key!
user_dict = {user['id']: user['name'] for user in users}
for post in posts[:3]:
    author = user_dict.get(post['userId'])
    print(f"Author: {author} | Title: {post['title']}")
\`\`\`

## Presenting to Executives
Tell the Director: "By joining these API endpoints in memory, we bypassed the database bottleneck completely. We now have a real-time, automated report of our top content creators."`,
      'scenario': `## Scenario: The "API Key" Leak
**The situation:** You just pushed your code to GitHub. 5 minutes later, you get an automated email from the API provider saying your "Secret Key" has been compromised and your account is suspended.

**Your job:**
1. Identify how the key got leaked (Did you hardcode it in the script?).
2. Use an \`.env\` file or "Environment Variables" to hide your keys.
3. Add a \`.gitignore\` file to your repository so the \`.env\` file is never pushed to GitHub again.
4. Rotate your API key (generate a new one).

**Think through these:**
- Why is it dangerous to have API keys visible on a public GitHub repository?
- How does a \`.gitignore\` file protect a company's sensitive credentials?`,
      'quizzes': [
        {
          'question': "When you upload your API project to GitHub, which file should you use to ensure your secret keys are NOT shared with the public?",
          'options': ["A. README.md", "B. .gitignore", "C. main.py", "D. config.txt"],
          'correct': 1,
          'explanation': "The .gitignore file tells Git which files to ignore. By putting your secret keys in a separate file (like .env) and adding that file to .gitignore, you keep your credentials safe while sharing your code."
        }
      ]
    }
  },
  'Cloud Computing': {
    'Cloud Basics for MIS': {
      'lesson': `## What is Cloud Computing?
Cloud computing is the delivery of computing services-including servers, storage, databases, networking, software-over the internet ("the cloud"). Instead of buying physical servers, you rent them from companies like Amazon (AWS) or Microsoft (Azure).

## Why should you care as an MIS student?
Businesses no longer build "Server Rooms." They use the Cloud. Understanding the cloud is essential because it's where all modern business data lives. It allows a small startup in Yaba to have the same computing power as a global bank.

## How it actually works
1. **IaaS**: Infrastructure as a Service. Renting the "virtual computer" (like AWS EC2).
2. **PaaS**: Platform as a Service. Tools to build apps without managing servers (like Google App Engine).
3. **SaaS**: Software as a Service. Using apps like Gmail, Zoom, or Salesforce.
4. **Storage**: Like a giant hard drive in the sky (AWS S3).

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
- Why is it easier to "Scale" a cloud server when your business grows?

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
    },
    'AWS, Azure, & Google Cloud': {
      'lesson': `## The Three Giants
The cloud market is dominated by three main providers:
- **AWS (Amazon Web Services)**: The leader. Has the most tools and features.
- **Microsoft Azure**: Popular with big corporations that already use Windows and Office 365.
- **Google Cloud (GCP)**: The expert in Big Data and Artificial Intelligence.

## Why should you care as an MIS student?
Different companies choose different clouds. Knowing the names and strengths of each helps you in job interviews. If you work at a bank, they likely use **Azure**. If you work at a fast-moving startup, they likely use **AWS**.

## How it actually works
1. **Regions**: Physical locations (like "London" or "South Africa") where the servers are kept.
2. **Availability Zones**: Multiple buildings in one region so that if one building loses power, the other stays on.
3. **Console**: The website where you log in to manage your servers.

## Real life: How companies use this
**MTN Nigeria** might use **Azure** because they have a deep relationship with Microsoft for their internal emails and documents. **Paystack** might use **AWS** because of its advanced security tools for handling millions of credit card transactions per day.

## Remember these three things
- AWS is the oldest and biggest.
- Azure is the best for "Enterprise" (big corporate) integration.
- GCP is the king of "Data Analytics."`,
      'scenario': `## Scenario: Choosing the Right Home
**The situation:** You are the CTO of a new logistics startup. You need to pick a cloud provider. Your team already knows how to use Google's data tools (like BigQuery), but the investors are pushing for AWS because "everyone uses it."

**What you're seeing:**
If you go with AWS, your team will have to spend 2 months learning new tools. If you go with Google Cloud, you can launch in 2 weeks.

**Your job:**
1. Compare the "Time to Market" (how fast you can launch).
2. Look at the "Free Credits" each provider offers to new startups.
3. Make a recommendation based on your team's skills, not just what's popular.

**Think through these:**
- Why is "Team Skillset" a valid reason to choose a specific cloud?
- How do "Free Credits" help a startup survive the first year?
- Does it matter to the customer which cloud you use?

**What the solution looks like:**
As an MIS leader, you'd choose **Google Cloud**. Why? Because speed and team expertise are more valuable than following the crowd. You'd present a "Cost-Benefit Analysis" showing that the 2 months saved are worth more than any minor difference in server price.`,
      'quizzes': [
        {
          'question': "Which cloud provider is known for being the most popular among large corporations already using Microsoft products?",
          'options': ["A. AWS", "B. Azure", "C. Google Cloud", "D. iCloud"],
          'correct': 1,
          'explanation': "Microsoft Azure integrates seamlessly with existing Microsoft tools like Active Directory and Office 365, making it a favorite for large enterprises."
        }
      ]
    },
    'S3: Storing Data in the Sky': {
      'lesson': `## What is AWS S3?
S3 stands for **Simple Storage Service**. It's not a "computer"; it's a giant, infinite hard drive. You can store any file (Images, CSVs, Videos) and access it from anywhere in the world.

## Why should you care as an MIS student?
S3 is the "Starting Point" for data pipelines. Before you clean data, you "Dump" it into S3. This is called a **Data Lake**. It's much cheaper to store 100TB of data in S3 than it is to store it in a database.

## How it actually works
1. **Buckets**: Think of these as "Main Folders" (e.g., \`company-invoices\`).
2. **Objects**: The files inside the bucket.
3. **Keys**: The full path to the file (e.g., \`2023/jan/invoice_001.pdf\`).
4. **Permissions**: Rules on who can see or delete the files.

## Show me the code
\`\`\`python
# Downloading a file from S3 to your local computer
s3.download_file('my-bucket', 'data.csv', 'local_data.csv')
\`\`\`

## Real life: How companies use this
**Instagram** stores every photo you upload in S3 (or a similar service). When you scroll your feed, the app asks the "Sky Hard Drive" for the image file and shows it to you. S3 ensures that even if 1 billion people look at the same photo, the system doesn't crash.

## Remember these three things
- S3 is for "Unstructured Data" (files).
- It is virtually "Unbreakable"-Amazon guarantees your data won't be lost.
- It is the foundation of the "Modern Data Lake."`,
      'scenario': `## Scenario: The "Leaky" Bucket
**The situation:** You just uploaded the "Employee Salary List" to an S3 bucket. 1 hour later, you find a link to the file on a public forum. Anyone in the world can see what the CEO earns.

**What you're seeing:**
When you created the bucket, you clicked "Public Access" because you wanted it to be "easy to use." This is the #1 cause of data breaches in the cloud.

**Your job:**
1. Immediately turn off "Public Access" in the AWS Console.
2. Set a "Bucket Policy" that only allows your specific office IP address to see the files.
3. Use "Presigned URLs" if you need to share a file with someone for just 10 minutes.

**Code to look at:**
\`\`\`python
# Generating a temporary link that expires in 1 hour
url = s3.generate_presigned_url('get_object', Params={'Bucket': 'secret', 'Key': 'file.pdf'}, ExpiresIn=3600)
\`\`\`

**Think through these:**
- Why is "Convenience" the enemy of "Security"?
- What is the "Reputation Cost" of a public data leak?
- How do "Presigned URLs" solve the problem of sharing files safely?

**What the solution looks like:**
By mastering S3 security, you protect the company from multi-million dollar lawsuits. You ensure that "Public" only means what you explicitly want the world to see, while everything else stays locked behind the cloud's digital vault.`,
      'quizzes': [
        {
          'question': "What is an S3 'Bucket'?",
          'options': ["A. A physical server", "B. A container for storing files (objects) in the cloud", "C. A type of database", "D. A programming language"],
          'correct': 1,
          'explanation': "Buckets are the fundamental containers for data in S3. Everything you store in S3 is contained in a bucket."
        }
      ]
    },
    'Lambda: Functions without Servers': {
      'lesson': `## What is AWS Lambda?
Lambda is "Serverless" computing. Instead of renting a whole computer that runs 24/7, you just upload your Python code. The code only "wakes up" when it's needed, runs for a few seconds, and then "disappears."

## Why should you care as an MIS student?
It is incredibly cheap. If your code only runs once a day for 5 seconds, you pay almost ₦0. With a traditional server, you'd pay for 24 hours of electricity even if the computer was doing nothing. Lambda is the future of efficient business automation.

## How it actually works
1. **Trigger**: What starts the code (e.g., "A new file arrived in S3").
2. **Function**: Your Python script.
3. **Execution**: The code runs, does its job, and stops.
4. **Scaling**: If 1,000 files arrive at once, Lambda starts 1,000 copies of your code automatically.

## Show me the code
\`\`\`python
# A simple Lambda function
def lambda_handler(event, context):
    print("I was triggered by an event!")
    return {"status": "success"}
\`\`\`

## Real life: How companies use this
**A Food Delivery App** uses Lambda to resize photos. When a restaurant owner uploads a giant 10MB photo of their Jollof Rice, a Lambda function "wakes up," shrinks the photo to a small size for mobile phones, saves it, and then turns itself off. Total cost: ₦0.001.

## Remember these three things
- Serverless means you don't manage the operating system.
- You only pay for the "Milliseconds" your code is running.
- Lambda is perfect for "Event-Driven" tasks (like processing an order as soon as it's placed).`,
      'scenario': `## Scenario: The "Night Owl" Automator
**The situation:** You have a script that checks for "Fraudulent Transactions" every hour. You are currently running it on a virtual server that costs ₦20,000 per month. The script only takes 2 minutes to run each time.

**What you're seeing:**
The server is "Idle" (doing nothing) for 58 minutes of every hour, but you are still paying for those minutes. You are wasting the company's budget.

**Your job:**
1. Move the Python logic to an **AWS Lambda** function.
2. Set a "CloudWatch Trigger" to run the function every 60 minutes.
3. Calculate the new cost (it will likely be under ₦100 per month).

**Think through these:**
- Why is it "wasteful" to have a server running 24/7 for a short task?
- How does "Serverless" help a company stay "Lean" (spending less)?
- What happens if the fraud-check script suddenly needs to run 1,000 times a minute? (Hint: Scaling)

**What the solution looks like:**
By switching to Lambda, you've saved the company ₦240,000 a year. This is the kind of "Business Intelligence" that gets MIS professionals promoted. You've proven you understand both the **Code** and the **Cost**.`,
      'quizzes': [
        {
          'question': "What is the main advantage of 'Serverless' computing like AWS Lambda?",
          'options': ["A. It is faster than any other computer", "B. You don't have to manage servers and you only pay for the time the code is actually running", "C. It doesn't use the internet", "D. It is only for storing images"],
          'correct': 1,
          'explanation': "Serverless allows you to focus on the code while the cloud provider handles the scaling and infrastructure, saving both time and money."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Disaster-Proof Backup System
In this project, you will move your company's data security to the next level by building an automated, cloud-based backup system. You will ensure that even if the physical office is destroyed, the business continues.

## The Business Case
Your company, **"Enugu Manufacturing,"** currently saves its daily production logs on a single computer in the factory. If that computer's hard drive fails (or the factory floods), 10 years of data is lost. You need to build a "Cloud Bridge" that pushes these logs to the AWS cloud automatically.

## Your Project Tasks:
0. **The Data**: Download the [Chinook Relational Database](https://github.com/lerocha/chinook-database), which simulates an iTunes store with heavily linked Tables (Artists, Albums, and Tracks).
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
print("   ENUGU MFG - CLOUD SECURITY DASHBOARD")
print("=========================================")
print(f"SYNC STATUS:     [SUCCESS]")
print(f"FILES PROTECTED: {file_count} CSVs")
print(f"S3 DESTINATION:  s3://enugu-mfg-secure-backups/")
print("-----------------------------------------")
print("Action: Project files pushed to GitHub.")
\`\`\`

## Presenting to Executives
Tell the CEO: "We are no longer vulnerable to local disasters. Our business intelligence is now stored in a globally distributed, encrypted digital vault. We can restore our entire operation in under 30 minutes from anywhere in the world."`,
      'scenario': `## Scenario: The "Oops, I Deleted It" Recovery
**The situation:** A manager accidentally deleted the "June Production Report" from the local computer. He is panicking. He needs it for a meeting in 10 minutes.

**Your job:**
1. Use your script (or the AWS CLI) to "Pull" the backup from S3 back to the local computer.
2. Verify that the file is the correct version.
3. Show the manager how the "Cloud History" allows you to recover any version of a file from any date.

**Think through these:**
- Why is "Versioning" (keeping multiple copies of the same file) a life-saver in business?
- How does the Cloud reduce the "Cost of Mistakes" in an organization?`,
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
  'dbt & Modeling': {
    'Modern Data Modeling': {
      'lesson': `## What is dbt & Modeling?
dbt (data build tool) is a framework that brings software engineering best practices-like testing and version control-to the world of SQL. It's used to turn raw data in your warehouse into "Clean" tables for the business.

## Why should you care as an MIS student?
Raw data is "Messy." Columns have weird names like \`C_123_TX\`, and dates are in the wrong format. If you give this to a manager, they'll be confused. dbt allows you to "Model" the data into clean, easy-to-read tables like \`daily_revenue\`.

## How it actually works
1. **Raw Layer**: The messy data exactly as it came from the source.
2. **Staging Layer**: Renaming columns and fixing dates.
3. **Mart Layer**: The final tables used by the CEO (e.g., "Monthly Sales by Region").

## Show me the code
\`\`\`sql
-- A dbt model: stg_customers.sql
with raw_data as (
    select * from {{ source('sales_app', 'customers') }}
),
final as (
    select
        id as customer_id,
        first_name || ' ' || last_name as full_name,
        lower(email) as email
    from raw_data
)
select * from final
\`\`\`

## Real life: How companies use this
**Cowrywise** uses dbt to ensure everyone in the company is looking at the same numbers. Instead of 10 people writing 10 different SQL queries to find "Total Users," they all use the one dbt model. This is called the "Single Version of Truth."

## Remember these three things
- dbt is "SQL with Superpowers."
- It focuses on the **Transformation** (the 'T' in ELT).
- It makes your data pipelines reliable and easy for others to understand.`,
      'scenario': `## Scenario: The "Which Number is Right?" War
**The situation:** In the Monday meeting, the Marketing Manager says sales were ₦5M last week. The Finance Manager says they were ₦4.2M. The CEO is angry because nobody knows the real number.

**What you're seeing:**
Marketing is counting "Orders Placed" (including ones not yet paid). Finance is counting "Bank Settlements" (only paid ones). Both are using different, custom SQL queries.

**Your job:**
1. Create a single dbt model called \`fct_sales\`.
2. Define exactly what a "Successful Sale" means in the SQL code.
3. Tell both managers to use this new model instead of their own queries.

**Code to look at:**
\`\`\`sql
-- Inside fct_sales.sql
select * 
from raw_orders
where status = 'completed' 
  and payment_confirmed = true
\`\`\`

**Think through these:**
- Why is it dangerous for a company to have two different "Sales" numbers?
- How does dbt help stop people from writing their own (possibly wrong) SQL?
- In MIS, why is "Consistency" more important than "Speed" in business reporting?

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
      'lesson': `## Tables vs Views
In a data warehouse, you have two ways to save your dbt models:
- **Table**: The data is actually copied and stored on a disk. It's fast to read but takes up space and needs to be updated.
- **View**: A "Virtual Table." It doesn't store data; it just runs the SQL query every time someone looks at it. It uses zero space but can be slow if the query is complex.

## Why should you care as an MIS student?
This is a "Cost vs Speed" decision. If you have a giant table with 1 billion rows, you should probably use a **Table** so people don't have to wait 10 minutes every time they open a dashboard. For a small list of "Product Categories," a **View** is perfect.

## How it actually works
In dbt, you change this with one line of code at the top of your SQL file:
\`\`\`sql
{{ config(materialized='table') }} -- To make it a Table
{{ config(materialized='view') }}  -- To make it a View
\`\`\`

## Real life: How companies use this
**A Retail Bank** might use a **Table** for "Daily Account Balances" because thousands of employees look at it all day. They use a **View** for the "Branch Manager List" because it only has 50 rows and only changes once a month.

## Remember these three things
- Views are "Live" (always up to date) but can be slow.
- Tables are "Cached" (fast to read) but need to be "Refreshed" by dbt.
- Use Tables for large, frequently used data and Views for small, simple logic.`,
      'scenario': `## Scenario: The "Spinning Wheel" Dashboard
**The situation:** You built a beautiful dashboard for the Sales Team. However, every time they open it, the screen stays blank for 30 seconds with a spinning wheel. The Sales VP is complaining that it's "too slow."

**What you're seeing:**
Your dbt model is currently a **View**. Every time the dashboard opens, the warehouse has to re-calculate 2 years of sales data from scratch.

**Your job:**
1. Change the dbt configuration from \`materialized='view'\` to \`materialized='table'\`.
2. Run \`dbt run\` to build the table once.
3. Watch the dashboard load in under 1 second.

**Think through these:**
- Why did the dashboard get faster when you switched to a Table?
- What is the "Price" you pay for this speed? (Hint: Storage and Refresh time)
- When would you *not* want to use a Table?

**What the solution looks like:**
By understanding "Materialization," you've improved the "User Experience" (UX). You've realized that the Sales Team's time is more valuable than a few pennies of storage cost. You've moved from "Building something that works" to "Building something that people actually like to use."`,
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
      'lesson': `## Why Test Data?
In software, we test if buttons work. In data, we test if the numbers are "Sane." Is the price negative? Is the customer ID missing? Is the date in the year 2099? dbt allows you to write automatic tests to catch these "Data Quality" issues.

## Why should you care as an MIS student?
"Garbage In, Garbage Out." If your source data is broken, your reports will be wrong, and the company will make bad decisions. Testing is the "Filter" that stops garbage data from reaching the CEO's dashboard.

## How it actually works
dbt has 4 built-in tests that you can add to a simple YAML file:
1. **Unique**: Is this column full of duplicates?
2. **Not_Null**: Is there missing data?
3. **Accepted_Values**: e.g. status must be 'Paid' or 'Pending', not 'Banana'.
4. **Relationships**: Does this Customer ID actually exist in the Customer table?

## Show me the code
\`\`\`yaml
# schema.yml
version: 2
models:
  - name: stg_payments
    columns:
      - name: payment_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['success', 'failed', 'pending']
\`\`\`

## Real life: How companies use this
**A Fintech** might have a test on their "Transaction Amount" column. If a bug in the app accidentally tries to save a transaction for -₦500,000, the dbt test will "Fail" and alert the engineers before that negative number messes up the total revenue report.

## Remember these three things
- Tests catch errors *before* the business sees them.
- Data Quality is the responsibility of the Data Engineer.
- dbt tests run every time you update your models (\`dbt test\`).`,
      'scenario': `## Scenario: The Duplicate Customer Disaster
**The situation:** Your company ran a "Refer a Friend" promotion. A bug in the system allowed some people to sign up twice with the same email. Now your "Total Customers" report is showing 10,000 people, but there are only 8,000 real humans.

**What you're seeing:**
The CEO is happy about the 10,000 users, but the Marketing team is confused because they can only find 8,000 emails in their mailing list. You look like you're "Faking the numbers."

**Your job:**
1. Add a \`unique\` test to the \`email\` column in your dbt model.
2. Run \`dbt test\`. It will show you exactly which emails are duplicates.
3. Fix the SQL to only pick the "first" signup for each email.

**Think through these:**
- Why are "Duplicate Records" a major problem for business reporting?
- How does a "Failing Test" protect your reputation as an analyst?
- In MIS, why is "Auditability" (proving the numbers are right) so important?

**What the solution looks like:**
By adding automated tests, you've created a "Safety Net." You no longer have to manually "check" the data every morning. If there's a duplicate, the computer tells you. This ensures that the CEO only ever sees the "Real" number, protecting both the company's decisions and your professional integrity.`,
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

## The Business Case
Your company, **"Owerri Omnichannel,"** sells on Jumia, Konga, and their own website. Each platform uses different names for "Revenue." The CEO is confused. You need to build a dbt project that joins these three sources and creates one master table called \`dim_total_revenue\`.

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
  }
};

