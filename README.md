This is a web application for e-commerce platform using by small or medium size business owners to showcase and sell theirs products.

# 🛒 Southside Cart — E-Commerce Platform for Australian SMEs

**Southside Cart** is a full-stack web application built to empower small and medium-sized businesses in Australia to sell their products online with ease. It provides a seamless experience for both store owners and customers—from product management to order placement.

---

## 🔧 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | [Next.js](https://nextjs.org/) (App Router, TypeScript) |
| Backend   | [Spring Boot](https://spring.io/projects/spring-boot) (REST API) |
| Database  | [阿里云 MySQL](https://www.aliyun.com/product/rds/mysql) |
| Cache     | [Redis](https://redis.io/) *(optional)* |
| Storage   | AWS S3 or Azure Blob *(for product images)* |
| DevOps    | Docker, GitHub Actions *(optional)* |

---

## ✨ Features

### Admin Panel (Merchant)
- Secure login
- Add / update / delete products
- Upload product images
- View customer orders

### Customer Experience
- Product listing & search
- Product detail page
- Add to cart
- Place orders
- Order confirmation & tracking

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/southside-cart.git
cd southside-cart
````

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd backend
./mvnw spring-boot:run
```

> Ensure 阿里云 MySQL is configured, and update credentials in `application.yml`.

---

## 🗃️ Database Schema (Simplified)

* `users`: id, name, email, password, role
* `products`: id, name, description, price, stock, image\_url
* `orders`: id, user\_id, status, created\_at
* `order_items`: id, order\_id, product\_id, quantity

---

## 🗂 Project Structure

```
southside-cart/
│
├── frontend/              # Next.js frontend (TypeScript)
│   ├── app/
│   ├── components/
│   └── ...
│
├── backend/               # Spring Boot backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── ...
│
└── README.md              # Project documentation
```

---

## ☁️ Deployment Suggestions

* **Frontend**: [Vercel](https://vercel.com/) or Netlify
* **Backend**: [Render](https://render.com/), Railway, or AWS EC2
* **Database**: 阿里云 MySQL (RDS)
* **Storage**: AWS S3 or Azure Blob for media

---

## 📄 License

MIT License.
© 2025 \[Your Name] — Southside Cart

---

## 📬 Contact

For feature requests, business use, or feedback:

📧 [your.email@example.com](mailto:your.email@example.com)
🌐 [GitHub Profile](https://github.com/your-username)

---

## ❤️ Acknowledgements

Thanks to the open-source community, Spring & React teams, and Australian SME owners who inspired this project.


