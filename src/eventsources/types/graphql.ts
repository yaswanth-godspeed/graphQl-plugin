import { GSCloudEvent, GSStatus, GSActor, PlainObject, GSEventSource } from "@godspeedsystems/core";
import { ApolloServer, gql } from 'apollo-server';
import loadYaml from '@godspeedsystems/core/dist/core/yamlLoader';
import { logger } from '@godspeedsystems/core/dist/logger';
import path from 'path';
import fs from 'fs-extra'

export default class EventSource extends GSEventSource {

  
  protected async initClient(): Promise<PlainObject> {
    return Promise.resolve(ApolloServer);
  }
  async subscribeToEvent(eventKey: string, eventConfig: PlainObject, processEvent: (event: GSCloudEvent, eventConfig: PlainObject) => Promise<GSStatus>): Promise<void> {
   
    const schemaFilePath = path.join(process.cwd(), "/src/eventsources/schema.graphql");
    const typeDefs = gql(fs.readFileSync(schemaFilePath, 'utf8'));
    async function loadEventsYaml(path: string) {
      try {
        return await loadYaml(path, true);
      } catch (ex) {
        logger.error('Error in reading events YAMLs', ex);
        process.exit(1);
      }
    }
    const eventPath = path.join(process.cwd(), "/src/events");
    let allResolvers = {};  // Initialize an empty object to store all resolvers

    const eventsSchema: PlainObject = await loadEventsYaml(eventPath);
    Object.keys(eventsSchema).forEach((event_info: any) => {
      let subquary = event_info.split('.')[2];
      subquary = subquary.replaceAll(/:([^\/]+)/g, '{$1}');
      const type_name = event_info.split('.')[1];

      let eventKey = event_info
      const resolvers = {
        [type_name]: {
          [subquary]: async () => {
            const event = new GSCloudEvent(
              "id",
              eventKey,
              new Date(),
              "Apollo",
              "1.0",
              {},
              "REST",
              new GSActor("user"),
              {}
            );
            let res = await processEvent(event, eventConfig);
            return res.data
          },
        }
      }
      Object.assign(allResolvers, resolvers);
    });
    let PORT = 3000;

    const server = new ApolloServer({
      typeDefs: typeDefs,

      resolvers: allResolvers,
    });

    server.listen({ port: PORT })
    return Promise.resolve();
  }
}


