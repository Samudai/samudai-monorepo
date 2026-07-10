export interface IVerifiableCredential {
    issuanceDate: string;
    badges: [
        {
            provider: string; //DAO Name
            badgePhoto: string;
            credential: {
                type: ['VerifiableCredential'];
                proof: {
                    jws: string;
                    created: string; //Timestamp
                    proofPurpose: 'assertionMethod';
                };
                issuer: 'Samudai';
                '@context': ['https://www.w3.org/2018/credentials/v1'];
                issuanceDate: string; //DATE
                credentialSubject: {
                    task: string;
                    project: string;
                    bounty: string;
                    Clan: string; //empty
                    skill: string[]; //tags
                    timeSpent: string; //''
                    '@context': [
                        {
                            hash: 'https://schema.org/Text';
                            provider: 'https://schema.org/Text';
                        },
                    ];
                };
            };
        },
    ];
}
