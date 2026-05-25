import re
import os
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'setFormData\(\{\s*\.\.\.formData,\s*(.*?)\s*\}\)', lambda m: 'setFormData(prev => ({ ...prev, ' + m.group(1) + ' }))', content)
    # Also replace setContent
    new_content = re.sub(r'setContent\(\{\s*\.\.\.content,\s*(.*?)\s*\}\)', lambda m: 'setContent(prev => ({ ...prev, ' + m.group(1) + ' }))', new_content)
    # Also replace setCurrentPost
    new_content = re.sub(r'setCurrentPost\(\{\s*\.\.\.currentPost,\s*(.*?)\s*\}\)', lambda m: 'setCurrentPost(prev => ({ ...prev, ' + m.group(1) + ' }))', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src/app/admin'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
