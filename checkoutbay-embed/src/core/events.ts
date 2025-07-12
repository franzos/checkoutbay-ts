/**
 * Event system for cart updates and notifications
 */

type EventCallback = (data: any) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[CheckoutBay] Event callback error:`, error);
      }
    });
  }

  once(event: string, callback: EventCallback): void {
    const oneTimeCallback = (data: any) => {
      callback(data);
      this.off(event, oneTimeCallback);
    };
    this.on(event, oneTimeCallback);
  }
}

// Global event emitter instance
export const events = new EventEmitter();