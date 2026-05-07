<#
.SYNOPSIS
  Copy spine-anchored build prompt from PriceScout repo into local Mikaela prompts/.
.PARAMETER MikaelaRoot
  e.g. C:\factory-agent-local
.PARAMETER RepoRoot
  PriceScout checkout (default: parent of scripts/)
#>
param(
  [string]$MikaelaRoot = "C:\factory-agent-local",
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$src = Join-Path $RepoRoot "docs\builder\spine-anchored-build.md"
$destDir = Join-Path $MikaelaRoot "prompts"
$dest = Join-Path $destDir "spine-anchored-build.md"

if (-not (Test-Path $src)) {
  Write-Error "Missing source prompt: $src"
  exit 1
}

if (-not (Test-Path $MikaelaRoot)) {
  Write-Warning "Mikaela root not found: $MikaelaRoot — create it per docs/LOCAL_BUILDER_CLAUDE_RUNBOOK.md Task A.1"
  exit 0
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -Force $src $dest
Write-Host "Synced spine prompt -> $dest"
