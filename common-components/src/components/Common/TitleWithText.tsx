import { Stack, Box, Text, StackProps, useMantineTheme } from "@mantine/core";
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
    const theme = useMantineTheme();
    
    // Use theme's neutral dark color for subtitle, with fallback to dimmed
    const subtitleColor = theme.colors['neutral-dark']?.[6] || 'dimmed';
    
    return (
        <Stack gap="xl" {...stackProps}>
            <Box style={{ textAlign: 'center' }}>
                <LargeTitle title={title} />
                {text && (
                    <Text size="lg" c={subtitleColor} maw={600} mx="auto">
                        {text}
                    </Text>
                )}
            </Box>
        </Stack>
    )
}