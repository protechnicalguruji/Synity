/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIHistoryItem } from "../types";

export class AICache {
  private static MEMORY_CACHE = new Map<string, { value: any; expiresAt: number }>();

  /**
   * Generates a unique key based on feature name and associated entity IDs/state values
   */
  public static makeKey(feature: string, entityId: string, stateHash?: string): string {
    return `synity_ai_${feature}_${entityId}${stateHash ? `_${stateHash}` : ""}`;
  }

  /**
   * Retrieves item from Memory or LocalStorage Cache if not expired
   */
  public static get<T>(key: string): T | null {
    // 1. Check memory cache
    const memEntry = this.MEMORY_CACHE.get(key);
    if (memEntry) {
      if (memEntry.expiresAt > Date.now()) {
        return memEntry.value as T;
      }
      this.MEMORY_CACHE.delete(key);
    }

    // 2. Check localStorage
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          // Warm up memory cache
          this.MEMORY_CACHE.set(key, { value: parsed.value, expiresAt: parsed.expiresAt });
          return parsed.value as T;
        }
        localStorage.removeItem(key); // clear expired
      } catch (e) {
        localStorage.removeItem(key);
      }
    }

    return null;
  }

  /**
   * Sets cache item with configurable TTL (default 10 minutes)
   */
  public static set<T>(key: string, value: T, ttlMs = 10 * 60 * 1000): void {
    const expiresAt = Date.now() + ttlMs;
    
    // Save to memory
    this.MEMORY_CACHE.set(key, { value, expiresAt });

    // Save to localStorage
    try {
      localStorage.setItem(key, JSON.stringify({ value, expiresAt }));
    } catch (e) {
      // localStorage full or unsupported
    }
  }

  /**
   * Clears a specific key
   */
  public static invalidate(key: string): void {
    this.MEMORY_CACHE.delete(key);
    localStorage.removeItem(key);
  }

  /**
   * Clears all AI Cache keys
   */
  public static clearAll(): void {
    this.MEMORY_CACHE.clear();
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith("synity_ai_")) {
        localStorage.removeItem(k);
      }
    });
  }

  // -----------------------------------------------------------------
  // AI HISTORY TRACKER
  // -----------------------------------------------------------------

  public static getHistory(): AIHistoryItem[] {
    const saved = localStorage.getItem("synity_ai_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  public static addHistoryEntry(entry: Omit<AIHistoryItem, "id" | "timestamp">): void {
    const history = this.getHistory();
    const newEntry: AIHistoryItem = {
      ...entry,
      id: `ai-hist-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    // Keep last 100 logs
    const updated = [newEntry, ...history].slice(0, 100);
    localStorage.setItem("synity_ai_history", JSON.stringify(updated));
  }

  public static clearHistory(): void {
    localStorage.removeItem("synity_ai_history");
  }
}
