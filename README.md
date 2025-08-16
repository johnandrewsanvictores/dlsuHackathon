# 🐝 Work Hive

**Work Hive** is an AI-powered, full-stack career management web application that helps job seekers organize and streamline their job search process. Designed for productivity, intelligence, and ease, Work Hive offers a centralized hub for managing resumes, job applications, interviews, and AI-powered insights—all in one intuitive dashboard.

---

## 🌟 Features

- 🤖 **AI Resume Matching** with Pollinations AI API  
- 🗃️ **Centralized Job Tracking Dashboard**  
- 📆 **Interview Calendar Management**  
- 📌 **Application Status Updates**  
- 🔍 **Smart Job Search & Filtering**  
- 📄 **Resume Upload & Parsing (PDF to Text)**  
- 🔐 **User Authentication & Google OAuth Login**  
- 🕷️ **Job Scraping from Multiple Sources**  
- 🧠 **Advanced Fuzzy Keyword Matching (Fuse.js)**  

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.0
- **Vite**
- **TailwindCSS**
- **React Router DOM**

### Backend
- **Node.js** with **Express** 5.1.0
- **MongoDB** with **Mongoose**

### Key Libraries & APIs
- `pdfjs-dist` – PDF to Text Conversion  
- `fuse.js` – Fuzzy Search for Smart Matching  
- `axios` – HTTP Requests  
- `bcrypt` – Secure Password Hashing  
- `multer` – File Uploads  
- **Pollinations AI API** – Resume Analysis & Skill Extraction  
- **Adzuna API** – Job Listings (Temporary Source)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/johnandrewsanvictores/dlsuHackathon.git
cd work-hive
```

### 2. Get Environment Files

To run the project, you’ll need both **client** and **server** `.env` files.

📩 **Please message `sanvictoresjohnandrewe@gmail.com` to request access to the required `.env` files.**

Once received, place them in:

- `client/.env`
- `server/.env`

---

## ⚙️ Environment Variables

Here are sample structures for the environment files:

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
CHOKIDAR_USEPOLLING=true
```

### Server (`server/.env`)
```env
MONGODB_URI=mongodb://mongo:27017/workhive
API_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
SESSION_SECRET=<your_session_secret>
```

---

## 🐳 Running with Docker

### 1. Build and start the app

```bash
docker-compose up --build
```

### 2. Run in the background

```bash
docker-compose up --build -d
```

### 3. Stop containers

```bash
docker-compose down
```

### 4. Access the app

- Frontend: [http://localhost:3000](http://localhost:3000)  
- API Server: [http://localhost:5000](http://localhost:5000)  
- MongoDB: on port `27017`

-

## 🗂️ Project Structure

```
work-hive/
│
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   └── .env
│
├── server/              # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── .env
│
├── docker-compose.yml
└── README.md
```

---

## 🛣️ Roadmap

- 🤝 **Integrations** with Philippine job sites like JobsPH and JobStreet  

---

## 👩‍💻 Development Tools

- **AI Assistants**: ChatGPT, Cursor  
- **Containerization**: Docker  
- **Version Control**: Git + GitHub  

---

## 🙌 Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/my-feature`)  
5. Create a Pull Request  

---

## 🛡️ License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or collaboration inquiries, please open an issue or message `sanvictoresjohnandrewe@gmail.com`.
