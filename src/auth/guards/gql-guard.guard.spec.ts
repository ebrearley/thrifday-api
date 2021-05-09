import { GqlAuthGuard } from './gql-guard.guard';

describe('GqlGuardGuard', () => {
  it('should be defined', () => {
    expect(new GqlAuthGuard()).toBeDefined();
  });
});
