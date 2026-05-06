# download-leonardo-videos.ps1
# Bulk-fetch PriceScout Motion 2.0 videos from Leonardo CDN to public/videos/<bucket>/
#
# Usage:
#   Open PowerShell on office-pc (any window, no admin needed)
#   cd E:\Projects\pricescout
#   .\scripts\download-leonardo-videos.ps1
#
# Add new URLs to $videos as more renders finish (network tab in Leonardo, sort by .mp4).
# The script is idempotent — re-running skips existing files.

$root = "E:\Projects\pricescout\public\videos"
New-Item -ItemType Directory -Force -Path "$root\hero" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\industries" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\final-cta" | Out-Null
New-Item -ItemType Directory -Force -Path "$root\mobile" | Out-Null

$videos = @(
    # Confirmed completed (CDN URLs captured 2026-04-29 from Leonardo network log)
    @{ name = "pricescout-C1-thriftstore-backroom.mp4"; bucket = "industries"; url = "https://cdn.leonardo.ai/users/050c0aea-76fd-4ef5-877a-91c75858029d/generations/1f148e69-e110-66f0-8173-d02292c08c7e/motion_2.0_A_thrift_store_s_back_sorting_room_rolling_clothing_racks_a_wooden_triage_table_-0.mp4" }
    @{ name = "pricescout-E1a-bin-ambient.mp4";        bucket = "final-cta";  url = "https://cdn.leonardo.ai/users/050c0aea-76fd-4ef5-877a-91c75858029d/generations/1f148e6e-f6e7-6eb0-8d55-2a345b31f9f1/motion_2.0_Cinematic_close-up_of_a_wooden_bin_filled_with_donated_items_folded_clothes_hard-0.mp4" }
    @{ name = "pricescout-E1b-hand-camera.mp4";        bucket = "final-cta";  url = "https://cdn.leonardo.ai/users/050c0aea-76fd-4ef5-877a-91c75858029d/generations/1f148e6f-a025-61d0-a0fc-34cb4c54e329/motion_2.0_A_hand_reaching_into_a_wooden_bin_of_donated_items_lifting_a_vintage_35mm_film_c-0.mp4" }

    # APPEND BELOW as more videos finish.
    # To grab a new URL: in Leonardo's tab, DevTools (F12) -> Network -> filter ".mp4" -> right-click finished generation -> Copy URL
    # Then add a row like: @{ name = "pricescout-A1-phone-sweater.mp4"; bucket = "hero"; url = "https://cdn.leonardo.ai/..." }
)

foreach ($v in $videos) {
    $dest = Join-Path $root (Join-Path $v.bucket $v.name)
    if (Test-Path $dest) {
        Write-Host "[skip] $($v.name) already exists" -ForegroundColor DarkGray
        continue
    }
    try {
        Write-Host "[get ] $($v.name)" -ForegroundColor Cyan
        Invoke-WebRequest -Uri $v.url -OutFile $dest -UseBasicParsing
        $size = (Get-Item $dest).Length
        $sizeMb = [math]::Round($size / 1MB, 2)
        Write-Host "[ok  ] $($v.name) ($sizeMb MB)" -ForegroundColor Green
    } catch {
        Write-Host "[fail] $($v.name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done. Files in $root\<bucket>\" -ForegroundColor Yellow
Write-Host "Run this script again as more videos finish — already-downloaded files are skipped."
