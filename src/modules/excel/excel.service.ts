import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, catchError, concatMap, from, lastValueFrom, tap } from 'rxjs';
import BaseService from 'src/core/services/base.service';
import * as XLSX from 'xlsx';
import { ExcelJsonDto } from './excel.dto';

@Injectable()
export class ExcelService extends BaseService {
    async readExcel(file: Express.Multer.File) {
        try{
            const workbook = XLSX.readFile(file.path);
            const sheet_name_list = workbook.SheetNames;
            const jsonData: ExcelJsonDto[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            let arrayGroupGl: string[] = [];
            const groupGl: ExcelJsonDto[] = [];
            const mappingDataExcel: Observable<ExcelJsonDto> = from(jsonData).pipe(
                catchError((error) => {
                  throw new BadRequestException(error);
                }),
                concatMap((item)=> this.mappingData(item, arrayGroupGl, groupGl))
            )
            jsonData.length > 0 ? await lastValueFrom(mappingDataExcel) : undefined;
            return groupGl;
        } catch (error) {
            this.handleErrorService(error);
        }
    }

    async mappingData(item: ExcelJsonDto, arrayGroupGl: string[], groupGl: ExcelJsonDto[]){
        item.groupGl ? arrayGroupGl.push(item.groupDetail) : undefined;
        const parent = arrayGroupGl[arrayGroupGl.length -1 ];
        item.groupGl =  item.groupGl !=='' ? '' : parent;
        item.createdBy='984809';
        const findSameData: ExcelJsonDto = groupGl.find(itemFinding => itemFinding.glAccount === item.glAccount);
        const findSameDataObject: ExcelJsonDto = groupGl.find(
            itemFinding => 
                itemFinding.glAccount === item.glAccount && 
                itemFinding.groupDetail === item.groupDetail &&
                itemFinding.dinas === item.dinas
            );
        if(findSameDataObject) console.log(findSameDataObject);
        if(item.glAccount > 0 && !findSameData) groupGl.push(item);
        return item;
    }
}
