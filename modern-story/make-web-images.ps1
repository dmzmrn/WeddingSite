# Photo intake for new.html — the page serves ONLY <chapter>/web/.
#
# Workflow: drop new original photos into preparea/ church/ reception/
# (root, descriptive names), then run:
#     powershell -File make-web-images.ps1 -RemoveOriginals
# Each original is resized into <chapter>/web/<same-name> (max edge
# 1600px, JPEG q82, EXIF orientation baked in) and, with the switch,
# the heavy original is deleted afterwards so it never gets committed.
# Keep your master copies somewhere outside this repo.
param([switch]$RemoveOriginals)

Add-Type -AssemblyName System.Drawing

$root    = $PSScriptRoot
$maxEdge = 1600
$quality = 82
$extensions = @('.jpg', '.jpeg', '.png')

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

foreach ($d in @('preparea', 'church', 'reception')) {
  $webDir = Join-Path "$root\$d" 'web'
  New-Item -ItemType Directory -Force $webDir | Out-Null

  Get-ChildItem "$root\$d" -File |
    Where-Object { $extensions -contains $_.Extension.ToLower() } |
    ForEach-Object {
      $img = [System.Drawing.Image]::FromFile($_.FullName)

      # honour EXIF orientation, then bake it in
      if ($img.PropertyIdList -contains 274) {
        $val = $img.GetPropertyItem(274).Value[0]
        switch ($val) {
          3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
          6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
          8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
        if ($val -ne 1) { $img.RemovePropertyItem(274) }
      }

      $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($img.Width, $img.Height))
      $nw = [int]($img.Width * $scale)
      $nh = [int]($img.Height * $scale)

      $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($img, 0, 0, $nw, $nh)

      $bmp.Save((Join-Path $webDir $_.Name), $codec, $encParams)
      $g.Dispose(); $bmp.Dispose(); $img.Dispose()
      Write-Host "web/$($_.Name)  ${nw}x${nh}"

      if ($RemoveOriginals) {
        Remove-Item $_.FullName -Force
        Write-Host "  removed original $($_.Name)"
      }
    }
}
Write-Host 'Done. new.html serves <chapter>/web/ - keep filenames identical.'
