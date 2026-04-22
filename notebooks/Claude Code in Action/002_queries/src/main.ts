import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getPendingOrders } from "./queries/order_queries";
import { sendOrderAlert } from "./slack";

async function main() {
  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  await createSchema(db, false);

  const overdueOrders = await getPendingOrders(db, 3);
  for (const order of overdueOrders) {
    await sendOrderAlert(
      order.order_number,
      order.customer_name,
      order.phone,
      order.days_pending,
    );
  }
}

main();
