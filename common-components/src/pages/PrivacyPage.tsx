import { Box, Center, Container, Stack, Text } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export interface PrivacyPageProps {
  supportEmail: string; // e.g., 'support@formshive.com' or 'support@checkoutbay.com'
  homeRoute?: string; // Default: '/'
  useLinkComponent?: boolean; // Use react-router Link vs anchor, default: true
  footer?: ReactNode; // Optional footer component
}

export function PrivacyPage(props: PrivacyPageProps) {
  const { i18n } = useTranslation();
  const { supportEmail, footer } = props;
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Try to load language-specific content
        const response = await fetch(`/content/privacy/${i18n.language}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          throw new Error('Language-specific content not found');
        }
      } catch {
        // Fallback to English
        try {
          const response = await fetch('/content/privacy/en.md');
          const text = await response.text();
          setContent(text);
        } catch (error) {
          console.error('Failed to load privacy content:', error);
          setContent('# Privacy Policy\n\nContent could not be loaded.');
        }
      }
    };

    loadContent();
  }, [i18n.language]);

  // Replace placeholder with actual support email
  const processedContent = content.replace('our support address', supportEmail);

  return (
    <>
      <Container mt="xl" mb="xl">
        <Center>
          <Stack maw={680}>
            <Box
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <Text size="xl" fw={700} mb="md" mt={0}>{children}</Text>,
                  h2: ({ children }) => <Text size="lg" fw={600} mb="sm" mt="xl">{children}</Text>,
                  h3: ({ children }) => <Text size="md" fw={600} mb="xs" mt="lg">{children}</Text>,
                  p: ({ children }) => <Text mb="md" mt={0}>{children}</Text>,
                  ul: ({ children }) => <Box component="ul" mb="md" mt="xs" pl="xl">{children}</Box>,
                  li: ({ children }) => <Box component="li" mb={4}>{children}</Box>,
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </Box>
          </Stack>
        </Center>
      </Container>
      {footer}
    </>
  );
}