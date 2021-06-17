import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {DonateDevice} from '../models';
import {DonateDeviceRepository} from '../repositories';

export class DonateDeviceController {
  constructor(
    @repository(DonateDeviceRepository)
    public donateDeviceRepository : DonateDeviceRepository,
  ) {}

  @post('/donate-devices')
  @response(200, {
    description: 'DonateDevice model instance',
    content: {'application/json': {schema: getModelSchemaRef(DonateDevice)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DonateDevice, {
            title: 'NewDonateDevice',
            exclude: ['id'],
          }),
        },
      },
    })
    donateDevice: Omit<DonateDevice, 'id'>,
  ): Promise<DonateDevice> {
    return this.donateDeviceRepository.create(donateDevice);
  }

  @get('/donate-devices/count')
  @response(200, {
    description: 'DonateDevice model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(DonateDevice) where?: Where<DonateDevice>,
  ): Promise<Count> {
    return this.donateDeviceRepository.count(where);
  }

  @get('/donate-devices')
  @response(200, {
    description: 'Array of DonateDevice model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DonateDevice, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DonateDevice) filter?: Filter<DonateDevice>,
  ): Promise<DonateDevice[]> {
    return this.donateDeviceRepository.find(filter);
  }

  @patch('/donate-devices')
  @response(200, {
    description: 'DonateDevice PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DonateDevice, {partial: true}),
        },
      },
    })
    donateDevice: DonateDevice,
    @param.where(DonateDevice) where?: Where<DonateDevice>,
  ): Promise<Count> {
    return this.donateDeviceRepository.updateAll(donateDevice, where);
  }

  @get('/donate-devices/{id}')
  @response(200, {
    description: 'DonateDevice model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DonateDevice, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DonateDevice, {exclude: 'where'}) filter?: FilterExcludingWhere<DonateDevice>
  ): Promise<DonateDevice> {
    return this.donateDeviceRepository.findById(id, filter);
  }

  @patch('/donate-devices/{id}')
  @response(204, {
    description: 'DonateDevice PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DonateDevice, {partial: true}),
        },
      },
    })
    donateDevice: DonateDevice,
  ): Promise<void> {
    await this.donateDeviceRepository.updateById(id, donateDevice);
  }

  @put('/donate-devices/{id}')
  @response(204, {
    description: 'DonateDevice PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() donateDevice: DonateDevice,
  ): Promise<void> {
    await this.donateDeviceRepository.replaceById(id, donateDevice);
  }

  @del('/donate-devices/{id}')
  @response(204, {
    description: 'DonateDevice DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.donateDeviceRepository.deleteById(id);
  }
}