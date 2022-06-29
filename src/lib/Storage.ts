import IORedis from 'ioredis';

class Storage {
  private registry: IORedis = new IORedis({
    db: 0,
    host: process.env.REDIS_URL,
    port: Number.parseInt(process.env.REDIS_PORT, 10),
  });

  public async add(value?: string): Promise<void> {
    if (typeof value === 'string') {
      await this.registry.set(value, '1');
    }

    return;
  }

  public async has(value?: string): Promise<boolean> {
    return (
      typeof value === 'string' && (await this.registry.get(value)) === '1'
    );
  }

  public async delete(value?: string): Promise<void> {
    if (typeof value === 'string') {
      await this.registry.del([value]);
    }

    return;
  }
}

export default new Storage();
