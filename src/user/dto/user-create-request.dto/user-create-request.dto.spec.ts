import { UserCreateRequestDto } from './user-create-request.dto';

describe('UserCreateRequestDto', () => {
  it('should be defined', () => {
    expect(new UserCreateRequestDto()).toBeDefined();
  });
});
