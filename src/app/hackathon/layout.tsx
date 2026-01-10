import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HIZEXULTRON - The Ultimate Hackathon | 29th-30th January 2025',
  description: '48 hours of innovation at HIZEXULTRON hackathon. Join us for the ultimate coding challenge from 29th to 30th January 2025.',
  keywords: ['hackathon', 'coding', 'innovation', 'technology', 'programming', 'HIZEXULTRON'],
  openGraph: {
    title: 'HIZEXULTRON - The Ultimate Hackathon',
    description: '48 hours of innovation at HIZEXULTRON hackathon. Join us for the ultimate coding challenge.',
    type: 'website',
  },
};

export default function HackathonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}