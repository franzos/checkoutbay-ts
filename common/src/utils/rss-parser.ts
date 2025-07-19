import { XMLParser } from 'fast-xml-parser';

export interface RSSAuthor {
  name: string;
  uri?: string;
}

export interface RSSEntry {
  author: RSSAuthor;
  category: string[];
  content: string;
  id: string;
  link: string;
  published: string;
  summary: string;
  title: string;
  updated: string;
}

export interface RSSFeed {
  title: string;
  author: RSSAuthor;
  entry: RSSEntry[];
}

export function parseRSS(xml: string): {
  feed: RSSFeed;
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
  });

  const result = parser.parse(xml);

  // Transform the feed entries to handle category terms
  if (result.feed?.entry) {
    result.feed.entry = result.feed.entry.map((entry: any) => ({
      ...entry,
      category: Array.isArray(entry.category)
        ? entry.category.map((cat: any) => cat['@_term'])
        : [entry.category['@_term']],
      link: entry.link?.['@_href'] || '',
      summary: typeof entry.summary === 'object' && entry.summary['#text'] 
        ? entry.summary['#text'] 
        : entry.summary,
      content: typeof entry.content === 'object' && entry.content['#text'] 
        ? entry.content['#text'] 
        : entry.content,
      title: typeof entry.title === 'object' && entry.title['#text'] 
        ? entry.title['#text'] 
        : entry.title,
    }));
  }

  return result;
}
