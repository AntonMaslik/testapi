import { TaskCreateRequestDto } from './task-create-request.dto';

describe('TaskCreateRequestDto', () => {
  it('should be defined', () => {
    expect(new TaskCreateRequestDto()).toBeDefined();
  });
});
