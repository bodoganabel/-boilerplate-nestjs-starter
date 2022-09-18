import { IsOptional } from 'class-validator';
import {
  IAluminiumShutter,
  IAluminiumSzunyoghalosShutter,
  IShutter,
} from '../shutter.schema';

export class UpdateShutterDto {
  @IsOptional()
  muanyag: IShutter;
  @IsOptional()
  muanyagSzunyoghalos: IShutter;
  @IsOptional()
  aluminium: IAluminiumShutter;
  @IsOptional()
  aluminiumSzunyoghalos: IAluminiumSzunyoghalosShutter;
  @IsOptional()
  mobilSzunyoghalo: IShutter;
}
