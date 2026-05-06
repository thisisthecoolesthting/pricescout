# Generates PNG marketing assets for Expo/Android listing (098).
# Requires Windows PowerShell + System.Drawing (desktop .NET).
param([string]$Root = (Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

function Save-Png([System.Drawing.Bitmap]$bmp, [string]$path) {
  $dir = Split-Path $path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function New-GradientMint([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $c1 = [System.Drawing.Color]::FromArgb(255, 17, 203, 157)
  $c2 = [System.Drawing.Color]::FromArgb(255, 15, 160, 133)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 45
  $g.FillRectangle($brush, $rect)
  return @{ Bitmap = $bmp; Graphics = $g; Brush = $brush }
}

function Draw-PMark([System.Drawing.Graphics]$g, [int]$size) {
  $fontSize = [single]($size * 0.42)
  $font = New-Object System.Drawing.Font(
    "Segoe UI",
    $fontSize,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
  $g.DrawString("P", $font, [System.Drawing.Brushes]::White, $rect, $fmt)
}

# --- 1024 icon (opaque) ---
$icon = New-GradientMint 1024 1024
Draw-PMark $icon.Graphics 1024
$iconPath = Join-Path $Root "assets\icon.png"
Save-Png $icon.Bitmap $iconPath
$icon.Graphics.Dispose(); $icon.Brush.Dispose(); $icon.Bitmap.Dispose()

# --- adaptive foreground: transparent PNG; graphic in inner square with ~264px margin ---
$fgBmp = New-Object System.Drawing.Bitmap(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$fgG = [System.Drawing.Graphics]::FromImage($fgBmp)
$fgG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$fgG.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$pad = 264
$inner = 1024 - 2 * $pad
$ellipseRect = New-Object System.Drawing.Rectangle $pad, $pad, $inner, $inner
$c1 = [System.Drawing.Color]::FromArgb(255, 17, 203, 157)
$c2 = [System.Drawing.Color]::FromArgb(255, 15, 160, 133)
$gbrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $ellipseRect, $c1, $c2, 35
$fgG.FillEllipse($gbrush, $ellipseRect)
$pFont = New-Object System.Drawing.Font(
  "Segoe UI",
  [single]($inner * 0.42),
  [System.Drawing.FontStyle]::Bold,
  [System.Drawing.GraphicsUnit]::Pixel
)
$pFmt = New-Object System.Drawing.StringFormat
$pFmt.Alignment = [System.Drawing.StringAlignment]::Center
$pFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
$rff = New-Object System.Drawing.RectangleF(
  [single]$ellipseRect.X,
  [single]$ellipseRect.Y,
  [single]$ellipseRect.Width,
  [single]$ellipseRect.Height
)
$fgG.DrawString("P", $pFont, [System.Drawing.Brushes]::White, $rff, $pFmt)
$fgOut = Join-Path $Root "assets\icon-foreground.png"
Save-Png $fgBmp $fgOut
$fgG.Dispose(); $fgBmp.Dispose()

# --- splash 1284 x 2778 ---
$splash = New-GradientMint 1284 2778
Draw-PMark $splash.Graphics ([int](1284 * 0.35))
$splashPath = Join-Path $Root "assets\splash.png"
Save-Png $splash.Bitmap $splashPath
$splash.Graphics.Dispose(); $splash.Brush.Dispose(); $splash.Bitmap.Dispose()

# --- feature graphic 1024 x 500 ---
$feat = New-GradientMint 1024 500
$f = [System.Drawing.Graphics]::FromImage($feat.Bitmap)
$f.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$tFont = New-Object System.Drawing.Font(
  "Segoe UI",
  [single]72,
  [System.Drawing.FontStyle]::Bold,
  [System.Drawing.GraphicsUnit]::Pixel
)
$tFmt = New-Object System.Drawing.StringFormat
$tFmt.Alignment = [System.Drawing.StringAlignment]::Center
$tFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
$f.DrawString("PriceScout", $tFont, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF 0, 120, 1024, 220), $tFmt)
$f.Dispose()
$featPath = Join-Path $Root "store-listing\play\feature-graphic.png"
Save-Png $feat.Bitmap $featPath
$feat.Graphics.Dispose(); $feat.Brush.Dispose(); $feat.Bitmap.Dispose()

Write-Host "Wrote assets under $Root"
