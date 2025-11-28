import os
import re

def fix_grid_file(content):
    # Fix: import Grid2 - remove it
    content = re.sub(r"import Grid from '@mui/material/Grid2';?\n?", "", content)
    content = re.sub(r",\s*Grid2", "", content)
    content = re.sub(r"Grid2,", "", content)
    
    # Fix: Replace <Grid container spacing={3}> with <Box sx={{ display: 'grid', gridTemplateColumns: ... }}>
    content = re.sub(
        r"<Grid container spacing=\{(\d+)\}",
        r'<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: \1 }}',
        content
    )
    
    # Fix: Replace simple <Grid xs={12} md={5}> with Box
    content = re.sub(
        r"<Grid xs=\{12\} md=\{5\}>",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", md: "span 5" } }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{12\} md=\{7\}>",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", md: "span 7" } }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{12\} md=\{4\}>",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{12\} md=\{6\}>",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{12\} md=\{8\}>",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", md: "span 8" } }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{12\}>",
        r'<Box sx={{ gridColumn: "1 / -1" }}>',
        content
    )
    
    content = re.sub(
        r"<Grid xs=\{6\}>",
        r'<Box sx={{ gridColumn: { xs: "span 6", md: "span 6" } }}>',
        content
    )
    
    # Fix: Replace complex <Grid xs={12} sm={6} md={4} lg={3}>
    content = re.sub(
        r"<Grid xs=\{12\} sm=\{6\} md=\{4\} lg=\{3\}",
        r'<Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 6", md: "span 4", lg: "span 3" }',
        content
    )
    
    # Replace closing </Grid> with </Box>
    content = re.sub(r"</Grid>", "</Box>", content)
    
    # Replace remaining <Grid with <Box if any exist
    content = re.sub(r"<Grid\s+", r"<Box ", content)
    
    return content

files = [
    r'src/pages/Archive.tsx',
    r'src/pages/AddParasite.tsx',
    r'src/pages/AddDiscovery.tsx',
    r'src/pages/Home.tsx',
    r'src/pages/ParasiteDetails.tsx',
    r'src/pages/Dashboard.tsx',
    r'src/components/dashboard/account/account-details-form.tsx',
    r'src/components/dashboard/settings/notifications.tsx'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = fix_grid_file(content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f' Fixed: {file}')
    else:
        print(f' Not found: {file}')

print('\n All files fixed!')
