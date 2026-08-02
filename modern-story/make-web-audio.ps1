# Compresses the ambient music in modern-story/audio to a web-friendly
# size using ffmpeg (MP3, 96 kbps is plenty for soft background music).
#
#   powershell -File modern-story/make-web-audio.ps1                  # writes <name>.web.mp3 next to each file
#   powershell -File modern-story/make-web-audio.ps1 -ReplaceOriginal # swaps the compressed file in place (config untouched)
#   powershell -File modern-story/make-web-audio.ps1 -InstallFfmpeg   # installs ffmpeg via winget first if missing
#
# The page references ./audio/music.mp3 - with -ReplaceOriginal the
# filename never changes, so new.html needs no edits.

param(
    [string]$Bitrate = '96k',
    [switch]$ReplaceOriginal,
    [switch]$InstallFfmpeg
)

$ErrorActionPreference = 'Stop'
$audioDir = Join-Path $PSScriptRoot 'audio'

function Find-Ffmpeg {
    $onPath = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($onPath) { return $onPath.Source }
    $wingetLink = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\ffmpeg.exe'
    if (Test-Path $wingetLink) { return $wingetLink }
    return $null
}

$ffmpeg = Find-Ffmpeg
if (-not $ffmpeg -and $InstallFfmpeg) {
    Write-Host 'Installing ffmpeg via winget (one-time)...'
    winget install -e --id Gyan.FFmpeg --accept-source-agreements --accept-package-agreements
    $ffmpeg = Find-Ffmpeg
}
if (-not $ffmpeg) {
    Write-Host 'ffmpeg not found. Either:'
    Write-Host '  1) re-run with -InstallFfmpeg   (uses winget), or'
    Write-Host '  2) install it yourself:  winget install Gyan.FFmpeg'
    exit 1
}

$files = Get-ChildItem $audioDir -File | Where-Object { $_.Extension -match '\.(mp3|m4a|wav|flac|ogg)$' -and $_.Name -notmatch '\.web\.' }
if (-not $files) { Write-Host "No audio files found in $audioDir"; exit 0 }

foreach ($file in $files) {
    $inSize = $file.Length
    $tmp = Join-Path $audioDir ($file.BaseName + '.web.mp3')
    & $ffmpeg -y -hide_banner -loglevel error -i $file.FullName -codec:a libmp3lame -b:a $Bitrate -ar 44100 $tmp
    if ($LASTEXITCODE -ne 0) { Write-Host "ffmpeg failed on $($file.Name)"; exit 1 }
    $outSize = (Get-Item $tmp).Length

    if ($outSize -ge $inSize) {
        Remove-Item $tmp -Confirm:$false
        Write-Host ("{0}: already smaller than {1} output - kept as-is" -f $file.Name, $Bitrate)
        continue
    }

    if ($ReplaceOriginal) {
        $target = Join-Path $audioDir ($file.BaseName + '.mp3')
        Remove-Item $file.FullName -Confirm:$false
        Move-Item $tmp $target
        Write-Host ("{0}: {1:N1} MB -> {2:N1} MB (replaced in place)" -f $file.Name, ($inSize/1MB), ($outSize/1MB))
    } else {
        Write-Host ("{0}: {1:N1} MB -> {2:N1} MB (written to {3})" -f $file.Name, ($inSize/1MB), ($outSize/1MB), (Split-Path $tmp -Leaf))
    }
}
