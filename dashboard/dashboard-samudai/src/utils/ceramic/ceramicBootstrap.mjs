import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays';
import { writeFile } from 'fs/promises';

const bootStrap = async () => {
  // The key must be provided as an environment variable
  const seed = new Uint8Array([
    173, 225, 253, 169, 141, 67, 152, 38, 76, 148, 48, 93, 9, 65, 178, 154, 130, 248, 170,
    6, 41, 173, 167, 132, 244, 158, 195, 64, 38, 192, 236, 171,
  ]);
  // Create and authenticate the DID
  const did = new DID({
    provider: new Ed25519Provider(seed),
    resolver: getResolver(),
  });
  await did.authenticate();

  // Connect to the local Ceramic node
  const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com');
  ceramic.did = did;

  const vcSchemaId = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'VerificationCredential',
    type: 'object',
    properties: {
      vcs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            issuanceDate: {
              type: 'string',
              title: 'Issuance Date',
              description: 'The date the credential was issued',
            },
            badges: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  provider: {
                    type: 'string',
                    title: 'Provider',
                    description: 'The provider of the badge',
                  },
                  badgePhoto: {
                    type: 'string',
                    title: 'Badge Photo',
                    description: 'The photo of the badge',
                  },
                  credential: {
                    type: 'object',
                    properties: {
                      credentialType: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      }, //Might have to change this
                      proof: {
                        type: 'object',
                        properties: {
                          jws: {
                            type: 'string',
                            title: 'JWS',
                            description: 'The JWS of the credential',
                          },
                          created: {
                            type: 'string',
                            title: 'Created',
                            description: 'The date the credential was created',
                          },
                          proofOfPurpose: {
                            type: 'string',
                            title: 'Proof of Purpose',
                            description: 'The purpose of the proof',
                          },
                        },
                      },
                      issuer: {
                        type: 'string',
                        title: 'Issuer',
                        description: 'The issuer of the credential',
                      },
                      context: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      issuanceDate: {
                        type: 'string',
                        title: 'Issuance Date',
                        description: 'The date the credential was issued',
                      },
                      credentialSubject: {
                        type: 'object',
                        properties: {
                          task: {
                            type: 'string',
                            title: 'Task',
                            description: 'The task the credential is for',
                          },
                          project: {
                            type: 'string',
                            title: 'Project',
                            description: 'The project the credential is for',
                          },
                          bounty: {
                            type: 'string',
                            title: 'Bounty',
                            description: 'The bounty the credential is for',
                          },
                          Clan: {
                            type: 'string',
                            title: 'Clan',
                            description: 'The clan the credential is for',
                          },
                          skill: {
                            type: 'array',
                            items: {
                              type: 'string',
                            },
                          },
                          timeSpent: {
                            type: 'string',
                            title: 'Time Spent',
                            description: 'The time spent on the task',
                          },
                          context: {
                            type: 'array',
                            items: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const metaData = {
    controllers: [ceramic.did.id],
  };

  const vcSchema = await TileDocument.create(ceramic, vcSchemaId, metaData);
  console.log(vcSchema.commitId.toString());
  const data = {
    vcSchema: vcSchema.commitId.toString(),
  };
  await writeFile('./model.json', JSON.stringify(data));
};

bootStrap();
