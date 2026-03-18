import prisma from "./prisma";

export async function createStockNotification(
  userId: string,
  product: { id: string; name: string; quantity: number; minimumStock: number }
) {
  const type = product.quantity === 0 ? "out_of_stock" : "low_stock";
  const title = product.quantity === 0 ? "Out of Stock" : "Low Stock Alert";
  const message = `${product.name} has ${product.quantity} unit${product.quantity === 1 ? "" : "s"} remaining (minimum: ${product.minimumStock})`;

  // Deduplicate: skip if same notification created in last 24h
  const existing = await prisma.notification.findFirst({
    where: {
      userId,
      productId: product.id,
      type,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });
  if (existing) return;

  await prisma.notification.create({
    data: { userId, title, message, type, productId: product.id },
  });
}
