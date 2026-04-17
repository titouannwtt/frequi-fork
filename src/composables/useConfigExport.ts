/**
 * useConfigExport — Export/Import all FreqUI user configuration.
 *
 * Captures all localStorage keys (Pinia stores + manual keys)
 * into a single JSON file, and restores them on import.
 */

/** All localStorage keys that constitute the user's configuration */
const CONFIG_KEYS = [
  // Pinia persisted stores
  'ftUISettings',
  'ftUIColorSettings',
  'ftLayoutSettings',
  'ftPlotConfig',
  'ftBotComparison',
  'ftUIChartSettings',
  'ftPairlistConfig',
  // Manual localStorage keys
  'ftAuthLoginInfo',
  'ftSelectedBot',
  'ft_locale',
  'enhancedOpenTradeColumns',
  'enhancedClosedTradeColumns',
  'ft_benchmarks_enabled',
  'ft_market_overview_settings',
  'ft_profit_goal',
];

interface FreqUIConfig {
  /** Format version for future compatibility */
  version: 1;
  /** Export timestamp */
  exportedAt: string;
  /** All key-value pairs from localStorage */
  data: Record<string, string>;
}

/**
 * Export all user configuration to a downloadable JSON file.
 */
export function exportConfig() {
  const data: Record<string, string> = {};

  for (const key of CONFIG_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      data[key] = value;
    }
  }

  const config: FreqUIConfig = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };

  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `frequi-config-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import user configuration from a JSON file.
 * Returns the number of keys restored.
 */
export async function importConfig(file: File): Promise<{ keysRestored: number; botCount: number }> {
  const text = await file.text();
  const config: FreqUIConfig = JSON.parse(text);

  if (!config.version || !config.data) {
    throw new Error('Invalid FreqUI config file');
  }

  let keysRestored = 0;
  for (const [key, value] of Object.entries(config.data)) {
    // Only restore known keys (security: don't write arbitrary keys)
    if (CONFIG_KEYS.includes(key)) {
      localStorage.setItem(key, value);
      keysRestored++;
    }
  }

  // Count bots in the auth data
  let botCount = 0;
  const authData = config.data['ftAuthLoginInfo'];
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      botCount = Object.keys(parsed).length;
    } catch { /* ignore */ }
  }

  return { keysRestored, botCount };
}

/**
 * Check if there are any bots configured.
 */
export function hasConfiguredBots(): boolean {
  const authData = localStorage.getItem('ftAuthLoginInfo');
  if (!authData) return false;
  try {
    const parsed = JSON.parse(authData);
    return Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
}
