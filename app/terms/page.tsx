import { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service - VastSea',
  description: 'Terms of Service for VastSea platform - Learn about our terms and conditions.',
};

const TermsPage = () => {
  return <TermsContent />;
};

export default TermsPage;
