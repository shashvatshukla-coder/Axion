import { useCallback, useState } from 'react';
import type { FormValues } from '@/types';

export type FormErrors = Record<string, string>;

/** Small controlled-form helper: values, per-field errors and a reset. */
export function useForm(initial: FormValues) {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { values, errors, setField, setErrors, reset };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error map for the listed required fields; `emailFields` are also format-checked. */
export function validateRequired(values: FormValues, required: string[], emailFields: string[] = []): FormErrors {
  const errors: FormErrors = {};
  for (const name of required) {
    if (!values[name] || !values[name].trim()) errors[name] = 'This field is required.';
  }
  for (const name of emailFields) {
    if (values[name] && !EMAIL.test(values[name].trim())) errors[name] = 'Enter an email like name@example.com.';
  }
  return errors;
}
