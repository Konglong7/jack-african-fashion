/**
 * ESLint 配置文件 - Next.js 15 + React 19 + TypeScript
 * 使用新的 flat config 格式 (ESLint 9+)
 */

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 兼容Next.js的eslint配置
const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfigs = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'tsconfig.tsbuildinfo', 'scripts/**']
  },
  ...tseslint.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React 性能警告（关闭prop-types检查，使用TypeScript）
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-key': 'error',

      // TypeScript 严格模式
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 一般最佳实践
      'no-console': process.env.NODE_ENV === 'production' ? ['warn', { allow: ['warn', 'error'] }] : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
      quotes: ['error', 'single', 'avoid-escape'],
      semi: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ]
    }
  }
];

export default eslintConfigs;
