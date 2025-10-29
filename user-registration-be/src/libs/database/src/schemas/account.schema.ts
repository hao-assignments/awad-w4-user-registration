import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

type IAccount = {
  username: string;
  email: string;
  password: string;
};

@Schema({
  collection: 'accounts',
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Account extends Document implements IAccount {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
