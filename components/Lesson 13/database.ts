import { ImageSourcePropType } from "react-native";
import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage";

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

// --- 1. HÀM MỞ DATABASE (SINGLETON) ---
const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;

  try {
    db = await SQLite.openDatabase({
      name: "myDatabase.db",
      location: "default",
    });
    console.log("✅ Database opened successfully");
    return db;
  } catch (error) {
    console.error("❌ Failed to open database:", error);
    throw new Error("Database opening failed");
  }
};

// --- 2. TYPES VÀ DỮ LIỆU BAN ĐẦU ---
export type Category = {
  id: number; // Đã đổi tên categoryId thành id để khớp với DB
  name: string; // Đã đổi tên categoryName thành name để khớp với DB
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

export type User = {
  id: number;
  username: string;
  password?: string;
  avatar?: string; // Tùy chọn, vì không muốn lưu trong Context
  role: "user" | "admin";
};

export type Order = {
  id: number;
  userId: number;
  username: string;
  customerName: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  date: string;
  total: number;
  status: "Đang xử lý" | "Đã giao" | "Hủy";
  items: string; // JSON string
};

export type CartItem = {
  id?: number; // tự tăng
  productId: number;
  name: string;
  price: number;
  quantity: number;
  img: string; // lưu dạng JSON string
};

// Khởi tạo bảng nếu chưa có

const productImages: ImageSourcePropType[] = [
  require("../../assets/images/bag1.jpg"),
  require("../../assets/images/hoalen1.jpg"),
  require("../../assets/images/mockhoa1.jpg"),
  require("../../assets/images/trangsuc.jpg"),
];

export const initialCategories: Category[] = [
  { id: 1, name: "Túi xách" },
  { id: 2, name: "Hoa len" },
  { id: 3, name: "Đồ chơi móc" },
  { id: 4, name: "Trang sức" },
];

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Túi xinh len",
    price: 250000,
    img: "bag1",
    categoryId: 1,
  },
  {
    id: 2,
    name: "Hoa len trang trí",
    price: 1100000,
    img: "hoalen1",
    categoryId: 2,
  },
  {
    id: 3,
    name: "Móc khóa hình bee",
    price: 490000,
    img: "mockhoa1",
    categoryId: 3,
  },
  {
    id: 4,
    name: "Kẹp tóc hoa tai",
    price: 120000,
    img: "trangsuc",
    categoryId: 4,
  },
  {
    id: 5,
    name: "Túi xách nữ thời trang",
    price: 980000,
    img: "bag1",
    categoryId: 1,
  },
];

// --- 3. HÀM KHỞI TẠO DATABASE ---

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction(
      (tx) => {
        // BẢNG CATEGORIES
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT UNIQUE)"
        );
        initialCategories.forEach((category) => {
          tx.executeSql(
            "INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)",
            [category.id, category.name]
          );
        });

        // BẢNG PRODUCTS
        tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          img TEXT,
          categoryId INTEGER,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )`);
        initialProducts.forEach((product: Product) => {
          db?.executeSql(
            "INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)",
            [
              product.id,
              product.name,
              product.price,
              product.img,
              product.categoryId,
            ]
          );
        });

        console.log("Database initialized!");

        // BẢNG USERS (Yêu cầu 11)
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            avatar TEXT,
            role TEXT
          )`,
          [],
          () => console.log("✅ Users table created")
        );

        // INSERT TÀI KHOẢN ADMIN MẶC ĐỊNH (Yêu cầu 11)
        tx.executeSql(
          `INSERT OR IGNORE INTO users (username, password, avatar, role) 
           VALUES ('admin', '123456', NULL, 'admin')`,
          [],
          () => console.log("✅ Admin user added")
        );
      },
      (error) => console.error("❌ Transaction error:", error),
      () => {
        console.log("✅ Database initialized");
        if (onSuccess) onSuccess();
      }
    );
  } catch (error) {
    console.error("❌ initDatabase outer error:", error);
  }
};

export const initCartTable = async () => {
  const db = await getDb();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  img TEXT,
  quantity INTEGER NOT NULL,
  addedAt TEXT
);
`
  );
};

export const initOrderTable = async () => {
  const db = await getDb();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  username TEXT,
  customerName TEXT,
  date TEXT,
  phone TEXT,
  address TEXT,
  paymentMethod TEXT,
  total REAL,
  status TEXT,
  items TEXT
);
`
  );
};

// --- 4. HÀM SẢN PHẨM VÀ DANH MỤC (CRUD + Fetch) ---

