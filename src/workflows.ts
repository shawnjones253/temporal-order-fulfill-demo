import { proxyActivities }
    from '@temporalio/workflow';

import type * as activities from '../src/activities';
import type { Order } from '../src/interfaces/order';

const { processPayment, reserveInventory, deliverOrder } = proxyActivities<typeof activities>({
    startToCloseTimeout: '5 seconds',
    retry: {
        nonRetryableErrorTypes: ['CreditCardExpiredException']
        backoffCoefficient: 2,
        initialInterval: 1000,
        maximumAttempts: 5,
        // maximumInterval: defaults to 100x initialInterval
    }
});

export async function OrderFulfillWorkflow(order: Order): Promise<string> {
    const paymentResult = await processPayment(order);
    const inventoryResult = await reserveInventory(order);
    const deliveryResult = await deliverOrder(order);
    return `Order fulfilled: ${paymentResult}, ${inventoryResult}, ${deliveryResult}`;
}
