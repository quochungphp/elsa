import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from "@nestjs/swagger";
import { IsArray } from "class-validator";

class PageMetaDto {
  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly itemsPerPage: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly currentPage: boolean;
}
class PageLinkDto {
  @ApiProperty()
  readonly first: string;

  @ApiProperty()
  readonly previous: string;

  @ApiProperty()
  readonly next: string;

  @ApiProperty()
  readonly last: string;

  @ApiProperty()
  readonly currentPage: boolean;
}
class PageDto<T> {
  @ApiProperty()
  readonly status: "success";

  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  @ApiProperty({ type: () => PageLinkDto })
  readonly link: PageLinkDto;
  constructor(data: T[], meta: PageMetaDto, link: PageLinkDto) {
    this.data = data;
    this.meta = meta;
    this.link = link;
  }
}
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiOkResponse({
      description: "Successfully received model list",
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};
