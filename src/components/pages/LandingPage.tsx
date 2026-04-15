'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Heart, Users, Bell, Lock } from 'lucide-react';

export function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Heart,
      title: 'Family First',
      description: 'Not a productivity app. Built for connection, not tasks.',
    },
    {
      icon: Users,
      title: 'See Everyone',
      description: 'Your family at a glance. Who needs attention, who\'s all good.',
    },
    {
      icon: Bell,
      title: 'Gentle Nudges',
      description: 'Reminders that care. No guilt, no pressure.',
    },
    {
      icon: Lock,
      title: 'Private',
      description: 'Your family, your data. No tracking, no ads.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <Image
              src="/images/logo.png"
              alt="Nudge"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-display mb-6"
          >
            Keep your family{' '}
            <span className="text-gradient">close</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Even when life gets fast.
            <br />
            <span className="text-[var(--color-text-muted)]">
              Gentle reminders for the small acts that keep families together.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="btn btn-primary btn-lg group"
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Social proof / Trust */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-sm text-[var(--color-text-muted)]"
          >
            Free forever. No account required.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-[var(--color-bg-subtle)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-headline mb-4">
              Make invisible care visible
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
              The small actions that keep families connected often go unnoticed.
              Until now.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mx-auto mb-5">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-[var(--color-text-secondary)] italic">
            "The best time to call mom was yesterday.
            <br />
            The second best time is now."
          </blockquote>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Nudge"
              width={28}
              height={28}
            />
            <span className="font-medium">Nudge</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Made with love for families everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
