const {
  nanoid
}  = require('nanoid');

module.exports = {
  async up(db, client) {
    let values = []
    for (let i = 0; i < 100; i++) {
      const urlCode = nanoid(8);
      values.push({
        originalUrl: `https://www.${nanoid(64)}.com`,
        shortUrl: `http://pdid.io/${urlCode}`,
        urlCode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        __v: 0
      })
    }
    await db.collection('urls').insertMany(values);
    console.log(`URL Collection created successfully`)
  },

  async down(db, client) {
    await db.collection('urls').drop();
    console.log(`URL Collection dropped successfully`)
  }
};
