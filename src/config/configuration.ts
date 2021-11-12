export type MongoConfig = {
  name: string;
  url: string;
  port: number;
  user?: string;
  password?: string;
};

export type RedisConfig = {
  host: string;
  port: number;
};

export type MailConfig = {
  transport?: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults?: {
    from: string;
  };
};

export type FirebaseConfig = {
  type?: string;
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
};

export type Config = {
  mongo: MongoConfig;
  redis: RedisConfig;
  mail: MailConfig;
  firebase?: FirebaseConfig;
};

export default (): Config => ({
  mongo: {
    name: `book-to-book`,
    url: 'localhost',
    port: 27017,
  },
  redis: {
    host: 'localhost',
    port: 6379,
  },
  mail: {
    transport: {
      host: 'panel.wtmsrv.com',
      port: 587,
      auth: {
        user: 'notifications@wtmsrv.com',
        pass: 'wtmNOTIFICATIONS@020',
      },
    },
    defaults: {
      from: 'Book To Book <notifications@wtmsrv.com>',
    },
  },
});
