import { Stack, Box, Text, StackProps } from "@mantine/core";
import { LargeTitle } from "./Title";

export interface LargeTitleWithTextProps extends StackProps {
    title: string;
    text?: string;
}

export function LargeTitleWithText({
    title,
    text,
    ...stackProps
}: LargeTitleWithTextProps) {
    return (
        <Stack gap="xl" {...stackProps}>
            <Box style={{ textAlign: 'center' }}>
                <LargeTitle title={title} />
                {text && (
                    <Text size="lg" c="dimmed" maw={600} mx="auto">
                        {text}
                    </Text>
                )}
            </Box>
        </Stack>
    )
}