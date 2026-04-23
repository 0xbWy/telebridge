import fs from 'fs';
import path from 'path';

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
});
