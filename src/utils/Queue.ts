class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Queue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private length: number = 0;

  // O(1)
  add(item: T): void {
    const newNode = new Node(item);
    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    if (!this.head) {
      this.head = newNode;
    }
    this.length++;
  }

  // O(1)
  remove(): T | null {
    if (!this.head) {
      return null;
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.length--;
    return value;
  }

  // O(1)
  peek(): T | null {
    return this.head ? this.head.value : null;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Convert Queue to JSON
  toJSON(): any {
    const items: T[] = [];
    let current = this.head;
    while (current) {
      items.push(current.value);
      current = current.next;
    }
    return JSON.stringify(items);
  }

  // Creates Queue from JSON
  static fromJSON<T>(data: any): Queue<T> {
    const queue = new Queue<T>();
    const items: T[] = Array.isArray(data) ? data : [];
    items.forEach((item) => queue.add(item));
    return queue;
  }
}
