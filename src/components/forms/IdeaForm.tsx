import { useState } from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { ideaService } from '@/services/ideaService';
import { useForm, validateRequired } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { ChoiceGroup, FormInput, FormTextarea, Select } from '@/components/common/FormInput';
import { SuccessPanel } from '@/components/forms/SuccessPanel';
import { cn } from '@/lib/utils';

const STEPS = [
  'Basic information',
  'Problem',
  'Target users',
  'Current alternatives',
  'Proposed solution',
  'Team details',
  'Submit',
];

const REQUIRED: string[][] = [
  ['name', 'email', 'title', 'category'],
  ['problem', 'whoFaces'],
  ['audience', 'audienceSize'],
  ['alternatives', 'whyNotEnough'],
  ['solution', 'different'],
  ['teamSize', 'skillsNeeded'],
  ['consent'],
];

const CATEGORIES = ['Campus', 'EdTech', 'HealthTech', 'AgriTech', 'FinTech', 'Commerce', 'Logistics', 'Mobility', 'MSME', 'Other'];

const INITIAL = {
  name: '',
  email: '',
  title: '',
  category: '',
  problem: '',
  whoFaces: '',
  audience: '',
  audienceSize: '',
  alternatives: '',
  whyNotEnough: '',
  solution: '',
  different: '',
  teamSize: '',
  skillsNeeded: '',
  consent: '',
};

export function IdeaForm({ onDone }: { onDone?: () => void }) {
  const { values, errors, setField, setErrors, reset } = useForm(INITIAL);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const toast = useToast();

  const validateStep = (index: number): boolean => {
    const found = validateRequired(values, REQUIRED[index], index === 0 ? ['email'] : []);
    if (index === 6 && values.consent !== 'yes') found.consent = 'Please confirm before submitting.';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    try {
      const res = await ideaService.submit(values);
      setReference(res.id);
      toast.success('Idea submitted. The validation team will review it.');
    } catch {
      toast.error('We could not submit your idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <SuccessPanel
        title="Idea received"
        message="Thanks for sharing it. The validation team reviews new ideas every week and will email you with next steps."
        reference={reference}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                reset();
                setStep(0);
                setReference(null);
              }}
            >
              Submit another idea
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
        if (step === STEPS.length - 1) void submit();
        else next();
      }}
      className="space-y-6"
      noValidate
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span className="font-mono uppercase tracking-wider">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="font-medium text-fg">{STEPS[step]}</span>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-accent' : 'bg-surface2')} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {step === 0 && (
          <>
            <FormInput label="Your name" required autoComplete="name" {...bind('name')} />
            <FormInput label="Email" type="email" required autoComplete="email" {...bind('email')} />
            <FormInput label="Idea title" required hint="A short name is fine. You can change it later." {...bind('title')} />
            <Select
              label="Category"
              required
              placeholder="Choose a category"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              {...bind('category')}
            />
          </>
        )}

        {step === 1 && (
          <>
            <FormTextarea
              label="What is the problem?"
              required
              hint="Describe what goes wrong today, in plain words."
              {...bind('problem')}
            />
            <FormTextarea label="Who faces it, and how often?" required rows={3} {...bind('whoFaces')} />
          </>
        )}

        {step === 2 && (
          <>
            <FormTextarea label="Who are the target users?" required rows={3} {...bind('audience')} />
            <ChoiceGroup
              label="Roughly how many people could use this?"
              required
              options={['Under 100', '100 to 1,000', '1,000 to 10,000', 'More than 10,000']}
              value={values.audienceSize}
              onChange={(v) => setField('audienceSize', v)}
              error={errors.audienceSize}
            />
          </>
        )}

        {step === 3 && (
          <>
            <FormTextarea
              label="How do people solve this today?"
              required
              hint="Apps, spreadsheets, asking a friend, doing nothing. All count."
              {...bind('alternatives')}
            />
            <FormTextarea label="Why is that not good enough?" required rows={3} {...bind('whyNotEnough')} />
          </>
        )}

        {step === 4 && (
          <>
            <FormTextarea label="What would you build?" required {...bind('solution')} />
            <FormTextarea label="What makes it different from what exists?" required rows={3} {...bind('different')} />
          </>
        )}

        {step === 5 && (
          <>
            <ChoiceGroup
              label="How many people are on your team right now?"
              required
              options={['Just me', '2 to 3', '4 to 6', 'More than 6']}
              value={values.teamSize}
              onChange={(v) => setField('teamSize', v)}
              error={errors.teamSize}
            />
            <FormTextarea
              label="What skills do you still need?"
              required
              rows={3}
              hint="For example: mobile developer, designer, someone who knows the industry."
              {...bind('skillsNeeded')}
            />
          </>
        )}

        {step === 6 && (
          <>
            <div className="space-y-2 rounded-xl border border-line bg-surface2/50 p-4 text-sm">
              <p className="eyebrow">Review</p>
              <p>
                <span className="text-muted">Idea:</span> {values.title}
              </p>
              <p>
                <span className="text-muted">Category:</span> {values.category}
              </p>
              <p className="line-clamp-3">
                <span className="text-muted">Problem:</span> {values.problem}
              </p>
              <p className="line-clamp-3">
                <span className="text-muted">Solution:</span> {values.solution}
              </p>
              <p>
                <span className="text-muted">Team:</span> {values.teamSize}
              </p>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={values.consent === 'yes'}
                  onChange={(e) => setField('consent', e.target.checked ? 'yes' : '')}
                  className="mt-0.5 h-4 w-4 rounded border-line accent-[rgb(var(--accent))]"
                />
                <span>I agree to be contacted about this idea and to share it with the validation team.</span>
              </label>
              {errors.consent && (
                <p className="mt-1.5 text-xs text-bad" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <Button variant="ghost" onClick={back} disabled={step === 0 || submitting} icon={<ArrowLeft className="h-4 w-4" />}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="submit">
            Next <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button type="submit" loading={submitting} icon={<Send className="h-4 w-4" />}>
            Submit idea
          </Button>
        )}
      </div>
    </form>
  );
}