// 4.1 FETCH
const mapRowsToProducts = (results: any): Product[] => {
  const products: Product[] = [];
  const rows = results[0].rows;
  for (let i = 0; i < rows.length; i++) {
    // Cần parse img từ string về ImageSourcePropType nếu cần hiển thị
    products.push(rows.item(i));
  }
  return products;
};
export const getProducts = async (): Promise<Product[]> => {
  const [results] = await db!.executeSql("SELECT * FROM products");
  const products: Product[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql("SELECT * FROM products");
    return mapRowsToProducts(results);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const [results] = await database.executeSql("SELECT * FROM categories");
    const items: Category[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
};

export const fetchProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  try {
    const db = await getDb();
    const results = await db.executeSql(
      "SELECT * FROM products WHERE categoryId = ?",
      [categoryId]
    );
    return mapRowsToProducts(results);
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    return [];
  }
};

export const findProductById = async (id: number): Promise<Product | null> => {
  try {
    const database = await getDb();
    const results = await database.executeSql(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (results[0].rows.length > 0) {
      return results[0].rows.item(0);
    }
    return null;
  } catch (error) {
    console.error("❌ Error finding product by ID:", error);
    return null;
  }
};

// 4.2 CRUD SẢN PHẨM (Yêu cầu 17)
export const addOrUpdateProduct = async (
  product: Product
): Promise<boolean> => {
  try {
    const database = await getDb();
    const id = product.id ?? Date.now();
    await database.executeSql(
      `INSERT OR REPLACE INTO products (id, name, price, categoryId, img)
       VALUES (?, ?, ?, ?, ?)`,
      [id, product.name, product.price, product.categoryId, product.img]
    );
    return true;
  } catch (error) {
    console.error("❌ Error add/update product:", error);
    return false;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const database = await getDb();
    await database.executeSql(`DELETE FROM products WHERE id = ?`, [id]);
    return true;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return false;
  }
};

// 4.3 CRUD DANH MỤC (Yêu cầu 16)
export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("INSERT INTO categories (name) VALUES (?)", [name]);
    console.log("✅ Category added:", name);
    return true;
  } catch (error) {
    console.error("❌ Error adding category (Name may not be unique):", error);
    return false;
  }
};

export const updateCategory = async (
  id: number,
  name: string
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE categories SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
    console.log("✅ Category updated:", id);
    return true;
  } catch (error) {
    console.error("❌ Error updating category:", error);
    return false;
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    // Trước khi xóa danh mục, cập nhật sản phẩm liên quan về 0 hoặc null (ví dụ)
    await db.executeSql(
      "UPDATE products SET categoryId = 0 WHERE categoryId = ?",
      [id]
    );
    await db.executeSql("DELETE FROM categories WHERE id = ?", [id]);
    console.log("✅ Category deleted:", id);
    return true;
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    return false;
  }
};

// --- 5. HÀM USER (Yêu cầu 12, 15) ---

// 5.1 AUTH
export const getUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      "SELECT id, username, avatar, role FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user by credentials:", error);
    return null;
  }
};

export const addUser = async (
  username: string,
  password: string,
  avatar: string | null,
  role: string
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      "INSERT INTO users (username, password, avatar, role) VALUES (?, ?, ?, ?)",
      [username, password, avatar, role]
    );
    console.log("✅ User added");
    return true;
  } catch (error) {
    console.error(
      "❌ Error adding user (Username exists or DB failure):",
      error
    );
    return false;
  }
};

// 5.2 CRUD USER (Yêu cầu 15)
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      "SELECT id, username, avatar, role FROM users"
    );
    const users: User[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      users.push(rows.item(i));
    }
    return users;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return [];
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("DELETE FROM users WHERE id = ?", [id]);
    console.log("✅ User deleted:", id);
    return true;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return false;
  }
};

export const updateUserRole = async (
  id: number,
  role: "user" | "admin"
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    console.log("✅ User role updated:", id, role);
    return true;
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    return false;
  }
};
export const getUserPasswordById = async (id: number): Promise<string | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      "SELECT password FROM users WHERE id = ?",
      [id]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0).password;
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user password by id:", error);
    return null;
  }
};
export const updateUsername = async (
  id: number,
  newUsername: string 
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE users SET username = ? WHERE id = ?", [newUsername, id]);
    return true;
  } catch (error) {
    console.error("❌ Error updating username:", error);
    return false;
  }
};
export const updateUserPassword = async (
  id: number,
  newPassword: string
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE users SET password = ? WHERE id = ?", [newPassword, id]);
    return true;
  } catch (error) {
    console.error("❌ Error updating user password:", error);
    return false;
  }
};
export const updateUserAvatar = async (
  id: number,
  newAvatar: string
): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE users SET avatar = ? WHERE id = ?", [newAvatar, id]);
    return true;
  } catch (error) {
    console.error("❌ Error updating user avatar:", error);
    return false;
  }
};


