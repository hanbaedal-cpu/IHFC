"use client";

import { useState } from "react";

export function CopyAddressButton({
  address,
  label,
  doneLabel,
}: {
  address: string;
  label: string;
  doneLabel: string;
}) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      setDone(false);
    }
  }

  return (
    <button type="button" className="btn-addr-copy" onClick={onCopy}>
      <span aria-hidden>⧉</span>
      {done ? doneLabel : label}
    </button>
  );
}
