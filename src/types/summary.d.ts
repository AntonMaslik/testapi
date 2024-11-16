import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';

export type SummaryInfo = {
    countTaskAll: number;
    countTaskCompleted: number;
    countTaskNotCompleted: number;
    countTaskLast30Days: number;
    countTaskLast7Days: number;
    countTaskLast24Hours: number;
    workspaces: WorkspaceEntity[];
};
