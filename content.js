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

## The Broad Business Problem
Your company, **"Northwind Traders,"** is an international import/export company losing money because pricing decisions are too slow. By the time management realizes a product is failing, it's already the end of the month. The root cause? Data fragmentation. The regional offices store their sales in isolated, messy CSV files, and an intern spends 4 hours manually copying them into Excel. You need to build an automated Python system that instantly consolidates this data so the company can make daily, aggressive pricing decisions.

## Your Project Tasks:
0. **The Data**: Download the [Northwind Relational Database from GitHub](https://github.com/pthom/northwind_psql) (Specifically the Orders, Order Details, and Products CSVs).
1. **The Script**: Write a Python script using Pandas to read these separate tables and \`MERGE\` them using their Foreign Keys (e.g., \`product_id\`).
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
      'lesson': `## Why are we learning ETL?
Data engineering is mostly about moving data from where it is created (like a cash register) to where it is analyzed (like a dashboard). **ETL** stands for **Extract, Transform, Load**. It is the "Pipeline" that makes this journey happen.

## Step-by-Step Tutorial: The 3 Pillars
1. **Extract**: Grabbing raw data from its source (Excel, a SQL database, or an API).
2. **Transform**: The "Kitchen" phase. You clean the data, fix typos, calculate totals, and remove private information.
3. **Load**: Delivering the clean data to its final destination (a Data Warehouse or a CSV for a boss).

## Let's look at a Real Business Example
Imagine **Shoprite**. Every time a customer buys a soda, that data is created at the cash register.
- **Extract**: At 11 PM, a script pulls all sales from every branch.
- **Transform**: The script calculates the total VAT and changes "soda" to "Beverage."
- **Load**: The clean data is saved into a central database. Now, the CEO can see exactly how much profit was made across all of Nigeria.

## Common Mistakes to Avoid
- **Dirty Loading**: Loading data without cleaning it first. If you load ₦5,000 as "5000NGN", your dashboard won't be able to do math on it.
- **Manual Extract**: Trying to copy-paste data yourself. A real ETL pipeline must be automated.`,
      'scenario': `## Scenario: The "Where is the Money?" Crisis
**The situation:** Your manager says the company made ₦10M today, but your dashboard only shows ₦8M.

**Your job:**
1. Check the **Extract** step: Did the data from the Abuja branch actually arrive?
2. Check the **Transform** step: Is the math accidentally excluding "Online Payments"?
3. Check the **Load** step: Is the final database rejecting some rows because they are too large?

**What the solution looks like:**
By understanding the ETL flow, you can troubleshoot exactly where the "missing ₦2M" is. You realize the Abuja branch internet was down during the Extract phase. You re-run the script, and the dashboard is fixed.`,
      'quizzes': [
        {
          'question': "What happens in the 'Transform' phase of ETL?",
          'options': ["A. Data is deleted", "B. Data is cleaned, calculated, and formatted for the business", "C. Data is moved to a new folder", "D. The computer is turned off"],
          'correct': 1,
          'explanation': "Transformation is where the 'magic' happens. Messy raw data becomes clean, useful business information."
        }
      ]
    },
    'The Extract Phase': {
      'lesson': `## Why are we learning Extraction?
Extraction is the "First Mile" of data engineering. If you can't get the data out of the source, you can't analyze it. Professionals use Python to "Reach into" systems and pull data automatically.

## Step-by-Step Tutorial: Pulling Data
1. **Source Identification**: Where does the data live? (CSV, SQL, or API).
2. **Connection**: Using a "Driver" or "Library" (like \`pandas\` or \`requests\`) to talk to that system.
3. **The Snapshot**: Pulling the data and saving it in a temporary "Staging Area."

## Let's look at a Real Business Example
**GTBank** extracts thousands of records from their ATM network every hour. Instead of a human checking each ATM, a Python script visits each machine's IP address, "Extracts" the transaction log, and saves it. This allows the bank to detect a broken ATM in seconds.

## Common Mistakes to Avoid
- **Hard-coding credentials**: Never put a database password directly in your Extract script.
- **Overloading the source**: If you extract 1 million rows at 2 PM, the database might slow down and prevent customers from buying things. Always extract during "Off-Peak" hours (like midnight).`,
      'scenario': `## Scenario: The Locked Database
**The situation:** You are trying to extract sales data at 10 AM, but the IT team says you are slowing down the system and customers can't check out.

**Your job:**
1. Schedule your extraction script to run at 2 AM instead of 10 AM.
2. Use "Incremental Extraction" (only pull today's rows) instead of pulling the whole history.

**What the solution looks like:**
You've balanced the needs of the "Business" (speed for customers) with the needs of "Analytics" (data for you). This is the mark of a professional MIS analyst.`,
      'quizzes': [
        {
          'question': "When is the best time to perform a large data extraction from a production database?",
          'options': ["A. During peak business hours", "B. Monday morning at 9 AM", "C. During off-peak hours (like midnight) when the system is not busy", "D. Never, just use Excel"],
          'correct': 2,
          'explanation': "Extraction can be 'heavy'. Doing it at night ensures you don't slow down the system for paying customers."
        }
      ]
    },
    'Cleaning & Transforming Data': {
      'lesson': `## Why are we learning Transformation?
Transformation is where you add **Value**. Raw data is just a pile of bricks; transformation is the process of building a house.

## Step-by-Step Tutorial: The "Cleaning" Checklist
1. **Standardization**: Change all dates to the same format (\`YYYY-MM-DD\`).
2. **Currency Conversion**: Convert all prices (USD, GBP) into Naira using a live exchange rate.
3. **De-duplication**: If a customer is listed twice by mistake, delete the duplicate.
4. **Calculations**: Create new columns like "Profit Margin" (Revenue - Cost).

## Let's look at a Real Business Example
**Paystack** receives payment data from thousands of websites. Some write "lagos", some write "LAGOS", and some write "Lagos State." Paystack uses a transformation script to change all of these to just "Lagos" so their "Sales by City" chart is accurate.

## Common Mistakes to Avoid
- **Losing the Raw Data**: Never delete your original messy data. If your transformation script has a bug, you'll need the raw data to try again.
- **Formatting in Excel**: Don't manually fix data in a spreadsheet. Use a script so the cleaning happens automatically every time new data arrives.`,
      'scenario': `## Scenario: The Duplicate Customer Disaster
**The situation:** Your company ran a promo, and 500 customers signed up twice with different emails. Your "Total Customers" report is now wrong.

**Your job:**
1. Write a Python script to find customers with the same "Phone Number."
2. Delete the duplicate rows, keeping only the most recent one.

**What the solution looks like:**
You've restored "Data Integrity." The CEO now has the real number of customers, which helps him plan the budget for next year correctly.`,
      'quizzes': [
        {
          'question': "What is 'De-duplication' in data transformation?",
          'options': ["A. Adding more data", "B. Removing identical records that were accidentally saved twice", "C. Changing the data type", "D. Sending an email"],
          'correct': 1,
          'explanation': "Duplicates lead to 'double counting', which makes your reports lie. De-duplication ensures each event is only counted once."
        }
      ]
    },
    'Loading into a Warehouse': {
      'lesson': `## Why are we learning Loading?
Loading is the final step. You've extracted the data and cleaned it; now you must "Park" it in a secure, high-performance home called a **Data Warehouse** (like Google BigQuery or Snowflake) so people can use it.

## Step-by-Step Tutorial: The Delivery
1. **Destination Schema**: Creating a table that has exactly the right columns to fit your clean data.
2. **Upsert vs. Append**: 
   - **Append**: Just add the new rows to the end.
   - **Upsert**: If the row already exists, update it; if not, add it.
3. **Verification**: Checking that 100 rows were sent and 100 rows arrived.

## Let's look at a Real Business Example
A bank like **Kuda** loads their "Clean Transactions" into a warehouse every 30 minutes. This warehouse is separate from their "Banking App." Why? So that analysts can run heavy reports all day without slowing down the app for customers.

## Common Mistakes to Avoid
- **Loading into Production**: Never load your analytics data back into the main database that runs the app. Use a separate Warehouse.
- **No Error Checks**: If the loading fails and you don't know, your dashboard will be empty. Always check the "Load Status."`,
      'scenario': `## Scenario: The "App is Slow" Complaint
**The situation:** You are running your analytics reports directly on the main database. Every time you run a "Top Customers" query, the mobile app becomes slow for everyone.

**Your job:**
1. Create a separate **Data Warehouse**.
2. Update your ETL pipeline to "Load" the data into this Warehouse once a night.
3. Tell the analysts to run their reports only on the Warehouse.

**What the solution looks like:**
You've improved the "System Architecture." The app stays fast for customers, and the analysts can run as many reports as they want without any risk.`,
      'quizzes': [
        {
          'question': "Why do companies use a separate 'Data Warehouse' for analytics instead of the main app database?",
          'options': ["A. To waste money", "B. To ensure that heavy analytics reports don't slow down the main app for customers", "C. Because warehouses are bigger than databases", "D. To hide data from hackers"],
          'correct': 1,
          'explanation': "Separating 'Production' (the app) from 'Analytics' (the reports) is a fundamental rule of MIS and Data Engineering."
        }
      ]
    },
    'Handling Pipeline Failures': {
      'lesson': `## Why are we learning Failure Handling?
In the real world, things break. The internet cuts out, a password changes, or a file is missing. If your ETL pipeline crashes and stays dead, the business stops getting its reports. Handling failures is what separates a "Student" from a "Senior Engineer."

## Step-by-Step Tutorial: Building Resilient Systems
1. **Retries**: If a connection fails, don't give up! Tell the computer to wait 5 minutes and try again. 90% of errors are temporary.
2. **Alerting**: If the script fails 3 times, send an immediate Slack/Email to you. "Hey! The pipeline is broken. Check the Abuja branch connection."
3. **Idempotency**: Ensuring that if you run a failed job again, it doesn't create duplicate rows. (e.g., using \`id\` to check if a row already exists).

## Let's look at a Real Business Example
**Flutterwave** processes millions of transactions. If their reconciliation pipeline fails at 2 AM, it doesn't just stop. It "Retries" automatically. If it still fails, it sends a "Critical Alert" to an engineer's phone. This ensures that even if there's a problem, it is fixed before the CEO wakes up at 8 AM.

## Common Mistakes to Avoid
- **Silent Failures**: The worst error is one you don't know about. If your script fails, it MUST shout (alert you).
- **Infinite Retries**: Don't tell your script to "try forever." If the password is wrong, it will never work. Set a limit of 3 or 5 tries.`,
      'scenario': `## Scenario: The Midnight Crash
**The situation:** You wake up at 8 AM and find your dashboard is empty. You check the code and see it crashed at 3 AM because the "Sales" file was missing.

**Your job:**
1. Add a \`try / except\` block to catch the error.
2. Inside the \`except\` block, add a function that sends you an alert.
3. Add a "Retry" rule to try again in 10 minutes.

**What the solution looks like:**
You've moved from "Building things that work" to "Building things that recover." Next time the file is 5 minutes late, the "Retry" will catch it automatically, and the dashboard will be ready when you wake up.`,
      'quizzes': [
        {
          'question': "What is the best way to handle a temporary network failure in a data pipeline?",
          'options': ["A. Delete the script", "B. Implement an 'Automated Retry' logic that waits and tries again", "C. Call the internet provider", "D. Do nothing and hope it works tomorrow"],
          'correct': 1,
          'explanation': "Network issues are often temporary. Retrying a few times automatically solves most of these problems without any human effort."
        }
      ]
    },
    'Incremental vs Full Loads': {
      'lesson': `## Why are we learning Load Strategies?
Efficiency is everything. If you have 10 years of sales data (100 million rows) and you only want to add today's sales (1,000 rows), a "Full Load" is a massive waste of time and money.

## Step-by-Step Tutorial: The Trade-off
1. **Full Load (Beginner)**: Deleting the whole table and replacing it with everything from the source.
   - **Pros**: Very easy to build.
   - **Cons**: Extremely slow as your company grows.
2. **Incremental Load (Pro)**: Only pulling and adding the rows that have been created *since the last time* the job ran.
   - **Pros**: Lightning fast, uses very little cloud power.
   - **Cons**: Harder to build (you need a "Watermark" or timestamp to know where you stopped).

## Let's look at a Real Business Example
**Uber** doesn't reload every ride since 2010 every time you finish a trip. They use **Incremental Loading**. As soon as your ride ends, that one row is "Extracted" and "Loaded" into their warehouse. This allows them to see global traffic patterns in near real-time.

## Common Mistakes to Avoid
- **Loading Duplicates**: If you run an incremental load twice for the same day, you might end up with double the sales. Always use a "Unique ID" check to prevent this.
- **Forgetting the Watermark**: If you don't keep track of the "Last Date Loaded," your script won't know which rows are new.`,
      'scenario': `## Scenario: The Growing Cloud Bill
**The situation:** Your company's data is growing fast. Your "Full Load" job used to take 5 minutes and cost ₦1k/day. Now it takes 2 hours and costs ₦50k/day.

**Your job:**
1. Switch to **Incremental Loading**.
2. Update your SQL to only pull rows where \`date = today\`.
3. Watch the cost drop back down and the speed increase instantly.

**What the solution looks like:**
You've "Future-Proofed" the pipeline. It doesn't matter if the company grows to a billion rows; your daily job only ever processes the new ones, keeping the system fast and the costs low.`,
      'quizzes': [
        {
          'question': "When should you choose an 'Incremental Load' over a 'Full Load'?",
          'options': ["A. When the dataset is very small", "B. When you want to replace all old data", "C. When the dataset is large and you only need to add new records to save time and cost", "D. Never, full loads are always better"],
          'correct': 2,
          'explanation': "Incremental loading is the key to 'Scaling'. It allows you to handle massive datasets by only working on the 'Change' rather than the 'Whole'."
        }
      ]
    },
    'ETL vs ELT': {
      'lesson': `## Why are we learning ELT?
Traditional **ETL** cleans data *before* saving it. Modern **ELT** (Extract, Load, Transform) saves the raw data first and cleans it *inside* the warehouse. This is the #1 trend in modern data engineering.

## Step-by-Step Tutorial: The Modern Shift
1. **ETL (Old Way)**: Best for when you have very sensitive data (like credit card numbers) that you MUST hide before it reaches the cloud.
2. **ELT (Modern Way)**: Best for speed and flexibility. You "dump" everything into a Data Lake (like S3) and use the power of the warehouse to clean it up with SQL.
3. **The "T" (dbt)**: In ELT, the Transformation is usually done using a tool called **dbt**, which we will learn later.

## Let's look at a Real Business Example
**Paystack** uses ELT. They pipe every raw event (clicks, logins, payments) into a "Data Lake." Then, their analysts use SQL to build "Models" that show conversion rates. If the business rules change, they just update the SQL—they don't have to re-extract the data because the "Raw History" is already there.

## Common Mistakes to Avoid
- **Losing the Raw Data**: In ETL, if you make a mistake in your cleaning logic, the raw data is gone. In ELT, you keep the raw data forever, so you can always fix your mistakes.
- **Transforming too early**: Don't waste time cleaning data that nobody will ever use. ELT allows you to load everything and only clean what is actually needed for a report.`,
      'scenario': `## Scenario: The "Oops, We Forgot a Column" Problem
**The situation:** You used ETL to process sales data and deleted the "Customer IP" column. 6 months later, the CEO wants to see "Fraud by City." You can't do it because the IP data is gone.

**Your job:**
1. Propose a switch to ELT.
2. Load the "Raw" data first.
3. Use SQL to create a "View" that includes the IP column.

**What the solution looks like:**
By adopting ELT, you've created a "Time Machine." Since you have the raw data safely stored, you can answer any new question that comes up in the future, even if you didn't plan for it 6 months ago.`,
      'quizzes': [
        {
          'question': "What is the main advantage of ELT over ETL?",
          'options': ["A. It is cheaper to build", "B. It allows you to keep the raw data history so you can change your transformation logic later", "C. It uses less internet", "D. It only works with Excel"],
          'correct': 1,
          'explanation': "ELT is about 'Flexibility'. By saving the raw data first, you can re-run your transformations as many times as you want if the business rules change."
        }
      ]
    },
    'ETL in a Real Nigerian Bank': {
      'lesson': `## ETL in a Real Nigerian Bank
In a Nigerian bank, ETL is about **Consolidation**. Thousands of branches in different cities must merge their data into one "Single Version of Truth" for the CEO and the Central Bank of Nigeria (CBN).

## Step-by-Step Tutorial: The Banking Flow
1. **Core Banking System (CBS)**: The main source (like Flexcube or Finacle).
2. **End of Day (EOD)**: A massive ETL job that runs every night to calculate interest, post charges, and balance the books.
3. **Reconciliation**: Comparing internal logs with NIBSS/Interswitch to make sure every Naira is accounted for.
4. **Regulatory Reporting**: Formatting data for the CBN's surveillance systems.

## Let's look at a Real Business Example
**Access Bank** uses ETL to manage "KYC" (Know Your Customer) data. They extract photos and IDs from branch scanners, "Transform" them into digital files, and "Load" them into a central database. This allows a customer to open an account in Enugu and have it accessible in Lagos in seconds.

## Common Mistakes to Avoid
- **No Audit Trail**: In banking, every change must be recorded. If you "Transform" a number, you must be able to prove *why* and *when* you did it.
- **Ignore Exceptions**: If a ₦1M transaction doesn't match between two systems, you can't just ignore it. You must create an "Exception Report" immediately.`,
      'scenario': `## Scenario: The Failed ATM Settlement
**The situation:** On Monday morning, Zenith Bank's settlement team noticed that ₦20 Million is missing. The internal system says the money was given out, but Interswitch says it wasn't.

**Your job:**
1. Manually trigger the "Reconciliation Pipeline."
2. Find the "Mismatched" rows.
3. Generate a report for the "Refunds" team.

**What the solution looks like:**
You've turned a financial crisis into a 5-minute data task. By automating the reconciliation, you ensure that the bank's records are always accurate and that customers get their money back quickly.`,
      'quizzes': [
        {
          'question': "What is 'Reconciliation' in banking ETL?",
          'options': ["A. Deleting old accounts", "B. Proving that internal records match external partner records (like NIBSS/Interswitch) to ensure no money is missing", "C. Changing the bank's logo", "D. Printing ATM receipts"],
          'correct': 1,
          'explanation': "Reconciliation is the act of checking your 'Internal' truth against an 'External' truth to ensure accuracy."
        }
      ]
    },
    'Milestone Project': {
      'lesson': `## Milestone: The Fintech Reconciliation Engine
In this project, you will build a complete ETL pipeline that handles the most critical task in banking: **Reconciliation**. You will move data from two sources and find the "Lost Money."

## The Broad Business Problem
Your grocery delivery startup, **"Instacart,"** is facing a data crisis. The analytics team is complaining about "ghost data"—orders with zero items or products linked to departments that don't exist. Investors are starting to doubt the revenue numbers. You must build a robust ETL pipeline that extracts the Orders, Products, and Departments tables, identifies these specific anomalies using Python, and loads a unified warehouse to restore trust in the company's reporting.

## Your Project Tasks:
0. **The Data**: Use the [Instacart Relational Database](https://www.kaggle.com/c/instacart-market-basket-analysis/data) (Orders, Products, and Departments tables).
1. **EXTRACT**: Pull the raw data into Python using Pandas.
2. **TRANSFORM**: 
   - Join the tables together.
   - Filter out "Ghost Orders" (orders with zero products).
   - Standardize department names (Uppercase).
3. **LOAD**: Save the cleaned dataset to a file called \`unified_warehouse.csv\`.
4. **DASHBOARD**: Create a summary showing "Total Anomalies Removed" and "True Revenue."
5. **DELIVERY**: Push your \`etl_pipeline.py\` and a screenshot of your terminal summary to GitHub.

## Presenting to Executives
Tell the VP: "Instead of 5 accountants manually checking files, this pipeline identifies every discrepancy in 3 seconds. It protects our revenue and ensures that the board of directors is looking at accurate, trustworthy numbers."`,
      'scenario': `## Scenario: The "Audit-Ready" Repository
**The situation:** The external auditors are coming. They want to see the "Logic" you used to calculate the sales figures. They don't want a spreadsheet; they want to see the code.

**Your job:**
1. Ensure your GitHub repo has a clear \`README.md\` explaining the ETL steps.
2. Tag your code as \`v1.0-Audit-Ready\`.
3. Show the auditors how every "Transformation" rule is documented in the code.

**What the solution looks like:**
You've proven that you are a professional. By using code instead of manual Excel, you've created a "Repeatable" and "Auditable" system that the bank can trust.`,
      'quizzes': [
        {
          'question': "Why is code-based ETL better for a financial audit than manual Excel files?",
          'options': ["A. It is more expensive", "B. It is transparent and repeatable-anyone can see the exact rules used to calculate the numbers and verify they haven't changed", "C. Auditors don't like Excel", "D. Code is faster to print"],
          'correct': 1,
          'explanation': "Auditability is the key. Code provides a 'Paper Trail' of every decision made during the data's journey."
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

