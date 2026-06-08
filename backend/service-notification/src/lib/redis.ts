import { redis } from '../config/redisConfig';
import { WebNotification } from '../controllers/socketControllers.ts/utils/types';
const crypto = require('crypto');
export class RedisFunctions {
  private redisClient: any;

  //private TTL = '5260000'; // 2 months
  constructor() {
    this.redisClient = redis;
  }

  createRedisMemberKey = (memberId: string) => {
    return `member:${memberId}:member`;
  };

  createMember = async (memberId: string) => {
    const memberIdKey = this.createRedisMemberKey(memberId);

    const memberKey = `member:${memberId}`;

    await this.redisClient.set(memberIdKey, memberKey);
    await this.redisClient.hmset(memberKey, ['memberId', memberId, 'member', memberIdKey]);

    await this.redisClient.sadd(`member:${memberId}:rooms`, `${memberId}`);

    return { memberId: memberId, member: memberIdKey };
  };

  getMember = async (memberId: string) => {
    const memberIdKey = this.createRedisMemberKey(memberId);

    const memberKey = await this.redisClient.get(memberIdKey);
    const member = await this.redisClient.hgetall(memberKey);

    return member;
  };

  getRoomsForMember = async (memberId: string) => {
    const rooms = await this.redisClient.smembers(`member:${memberId}:rooms`);

    return rooms;
  };

