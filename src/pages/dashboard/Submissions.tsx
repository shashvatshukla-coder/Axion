import { useState, useMemo } from 'react';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Search,
  ExternalLink,
  Mail,
  Calendar,
  Sparkles,
  User,
  Copy,
  Check,
  Tag,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { ideaService } from '@/services/ideaService';
import { applicationService } from '@/services/applicationService';
import type { Idea, ClubApplication } from '@/types';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { formatDate } from '@/lib/utils';

type TabKey = 'ideas' | 'applications';

export default function Submissions() {
  const [activeTab, setActiveTab] = useState<TabKey>('ideas');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [selectedApp, setSelectedApp] = useState<ClubApplication | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ideasAsync = useAsync(() => ideaService.list(), []);
  const appsAsync = useAsync(() => applicationService.list(), []);

  const ideas = useMemo(() => ideasAsync.data || [], [ideasAsync.data]);
  const applications = useMemo(() => appsAsync.data || [], [appsAsync.data]);

  // Categories list for filtering
  const ideaCategories = useMemo(() => {
    const set = new Set(ideas.map((i) => i.category).filter(Boolean));
    return Array.from(set);
  }, [ideas]);

  const appKinds = useMemo(() => {
    const set = new Set(applications.map((a) => a.kind).filter(Boolean));
    return Array.from(set);
  }, [applications]);

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ideas.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.submittedBy,
        item.problem,
        item.category,
        item.stage,
        item.validation,
        ...(item.submission ? Object.values(item.submission) : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [ideas, search, categoryFilter]);

  // Filtered Applications
  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (categoryFilter !== 'ALL' && app.kind !== categoryFilter) return false;
      if (!q) return true;
      const vals = app.values || {};
      const haystack = [
        app.kind,
        vals.name,
        vals.email,
        vals.branchYear,
        vals.skills,
        vals.why,
        vals.availability,
        ...(Object.values(vals) || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [applications, search, categoryFilter]);

  // CSV Exporter
  const exportCSV = () => {
    let csv = '';
    const timestamp = new Date().toISOString().split('T')[0];

    if (activeTab === 'ideas') {
      const headers = ['ID', 'Title', 'Submitted By', 'Category', 'Validation', 'Stage', 'Date', 'Problem'];
      const rows = filteredIdeas.map((i) => [
        i.id,
        `"${(i.title || '').replace(/"/g, '""')}"`,
        `"${(i.submittedBy || '').replace(/"/g, '""')}"`,
        `"${(i.category || '').replace(/"/g, '""')}"`,
        i.validation,
        i.stage,
        i.date,
        `"${(i.problem || '').replace(/"/g, '""')}"`,
      ]);
      csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      downloadFile(csv, `axion-ideas-submissions-${timestamp}.csv`, 'text/csv;charset=utf-8;');
    } else {
      const headers = ['ID', 'Track / Role', 'Applicant Name', 'Email', 'Branch & Year', 'Skills', 'Availability', 'Link', 'Why Join'];
      const rows = filteredApps.map((a) => {
        const v = a.values || {};
        return [
          a.id,
          `"${(a.kind || '').replace(/"/g, '""')}"`,
          `"${(v.name || '').replace(/"/g, '""')}"`,
          `"${(v.email || '').replace(/"/g, '""')}"`,
          `"${(v.branchYear || '').replace(/"/g, '""')}"`,
          `"${(v.skills || '').replace(/"/g, '""')}"`,
          `"${(v.availability || '').replace(/"/g, '""')}"`,
          `"${(v.link || '').replace(/"/g, '""')}"`,
          `"${(v.why || '').replace(/"/g, '""')}"`,
        ];
      });
      csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      downloadFile(csv, `axion-club-applications-${timestamp}.csv`, 'text/csv;charset=utf-8;');
    }
  };

  // JSON Exporter
  const exportJSON = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const data = activeTab === 'ideas' ? filteredIdeas : filteredApps;
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, `axion-${activeTab}-${timestamp}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isLoading = ideasAsync.loading || appsAsync.loading;
  const isError = ideasAsync.error || appsAsync.error;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Submissions Hub</h1>
          <p className="mt-1 text-sm text-muted">
            Manage, review, and export inbound incubator proposals and club membership applications.
          </p>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="h-4 w-4 text-emerald-500" />}
            title="Download CSV report of current view"
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportJSON}
            icon={<FileJson className="h-4 w-4 text-sky-500" />}
            title="Export JSON records"
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4 space-y-1">
          <span className="text-xs text-muted">Total Ideas</span>
          <div className="text-2xl font-bold text-fg font-mono tabular-nums">{ideas.length}</div>
          <span className="text-xs text-muted">Incubator submissions</span>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-xs text-muted">Total Applications</span>
          <div className="text-2xl font-bold text-fg font-mono tabular-nums">{applications.length}</div>
          <span className="text-xs text-muted">Membership candidates</span>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-xs text-muted">Pending Review</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {ideas.filter((i) => i.validation === 'Pending').length + applications.length}
          </div>
          <span className="text-xs text-muted">Requires attention</span>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-xs text-muted">Validated Proposals</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {ideas.filter((i) => i.validation === 'Validated').length}
          </div>
          <span className="text-xs text-muted">Ready for execution</span>
        </div>
      </div>

      {/* Segmented Controls & Search Toolbar */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={activeTab}
            onChange={(val) => {
              setActiveTab(val as TabKey);
              setCategoryFilter('ALL');
            }}
            tabs={[
              { id: 'ideas', label: 'Startup & Project Ideas', count: ideas.length },
              { id: 'applications', label: 'Club Membership Applications', count: applications.length },
            ]}
          />

          <div className="text-xs text-muted font-mono tabular-nums">
            Showing {activeTab === 'ideas' ? filteredIdeas.length : filteredApps.length} records
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === 'ideas'
                  ? 'Search by title, submitter, problem, category...'
                  : 'Search by candidate name, email, skills, department...'
              }
              className="w-full rounded-xl border border-line bg-surface pl-9 pr-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="ALL">All Categories / Tracks</option>
              {activeTab === 'ideas'
                ? ideaCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                : appKinds.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
            </select>

            {(search || categoryFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('ALL');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Stream */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="card p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-line rounded w-3/4" />
              <div className="h-3 bg-line/60 rounded w-1/2" />
              <div className="h-16 bg-line/40 rounded w-full" />
              <div className="h-8 bg-line rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="card p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-semibold text-fg">Unable to load submissions</h3>
          <p className="text-sm text-muted">Please verify your administrator session.</p>
        </div>
      ) : activeTab === 'ideas' ? (
        filteredIdeas.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-muted mx-auto" />
            <h3 className="text-base font-semibold text-fg">No incubator ideas found</h3>
            <p className="text-sm text-muted">
              {search || categoryFilter !== 'ALL'
                ? 'Try adjusting your search query or category filters.'
                : 'Inbound startup ideas submitted on the public Incubator page will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => setSelectedIdea(idea)}
                className="card p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-glow border-line hover:border-accent/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-mono">{idea.id}</span>
                    <span>{formatDate(idea.date)}</span>
                  </div>

                  <h3 className="text-base font-semibold text-fg line-clamp-1">{idea.title}</h3>

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="text-fg font-medium">{idea.submittedBy}</span>
                    <span aria-hidden="true">·</span>
                    <span>{idea.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{idea.stage}</span>
                  </div>

                  <p className="text-xs text-muted line-clamp-3 leading-relaxed mt-2">{idea.problem}</p>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      idea.validation === 'Validated'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : idea.validation === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {idea.validation}
                  </span>

                  <span className="text-xs text-accent font-medium inline-flex items-center gap-1 group-hover:underline">
                    Inspect Details &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredApps.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <User className="h-8 w-8 text-muted mx-auto" />
          <h3 className="text-base font-semibold text-fg">No applications found</h3>
          <p className="text-sm text-muted">
            {search || categoryFilter !== 'ALL'
              ? 'Try adjusting your search query or track filter.'
              : 'Public membership submissions made via the Join Club page will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => {
            const vals = app.values || {};
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="card p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-glow border-line hover:border-accent/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-mono">{app.id}</span>
                    <span className="text-accent font-medium">{app.kind}</span>
                  </div>

                  <h3 className="text-base font-semibold text-fg">{vals.name || 'Unnamed Applicant'}</h3>

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{vals.email}</span>
                    {vals.branchYear && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{vals.branchYear}</span>
                      </>
                    )}
                  </div>

                  {vals.why && (
                    <p className="text-xs text-muted line-clamp-3 leading-relaxed mt-2">{vals.why}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                  <span className="text-muted flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vals.availability || 'Time flexible'}
                  </span>

                  <span className="text-accent font-medium inline-flex items-center gap-1">
                    Inspect Details &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Drawer for Ideas */}
      <Drawer
        open={selectedIdea !== null}
        onClose={() => setSelectedIdea(null)}
        title={selectedIdea?.title || 'Idea Proposal'}
        description={`Proposal ID: ${selectedIdea?.id || ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedIdea) {
                  downloadFile(
                    JSON.stringify(selectedIdea, null, 2),
                    `idea-${selectedIdea.id}.json`,
                    'application/json'
                  );
                }
              }}
              icon={<Download className="h-4 w-4" />}
            >
              Export Record
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedIdea) {
                  copyToClipboard(JSON.stringify(selectedIdea, null, 2), selectedIdea.id);
                }
              }}
              icon={
                copiedId === selectedIdea?.id ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              }
            >
              {copiedId === selectedIdea?.id ? 'Copied' : 'Copy JSON'}
            </Button>
          </div>
        }
      >
        {selectedIdea && (
          <div className="space-y-6 text-sm text-fg">
            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-surface2 px-2.5 py-1 text-xs font-medium text-fg">
                Category: {selectedIdea.category}
              </span>
              <span className="rounded-lg bg-surface2 px-2.5 py-1 text-xs font-medium text-fg">
                Stage: {selectedIdea.stage}
              </span>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                  selectedIdea.validation === 'Validated'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : selectedIdea.validation === 'Rejected'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                Validation: {selectedIdea.validation}
              </span>
            </div>

            {/* Submitter & Date */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-line bg-surface p-4">
              <div>
                <span className="text-xs text-muted block">Submitted By</span>
                <span className="font-medium text-fg mt-0.5 block">{selectedIdea.submittedBy}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Date Received</span>
                <span className="font-medium text-fg mt-0.5 block font-mono">{formatDate(selectedIdea.date)}</span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Problem Statement</h4>
              <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedIdea.problem}
              </div>
            </div>

            {/* Complete Submission Payload */}
            {selectedIdea.submission && Object.keys(selectedIdea.submission).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Full Submission Questionnaire
                </h4>
                <div className="rounded-xl border border-line bg-surface divide-y divide-line overflow-hidden">
                  {Object.entries(selectedIdea.submission).map(([k, v]) => (
                    <div key={k} className="p-3.5 space-y-1">
                      <span className="text-xs font-medium text-muted capitalize">
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="text-sm text-fg whitespace-pre-wrap">{v || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Detail Drawer for Applications */}
      <Drawer
        open={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
        title={selectedApp?.values?.name || 'Club Application'}
        description={`Track: ${selectedApp?.kind || 'General'} · ID: ${selectedApp?.id || ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedApp) {
                  downloadFile(
                    JSON.stringify(selectedApp, null, 2),
                    `application-${selectedApp.id}.json`,
                    'application/json'
                  );
                }
              }}
              icon={<Download className="h-4 w-4" />}
            >
              Export Record
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedApp) {
                  copyToClipboard(JSON.stringify(selectedApp, null, 2), selectedApp.id);
                }
              }}
              icon={
                copiedId === selectedApp?.id ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              }
            >
              {copiedId === selectedApp?.id ? 'Copied' : 'Copy JSON'}
            </Button>
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-6 text-sm text-fg">
            {/* Quick Contact & Action Card */}
            <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted block">Applicant Name</span>
                  <span className="font-semibold text-fg text-base">{selectedApp.values?.name || '—'}</span>
                </div>
                <span className="rounded-lg bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 text-xs font-medium">
                  {selectedApp.kind}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line text-xs">
                {selectedApp.values?.email && (
                  <a
                    href={`mailto:${selectedApp.values.email}`}
                    className="flex items-center gap-2 text-accent hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{selectedApp.values.email}</span>
                  </a>
                )}
                {selectedApp.values?.link && (
                  <a
                    href={selectedApp.values.link.startsWith('http') ? selectedApp.values.link : `https://${selectedApp.values.link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-accent hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span>Portfolio / Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Key Qualifications */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-line bg-surface p-4">
              <div>
                <span className="text-xs text-muted block">Branch & Year</span>
                <span className="font-medium text-fg mt-0.5 block">
                  {selectedApp.values?.branchYear || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted block">Time Availability</span>
                <span className="font-medium text-fg mt-0.5 block">
                  {selectedApp.values?.availability || 'Not specified'}
                </span>
              </div>
            </div>

            {/* Skills */}
            {selectedApp.values?.skills && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Skills & Expertise</h4>
                <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed">
                  {selectedApp.values.skills}
                </div>
              </div>
            )}

            {/* Why Join */}
            {selectedApp.values?.why && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Motivation & Goals</h4>
                <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedApp.values.why}
                </div>
              </div>
            )}

            {/* Dynamic Raw Fields */}
            {selectedApp.values && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">All Form Fields</h4>
                <div className="rounded-xl border border-line bg-surface divide-y divide-line overflow-hidden">
                  {Object.entries(selectedApp.values).map(([k, v]) => (
                    <div key={k} className="p-3.5 space-y-1">
                      <span className="text-xs font-medium text-muted capitalize">
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="text-sm text-fg whitespace-pre-wrap">{v || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
