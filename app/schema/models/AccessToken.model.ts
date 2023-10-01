import { Table, Column, Model, PrimaryKey, DataType, CreatedAt, ForeignKey } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import User from './User.model';

export enum Providers {
  SELF = 'self',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter'
}

interface AccessTokenAttributes {
  readonly id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  provider: Providers;
  expiredAt: Date;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;
}
export interface AccessTokenInput extends Optional<Omit<AccessTokenAttributes, 'id' | 'createdAt'>, 'refreshToken'> { }
export interface AccessTokenOutput extends AccessTokenAttributes { }


@Table({
  timestamps: true,
  paranoid: true,
  modelName: 'AccessToken',
  tableName: 'access_tokens',
  underscored: true,
})
export default class AccessToken extends Model<AccessTokenAttributes, AccessTokenInput> implements AccessTokenAttributes {

  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  readonly id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  accessToken !: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  refreshToken !: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: Providers.SELF
  })
  provider !: Providers;

  @CreatedAt
  expiredAt!: Date;

  @CreatedAt
  createdAt!: Date;
};