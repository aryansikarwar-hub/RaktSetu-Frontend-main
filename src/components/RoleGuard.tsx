'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Role = 'donor' | 'hospital' | 'admin' | 'coordinator';

/**
 * RoleGuard — wrap any page/section to restrict it to specific roles.
 *
 *   <RoleGuard allow={['hospital', 'admin']}>
 *     <FindBlood />
 *   </RoleGuard>
 *
 * - If the visitor is not logged in, they see a "please sign in" notice.
 * - If logged in but the role isn't allowed, they see an "access restricted"
 *   notice that explains who the feature is for.
 * - Otherwise the children render normally.
 */
export default function RoleGuard({
  allow,
  children,
  featureName = 'This feature',
}: {
  allow: Role[];
  children: React.ReactNode;
  featureName?: string;
}) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Notice
        icon={<LogIn size={28} />}
        title="Please sign in"
        message={`${featureName} requires an account. Log in or register to continue.`}
        cta={
          <Link href="/" className="btn-primary inline-flex">
            Go to Home
          </Link>
        }
      />
    );
  }

  if (!allow.includes(user.role as Role)) {
    const who = allow
      .map((r) => (r === 'hospital' ? 'hospitals' : r === 'admin' ? 'admins' : r === 'donor' ? 'donors' : r))
      .join(' & ');
    return (
      <Notice
        icon={<ShieldAlert size={28} />}
        title="Access restricted"
        message={`${featureName} is available to ${who} only. Your account role (${user.role}) doesn't have access.`}
        cta={
          <Link href="/user-dashboard" className="btn-primary inline-flex">
            Back to Dashboard
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
}

function Notice({
  icon,
  title,
  message,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center card p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
        {cta}
      </div>
    </div>
  );
}