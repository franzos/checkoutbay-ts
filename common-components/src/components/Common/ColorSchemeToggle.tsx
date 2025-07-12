import { ActionIcon, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    if (colorScheme === 'light') {
      setColorScheme('dark');
    } else if (colorScheme === 'dark') {
      setColorScheme('auto');
    } else {
      setColorScheme('light');
    }
  };

  const getIcon = () => {
    switch (colorScheme) {
      case 'light':
        return <IconSun size={18} />;
      case 'dark':
        return <IconMoon size={18} />;
      case 'auto':
        return <IconDeviceDesktop size={18} />;
      default:
        return <IconSun size={18} />;
    }
  };

  const getTooltipLabel = () => {
    switch (colorScheme) {
      case 'light':
        return 'Light mode (click for dark)';
      case 'dark':
        return 'Dark mode (click for auto)';
      case 'auto':
        return 'Auto mode (click for light)';
      default:
        return 'Toggle color scheme';
    }
  };

  return (
    <Tooltip label={getTooltipLabel()}>
      <ActionIcon
        onClick={toggleColorScheme}
        variant="subtle"
        size="lg"
        aria-label="Toggle color scheme"
      >
        {getIcon()}
      </ActionIcon>
    </Tooltip>
  );
}
