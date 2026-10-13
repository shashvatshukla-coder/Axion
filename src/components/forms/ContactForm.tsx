import { useState } from 'react';
import { Send } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { useForm, validateRequired } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { FormInput, FormTextarea, Select } from '@/components/common/FormInput';
import { SuccessPanel } from '@/components/forms/SuccessPanel';

const INITIAL = { name: '', email: '', topic: '', message: '' };
const TOPICS = ['General question', 'Hire the agency', 'Partnership or collaboration', 'Press', 'Something else'];

export function ContactForm() {
  const { values, errors, setField, setErrors, reset } = useForm(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const submit = async () => {
    const found = validateRequired(values, ['name', 'email', 'topic', 'message'], ['email']);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await clientService.sendMessage(values);
      setSent(true);
      toast.success('Message sent.');
    } catch {
      toast.error('We could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <SuccessPanel
        title="Message sent"
        message="Thanks for getting in touch. We usually reply within two working days."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              setSent(false);
            }}
          >
            Send another message
          </Button>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="Name" required autoComplete="name" {...bind('name')} />
        <FormInput label="Email" type="email" required autoComplete="email" {...bind('email')} />
      </div>
      <Select
        label="Topic"
        required
        placeholder="What is this about?"
        options={TOPICS.map((t) => ({ value: t, label: t }))}
        {...bind('topic')}
      />
      <FormTextarea label="Message" required rows={5} {...bind('message')} />
      <div className="flex justify-end">
        <Button type="submit" loading={submitting} icon={<Send className="h-4 w-4" />}>
          Send message
        </Button>
      </div>
    </form>
  );
}
