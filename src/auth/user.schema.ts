import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EPermissions, Permission } from './permission.schema';

export interface IJwtPayload {
  username: string;
  permissions: string[];
}

export const ERoles = {
  ADMIN: Object.values(EPermissions),
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  @Type(() => Permission)
  permissions: Permission[];
}

export const UserSchema = SchemaFactory.createForClass(User);
