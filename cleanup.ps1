$file = 'c:\Users\aboua\OneDrive\Bureau\IUT\Portfolio\index.html'
$lines = Get-Content $file -Encoding UTF8
# Find start: first line with 'project-img-overlay'
$startIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'project-img-overlay') { $startIdx = $i; break }
}
# Find end: section id parcours (after the orphan)
$endIdx = -1
for ($i = $startIdx+1; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "section id=""parcours""") { $endIdx = $i; break }
}
Write-Host "Start: $startIdx End: $endIdx"
if ($startIdx -gt 0 -and $endIdx -gt $startIdx) {
    $result = $lines[0..($startIdx-1)] + $lines[$endIdx..($lines.Count-1)]
    $result | Out-File $file -Encoding UTF8
    Write-Host "Done. Lines: $($result.Count)"
}
