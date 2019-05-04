import { Project } from "../../models/Project";
import { User } from "../../models/User";
import { CommandDto } from "./base/CommandDto";
import { UserRole } from "../../models/enums/UserRole";
import { IsMongoId, IsString, MaxLength, IsEmail, Length, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ObjectId } from "mongodb";

export class ProjectCmdDto extends CommandDto<Project> {
    @IsString() @Length(3, 300) title: string;
    @IsDateString() date: string;
    @IsString() @MaxLength(500) location: string;
    @IsString() @MaxLength(3000) @IsOptional() notes: string;
    @IsNumber() quotation: number;
    @IsNumber() aditionalItemPrice: number;
    @IsMongoId() clientId: string;

    toEntity(): Project {
        return new Project({
            title: this.title,
            date: new Date(this.date),
            location: this.location,
            notes: this.notes,
            client: new ObjectId(this.clientId)
        });
    }
}
