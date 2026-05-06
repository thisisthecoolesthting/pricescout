"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=pro.pricescout.app";

type Manifest = {
  version: string;
  sha256: string;
  sizeBytes: number;
  releasedAt: string;
  note?: string;
};

export function MobileAppCard() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);

  const isPlaceholder =
    !manifest ||
    manifest.version === "0.0.0-dev" ||
    manifest.sha256 === "pending" ||
    manifest.sizeBytes === 0;

  useEffect(() => {
    let cancelled = false;
    fetch("/downloads/pricescout-android-latest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j && typeof j.version === "string") setManifest(j as Manifest);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const target = isPlaceholder ? PLAY_STORE_URL : `${origin}/downloads/pricescout-android-latest.apk`;
    QRCode.toDataURL(target, { width: 200, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null));
  }, [isPlaceholder]);

  const internalBetaUrl = process.env.NEXT_PUBLIC_ANDROID_INTERNAL_PLAY_URL;

  return (
    <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-ink">Get the mobile app</h2>
      <p className="mt-1 text-sm text-muted">
        Install on your crew&apos;s phones — each install counts toward your four included scanner slots.
      </p>
      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          {isPlaceholder ? (
            <div className="rounded-xl border border-line/60 bg-cream/40 px-4 py-3 text-sm text-muted">
              <p className="font-medium text-ink">APK in build — internal beta available soon</p>
              <p className="mt-1 text-xs text-soft">
                Production APK ships from the mobile release pipeline; this button will download the signed file when
                it is published to{" "}
                <code className="rounded bg-white px-1 text-ink">public/downloads/</code>.
              </p>
              {internalBetaUrl ? (
                <a href={internalBetaUrl} className="mt-2 inline-block text-sm font-medium text-mint-700 underline">
                  Open Play Console internal track
                </a>
              ) : null}
            </div>
          ) : (
            <a href="/downloads/pricescout-android-latest.apk" className="btn-primary btn-large inline-block text-center">
              Download Android APK
            </a>
          )}
          <p className="text-xs text-soft">
            Or install via{" "}
            <a href={PLAY_STORE_URL} className="font-medium text-mint-700 underline">
              Google Play
            </a>
          </p>
          <p className="text-xs italic text-soft">iPhone app — coming soon, awaiting App Store approval</p>
          {manifest && !isPlaceholder ? (
            <p className="text-xs text-soft">
              Version {manifest.version} · {(manifest.sizeBytes / 1024 / 1024).toFixed(1)} MB · Released{" "}
              {new Date(manifest.releasedAt).toLocaleDateString()}
            </p>
          ) : null}
          {manifest && isPlaceholder && manifest.note ? (
            <p className="text-xs text-soft">{manifest.note}</p>
          ) : null}
        </div>
        {qrDataUrl ? (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode */}
            <img src={qrDataUrl} alt="Scan to install" width={200} height={200} className="rounded-lg border border-line" />
            <p className="mt-2 text-xs text-soft">Scan with your phone</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
