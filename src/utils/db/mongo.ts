import { MongoClient, Db } from 'mongodb';

export async function connectMongo(uri: string, dbName?: string): Promise<{ client: MongoClient; db?: Db }> {
  const client = new MongoClient(uri);
  await client.connect();
  const db = dbName ? client.db(dbName) : undefined;
  return { client, db };
}
