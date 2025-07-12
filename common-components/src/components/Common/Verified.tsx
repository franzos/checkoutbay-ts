import { Group, Text } from '@mantine/core';
import { IconCheckbox, IconSquare } from '@tabler/icons-react';

export interface VerifiedProps {
  isVerified: boolean;
}

export function IsVerified(props: VerifiedProps) {
  const Icon = () => {
    return props.isVerified ? <IconCheckbox /> : <IconSquare />;
  };
  return (
    <Group>
      <Icon />
      <Text>Verified</Text>
    </Group>
  );
}
