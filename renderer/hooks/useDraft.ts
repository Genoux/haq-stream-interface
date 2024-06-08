// hooks/useDraft.ts
import { useState } from 'react';

export const useDraft = () => {
  const [draft, setDraft] = useState<any | null>(null);

  const clearDraft = () => {
    setDraft(null);
  };

  return { draft, setDraft, clearDraft };
};
