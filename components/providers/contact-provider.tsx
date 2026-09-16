"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Where a contextual CTA (e.g. inline on the Oracle page) opened the panel from. */
export type ContactSource = {
  practice?: string;
  serviceKey?: string;
};

type ContactContextValue = {
  open: boolean;
  source: ContactSource;
  setOpen: (open: boolean, source?: ContactSource) => void;
  toggle: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const [source, setSource] = useState<ContactSource>({});

  const setOpen = useCallback((next: boolean, nextSource?: ContactSource) => {
    if (next) setSource(nextSource ?? {});
    setOpenState(next);
  }, []);
  const toggle = useCallback(() => setOpenState((value) => !value), []);
  const value = useMemo(
    () => ({ open, source, setOpen, toggle }),
    [open, source, setOpen, toggle],
  );

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContactPanel() {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContactPanel must be used within ContactProvider");
  }

  return context;
}
