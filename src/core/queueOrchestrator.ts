// src/core/queueOrchestrator.ts

export class QueueOrchestrator {
  private static queue: string[] = [];
  private static isRunning = false;

  /**
   * Adds URLs to the queue and triggers the processor
   * @param urls Array of validated URLs
   * @param concurrency How many tabs to open at once
   */
  static async addAndProcess(urls: string[], concurrency: number = 3) {
    this.queue.push(...urls);
    if (!this.isRunning) {
      await this.run(concurrency);
    }
  }

  private static async run(concurrency: number) {
    this.isRunning = true;

    while (this.queue.length > 0) {
      // Get the next batch
      const batch = this.queue.splice(0, concurrency);

      // Open tabs in the current batch
      await Promise.all(batch.map(url => 
        chrome.tabs.create({ url, active: false })
      ));

      // Adaptive delay to prevent RAM spikes and browser UI freeze
      // 800ms is the sweet spot for smooth opening
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    this.isRunning = false;
  }
}
