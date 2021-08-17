import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {DonateDevice} from '../models';
import {DonateDeviceRepository} from '../repositories';
import sendSMS from './../utils/sendSMS';
import {DonateDevice as DonateDeviceType} from './donate-device-graphQL-model';
import {graphQLHelper} from './graphQL-helper';
import {Corporate as CorporateType} from './corporate-graphQL-model';
import {CorporateDevices as CorporateDevicesType} from './corporate-devices-graphQL-model';

export class DonateDeviceController {
  constructor(
    @repository(DonateDeviceRepository)
    public donateDeviceRepository: DonateDeviceRepository
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
    const instanceID = donateDevice.data[0]?.instanceID;
    const trackingKey = instanceID
      .split(':')?.[1]
      ?.split('-')?.[0]
      .toUpperCase();
    const data = donateDevice?.data?.[0];
    const smsBody = `You have successfully registered for donating your smartphone as part of "Baccho ka Sahara, Phone Humara" campaign. Your tracking ID is ${trackingKey}. You can use this ID to track the status of delivery for your donated device.\n\n- Samagra Shiksha, Himachal Pradesh`;
    const contactNumber = data.contact;
    const smsDispatchResponse = sendSMS(smsBody, trackingKey, contactNumber,process.env.DONATE_DEVICES_TEMPLATE_ID);

    data.trackingKey = trackingKey;
    const donateDeviceType = new DonateDeviceType(data);
    const gQLHelper = new graphQLHelper();
    if (donateDeviceType.phone_number) {
      const {errors, data: gqlResponse} = await gQLHelper.startExecuteInsert(
        donateDeviceType,
      );
      if (errors) {
        console.error(errors);
      } else {
        console.log(gqlResponse);
      }
    }
    return this.donateDeviceRepository.create(donateDevice);
  }

  @post('/donate-devices-corporate')
  @response(200, {
    description: 'Corporate model instance',
    content: {'application/json': {schema: getModelSchemaRef(DonateDevice)}},
  })
  async createCorporate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DonateDevice, {
            title: 'NewSurvay',
            exclude: ['id'],
          }),
        },
      },
    })
    corporateResponce: Omit<DonateDevice, 'id'>,
  ): Promise<DonateDevice> {
    let instanceID = corporateResponce.data[0]?.instanceID;
    instanceID = instanceID
      .split(':')?.[1]
      ?.split('-')?.[0]
      .toUpperCase();
    const data = corporateResponce?.data?.[0];
    data.instanceID = instanceID;
    const corporateType = new CorporateType(data);
    const gQLHelper = new graphQLHelper();

    if (corporateType.poc_phone_number) {
      const {errors, data: gqlResponse} = await gQLHelper.startExecuteInsert(
        corporateType,
      );
      if (errors) {
        console.error(errors);
      } else {
        let trackingKeys: String[] = [];
        for(let i = 0; i < gqlResponse.insert_device_donation_corporates_one.quantity_of_devices; i++ ) {
          let r = (Math.random() + 1).toString(36).substring(4).toUpperCase();
          trackingKeys = [...trackingKeys,r];
          const corporateDevicesType = new CorporateDevicesType({"trackingKey":r,'companyId':gqlResponse.insert_device_donation_corporates_one.company_id});
          const {errors, data: cdGqlResponse} = await gQLHelper.startExecuteInsert(
            corporateDevicesType,
          );
          if (errors) {
            console.error(errors);
          } else {
            console.log(cdGqlResponse);
          }
        }
        
        const smsBody = `Congratulations! You have successfully registered for donating ${gqlResponse.insert_device_donation_corporates_one.quantity_of_devices} smartphones as part of the "Digital Saathi" campaign. \nPlease note your tracking IDs: ${instanceID}. You can use these IDs to track the status of delivery for your donated smartphones. Contact 1800-180-8190 for any assistance.\n\n- Samagra Shiksha, Himachal Pradesh`;

        const contactNumber = corporateType.poc_phone_number;
        const smsDispatchResponse = sendSMS(smsBody, instanceID, contactNumber, process.env.DONATE_DEVICES_CORPORATE_TEMPLATE_ID);
        smsDispatchResponse.then((e) => {
          console.log(e);
        });
      }
    }
    return this.donateDeviceRepository.create(corporateResponce);
  }
  
  // @get('/donate-devices/count')
  // @response(200, {
  //   description: 'DonateDevice model count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async count(
  //   @param.where(DonateDevice) where?: Where<DonateDevice>,
  // ): Promise<Count> {
  //   return this.donateDeviceRepository.count(where);
  // }

  // @patch('/donate-devices')
  // @response(200, {
  //   description: 'DonateDevice PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DonateDevice, { partial: true }),
  //       },
  //     },
  //   })
  //   donateDevice: DonateDevice,
  //   @param.where(DonateDevice) where?: Where<DonateDevice>,
  // ): Promise<Count> {
  //   return this.donateDeviceRepository.updateAll(donateDevice, where);
  // }

  // @get('/donate-devices/{id}')
  // @response(200, {
  //   description: 'DonateDevice model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(DonateDevice, { includeRelations: true }),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(DonateDevice, { exclude: 'where' }) filter?: FilterExcludingWhere<DonateDevice>
  // ): Promise<DonateDevice> {
  //   return this.donateDeviceRepository.findById(id, filter);
  // }

  // @patch('/donate-devices/{id}')
  // @response(204, {
  //   description: 'DonateDevice PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(DonateDevice, { partial: true }),
  //       },
  //     },
  //   })
  //   donateDevice: DonateDevice,
  // ): Promise<void> {
  //   await this.donateDeviceRepository.updateById(id, donateDevice);
  // }

  // @put('/donate-devices/{id}')
  // @response(204, {
  //   description: 'DonateDevice PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() donateDevice: DonateDevice,
  // ): Promise<void> {
  //   await this.donateDeviceRepository.replaceById(id, donateDevice);
  // }

  // @del('/donate-devices/{id}')
  // @response(204, {
  //   description: 'DonateDevice DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.donateDeviceRepository.deleteById(id);
  // }
}
