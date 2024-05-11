import { Controller } from '@nestjs/common';
import { SocialsService } from './socials.service';

@Controller('socials')
export class SocialsController {
  constructor(private _socialsService: SocialsService) {}
}
