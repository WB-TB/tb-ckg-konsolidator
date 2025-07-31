import { All, Controller, Get, Logger, Param, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Konsolidator Endpoints')
@Controller() // Menangkap semua request dari root path
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxyService: ProxyService) {}

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/skrining')
  async proxySitbSkrinigPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'skrining', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/skrining')
  async proxySitbSkriningGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'skrining', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/terduga')
  async proxySitbTerdugaPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'terduga', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/terduga')
  async proxySitbTerdugaGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'terduga', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/identitas-terduga')
  async proxySitbIdentitasTerdugaPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'identitas-terduga', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/identitas-terduga')
  async proxySitbIdentitasTerdugaGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'identitas-terduga', env);
  }
  
  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/permintaan-lab')
  async proxySitbPermintaanLabPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'permintaan-lab', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/permintaan-lab')
  async proxySitbPermintaanLabGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'permintaan-lab', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/hasil-lab')
  async proxySitbHasilLabPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'hasil-lab', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/hasil-lab')
  async proxySitbHasilLabGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'hasil-lab', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/sitb/konfirmasi-kasus')
  async proxySitbKonfirmasiKasusPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'konfirmasi-kasus', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/sitb/konfirmasi-kasus')
  async proxySitbKonfirmasiKasusGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[SITB][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'sitb', 'konfirmasi-kasus', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Post('/:env/ckg/update-pasien-tb')
  async proxyCkgUpdatePasienTbPost(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log(`[CKG][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'ckg', 'update-pasien-tb', env);
  }

  @ApiParam({
    name: 'env',
    description: "Environment target ('dev' atau 'prod')",
    enum: ['dev', 'prod'],
  })
  @Get('/:env/ckg/update-pasien-tb')
  async proxyCkgUpdatePasienTbGet(
    @Param('env') env: string,
    @Req() req: Request,
    @Res() res: Response,
    // @Query('id') id: string,
    // @Query('nik') nik: string,
  ) {
    this.logger.log(`[CKG][${env.toUpperCase()}] Konsolidasi request dari ${req.originalUrl}`);
    return this.proxyService.proxyRequest(req, res, 'ckg', 'update-pasien-tb', env);
  }
}