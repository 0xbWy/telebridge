import fs from 'fs';
import path from 'path';

// Regex to parse .strings files: "Key" = "Value";
// Handles multi-line values and escaped quotes
function parseStringsFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  let currentKey = '';
  let currentValue = '';
  let inValue = false;

  for (const line of lines) {
    const keyMatch = line.match(/^"([^"]+)"\s*=\s*"/);
    if (keyMatch && !inValue) {
      currentKey = keyMatch[1];
      // Get everything after the opening quote of the value
      const valueStart = line.indexOf('=', line.indexOf(currentKey)) + 1;
      const firstQuote = line.indexOf('"', valueStart);
      currentValue = line.substring(firstQuote + 1);
      inValue = true;

      // Check if the value ends on this same line
      let endIdx = currentValue.length - 1;
      while (endIdx >= 0 && (currentValue[endIdx] === '\r' || currentValue[endIdx] === '\n')) {
        endIdx--;
      }
      if (endIdx >= 0 && currentValue[endIdx] === ';' && currentValue[endIdx - 1] === '"') {
        // Value ends on this line
        currentValue = currentValue.substring(0, endIdx - 1);
        result[currentKey] = unescapeValue(currentValue);
        currentKey = '';
        currentValue = '';
        inValue = false;
      }
    } else if (inValue) {
      currentValue += '\n' + line;
      let endIdx = currentValue.length - 1;
      while (endIdx >= 0 && (currentValue[endIdx] === '\r' || currentValue[endIdx] === '\n')) {
        endIdx--;
      }
      if (endIdx >= 0 && currentValue[endIdx] === ';' && currentValue[endIdx - 1] === '"') {
        currentValue = currentValue.substring(0, endIdx - 1);
        result[currentKey] = unescapeValue(currentValue);
        currentKey = '';
        currentValue = '';
        inValue = false;
      }
    }
  }

  return result;
}

function unescapeValue(val: string): string {
  return val.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
}

