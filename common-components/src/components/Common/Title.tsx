import { Title, TitleProps, useMantineTheme } from "@mantine/core";

export interface LargeTitleProps extends TitleProps {
    title: string;
}

export function LargeTitle({ title, ...stackProps }: LargeTitleProps) {
    const theme = useMantineTheme();
    
    // Get theme colors, with fallbacks
    const primaryColor = theme.colors['brand-primary']?.[6] || theme.colors.primary[6];
    const accentColor = theme.colors['brand-accent']?.[6] || theme.colors['brand-secondary']?.[6] || theme.colors.primary[8];
    
    return (
        <Title
            order={1}
            style={{
                background: `linear-gradient(45deg, ${primaryColor}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                fontSize: 'clamp(50px, 8vw, 60px)',
                fontWeight: 900,
                letterSpacing: '-2px'
            }}
            {...stackProps}
        >
            {title}
        </Title>
    )
}