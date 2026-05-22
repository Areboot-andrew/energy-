$cssPath = 'C:\Users\user\Desktop\1231\.next\static\css\e55b9ebde90903ba.css'
$css = Get-Content $cssPath -Raw
Write-Host "CSS file size: $($css.Length) chars"
if ($css -match 'bg-primary-fixed') { Write-Host 'FOUND: bg-primary-fixed class compiled' } else { Write-Host 'NOT FOUND: bg-primary-fixed - utilities NOT compiled!' }
if ($css -match 'text-secondary-fixed') { Write-Host 'FOUND: text-secondary-fixed compiled' } else { Write-Host 'NOT FOUND: text-secondary-fixed - utilities NOT compiled!' }
if ($css -match 'bg-surface-container\b') { Write-Host 'FOUND: bg-surface-container compiled' } else { Write-Host 'NOT FOUND: bg-surface-container - utilities NOT compiled!' }
if ($css -match '@tailwind utilities') { Write-Host 'WARNING: raw @tailwind utilities directive found - NOT compiled!' } else { Write-Host 'No raw @tailwind directive - good' }
if ($css -match 'min-h-\[921px\]') { Write-Host 'FOUND: arbitrary value classes compiled' } else { Write-Host 'NOT FOUND: arbitrary values - Tailwind JIT not running!' }
