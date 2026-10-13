import { CreateRecord } from "@/components/common/CreateRecord";
import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Progress } from "@/components/common/Progress";
import { AvatarStack } from "@/components/common/Avatar";
import { Drawer } from "@/components/common/Drawer";
import { ProjectDetails } from "@/components/common/ProjectDetails";

const columns: Column<Project>[] = [
  {
    key: "name",
    header: "Project",
    render: (p) => (
      <div className="min-w-[10rem]">
        <p className="font-medium">{p.name}</p>
        <p className="text-xs text-muted">{p.type}</p>
      </div>
    ),
  },
  {
    key: "client",
    header: "Client",
    hideBelow: "md",
    render: (p) => <span>{p.client ?? "—"}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (p) => <StatusBadge status={p.status} />,
  },
  {
    key: "progress",
    header: "Progress",
    hideBelow: "sm",
    className: "w-44",
    render: (p) => <Progress value={p.progress} tone="agency" showLabel />,
  },
  {
    key: "members",
    header: "Members",
    hideBelow: "lg",
    render: (p) => <AvatarStack names={p.members} />,
  },
];

export default function AgencyProjects() {
  usePageTitle("Agency projects");
  const state = useAsync(() => projectService.list(), []);
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <CreateRecord resource="projects" onCreated={state.reload} />
      <PageHeader
        title="Agency projects"
        description="Paid client work, from kickoff to handover. Select a row for details."
      />
      <AsyncView state={state} skeleton={<TableSkeleton />}>
        {(all) => (
          <DataTable
            columns={columns}
            rows={all.filter((p) => p.division === "Agency")}
            rowKey={(p) => p.id}
            onRowClick={setSelected}
            searchText={(p) =>
              `${p.name} ${p.client ?? ""} ${p.type} ${p.tech.join(" ")}`
            }
            searchPlaceholder="Search projects"
          />
        )}
      </AsyncView>
      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name}
        description={selected?.client}
      >
        {selected && <ProjectDetails project={selected} />}
      </Drawer>
    </>
  );
}
