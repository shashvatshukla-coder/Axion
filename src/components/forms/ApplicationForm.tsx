import { useState } from 'react';
import { Send } from 'lucide-react';
import { memberService } from '@/services/memberService';
import { useForm, validateRequired } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { FormInput, FormTextarea, Select } from '@/components/common/FormInput';
import { SuccessPanel } from '@/components/forms/SuccessPanel';

const INITIAL = {
  name: '',
  email: '',
  branchYear: '',
  skills: '',
  link: '',
  why: '',
  availability: '',
};

const AVAILABILITY = ['2 to 4 hours a week', '5 to 8 hours a week', '9 to 12 hours a week', 'More than 12 hours a week'];

export function ApplicationForm({ kind, onDone }: { kind: string; onDone?: () => void }) {
  const { values, errors, setField, setErrors, reset } = useForm(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const toast = useToast();

  const submit = async () => {
    const found = validateRequired(values, ['name', 'email', 'branchYear', 'why', 'availability'], ['email']);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await memberService.apply(kind, values);
      setReference(res.reference);
      toast.success('Application sent.');
    } catch {
      toast.error('We could not send your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <SuccessPanel
        title="Application received"
        message="Thanks for applying. A team lead will reach out within a week to set up a short conversation."
        reference={reference}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                reset();
                setReference(null);
              }}
            >
              Apply for something else
            </Button>
            {onDone && <Button onClick={onDone}>Done</Button>}
          </>
        }
      />
    );
  }

  const bind = (name: keyof typeof INITIAL) => ({
    value: values[name],
    onChange: (e: { target: { value: string } }) => setField(name, e.target.value),
    error: errors[name],
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-4"
      noValidate
    >
      <p className="rounded-xl bg-surface2/60 px-3.5 py-2.5 text-sm">
        Applying for: <span className="font-semibold">{kind}</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Name" required autoComplete="name" {...bind('name')} />
        <FormInput label="Email" type="email" required autoComplete="email" {...bind('email')} />
      </div>
      <FormInput label="Branch and year" required placeholder="e.g. Computer Science, 2nd year" {...bind('branchYear')} />
      <FormInput label="Skills" hint="Tools, languages or anything you are good at." {...bind('skills')} />
      <FormInput label="Portfolio, GitHub or LinkedIn" type="url" placeholder="https://" hint="Optional" {...bind('link')} />
      <Select
        label="Time you can give"
        required
        placeholder="Choose one"
        options={AVAILABILITY.map((a) => ({ value: a, label: a }))}
        {...bind('availability')}
      />
      <FormTextarea label="Why do you want to join?" required rows={4} {...bind('why')} />
      <div className="flex justify-end border-t border-line pt-4">
        <Button type="submit" loading={submitting} icon={<Send className="h-4 w-4" />}>
          Send application
        </Button>
      </div>
    </form>
  );
}
