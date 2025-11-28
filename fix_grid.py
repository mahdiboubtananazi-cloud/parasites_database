import os
import re

# تحديد الملفات التي تحتاج إصلاح
files_to_fix = [
    r'src\pages\Archive.tsx',
    r'src\pages\AddParasite.tsx',
    r'src\pages\AddDiscovery.tsx',
    r'src\pages\Home.tsx',
    r'src\pages\ParasiteDetails.tsx',
    r'src\pages\Dashboard.tsx',
    r'src\components\dashboard\account\account-details-form.tsx',
    r'src\components\dashboard\settings\notifications.tsx'
]

def fix_grid_responsive(content):
    # Replace Grid with responsive sx
    # Pattern: <Grid xs={12} md={5}>
    pattern = r'<Grid\s+xs=\{(\d+)\}\s+md=\{(\d+)\}>'
    replacement = r'<Grid sx={{ display: "grid", gridColumn: { xs: "span \1", md: "span \2" } }}>'
    content = re.sub(pattern, replacement, content)
    
    # Pattern: <Grid xs={12} sm={6} md={4} lg={3}>
    pattern = r'<Grid\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}\s+lg=\{(\d+)\}'
    replacement = r'<Grid sx={{ gridColumn: { xs: "span \1", sm: "span \2", md: "span \3", lg: "span \4" } }}'
    content = re.sub(pattern, replacement, content)
    
    # Pattern: <Grid xs={12}>
    pattern = r'<Grid\s+xs=\{(\d+)\}>'
    replacement = r'<Grid sx={{ gridColumn: "span \1" }}>'
    content = re.sub(pattern, replacement, content)
    
    # Remove Grid2 imports
    content = content.replace("import Grid from '@mui/material/Grid2';", "")
    content = content.replace("Grid2,", "")
    
    return content

for file_path in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = fix_grid_responsive(content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f' Fixed: {file_path}')
    else:
        print(f' Not found: {file_path}')

print('\nDone!')
