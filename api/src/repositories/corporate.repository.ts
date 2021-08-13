import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Corporate, CorporateRelations} from '../models';

export class CorporateRepository extends DefaultCrudRepository<
  Corporate,
  typeof Corporate.prototype.id,
  CorporateRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Corporate, dataSource);
  }
}
