import { useState } from 'react';
import { Send } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { useForm, validateRequired } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { ChoiceGroup, FormInput, FormTextarea, Select } from '@/components/common/FormInput';
import { SuccessPanel } from '@/components/forms/SuccessPanel';

const PROJECT_TYPES = ['Web', 'Mobile', 'AI', 'UI/UX', 'Automation', 'Other'];

const BUDGETS = [
  'Under ₹50,000',
  '₹50,000 to ₹1,00,000',
  '₹1,00,000 to ₹3,00,000',
  '₹3,00,000 to ₹10,00,000',
  'Not sure yet',
];

const TIMELINES = ['Under 1 month', '1 to 2 months', '2 to 4 months', 'More than 4 months', 'Flexible'];

const INITIAL = {
  name: '',
  organization: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
  description: '',
  features: '',
};

export function ClientProjectForm({ onDone }: { onDone?: () => void }) {
  const { values, errors, setField, setErrors, reset } = useForm(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const toast = useToast();

  const submit = async () => {
    const found = validateRequired(
      values,
      ['name', 'organization', 'email', 'projectType', 'budget', 'timeline', 'description'],
      ['email'],
    );
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await clientService.submitRequest(values);
      setReference(res.reference);
      toast.success('Request sent. The agency team will reply within two working days.');
    } catch {
      toast.error('We could not send your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <SuccessPanel
        title="Request received"
        message="Thank you. A delivery lead will read your brief and reply with questions or a proposal within two working days."
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
              Send another request
            </Button>
            {onDone && <Button variant="agency" onClick={onDone}>Done</Button>}
          </>
        }
      />
    );
  }

  const text = (name: keyof typeof INITIAL) => ({
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
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Your name" required autoComplete="name" {...text('name')} />
        <FormInput label="Organization" required autoComplete="organization" {...text('organization')} />
        <FormInput label="Email" type="email" required autoComplete="email" {...text('email')} />
        <FormInput label="Phone" type="tel" autoComplete="tel" hint="Optional" {...text('phone')} />
      </div>

      <ChoiceGroup
        label="Project type"
        required
        options={PROJECT_TYPES}
        value={values.projectType}
        onChange={(v) => setField('projectType', v)}
        error={errors.projectType}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Budget"
          required
          placeholder="Choose a range"
          options={BUDGETS.map((b) => ({ value: b, label: b }))}
          {...text('budget')}
        />
        <Select
          label="Timeline"
          required
          placeholder="Choose a timeline"
          options={TIMELINES.map((t) => ({ value: t, label: t }))}
          {...text('timeline')}
        />
      </div>

      <FormTextarea
        label="Project description"
        required
        hint="What do you want built, and what problem should it solve?"
        {...text('description')}
      />
      <FormTextarea label="Required features" rows={3} hint="One per line is fine." {...text('features')} />

      <div className="flex justify-end border-t border-line pt-4">
        <Button type="submit" variant="agency" loading={submitting} icon={<Send className="h-4 w-4" />}>
          Submit request
        </Button>
      </div>
    </form>
  );
}
