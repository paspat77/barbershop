// cloudfunctions/initCollections/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const result = { created: [], errors: [] };

  const collections = ['appointments', 'schedules'];

  for (const name of collections) {
    try {
      await db.createCollection(name);
      result.created.push(name);
    } catch (e) {
      // 集合已存在则跳过
      result.errors.push({ name, err: e.message });
    }
  }

  return {
    success: true,
    result
  };
};
