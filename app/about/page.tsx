import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Me - Sagar Suryakant Waghmare',
  description: 'Learn more about Sagar Suryakant Waghmare, the creator of VastSea platform.',
};

const AboutPage = () => {
  return <AboutContent />;
};

export default AboutPage;
