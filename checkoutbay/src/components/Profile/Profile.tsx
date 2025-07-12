import { Text } from "@mantine/core";

export interface ProfileProps {
  publicKey: string;
}

export function Profile(props: ProfileProps) {
  return (
    <div>
      <h1>Profile</h1>
      <Text>Public key: {props.publicKey}</Text>
    </div>
  );
}
