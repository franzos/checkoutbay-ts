import { Anchor, List, ListItem, Pill, Text } from '@mantine/core';
import { parseRSS, RSSEntry, RSSFeed } from "@gofranz/common";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { LargeTitleWithText } from './TitleWithText';

export interface NewsProps {
  blogBaseUrl: string; // e.g., 'https://blog.formshive.com' or 'https://blog.checkoutbay.com'
  maxItems?: number; // Default: 10
  summaryLength?: number; // Default: 180
}

export function News(props: NewsProps) {
  const { t } = useTranslation();
  const { blogBaseUrl, maxItems = 10, summaryLength = 180 } = props;
  const url = `${blogBaseUrl}/feed.xml`;
  const [feed, setFeed] = useState<RSSFeed | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const resData = await res.text();
      const parsedFeed = parseRSS(resData);
      setFeed(parsedFeed.feed);
    })();
  }, [url]);

  const category = (cat: string, index: number) => (
    <Pill key={`${cat}-${index}`} color="gray" size="xs">
      <span style={{ fontSize: '12px', color: 'var(--mantine-color-dimmed)' }}>
        {cat}
      </span>
    </Pill>
  );

  return (
    <>
      <LargeTitleWithText title={t('news.title')} mb="md" />
      <List mb="md" maw={680}>
        {feed ? (
          feed?.entry.slice(0, maxItems).map((item: RSSEntry) => (
            <ListItem key={`news-${item.id}`} mb="xs">
              <div>
                <Anchor href={item.id} title={item.title}>
                  {item.title}
                </Anchor>
              </div>
              <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                {item.category.map((cat: string, index: number) => category(cat.toLowerCase(), index))}
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                {item.summary.replace(/<[^>]*>/g, '').slice(0, summaryLength)} ...
              </div>
            </ListItem>
          ))
        ) : (
          <Text>{t('news.loading')}</Text>
        )}
      </List>
      <Text>
        {t('news.rssDescription')}{' '}
        <Anchor href={url}>{url.replace('https://', '')}</Anchor>
      </Text>
    </>
  );
}