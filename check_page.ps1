Start-Sleep -Seconds 5
$resp = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing
Write-Host "Status: $($resp.StatusCode)"
Write-Host "Content length: $($resp.Content.Length)"
# Find the CSS link
$cssLinks = [regex]::Matches($resp.Content, 'href="(/_next/static/css/[^"]+)"')
foreach ($m in $cssLinks) {
    Write-Host "CSS file: $($m.Groups[1].Value)"
}
