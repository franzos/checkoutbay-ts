import { Title, TitleProps } from "@mantine/core";

export interface LargeTitleProps extends TitleProps {
    title: string;
}

export function LargeTitle({ title, ...stackProps }: LargeTitleProps) {
    return (
        <Title
            order={1}
            style={{
                background: 'linear-gradient(45deg, #1c7ed6, #15aabf)',
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