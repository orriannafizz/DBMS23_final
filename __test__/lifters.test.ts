import handler from '@/pages/api/lifters/[id]';
require('dotenv').config({ path: '.env.local' });

describe('/api/lifters/[id] handler', () => {
  it('should return correct JSON for id 1', async () => {
    // 加入 async
    const req = {
      query: {
        id: '1',
      },
    };

    const res: any = {
      statusCode: null,
      body: null,
      status: function (status: number) {
        this.statusCode = status;
        return this;
      },
      json: function (msg: any) {
        this.body = msg;
        return this;
      },
    };

    await handler(req, res);

    expect(res.statusCode).toBe(200);
  });
});
