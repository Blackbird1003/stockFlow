import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo users, categories and products...");

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const staffPassword = await bcrypt.hash("Staff123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@stockflow.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@stockflow.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@stockflow.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@stockflow.com",
      password: staffPassword,
      role: "STAFF",
    },
  });

  // Only seed products/categories if admin has none yet
  const existingCategories = await prisma.category.count({ where: { userId: admin.id } });
  if (existingCategories > 0) {
    console.log("Demo data already exists. Skipping product/category seed.");
    console.log("Done.");
    return;
  }

  // Categories
  const electronics = await prisma.category.create({
    data: { userId: admin.id, name: "Electronics", description: "Gadgets, devices and electronic accessories" },
  });
  const clothing = await prisma.category.create({
    data: { userId: admin.id, name: "Clothing", description: "Apparel, footwear and fashion accessories" },
  });
  const food = await prisma.category.create({
    data: { userId: admin.id, name: "Food & Beverages", description: "Consumable goods, snacks and drinks" },
  });
  const home = await prisma.category.create({
    data: { userId: admin.id, name: "Home & Garden", description: "Furniture, tools and home essentials" },
  });
  const health = await prisma.category.create({
    data: { userId: admin.id, name: "Health & Beauty", description: "Skincare, supplements and wellness products" },
  });

  // Products with Unsplash images
  const products = [
    // Electronics
    { name: "MacBook Pro 14\"", sku: "ELEC-001", categoryId: electronics.id, price: 850000, costPrice: 680000, quantity: 15, minimumStock: 5, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop", description: "Apple MacBook Pro with M3 chip" },
    { name: "Samsung Galaxy S24", sku: "ELEC-002", categoryId: electronics.id, price: 320000, costPrice: 250000, quantity: 30, minimumStock: 10, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop", description: "Samsung flagship smartphone" },
    { name: "Sony WH-1000XM5 Headphones", sku: "ELEC-003", categoryId: electronics.id, price: 95000, costPrice: 72000, quantity: 8, minimumStock: 5, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", description: "Premium noise-cancelling wireless headphones" },
    { name: "iPad Air 5th Gen", sku: "ELEC-004", categoryId: electronics.id, price: 420000, costPrice: 330000, quantity: 3, minimumStock: 5, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop", description: "Apple iPad Air with M1 chip" },
    { name: "Logitech MX Master 3S", sku: "ELEC-005", categoryId: electronics.id, price: 42000, costPrice: 30000, quantity: 20, minimumStock: 8, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop", description: "Advanced wireless productivity mouse" },
    // Clothing
    { name: "Classic White T-Shirt", sku: "CLTH-001", categoryId: clothing.id, price: 8500, costPrice: 4500, quantity: 120, minimumStock: 30, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop", description: "100% cotton premium white tee" },
    { name: "Slim Fit Chinos", sku: "CLTH-002", categoryId: clothing.id, price: 18000, costPrice: 11000, quantity: 45, minimumStock: 15, imageUrl: "https://images.unsplash.com/photo-1624378441864-6eda7bed06a9?w=200&h=200&fit=crop", description: "Stretch slim fit chino trousers" },
    { name: "Running Sneakers", sku: "CLTH-003", categoryId: clothing.id, price: 35000, costPrice: 22000, quantity: 0, minimumStock: 10, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop", description: "Lightweight breathable running shoes" },
    // Food & Beverages
    { name: "Premium Ground Coffee 1kg", sku: "FOOD-001", categoryId: food.id, price: 12500, costPrice: 8000, quantity: 60, minimumStock: 20, imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=200&fit=crop", description: "Single origin Arabica ground coffee" },
    { name: "Mixed Nuts Gift Pack", sku: "FOOD-002", categoryId: food.id, price: 9800, costPrice: 6500, quantity: 4, minimumStock: 10, imageUrl: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=200&h=200&fit=crop", description: "Premium mixed nuts, 500g" },
    { name: "Green Tea Collection", sku: "FOOD-003", categoryId: food.id, price: 6200, costPrice: 3800, quantity: 75, minimumStock: 25, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop", description: "Assorted green tea varieties, 30 bags" },
    // Home & Garden
    { name: "Ceramic Plant Pot Set", sku: "HOME-001", categoryId: home.id, price: 14500, costPrice: 8800, quantity: 25, minimumStock: 8, imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop", description: "Set of 3 ceramic pots with drainage holes" },
    { name: "Bamboo Cutting Board", sku: "HOME-002", categoryId: home.id, price: 7200, costPrice: 4100, quantity: 2, minimumStock: 10, imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop", description: "Eco-friendly bamboo kitchen cutting board" },
    // Health & Beauty
    { name: "Vitamin C Serum 30ml", sku: "HLTH-001", categoryId: health.id, price: 22000, costPrice: 13000, quantity: 40, minimumStock: 12, imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop", description: "20% Vitamin C brightening facial serum" },
    { name: "Omega-3 Fish Oil (90 caps)", sku: "HLTH-002", categoryId: health.id, price: 18500, costPrice: 11000, quantity: 55, minimumStock: 15, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop", description: "High-strength Omega-3 EPA & DHA supplements" },
    { name: "Natural Shea Butter Lotion", sku: "HLTH-003", categoryId: health.id, price: 9500, costPrice: 5500, quantity: 0, minimumStock: 10, imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop", description: "Unrefined pure shea butter body lotion 250ml" },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        userId: admin.id,
        name: p.name,
        sku: p.sku,
        categoryId: p.categoryId,
        price: p.price,
        costPrice: p.costPrice,
        quantity: p.quantity,
        minimumStock: p.minimumStock,
        imageUrl: p.imageUrl,
        description: p.description,
      },
    });

    if (p.quantity > 0) {
      await prisma.inventoryLog.create({
        data: {
          userId: admin.id,
          productId: product.id,
          action: "Initial Stock",
          quantityChange: p.quantity,
          previousQty: 0,
          newQty: p.quantity,
        },
      });
    }
  }

  console.log(`Created 5 categories and ${products.length} products for admin account.`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
