 
import axios from 'axios';
import { graphQLQuery } from './graphQL-query';

export class graphQLHelper {

async fetchGraphQL (
    operationsDoc: string,
    operationName: string,
    variables: any,
  ): Promise<any> {
    try {
      const result = await axios({
        url: process.env.HASURA_URL,
        headers: {
          'content-type': 'application/json',
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
        method: 'POST',
        data: {
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        },
      });
      return result.data;
    } catch (error) {
        console.error(error);
        return error;
    }
  }
  
  async executeInsert(obj: graphQLQuery) {
    const sanitisedObject: Partial<graphQLQuery> = {...obj};
    delete sanitisedObject.operationName;
    delete sanitisedObject.operationsDoc;
    delete sanitisedObject.variableName;
  
    return this.fetchGraphQL(obj.operationsDoc, obj.operationName, {
      [obj.variableName]: sanitisedObject,
    });
  }
  
  async startExecuteInsert(obj: graphQLQuery) {
    const {errors, data} = await this.executeInsert(obj);
  
    if (errors) {
      console.error(errors);
      return { errors: errors, data: null }
    } else { 
      console.log(data);
      return { errors: null, data: data }
    }
  }

}