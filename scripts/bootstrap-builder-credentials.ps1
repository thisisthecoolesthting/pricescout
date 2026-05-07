# bootstrap-builder-credentials.ps1 -- Automated credential setup for builder agents
#
# This script makes the office-pc credential-ready for Codex/Claude Code/any builder
# agent to push to GitHub without prompting. It:
#   - Installs gh CLI if missing (via winget)
#   - Triggers gh auth login if not already authenticated
#   - Sets gh as git credential helper
#   - Configures git user identity if missing
#   - Strips stale GITHUB_TOKEN/GH_TOKEN from env (per session)
#   - Runs the verify script and reports status
#
# Run once on each machine where a builder agent will operate.
#
# Usage:
#   cd E:\Projects\pricescout
#   .\scripts\bootstrap-builder-credentials.ps1
#   .\scripts\bootstrap-builder-credentials.ps1 -GitName "Ricky Reasner" -GitEmail "reasner196@gmail.com"

[CmdletBinding()]
param(
    [string]$GitName = "Ricky Reasner",
    [string]$GitEmail = "reasner196@gmail.com",
    [string]$GitHubAccount = "thisisthecoolesthting"
)

Write-Host "Builder credential bootstrap" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# 1. Strip stale tokens from current session env
Write-Host "[1/6] Stripping stale tokens from env..." -ForegroundColor Yellow
if ($env:GITHUB_TOKEN) {
    Remove-Item Env:GITHUB_TOKEN -ErrorAction SilentlyContinue
    Write-Host "      Removed GITHUB_TOKEN from env (was set; gh CLI cached creds will be used instead)" -ForegroundColor Green
}
if ($env:GH_TOKEN) {
    Remove-Item Env:GH_TOKEN -ErrorAction SilentlyContinue
    Write-Host "      Removed GH_TOKEN from env" -ForegroundColor Green
}

# 2. Verify gh CLI is installed
Write-Host "`n[2/6] Verifying gh CLI..." -ForegroundColor Yellow
$ghPath = (Get-Command gh -ErrorAction SilentlyContinue).Source
if (-not $ghPath) {
    Write-Host "      gh not found. Installing via winget..." -ForegroundColor Yellow
    try {
        winget install --id GitHub.cli --silent --accept-source-agreements --accept-package-agreements
        $env:Path = "$env:Path;$env:ProgramFiles\GitHub CLI"
        $ghPath = (Get-Command gh -ErrorAction SilentlyContinue).Source
        if (-not $ghPath) {
            Write-Host "      gh still not found after install -- restart PowerShell and re-run this script" -ForegroundColor Red
            exit 1
        }
        Write-Host "      gh installed at $ghPath" -ForegroundColor Green
    } catch {
        Write-Host "      gh install failed via winget. Install manually from https://cli.github.com/" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "      gh found at $ghPath" -ForegroundColor Green
}

# 3. gh auth login if needed
Write-Host "`n[3/6] gh auth status..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1 | Out-String
$needLogin = $false
if ($authStatus -notmatch "Logged in to github\.com") {
    $needLogin = $true
} elseif ($authStatus -match "Logged in to github\.com account (\S+)") {
    $currentAccount = $matches[1]
    if ($currentAccount -ne $GitHubAccount) {
        Write-Host "      Currently logged in as $currentAccount but expected $GitHubAccount" -ForegroundColor Yellow
        $switchPrompt = Read-Host "      Switch to $GitHubAccount? [y/N]"
        if ($switchPrompt -match "^[yY]") { $needLogin = $true }
    } else {
        Write-Host "      Logged in as $GitHubAccount (correct)" -ForegroundColor Green
    }
}
if ($needLogin) {
    Write-Host "      Triggering gh auth login -- a browser window will open." -ForegroundColor Yellow
    Write-Host "      Authenticate as: $GitHubAccount" -ForegroundColor Yellow
    gh auth login --web --git-protocol https --hostname github.com
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      gh auth login failed. Re-run this script after fixing." -ForegroundColor Red
        exit 1
    }
}

# 4. gh as git credential helper
Write-Host "`n[4/6] Configuring gh as git credential helper..." -ForegroundColor Yellow
gh auth setup-git 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      gh auth setup-git succeeded" -ForegroundColor Green
} else {
    Write-Host "      gh auth setup-git had errors -- check git config --global" -ForegroundColor Yellow
}

# 5. Git identity
Write-Host "`n[5/6] Git identity..." -ForegroundColor Yellow
$existingName = git config --global user.name 2>&1
$existingEmail = git config --global user.email 2>&1
if (-not $existingName) {
    git config --global user.name "$GitName"
    Write-Host "      user.name set to: $GitName" -ForegroundColor Green
} else {
    Write-Host "      user.name already: $existingName" -ForegroundColor Green
}
if (-not $existingEmail -or $existingEmail -notmatch "@") {
    git config --global user.email "$GitEmail"
    Write-Host "      user.email set to: $GitEmail" -ForegroundColor Green
} else {
    Write-Host "      user.email already: $existingEmail" -ForegroundColor Green
}

# 6. Verify everything via the verify script
Write-Host "`n[6/6] Running verify-builder-credentials.ps1..." -ForegroundColor Yellow
if (Test-Path ".\scripts\verify-builder-credentials.ps1") {
    & .\scripts\verify-builder-credentials.ps1
    $verifyExitCode = $LASTEXITCODE
} else {
    Write-Host "      verify script not found at .\scripts\verify-builder-credentials.ps1 -- skip" -ForegroundColor Yellow
    $verifyExitCode = 0
}

Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
if ($verifyExitCode -eq 0) {
    Write-Host "BOOTSTRAP COMPLETE -- builder agents can push." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: paste the BUILDER_AGENT_PROMPT.md contents into your Codex/Claude Code/builder chat." -ForegroundColor Cyan
} else {
    Write-Host "BOOTSTRAP INCOMPLETE -- see verify output above." -ForegroundColor Red
    exit 1
}
