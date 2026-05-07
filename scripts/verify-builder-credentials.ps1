# verify-builder-credentials.ps1 -- Confirms the office-pc has git/gh credentials
# wired correctly for the builder agent (Codex, Claude Code, etc.) to push.
#
# Run once before any builder agent does a push. Re-run if you ever see
# "permission denied" on a git operation.
#
# Usage:
#   cd E:\Projects\pricescout
#   .\scripts\verify-builder-credentials.ps1
#
# Exit codes:
#   0 = all checks passed
#   1 = one or more checks failed (output identifies which)

$ErrorActionPreference = "Continue"
$failures = @()
$warnings = @()

function CheckOk($msg) { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function CheckFail($msg) { Write-Host "  [FAIL] $msg" -ForegroundColor Red; $script:failures += $msg }
function CheckWarn($msg) { Write-Host "  [WARN] $msg" -ForegroundColor Yellow; $script:warnings += $msg }

Write-Host "Builder credential verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. gh CLI installed
Write-Host "1. gh CLI installation"
$ghPath = (Get-Command gh -ErrorAction SilentlyContinue).Source
if ($ghPath) { CheckOk "gh found at $ghPath" }
else { CheckFail "gh CLI not found on PATH. Install from https://cli.github.com/"; }

# 2. gh CLI authenticated
Write-Host "`n2. gh CLI auth status"
$authStatus = gh auth status 2>&1 | Out-String
if ($authStatus -match "Logged in to github\.com" -and $authStatus -match "Active account") {
    CheckOk "gh authenticated"
    if ($authStatus -match "Logged in to github\.com account (\S+)") {
        $account = $matches[1]
        if ($account -eq "thisisthecoolesthting") { CheckOk "Account is thisisthecoolesthting" }
        else { CheckWarn "Account is $account (expected: thisisthecoolesthting). Switch with: gh auth switch" }
    }
} else {
    CheckFail "gh not authenticated. Run: gh auth login --web --git-protocol https --hostname github.com"
}

# 3. gh as git credential helper
Write-Host "`n3. git credential helper"
$credHelper = git config --global credential.helper 2>&1
$ghCredHelper = git config --global --get-all credential.https://github.com.helper 2>&1
if ($credHelper -or $ghCredHelper -match "gh|manager") {
    CheckOk "credential helper configured ($credHelper)"
} else {
    CheckFail "git credential helper not configured. Run: gh auth setup-git"
}

# 4. Git identity
Write-Host "`n4. Git identity"
$gitName = git config --global user.name 2>&1
$gitEmail = git config --global user.email 2>&1
if ($gitName) { CheckOk "user.name: $gitName" }
else { CheckFail "user.name not set. Run: git config --global user.name 'Your Name'" }
if ($gitEmail -match "@") { CheckOk "user.email: $gitEmail" }
else { CheckFail "user.email not set. Run: git config --global user.email 'you@example.com'" }

# 5. Stale GITHUB_TOKEN in env (warning — not a hard fail)
Write-Host "`n5. Stale tokens in env"
if ($env:GITHUB_TOKEN) {
    CheckWarn "GITHUB_TOKEN is set in env -- git may use this instead of gh cached creds. If pushes 403, unset it: Remove-Item Env:GITHUB_TOKEN"
} else { CheckOk "GITHUB_TOKEN not in env" }
if ($env:GH_TOKEN) {
    CheckWarn "GH_TOKEN is set in env -- check that it matches the active gh account. Otherwise: Remove-Item Env:GH_TOKEN"
} else { CheckOk "GH_TOKEN not in env" }

# 6. Repo state
Write-Host "`n6. Current repo state"
if (Test-Path ".git") {
    $remoteUrl = git remote get-url origin 2>&1
    if ($remoteUrl -match "github.com[:/]thisisthecoolesthting/") {
        CheckOk "origin remote: $remoteUrl"
    } elseif ($remoteUrl) {
        CheckWarn "origin remote: $remoteUrl (expected thisisthecoolesthting/* owner)"
    } else {
        CheckFail "origin remote not configured. Run: git remote add origin https://github.com/thisisthecoolesthting/pricescout.git"
    }
} else {
    CheckWarn "Not in a git repo. Run from E:\Projects\pricescout"
}

# 7. fetch test (read-only credential check)
Write-Host "`n7. Read access to origin"
$fetchOutput = git fetch origin 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    CheckOk "git fetch origin succeeded"
} else {
    CheckFail "git fetch origin failed: $fetchOutput"
}

# 8. Token scopes for write/repo creation (best-effort)
Write-Host "`n8. Token scopes"
$scopesLine = $authStatus | Select-String -Pattern "Token scopes:" | Select-Object -First 1
if ($scopesLine -match "repo") { CheckOk "Token has 'repo' scope (write to repos)" }
else { CheckWarn "Token may not have 'repo' scope. Run: gh auth refresh -s repo,workflow" }

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
$passed = 8 - $failures.Count
Write-Host "Passed: $passed/8" -ForegroundColor $(if ($failures.Count -eq 0) { "Green" } else { "Yellow" })
if ($warnings.Count -gt 0) { Write-Host "Warnings: $($warnings.Count)" -ForegroundColor Yellow }
if ($failures.Count -eq 0) {
    Write-Host "READY -- builder agents can push." -ForegroundColor Green
    exit 0
} else {
    Write-Host "BLOCKED -- fix the FAIL items above before any builder runs." -ForegroundColor Red
    exit 1
}
