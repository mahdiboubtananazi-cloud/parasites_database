$files = Get-ChildItem -Path 'src' -Recurse -Filter '*.tsx'

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # استبدال Grid بـ Grid2
    $content = $content -replace "from '@mui/material/Grid'", "from '@mui/material/Grid2'"
    $content = $content -replace 'import Grid ', 'import Grid2 '
    $content = $content -replace 'import \{ Grid \}', 'import { Grid2 }'
    $content = $content -replace '<Grid ', '<Grid2 '
    $content = $content -replace '</Grid>', '</Grid2>'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host 'Grid2 migration completed!' -ForegroundColor Green
