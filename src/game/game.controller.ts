import { Controller, Post, Get, Body } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('random-seed')
  randomSeed() {
    return { seed: this.gameService.getRandomSeed() };
  }

  @Post('validate')
  validate(@Body() body: { word?: string }) {
    const word = (body?.word ?? '').toString().trim();
    const valid = this.gameService.isValidWord(word);
    return { valid };
  }

  @Post('check')
  check(@Body() body: { guess?: string; word?: string; seed?: number }) {
    const guess = (body?.guess ?? body?.word ?? '').toString().trim();
    const seed =
      body?.seed != null ? Number(body.seed) : null;
    return this.gameService.checkGuess(guess, seed);
  }
}
