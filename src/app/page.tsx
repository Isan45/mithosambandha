
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User,
  HeartHandshake,
  Search,
  CheckCircle,
  MapPin,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockProfiles, mockSuccessStories } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const HowItWorksStep = ({ icon: Icon, step, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <div className="text-xl font-bold mb-2">{step}</div>
    <h3 className="text-xl font-headline mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const ProfileCard = ({ profile }) => (
  <Card className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group">
    <div className="relative h-64">
      <Image 
        src={profile.photos[0]} 
        alt={profile.name} 
        fill
        className="object-cover"
        data-ai-hint="portrait person"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
    <CardContent className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">{profile.name}, {profile.age}</CardTitle>
        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{profile.location}</span>
      </div>
      <div className="flex gap-2 pt-2">
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-full text-xs">
          <Link href={`/profiles/${profile.id}`}>View Profile</Link>
        </Button>
        <Button asChild size="sm" className="flex-1 rounded-full text-xs bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/join">Send Interest</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    {children}
  </section>
);

const HomePage = () => {
  const featuredProfiles = mockProfiles.filter(p => p.status === 'approved').slice(0, 4);
  const newMembers = mockProfiles.filter(p => p.status === 'approved').slice(4, 8);
  const successStories = mockSuccessStories.slice(0, 3);

  return (
    <div className="bg-background text-foreground font-body">
      
      {/* Hero Section */}
      <Section id="home" className="relative pt-12 md:pt-20">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 text-center md:text-left space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight tracking-tighter">
              Finding Your Forever in the Nepali Way.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">
              The most trusted matrimonial platform for the Nepali community worldwide.
            </p>
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg font-bold transition-all duration-300 transform hover:scale-105">
              <Link href="/join">Join Now</Link>
            </Button>
          </motion.div>
          <motion.div 
            className="flex-1 w-full flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full max-w-md md:max-w-xl rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-500 transform hover:scale-105">
              <Image 
                src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/Mithi%20sambandha%20Hero%20Image%20.png?alt=media&token=276a0e88-fe36-47e1-b00a-fc414b3c87a9" 
                alt="A happily married Nepali couple" 
                width={1000}
                height={800}
                className="w-full h-full object-cover"
                priority
                data-ai-hint="happy couple"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      <Separator />

      {/* How It Works Section */}
      <Section id="how-it-works" className="bg-secondary">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our simple and secure process helps you find your life partner with ease and confidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <HowItWorksStep
              icon={User}
              step="1"
              title="Create Your Profile"
              description="Fill out your details and preferences to begin your journey."
            />
            <HowItWorksStep
              icon={Search}
              step="2"
              title="Find Your Match"
              description="Browse through thousands of verified profiles that match your criteria."
            />
            <HowItWorksStep
              icon={HeartHandshake}
              step="3"
              title="Connect Securely"
              description="Send interests and chat with potential partners in a safe environment."
            />
            <HowItWorksStep
              icon={CheckCircle}
              step="4"
              title="Begin Your Journey"
              description="Meet your match and take the first step towards a happy life."
            />
          </div>
        </div>
      </Section>
      
      <Separator />
      
      {/* Featured Profiles Section */}
      <Section id="profiles" className="bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Featured Profiles</h2>
            <Button asChild variant="link" className="text-primary hover:text-primary/80 transition-colors">
              <Link href="/search">View All Profiles</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </Section>

      <Separator />

      {/* New Members Section */}
      <Section className="bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">New Members</h2>
            <Button asChild variant="link" className="text-primary hover:text-primary/80 transition-colors">
              <Link href="/search">View All New Members</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newMembers.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </Section>

      <Separator />

      {/* Testimonials Section */}
      <Section id="testimonials" className="bg-background">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Read how Mitho Sambandha has helped thousands of Nepalis find their forever after.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 text-left">
                 <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                     <Avatar className="w-16 h-16">
                      <AvatarImage src={story.photo} alt={story.names} />
                      <AvatarFallback>{story.names.split(' & ')[0][0]}{story.names.split(' & ')[1][0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-headline">{story.names}</CardTitle>
                      <CardDescription>A Match Made in Heaven</CardDescription>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "{story.story}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
           <Button asChild variant="link" size="lg" className="mt-8 text-primary hover:text-primary/80 transition-colors">
              <Link href="/success-stories">Read More Success Stories</Link>
            </Button>
        </div>
      </Section>

      <Separator />
      
      {/* Call to Action Section */}
      <Section id="cta" className="bg-gradient-to-r from-primary via-primary/90 to-accent/80 text-primary-foreground text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4">Your Journey Begins Here.</h2>
          <p className="text-lg md:text-xl font-light mb-8 max-w-3xl mx-auto text-primary-foreground/90">
            Join thousands of individuals finding their perfect match on a platform built on trust, security, and a shared understanding.
          </p>
          <Button asChild size="lg" className="rounded-full bg-background text-primary hover:bg-background/90 shadow-xl font-bold transition-all duration-300 transform hover:scale-105">
            <Link href="/join">Create Your Free Profile</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
