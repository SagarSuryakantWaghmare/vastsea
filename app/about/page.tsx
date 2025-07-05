import { Metadata } from 'next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about the VastSea team and our mission.',
};

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Co-Founder & CEO',
      avatar: '/avatars/john.jpg',
      bio: 'John is a passionate developer with a love for building amazing products.',
    },
    {
      name: 'Jane Smith',
      role: 'Co-Founder & CTO',
      avatar: '/avatars/jane.jpg',
      bio: 'Jane is a brilliant engineer who loves solving complex problems.',
    },
    {
      name: 'Peter Jones',
      role: 'Lead Designer',
      avatar: '/avatars/peter.jpg',
      bio: 'Peter is a creative designer with a keen eye for detail.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          About VastSea
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          We are a team of passionate developers, designers, and educators dedicated to creating the best platform for learning and sharing programming knowledge.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardHeader>
                <Avatar className="mx-auto h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{member.name}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
