//export default new Set<string>();

class Storage {
  private registry: Set<string> = new Set<string>();

  public add(value?: string): void {
    if (typeof value === 'string') {
      this.registry.add(value);
    }

    return;
  }

  public has(value?: string): boolean {
    return typeof value === 'string' && this.registry.has(value);
  }

  public delete(value?: string): void {
    if (typeof value === 'string') {
      this.registry.delete(value);
    }

    return;
  }
}

export default new Storage();
