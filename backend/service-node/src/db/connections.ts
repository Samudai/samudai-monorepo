import mongoose from "mongoose";

// The merged Node service hosts what used to be four separate services, each
// owning its own Mongo database (activity / twitter / web3). We open ONE socket
// pool and expose a per-service connection scoped to that database via useDb,
// so existing collections keep living in their original databases.
const MONGO_URL = process.env.MONGO_URL || "";

// Preserve Mongoose v6 query behavior (filter casting against the schema).
mongoose.set("strictQuery", true);

const base = mongoose.createConnection(MONGO_URL);

export const activityConn = base.useDb("activity", { useCache: true });
export const twitterConn = base.useDb("twitter", { useCache: true });
export const web3Conn = base.useDb("web3", { useCache: true });

export const closeConnections = async (): Promise<void> => {
  await base.close();
};
