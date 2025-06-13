import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types/product";
const productsFilePath = path.join(process.cwd(), "products.json");

// GET - отримати всі товари
export async function GET() {
  try {
    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("Помилка читання файлу продуктів:", error);
    // Якщо файл не існує, створюємо базову структуру
    const defaultProducts = {
      products: [
        {
          id: "cats-fresh",
          idNumber: 1,
          name: {
            uk: "Cats Fresh - Комкуючий наповнювач з тофу",
            ru: "Cats Fresh - Комкующий наполнитель из тофу",
          },
          description: {
            uk: "Екологічний наповнювач з тофу для котячого туалету",
            ru: "Экологический наполнитель из тофу для кошачьего туалета",
          },
          price: {
            single: 280,
            from_6: 250,
          },
        },
      ],
    };

    await fs.writeFile(
      productsFilePath,
      JSON.stringify(defaultProducts, null, 2)
    );
    return NextResponse.json(defaultProducts, { status: 200 });
  }
}

// POST - додати новий товар
export async function POST(req: NextRequest) {
  try {
    const productData = await req.json();

    // Валідація основних полів
    if (
      !productData.id ||
      !productData.name?.uk ||
      !productData.price?.single
    ) {
      return NextResponse.json(
        { error: "Не вистачає обов'язкових полів" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data);

    // Перевіряємо чи не існує товар з таким ID
    if (products.products.find((p: Product) => p.id === productData.id)) {
      return NextResponse.json(
        { error: "Товар з таким ID вже існує" },
        { status: 400 }
      );
    }

    products.products.push(productData);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Помилка сервера: ${error}` },
      { status: 500 }
    );
  }
}

// PUT - оновити товар
export async function PUT(req: NextRequest) {
  try {
    const productData = await req.json();

    if (!productData.id) {
      return NextResponse.json(
        { error: "ID товару не вказано" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data);

    const productIndex = products.products.findIndex(
      (p: Product) => p.id === productData.id
    );

    if (productIndex === -1) {
      return NextResponse.json({ error: "Товар не знайдено" }, { status: 404 });
    }

    products.products[productIndex] = {
      ...products.products[productIndex],
      ...productData,
    };
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Помилка сервера: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - видалити товар
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID товару не вказано" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(productsFilePath, "utf-8");
    const products = JSON.parse(data);

    products.products = products.products.filter((p: Product) => p.id !== id);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Помилка сервера: ${error}` },
      { status: 500 }
    );
  }
}
