import re

def fix_content():
    with open('content.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # The code block ends with \`\`\` (escaped backticks in JS template literals)
    # The regex needs to match \`\`\`python ... \`\`\`
    # Let's match: (\\\`\\\`\\\`(?:python|bash)?\n.*?\\\`\\\`\\\`)
    # followed by \n+
    # and then the Beginner Breakdown section
    
    # Let's try to match \`\`\`
    pattern = re.compile(r'(\\\`\\\`\\\`(?:python|bash)?\n.*?\\\`\\\`\\\`)\n+((\*\*Beginner Breakdown.*?\*\*\s*.*?)(?=\n\s*(?:### |## |\\\`\\\`\\\`|\Z|,\n|\'scenario\':|\'quizzes\':)))', re.DOTALL)
    
    swaps = 0
    def replacer(match):
        nonlocal swaps
        swaps += 1
        code_block = match.group(1).strip()
        breakdown_section = match.group(2).strip()
        return f"{breakdown_section}\n\n{code_block}"

    new_content = pattern.sub(replacer, content)

    with open('content.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Swaps performed: {swaps}")

if __name__ == '__main__':
    fix_content()