  getNotifications = async (memberId: string, offset = 0, size = 50) => {
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall(`member_notifications:${memberId}`, async (err: any, hashData: any) => {
        if (err) {
          console.error('Error retrieving member notifications:', err);
          reject(err);
        } else {
          try {
            const notifications = Object.keys(hashData);

            const notificationPromises = notifications.map(async (notification: any) => {
              const n = await this.redisClient.get(`notification:${notification}`);
              const notificationContent = JSON.parse(n);

              notificationContent.read = hashData[notification] === 'true' ? true : false;

              return notificationContent;
            });

            const Notifications = await Promise.all(notificationPromises);

            resolve(Notifications);
          } catch (error) {
            console.error('Error processing notifications:', error);
            reject(error);
          }
        }
      });
    });
  };

  publishNotification = async (notification: WebNotification) => {
    const tempNotification = notification;
    const to = tempNotification.notificationData.to.to;
    const currentTimestamp = new Date().getTime();

    const hash = crypto.createHash('md5').update(`${currentTimestamp}`).digest('hex');

    const shortHash = hash.substring(0, 5);

    notification.notificationId = `${currentTimestamp}-${shortHash}`;
    const notificationContent = JSON.stringify(notification);

    await this.redisClient.set(`notification:${notification.notificationId}`, notificationContent);
    const nId = notification.notificationId;
    for (const toMember of to) {
      console.log('toMember', toMember);
      const n: any = {};
      n[nId] = false;

      await this.redisClient.hset(`member_notifications:${toMember}`, n);
    }

    return true;
  };

  publishActivityLog = async (notification: WebNotification) => {
    const to = notification.notificationData.to.to;
    for (const toMember of to) {
      //notification.notificationData.to.to = [toMember];
      const id = await this.redisClient.zcard(`room:${toMember}`);
      await this.redisClient.zadd(`room:${toMember}`, id + 1, JSON.stringify(notification)); //expire after 7 days
      await this.redisClient.expire(`room:${toMember}`, 604800);
      await this.redisClient.publish('activityLog', JSON.stringify(notification));
      //We need to add 2 zadds later to make sure that the notification is published to the correct room
    }
  };

  //   updateNotification = async (memberId: string, notificationId: string, notificationData: any) => {
  //     const notification = JSON.stringify({
  //         ...notificationData,
  //         timestamp: new Date().getTime(),
  //         status: 'read',
  //     })

  //     const result = await this.redisClient.zadd(`room:${memberId}`, xx: "XX" ,notificationId, notification);
  //   }

  updateReadReceiptForNotification = async (memberId: string, notificationId: string) => {
    try {
      const result = await this.redisClient.hset(`member_notifications:${memberId}`, notificationId, true);
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  memberNotificationCleanUp = async () => {
    // Lua script
    const luaScript = `
        local keys = redis.call("HKEYS", KEYS[1]) -- Get all keys in the hash
        local currentTimestamp = ARGV[1] -- Current timestamp in milliseconds
        local thresholdTimestamp = currentTimestamp - 30000 -- 5 minutes ago

        -- Iterate through keys, check conditions, and delete if necessary
        for _, key in ipairs(keys) do
            local timestamp, shortHash = string.match(key, "(%d+)-([%w%-]+)")

            if timestamp and shortHash then
                local keyTimestamp = tonumber(timestamp)
                local isTrue = redis.call("HGET", KEYS[1], key) == "true"

                if isTrue and keyTimestamp < thresholdTimestamp then
                    redis.call("HDEL", KEYS[1], key)
                end
            end
        end
    `;

    const luaScript2 = `
        local hashKeys = redis.call("KEYS", KEYS[1])
        return hashKeys
        local cursor = "0"
        local values = {}

        repeat
            local result = redis.call("SCAN", cursor, "MATCH", KEYS[1], "COUNT", 1000)
            cursor = result[1]
            local keys = result[2]

            for _, key in ipairs(keys) do
                table.insert(values, key)
            end
        until cursor == "0"

        return values
    `;

    // Set the pattern for all hash keys starting with "member_notifications"
    const hashKeyPattern = 'member_notifications:*';

    try {
      const res1 = await this.redisClient.eval(luaScript2, 1, hashKeyPattern);

      const currentTimestamp = Date.now();
      // Call the Lua script
      await Promise.all(
        res1?.map(async (hashKey: any) => {
          try {
            await this.redisClient.eval(luaScript, 1, hashKey, currentTimestamp);
          } catch (error) {
            console.error(`Error executing Lua script for hash key ${hashKey}: ${error}`);
          }
        }),
      );
    } catch (error) {
      console.error(`Error executing Lua script: ${error}`);
    }
  };

  notificationCleanUp = async () => {
    const luaScript = `
      local cursor = "0"
      local values = {}

      repeat
          local result = redis.call("SCAN", cursor, "MATCH", KEYS[1], "COUNT", 1000)
          cursor = result[1]
          local keys = result[2]

          for _, key in ipairs(keys) do
              table.insert(values, key)
          end
      until cursor == "0"

      return values
  `;
    const keyPattern = 'notification:*';

    const luaScript2 = `
    
      local cursor = "0"
      local values = {}

      repeat
          local result = redis.call("SCAN", cursor, "MATCH", KEYS[1], "COUNT", 1000)
          cursor = result[1]
          local keys = result[2]

          for _, key in ipairs(keys) do
              table.insert(values, key)
          end
      until cursor == "0"

      return values
   `;
    try {
      const notifications = await this.redisClient.eval(luaScript, 1, keyPattern);

      // Set the pattern for all hash keys starting with "member_notifications"
      const hashKeyPattern = 'member_notifications:*';

      try {
        const memberNotifications = await this.redisClient.eval(luaScript2, 1, hashKeyPattern);
        console.log(memberNotifications);

        const luaScript3 = `
                local targetKey = KEYS[1]
                local setKeyPrefix = KEYS[2]
                local hashKeys = ARGV

                local function isKeyPresent()
                    for _, hashKey in ipairs(hashKeys) do
                        if redis.call("HEXISTS", hashKey, targetKey) == 1 then
                            return true
                        end
                    end
                    return false
                end

                local keyPresent = isKeyPresent()

                if not keyPresent then
                  redis.call("DEL", setKeyPrefix .. targetKey)
                  return setKeyPrefix .. targetKey
                end
            `;

        try {
          await Promise.all(
            notifications.map(async (n: any) => {
              try {
                const notificationId = n.split(':')[1];
                const setKeyPrefix = 'notification:';
                const result = await this.redisClient.eval(
                  luaScript3,
                  2,
                  notificationId,
                  setKeyPrefix,
                  ...memberNotifications,
                );
                console.log('notificationId', notificationId, 'keypresent', result);
              } catch (error) {
                console.error(`Error processing notification ${n}: ${error}`);
              }
            }),
          );
        } catch (error) {
          console.error(`Error executing Lua script3: ${error}`);
        }
      } catch (error) {
        console.error(`Error executing Lua script2: ${error}`);
      }
    } catch (error) {
      console.error(`Error executing Lua script: ${error}`);
    }
  };
}
