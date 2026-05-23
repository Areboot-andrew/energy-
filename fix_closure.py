import re

path = 'src/app/admin/edit-page/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace setContent({ ...content, xyz: val })
# with setContent(prev => ({ ...prev, xyz: val }))

def repl(match):
    return 'setContent(prev => ({ ...prev, ' + match.group(1) + ' }))'

new_content = re.sub(r'setContent\(\{\s*\.\.\.content,\s*(.*?)\s*\}\)', repl, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
