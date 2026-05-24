import React from 'react';
import { UserPlus, Search, Handshake } from 'lucide-react';

const STEPS = [
  {
    id: 'step-register',
    step: '01',
    icon: <UserPlus size={28} />,
    title: 'Register as a Donor',
    description: 'Create your donor profile with blood type, city, and health details. Takes under 3 minutes. Your data is secure and verified by our medical team.',
    color: 'bg-red-50 dark:bg-red-950/20 text-primary border-red-100 dark:border-red-900',
    iconBg: 'bg-primary text-white',
  },
  {
    id: 'step-match',
    step: '02',
    icon: <Search size={28} />,
    title: 'Get Matched Instantly',
    description: 'Our real-time matching engine connects patients and hospitals with compatible donors nearby. Receive emergency alerts on your phone within seconds.',
    color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    iconBg: 'bg-blue-600 text-white',
  },
  {
    id: 'step-save',
    step: '03',
    icon: <Handshake size={28} />,
    title: 'Donate & Save a Life',
    description: 'Visit the hospital, complete donation, and earn your RaktSetu Saver certificate. Track your donation history and impact on your personal dashboard.',
    color: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900',
    iconBg: 'bg-green-600 text-white',
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 py-20">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">How It Works</span>
        <h2 className="section-header mt-4 text-3xl lg:text-4xl">
          Saving Lives in 3 Simple Steps
        </h2>
        <p className="section-subheader max-w-xl mx-auto mt-3">
          From registration to donation — our streamlined process makes it easy for every Indian to contribute to the national blood and organ network.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connector lines */}
        <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 to-blue-400/30" />

        {STEPS?.map((step, index) => (
          <div key={step?.id} className="relative group">
            <div className={`card-hover p-7 border ${step?.color?.split(' ')?.slice(-1)?.[0]}`}>
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl ${step?.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  {step?.icon}
                </div>
                <div>
                  <span className="text-4xl font-extrabold text-border leading-none">{step?.step}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step?.description}</p>
            </div>
            {index < 2 && (
              <div className="hidden md:flex absolute top-14 -right-4 w-8 h-8 bg-card rounded-full border-2 border-border items-center justify-center z-10 text-muted-foreground">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}