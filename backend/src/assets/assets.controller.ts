import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AssetsService } from "./assets.service";
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from "./dto/asset.dto";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";

@ApiTags("assets")
@Controller("assets")
export class AssetsController {
  constructor(private service: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List all available assets (public)" })
  findAll(@Query() query: AssetQueryDto) {
    return this.service.findAll(query);
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, join(process.cwd(), 'uploads'));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async uploadFiles(@Request() req, @UploadedFiles() files: any[]) {
    // Log filenames and sizes for debugging
    if (files && files.length > 0) {
      console.log('Uploaded files:');
      files.forEach((f) => console.log(` - ${f.originalname} -> ${f.filename} (${f.size} bytes)`));
    } else {
      console.log('No files received in uploadFiles');
    }

    const host = req.protocol + '://' + req.get('host');
    const urls = (files || []).map((f) => `${host}/uploads/${f.filename}`);
    return { urls };
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List assets owned by current user" })
  findMine(@Request() req, @Query() query: AssetQueryDto) {
    return this.service.findByOwner(req.user.id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single asset by ID" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new asset" })
  create(@Request() req, @Body() dto: CreateAssetDto) {
    return this.service.create(req.user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update an owned asset" })
  update(@Param("id") id: string, @Request() req, @Body() dto: UpdateAssetDto) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an owned asset" })
  remove(@Param("id") id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }
}
