import type { DragEvent, FormEvent, ChangeEvent } from 'react';

declare global {
  namespace React {
    interface DragEvent<T = Element> extends DragEvent<T> {}
    interface FormEvent<T = Element> extends FormEvent<T> {}
    interface ChangeEvent<T = Element> extends ChangeEvent<T> {}
  }
} 