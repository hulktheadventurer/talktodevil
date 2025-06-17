'use client';

import { useState } from 'react';

let listeners: (() => void)[] = [];

export function useDonateModal() {
  const [, setToggle] = useState(false);

  const notify = () => setToggle((v) => !v);

  const open = () => {
    listeners.forEach((cb) => cb());
    notify();
  };

  return { open };
}

export function donateModalListener(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}
