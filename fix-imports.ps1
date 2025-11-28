$files = Get-ChildItem -Path 'src' -Recurse -Filter '*.tsx'

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # إصلاح الـ imports
    $content = $content -replace "import \{ Grid \}", "import Grid2"
    $content = $content -replace "} from '@mui/material/Grid';", "} from '@mui/material';"
    $content = $content -replace "Grid,", "Grid2,"
    
    # إصلاح الاستخدام
    $content = $content -replace '<Grid2 item', '<Grid2'
    $content = $content -replace 'Grid2 container', 'Grid2 container'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host 'Fixed Grid2 imports!' -ForegroundColor Green