describe('TeleBridge Branding', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));

    it('should have name "telebridge"', () => {
      expect(pkg.name).toBe('telebridge');
    });
  });

  describe('index.html', () => {
    const html = fs.readFileSync(path.join(rootDir, 'src/index.html'), 'utf-8');

    it('should not contain "Telegram Web" in noscript', () => {
      expect(html).not.toContain('Telegram Web');
    });

    it('should contain "TeleBridge" in noscript', () => {
      expect(html).toContain('TeleBridge');
    });

    it('should reference telebridge.online in canonical', () => {
      expect(html).toContain('telebridge.online');
    });
  });

  describe('Web Manifests', () => {
    const manifestFiles = [
      'public/site.webmanifest',
      'public/site_dev.webmanifest',
      'public/site_apple.webmanifest',
      'public/site_apple_dev.webmanifest',
    ];

    manifestFiles.forEach((filePath) => {
      const fileName = path.basename(filePath);
      const content = fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
      const manifest = JSON.parse(content);

      describe(fileName, () => {
        it('should have name containing "TeleBridge"', () => {
          expect(manifest.name).toContain('TeleBridge');
        });

        it('should have short_name containing "TeleBridge"', () => {
          expect(manifest.short_name).toContain('TeleBridge');
        });
      });
    });
  });

  describe('Config', () => {
    const configContent = fs.readFileSync(path.join(rootDir, 'src/config.ts'), 'utf-8');

    it('should reference telebridge.online as production hostname', () => {
      expect(configContent).toContain('telebridge.online');
    });

    it('should not have Telegram Web as APP_NAME default', () => {
      expect(configContent).not.toContain('Telegram Web ');
    });
  });

  describe('TeleBridge logo asset', () => {
    it('should have telebridge-logo.png in public directory', () => {
      const logoPath = path.join(rootDir, 'public/telebridge-logo.png');
      expect(fs.existsSync(logoPath)).toBe(true);
    });
  });

  describe('.env', () => {
    const envContent = fs.readFileSync(path.join(rootDir, '.env'), 'utf-8');

    it('should have TELEGRAM_API_ID placeholder', () => {
      expect(envContent).toContain('TELEGRAM_API_ID');
    });

    it('should have TELEGRAM_API_HASH placeholder', () => {
      expect(envContent).toContain('TELEGRAM_API_HASH');
    });

    it('should reference telebridge.online domain', () => {
      expect(envContent).toContain('telebridge.online');
    });
  });

  describe('Tauri config', () => {
    const tauriConfig = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'tauri/tauri.conf.json'), 'utf-8'),
    );

    it('should have productName "TeleBridge"', () => {
      expect(tauriConfig.productName).toBe('TeleBridge');
    });

    it('should have telebridge deep link scheme', () => {
      expect(tauriConfig.plugins['deep-link'].desktop.schemes).toContain('telebridge');
    });

    it('should not have "Telegram" in identifier', () => {
      expect(tauriConfig.identifier).not.toContain('telegram');
    });
  });

  describe('Webpack config', () => {
    const webpackContent = fs.readFileSync(path.join(rootDir, 'webpack.config.ts'), 'utf-8');

    it('should default to TeleBridge title', () => {
      expect(webpackContent).toContain('TeleBridge');
    });
  });

  describe('Icon references exist on disk', () => {
    const iconFiles = [
      'public/icon-192x192.png',
      'public/icon-384x384.png',
      'public/icon-512x512.png',
      'public/icon-dev-192x192.png',
      'public/icon-dev-384x384.png',
      'public/icon-dev-512x512.png',
      'public/apple-touch-icon.png',
      'public/apple-touch-icon-dev.png',
      'public/favicon-16x16.png',
      'public/favicon-32x32.png',
      'public/favicon.ico',
      'public/favicon.svg',
    ];

    iconFiles.forEach((iconPath) => {
      it(`${iconPath} should exist`, () => {
        expect(fs.existsSync(path.join(rootDir, iconPath))).toBe(true);
      });
    });
  });

  describe('Localization strings — no Telegram Premium in values (VAL-BRAND-007)', () => {
    const stringsContent = fs.readFileSync(
      path.join(rootDir, 'src/assets/localization/fallback.strings'), 'utf-8',
    );
    const parsed = parseStringsFile(stringsContent);

    it('should have no "Telegram Premium" in any fallback.strings value', () => {
      const violations: string[] = [];
      for (const [key, value] of Object.entries(parsed)) {
        if (value.includes('Telegram Premium')) {
          violations.push(`"${key}" = "${value}"`);
        }
      }
      expect(violations).toEqual([]);
    });
  });

  describe('Localization strings — no user-visible Telegram references (VAL-BRAND-008)', () => {
    const stringsContent = fs.readFileSync(
      path.join(rootDir, 'src/assets/localization/fallback.strings'), 'utf-8',
    );
    const parsed = parseStringsFile(stringsContent);

    // Patterns that indicate user-visible "Telegram" brand references
    const userVisiblePatterns: Array<{ pattern: RegExp; description: string }> = [
      { pattern: /\bjoined Telegram\b/i, description: '"joined Telegram"' },
      { pattern: /\bon Telegram\b/i, description: '"on Telegram"' },
      { pattern: /\bTelegram account\b/i, description: '"Telegram account"' },
      { pattern: /\bTelegram app\b/i, description: '"Telegram app"' },
      { pattern: /\bTelegram search\b/i, description: '"Telegram search"' },
      { pattern: /\bin Telegram\b/i, description: '"in Telegram"' },
      { pattern: /\bto Telegram\b/i, description: '"to Telegram"' },
      { pattern: /\bfrom Telegram\b/i, description: '"from Telegram"' },
      { pattern: /\bwith Telegram\b/i, description: '"with Telegram"' },
      { pattern: /\bOpen Telegram\b/i, description: '"Open Telegram"' },
      { pattern: /\bTelegram profile\b/i, description: '"Telegram profile"' },
      { pattern: /\bTelegram name\b/i, description: '"Telegram name"' },
      { pattern: /\bTelegram FAQ\b/i, description: '"Telegram FAQ"' },
      { pattern: /\bTelegram Features\b/i, description: '"Telegram Features"' },
      { pattern: /\bTelegram client\b/i, description: '"Telegram client"' },
      { pattern: /\bTelegram code\b/i, description: '"Telegram code"' },
      { pattern: /\bTelegram login\b/i, description: '"Telegram login"' },
      { pattern: /\bTelegram Support\b/i, description: '"Telegram Support"' },
      { pattern: /\bTelegram offers\b/i, description: '"Telegram offers"' },
      { pattern: /\bTelegram uses\b/i, description: '"Telegram uses"' },
      { pattern: /\bTelegram shares\b/i, description: '"Telegram shares"' },
      { pattern: /\bTelegram developed\b/i, description: '"Telegram developed"' },
      { pattern: /\bTelegram never\b/i, description: '"Telegram never"' },
      { pattern: /\bTelegram doesn'?t\b/i, description: '"Telegram doesn\'t"' },
      { pattern: /\byour Telegram\b/i, description: '"your Telegram"' },
      { pattern: /\bUpdate Telegram\b/i, description: '"Update Telegram"' },
    ];

    userVisiblePatterns.forEach(({ pattern, description }) => {
      it(`should not contain ${description} in any localized string value`, () => {
        const violations: string[] = [];
        for (const [key, value] of Object.entries(parsed)) {
          if (pattern.test(value)) {
            violations.push(`"${key}" = "${value}"`);
          }
        }
        expect(violations).toEqual([]);
      });
    });

    it('should not have bare "Telegram" as a standalone word in values (except functional references)', () => {
      // Match standalone "Telegram" not preceded/succeeded by other word chars
      // Exclude known functional references: telegram.org, t.me, tg://, TelegramClient
      const bareTelegram = /\bTelegram\b/;
      const functionalExceptions = [
        'telegram.org',
        'TelegramClient',
        'TelegramTips',
      ];
      const violations: string[] = [];
      for (const [key, value] of Object.entries(parsed)) {
        if (bareTelegram.test(value)) {
          // Check if it's a functional reference
          const isFunctional = functionalExceptions.some((exc) => value.includes(exc));
          // Allow if the value already says "TeleBridge" or is clearly about API
          if (!isFunctional && !value.includes('TeleBridge')) {
            // Skip the "Telegram" key itself which maps to "TeleBridge"
            if (key === 'Telegram') continue;
            violations.push(`"${key}" = "${value.substring(0, 80)}"`);
          }
        }
      }
      expect(violations).toEqual([]);
    });
  });

  describe('Localization strings — Login/QR screens say TeleBridge (VAL-BRAND-004)', () => {
    const stringsContent = fs.readFileSync(
      path.join(rootDir, 'src/assets/localization/fallback.strings'), 'utf-8',
    );
    const parsed = parseStringsFile(stringsContent);

    it('LoginQRHelp1 should show "Open TeleBridge on your phone"', () => {
      expect(parsed['LoginQRHelp1']).toBe('Open TeleBridge on your phone');
    });

    it('SentAppCode should reference "TeleBridge" not "Telegram"', () => {
      expect(parsed['SentAppCode']).toContain('TeleBridge');
      expect(parsed['SentAppCode']).not.toContain('Telegram');
    });

    it('LoginQRTitle should reference "TeleBridge"', () => {
      expect(parsed['LoginQRTitle']).toContain('TeleBridge');
    });
  });

  describe('Initial strings — no user-visible Telegram references', () => {
    const initialContent = fs.readFileSync(
      path.join(rootDir, 'src/assets/localization/initialStrings.ts'), 'utf-8',
    );

    it('SentAppCode should say "TeleBridge" not "Telegram"', () => {
      expect(initialContent).not.toMatch(/"SentAppCode".*\bTelegram\b/);
      expect(initialContent).toMatch(/"SentAppCode".*TeleBridge/);
    });

    it('LoginQRHelp1 should say "TeleBridge" not "Telegram"', () => {
      expect(initialContent).not.toMatch(/"LoginQRHelp1".*\bTelegram\b/);
    });

    it('LoginQRTitle should say "TeleBridge" not "Telegram"', () => {
      expect(initialContent).not.toMatch(/"LoginQRTitle".*\bTelegram\b/);
    });
  });
});
