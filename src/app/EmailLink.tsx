"use client";

import { useMemo } from "react";

type Props = {
  user: string;
  domain: string;
  subject?: string;
  className?: string;
};

export default function EmailLink({ user, domain, subject, className }: Props) {
  // built on the client only so bots scraping server HTML don't see the address
  const email = useMemo(() => `${user}@${domain}`, [user, domain]);
  const href = useMemo(
    () =>
      `mailto:${email}${
        subject ? `?subject=${encodeURIComponent(subject)}` : ""
      }`,
    [email, subject]
  );

  return (
    <a href={href} className={className}>
      {email}
    </a>
  );
}
