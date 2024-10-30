import { WorkspaceEntity } from './workspace.entity';

describe('Workspace', () => {
  it('should be defined', () => {
    expect(new WorkspaceEntity()).toBeDefined();
  });
});
