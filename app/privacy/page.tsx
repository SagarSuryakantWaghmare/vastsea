import { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy - VastSea',
  description: 'Privacy Policy for VastSea platform - Learn how we collect, use, and protect your data.',
};

const PrivacyPage = () => {
  return <PrivacyContent />;
};

export default PrivacyPage;
