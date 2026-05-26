import sys

def swap_blocks():
    with open('content.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out = []
    i = 0
    swaps = 0

    while i < len(lines):
        line = lines[i]
        
        # Detect the start of a code block
        if r'\`\`\`' in line and not line.strip().startswith('//'):
            code_block = [line]
            i += 1
            while i < len(lines):
                c_line = lines[i]
                code_block.append(c_line)
                i += 1
                if r'\`\`\`' in c_line:
                    break
            
            j = i
            blank_lines = []
            while j < len(lines) and lines[j].strip() == '':
                blank_lines.append(lines[j])
                j += 1
                
            if j < len(lines) and '**Beginner Breakdown' in lines[j]:
                breakdown = []
                while j < len(lines):
                    b_line = lines[j]
                    
                    if j > (i + len(blank_lines)):
                        # Conditions to stop the breakdown
                        if b_line.strip().startswith('### ') or b_line.strip().startswith('## ') or r'\`\`\`' in b_line or b_line.strip() == '`,' or "'scenario':" in b_line or "'quizzes':" in b_line:
                            break
                        # If the line ends the Javascript template string
                        if b_line.rstrip().endswith('`,'):
                            break
                        # If the line is just a normal paragraph starting with "The answer"
                        if b_line.strip().startswith('The answer in this scenario:'):
                            break
                    
                    breakdown.append(b_line)
                    j += 1
                
                # Append blank lines before breakdown
                out.extend(blank_lines)
                # Append breakdown
                out.extend(breakdown)
                # Ensure spacing
                if not out[-1].endswith('\n\n'):
                    out.append('\n')
                # Append code block
                out.extend(code_block)
                
                i = j
                swaps += 1
                continue
            else:
                out.extend(code_block)
                continue
        else:
            out.append(line)
            i += 1

    with open('content.js', 'w', encoding='utf-8') as f:
        f.writelines(out)

    print(f"Swaps performed: {swaps}")

if __name__ == '__main__':
    swap_blocks()
