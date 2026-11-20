"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type Props = { email: string; label: string; copiedLabel: string };

export function CopyEmail({ email, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-fg transition hover:border-accent/60 hover:text-accent"
    >
      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
