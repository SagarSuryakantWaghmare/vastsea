import { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - VastSea',
  description: 'Admin dashboard for managing problems and users on VastSea platform.',
};

const AdminPage = () => {
  return <AdminDashboard />;
};

export default AdminPage;
