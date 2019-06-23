import { Project } from "../models/Project";
import { CommandDto } from "./base/CommandDto";
import { IsString, MaxLength, IsEmail, Length, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ClientCmdDto } from "./ClientCmdDto";

export class ProjectCmdDto extends CommandDto<Project> {
    @IsString() @Length(3, 300) title: string;
    @IsDateString() date: string;
    @IsString() @MaxLength(500) location: string;
    @IsString() @MaxLength(3000) @IsOptional() notes: string;
    @IsNumber() quotation: number;
    @IsNumber() aditionalItemPrice: number;
    @IsString() @Length(2, 200) client: ClientCmdDto;
    @IsNumber() quantity: number;

    toEntity(): Project {
        return new Project({
            title: this.title,
            date: new Date(this.date),
            location: this.location,
            notes: this.notes,
            quantity: this.quantity,
            quotation: this.quotation,
            aditionalItemPrice: this.aditionalItemPrice,
            client: this.client.toEntity()
        });
    }
}
