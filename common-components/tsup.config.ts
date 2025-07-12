import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  publicDir: 'src/assets',
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    '@mantine/core',
    '@mantine/form',
    '@mantine/hooks',
    '@mantine/notifications',
    '@tabler/icons-react',
    'i18next',
    'react-i18next'
  ]
})