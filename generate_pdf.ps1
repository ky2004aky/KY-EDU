$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

$htmlFile = (Resolve-Path ".\PRESENTATION_FOR_PDF.html").Path
$pdfFile = Join-Path $PSScriptRoot "KY_EDU_PROJECT_PRESENTATION.pdf"

# In Chrome, paths with spaces must be wrapped in escaped quotes
$cmdLine = "`"$chromePath`" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=`"$pdfFile`" `"file:///$($htmlFile.Replace('\', '/'))`""

Write-Host "Running: $cmdLine"
cmd.exe /c $cmdLine

Start-Sleep -Seconds 3

if (Test-Path $pdfFile) {
    $item = Get-Item $pdfFile
    Write-Host "SUCCESS! Generated PDF: $($item.FullName) ($([math]::Round($item.Length/1KB, 2)) KB)"
} else {
    Write-Host "Failed to generate PDF."
}
