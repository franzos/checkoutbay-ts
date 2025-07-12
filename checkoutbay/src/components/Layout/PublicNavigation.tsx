import { Box, Burger, Button, Container, Drawer, Group, Image, Menu, Stack, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { ColorSchemeToggle, useLanguageAwareRouting } from '@gofranz/common-components';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';

export function PublicNavigation() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { createLanguageURL, isActive } = useLanguageAwareRouting();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const isDark = colorScheme === 'dark';

  return (
    <Box
      style={{
        // borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        // backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
      }}
      py="sm"
    >
      <Container>
        <Group justify="space-between">
          <Group>
            <Link to={createLanguageURL('/')}>
              <Image src="/logo.svg" alt={t('brand.logoAlt')} width={32} height={32} style={{ cursor: 'pointer' }} />
            </Link>
            <Group gap={5} visibleFrom="sm">
              <Button component={Link} to={createLanguageURL('/')} variant={isActive('/') ? 'filled' : 'subtle'} size="sm">
                {t('glob_navigation.home')}
              </Button>
              <Button component={Link} to={createLanguageURL('/pricing')} variant={isActive('/pricing') ? 'filled' : 'subtle'} size="sm">
                {t('glob_navigation.pricing')}
              </Button>
              <Menu trigger="hover" openDelay={100} closeDelay={400}>
                <Menu.Target>
                  <Button variant={(isActive('/docs') || isActive('/news')) ? 'filled' : 'subtle'} size="sm">
                    {t('glob_navigation.more')}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to={createLanguageURL('/docs')}>
                    {t('glob_navigation.docs')}
                  </Menu.Item>
                  <Menu.Item component={Link} to={createLanguageURL('/news')}>
                    {t('glob_navigation.news')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
          <Group>
            <LanguageSelector />
            <ColorSchemeToggle />
            <Group gap={5} visibleFrom="sm">
              <Button component={Link} to={createLanguageURL('/login')} variant="outline" size="sm">
                {t('glob_navigation.login')}
              </Button>
              <Button component={Link} to={createLanguageURL('/signup')} variant="filled" size="sm">
                {t('glob_navigation.signup')}
              </Button>
            </Group>
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" size="sm" />
          </Group>
        </Group>
      </Container>
      
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={t('brand.name')}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="md">
          <Button 
            component={Link} 
            to={createLanguageURL('/')} 
            variant={isActive('/') ? 'filled' : 'subtle'} 
            fullWidth
            onClick={closeDrawer}
          >
            {t('glob_navigation.home')}
          </Button>
          <Button
            component={Link}
            to={createLanguageURL('/pricing')}
            variant={isActive('/pricing') ? 'filled' : 'subtle'}
            fullWidth
            onClick={closeDrawer}
          >
            {t('glob_navigation.pricing')}
          </Button>
          <Button 
            component={Link} 
            to={createLanguageURL('/docs')} 
            variant={isActive('/docs') ? 'filled' : 'subtle'} 
            fullWidth
            onClick={closeDrawer}
          >
            {t('glob_navigation.docs')}
          </Button>
          <Button 
            component={Link} 
            to={createLanguageURL('/news')} 
            variant={isActive('/news') ? 'filled' : 'subtle'} 
            fullWidth
            onClick={closeDrawer}
          >
            {t('glob_navigation.news')}
          </Button>
          <Box mt="md" pt="md" style={{ borderTop: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}>
            <Stack gap="sm">
              <Button 
                component={Link} 
                to={createLanguageURL('/login')} 
                variant="outline" 
                fullWidth
                onClick={closeDrawer}
              >
                {t('glob_navigation.login')}
              </Button>
              <Button 
                component={Link} 
                to={createLanguageURL('/signup')} 
                variant="filled" 
                fullWidth
                onClick={closeDrawer}
              >
                {t('glob_navigation.signup')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
}
