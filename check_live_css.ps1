$cssUrl = 'http://localhost:3000/_next/static/css/app/layout.css'
$css = (Invoke-WebRequest -Uri $cssUrl -UseBasicParsing).Content
Write-Host "CSS size: $($css.Length) chars"
if ($css -match 'bg-primary-fixed') { Write-Host "FOUND: bg-primary-fixed utility compiled!" } else { Write-Host "NOT FOUND: bg-primary-fixed" }
if ($css -match 'bg-surface-container') { Write-Host "FOUND: bg-surface-container utility compiled!" } else { Write-Host "NOT FOUND: bg-surface-container" }
if ($css -match 'text-secondary-fixed') { Write-Host "FOUND: text-secondary-fixed compiled!" } else { Write-Host "NOT FOUND: text-secondary-fixed" }
if ($css -match 'd5f000') { Write-Host "FOUND: color d5f000 in CSS!" } else { Write-Host "NOT FOUND: d5f000" }
if ($css -match '131315') { Write-Host "FOUND: background color 131315!" } else { Write-Host "NOT FOUND: 131315" }
if ($css -match '@tailwind') { Write-Host "WARNING: raw @tailwind not compiled!" } else { Write-Host "OK: no raw @tailwind directives" }
# Show first 500 chars of CSS
Write-Host "`n=== CSS SNIPPET ==="
Write-Host $css.Substring(0, [Math]::Min(800, $css.Length))
