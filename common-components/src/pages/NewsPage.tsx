import { Container } from '@mantine/core';
import { ReactNode } from 'react';
import { News } from '../components/Common/News';

export interface NewsPageProps {
  blogBaseUrl: string; // e.g., 'https://blog.formshive.com' or 'https://blog.checkoutbay.com'
  maxItems?: number; // Default: 10
  summaryLength?: number; // Default: 180
  footer?: ReactNode; // Optional footer component
}

export function NewsPage(props: NewsPageProps) {
  const { blogBaseUrl, maxItems, summaryLength, footer } = props;
  
  return (
    <>
      <Container mt="xl" mb="xl">
        <News 
          blogBaseUrl={blogBaseUrl}
          maxItems={maxItems}
          summaryLength={summaryLength}
        />
      </Container>
      {footer}
    </>
  );
}