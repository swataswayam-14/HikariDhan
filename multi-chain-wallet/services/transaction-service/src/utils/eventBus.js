import NATS from 'nats';
import { Transaction } from '../Transaction';
import { TransactionProcessor } from '../services/TransactionProcessor';

let nc;

export async function setupEventHandlers() {
  nc = await NATS.connect({ servers: process.env.NATS_URL });
  
  // Subscribe to transaction events
  const sub = nc.subscribe('transaction.*');
  
  (async () => {
    for await (const msg of sub) {
      const handler = eventHandlers[msg.subject];
      if (handler) {
        try {
          await handler(JSON.parse(msg.data));
        } catch (error) {
          console.error(`Error handling event ${msg.subject}:`, error);
        }
      }
    }
  })();
}

export async function publishEvent(subject, data) {
  if (!nc) {
    throw new Error('NATS client not initialized');
  }
  await nc.publish(subject, JSON.stringify(data));
}

const eventHandlers = {
  'transaction.created': async (transaction) => {
    const processor = new TransactionProcessor();
    const update = await processor.processTransaction(transaction);
    
    await Transaction.findByIdAndUpdate(
      transaction._id,
      { $set: update },
      { new: true }
    );

    if (update.status === 'confirmed') {
      await publishEvent('transaction.confirmed', transaction);
    }
  }
};