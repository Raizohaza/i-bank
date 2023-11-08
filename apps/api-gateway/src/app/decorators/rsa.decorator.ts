import { SetMetadata } from '@nestjs/common';

export const Verify = (secured: boolean) => SetMetadata('Verify', secured);
