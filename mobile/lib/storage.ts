import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IdentifyResponse } from "./api";

const FLIP_LOG_KEY = "pricescout.flipLog.v1";

export interface SavedScan extends IdentifyResponse {
  id: string;
  scannedAt: string; // ISO
  imageDataUri: string | null;
}

export async function loadFlipLog(): Promise<SavedScan[]> {
  const raw = await AsyncStorage.getItem(FLIP_LOG_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SavedScan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveScan(scan: SavedScan): Promise<void> {
  const list = await loadFlipLog();
  list.unshift(scan);
  // Cap at 200 most recent — keep storage tame.
  const capped = list.slice(0, 200);
  await AsyncStorage.setItem(FLIP_LOG_KEY, JSON.stringify(capped));
}

export async function clearFlipLog(): Promise<void> {
  await AsyncStorage.removeItem(FLIP_LOG_KEY);
}