// --- 6. HÀM TÌM KIẾM ---
export const searchProductsByNameOrCategory = async (
  keyword: string
): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `
      SELECT p.* FROM products p
      JOIN categories c ON p.categoryId = c.id
      WHERE p.name LIKE ? OR c.name LIKE ?
      `,
      [`%${keyword}%`, `%${keyword}%`]
    );

    return mapRowsToProducts(results);
  } catch (error) {
    console.error("❌ Error searching by name or category:", error);
    return [];
  }
};

// --- Thêm sản phẩm vào cart ---
export const addToCart = async (item: CartItem) => {
  const db = await getDb();
  const [res] = await db.executeSql("SELECT * FROM cart WHERE productId = ?", [
    item.productId,
  ]);

  if (res.rows.length > 0) {
    // tăng số lượng nếu đã tồn tại
    const existing = res.rows.item(0);
    const newQty = existing.quantity + item.quantity;
    await db.executeSql(
      "UPDATE cart SET quantity = ?, addedAt = ? WHERE productId = ?",
      [newQty, new Date().toISOString(), item.productId]
    );
  } else {
    await db.executeSql(
      "INSERT INTO cart (productId, name, price, quantity, img, addedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        item.productId,
        item.name,
        item.price,
        item.quantity,
        item.img,
        new Date().toISOString(),
      ]
    );
  }
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  const db = await getDb();
  const [results] = await db.executeSql("SELECT * FROM cart");
  const items: CartItem[] = [];

  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push({
      id: row.id,
      productId: row.productId,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
      img: row.img,
    });
  }

  return items;
};

// --- Cập nhật số lượng ---
export const updateCartItemQuantity = async (
  productId: number,
  qty: number
) => {
  if (qty < 1) return; // không cho <=0
  const db = await getDb();
  await db.executeSql("UPDATE cart SET quantity = ? WHERE productId = ?", [
    qty,
    productId,
  ]);
};

// --- Xóa sản phẩm ---
export const removeCartItem = async (productId: number) => {
  const db = await getDb();
  await db.executeSql("DELETE FROM cart WHERE productId = ?", [productId]);
};

// --- Xóa toàn bộ cart ---
export const clearCart = async () => {
  const db = await getDb();
  await db.executeSql("DELETE FROM cart");
};

export const addOrder = async (order: Omit<Order, "id">) => {
  try {
    const db = await getDb();
    await db.executeSql(
      "INSERT INTO orders ( userId, username, date, phone, address, paymentMethod, total, status, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [order.userId, order.username, order.date, order.phone, order.address, order.paymentMethod, order.total, order.status, order.items]
    );
    console.log("✅ Order added for:", order.username);
    return true;
  } catch (error) {
    console.error("❌ Error adding order:", error);
    return false;
  }
};

// Lấy tất cả đơn hàng (mới nhất lên đầu)
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      "SELECT * FROM orders ORDER BY id DESC"
    );
    const orders: Order[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      orders.push(rows.item(i));
    }
    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
};

export const fetchOrdersByUserId = async (userId: number): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      "SELECT * FROM orders WHERE userId = ? ORDER BY id DESC",
      [userId]
    );
    const orders: Order[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      orders.push(rows.item(i));
    }
    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders by user:", error);
    return [];
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const db: SQLiteDatabase = await getDb();
    const [results] = await db.executeSql("SELECT * FROM orders ORDER BY date DESC");
    const orders: Order[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      orders.push(results.rows.item(i));
    }
    return orders;
  } catch (e) {
    console.error("❌ Lỗi fetchAllOrders:", e);
    return [];
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const db = await getDb();
    await db.executeSql("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      orderId,
    ]);
    console.log("✅ Order status updated:", orderId, status);
    return true;
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return false;
  }
};

export const deleteDatabase = async (): Promise<void> => {
  try {
    await SQLite.deleteDatabase({ name: "myDatabase.db", location: "default" });
    console.log("✅ Database deleted successfully");
  } catch (error) {
    console.error("❌ Failed to delete database:", error);
  }
};

// export const resetDatabase = async (): Promise<void> => {
//   try {
//     // 1. Xóa DB cũ
//     await SQLite.deleteDatabase({ name: "myDatabase.db", location: "default" });
//     console.log("✅ Database deleted successfully");

//     // 2. Mở lại DB mới
//     db = await SQLite.openDatabase({
//       name: "myDatabase.db",
//       location: "default",
//     });
//     console.log("✅ Database opened successfully");

//     // 3. Khởi tạo bảng và dữ liệu mẫu
//     await initDatabase();
//     await initCartTable();
//     await initOrderTable();

//     console.log("✅ Database reset complete");
//   } catch (error) {
//     console.error("❌ Failed to reset database:", error);
//   }
// };
