import os
import shutil

src = r'c:\Users\Vishesh yadav\OneDrive\Desktop\Assessment_Recommendation_system\smartkoach\backend\services\openai_service.py'
dst_dir = r'c:\Users\Vishesh yadav\OneDrive\Desktop\Assessment_Recommendation_system\Backend\services'
dst = os.path.join(dst_dir, 'openai_service.py')

os.makedirs(dst_dir, exist_ok=True)
shutil.copy2(src, dst)
print('Copied openai_service.py')

csv_file = r'c:\Users\Vishesh yadav\OneDrive\Desktop\Assessment_Recommendation_system\Backend\data\shl_real_assessments.csv'
with open(csv_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 0:
        new_lines.append(line)
        continue
    line = line.strip()
    if not line:
        continue
    parts = line.split(',')
    if len(parts) > 6:
        tail = parts[-4:]
        head = parts[0]
        desc = ','.join(parts[1:-4])
        if not (desc.startswith('\"') and desc.endswith('\"')):
            desc = f'"{desc}"'
        new_line = f'{head},{desc},{tail[0]},{tail[1]},{tail[2]},{tail[3]}\n'
        new_lines.append(new_line)
    else:
        new_lines.append(line + '\n')

with open(csv_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Fixed CSV')
