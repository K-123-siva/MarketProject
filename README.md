# NestBazaar - Real Estate & Home Marketplace

A full-stack marketplace platform for buying, selling, and renting properties, furniture, home services, and building materials across India.

## Features

- 🏢 **Property Listings** - Buy/Sell/Rent residential & commercial properties
- 🛋️ **Furniture Marketplace** - Browse and buy home furniture
- 🔧 **Home Services** - Find plumbers, painters, electricians, and more
- 🧱 **Building Materials** - Shop for construction materials
- 💬 **Real-time Chat** - Connect with sellers instantly
- ❤️ **Wishlist** - Save your favorite listings
- ⭐ **Reviews & Ratings** - Read and write reviews
- 📍 **Location-based Search** - Find listings near you
- 🧾 **Seller Verification** - Verified seller badges
- 📸 **Image Galleries** - Multiple images per listing

## Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS
- React Router DOM
- Zustand (State Management)
- Axios
- Socket.io Client
- Lucide React (Icons)
- Vite

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- Bcrypt
- Multer + Cloudinary (Image Uploads)
- Socket.io (Real-time Chat)
- CORS, dotenv

## Installation

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nestbazaar
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=nestbazaar
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create MySQL database:
```sql
CREATE DATABASE nestbazaar;
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`
Backend will run on `http://localhost:5000`

## Project Structure

```
nestbazaar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth, upload middleware
│   │   ├── socket/       # Socket.io chat
│   │   └── index.js      # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/:id` - Update listing (auth required)
- `DELETE /api/listings/:id` - Delete listing (auth required)

### Reviews
- `GET /api/reviews/:listingId` - Get reviews for listing
- `POST /api/reviews` - Add review (auth required)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (auth required)
- `POST /api/wishlist` - Toggle wishlist item (auth required)

### Messages
- `GET /api/messages` - Get user conversations (auth required)
- `POST /api/messages` - Send message (auth required)

## Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
- Set environment variables
- Deploy from GitHub
- Use MySQL add-on for database

### Database (Railway/PlanetScale)
- Create MySQL database
- Update connection string in .env

## Contributing

This project was built as a real-time internship assignment. Feel free to fork and customize!

## License

MIT

## Author

Built with ❤️ for the internship opportunity
