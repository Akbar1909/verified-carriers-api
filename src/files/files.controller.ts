import {
    Controller,
    Post,
    Get,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    Res,
  } from '@nestjs/common';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { FilesService } from './files.service';
  import { Response } from 'express';
  import { join } from 'path';
  
  @Controller('files')
  export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
            // new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      return this.filesService.create({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
      });
    }
  
    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
    async uploadMultipleFiles(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          ],
        }),
      )
      files: Express.Multer.File[],
    ) {
      const uploadedFiles = [];
      
      for (const file of files) {
        const createdFile = await this.filesService.create({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          mimeType: file.mimetype,
          size: file.size,
        });
        uploadedFiles.push(createdFile);
      }
      
      return uploadedFiles;
    }
  
    @Get()
    findAll() {
      return this.filesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.filesService.findOne(id);
    }
  
    @Get('download/:id')
    async download(@Param('id') id: string, @Res() res: Response) {
      const file = await this.filesService.findOne(id);
      return res.sendFile(file.filename, { root: './uploads' });
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.filesService.remove(id);
    }
  }