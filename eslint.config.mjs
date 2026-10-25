import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'agent/**',
      '.agents/**',
      '.codex/**',
      'node_modules/**',
      '**/dist/**',
      '**/.test-dist/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
