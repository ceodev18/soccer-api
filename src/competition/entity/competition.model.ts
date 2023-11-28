import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class Competition {
  _id?: mongoose.Types.ObjectId;
  name: string;
  code: string;
  areaCode: string;

  constructor(init: { _id?: mongoose.Types.ObjectId; name: string; code: string; areaCode: string }) {
    this._id = init._id || new mongoose.Types.ObjectId();
    this.name = init.name;
    this.code = init.code;
    this.areaCode = init.areaCode;
  }
}

export interface CompetitionModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  areaCode: string;
}
export const CompetitionSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    code: { required: true, type: String },
    areaCode: { required: true, type: String },
  }
);
CompetitionSchema.virtual('teams', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'competitions',
  justOne: false,
});
export const CompetitionModel = mongoose.model<CompetitionModel>('Competition', CompetitionSchema);

