# 🐵 Vibe Monkey AI

> **AI-Powered Startup Idea Validation Platform**

Transform your startup ideas into validated, actionable business plans with comprehensive AI-powered analysis. Vibe Monkey AI provides deep insights into market potential, technical feasibility, feature prioritization, and development roadmaps.

## ✨ Features

### 🧠 **AI-Powered Analysis**
- **Market Validation**: Comprehensive market research and competitive analysis
- **Technical Feasibility**: Real-world assessment of development requirements
- **Business Model Analysis**: Revenue potential and sustainability evaluation
- **Risk Assessment**: Identify potential challenges with mitigation strategies

### 🎯 **Smart Feature Planning**
- **Feature Prioritization**: AI-generated MVP, V1, and future release plans
- **User Flow Design**: Complete user journey mapping
- **Development Roadmap**: Phase-based development timeline with effort estimates
- **Technical Stack Recommendations**: Curated technology suggestions based on your project needs

### 📊 **Interactive Dashboard**
- **Kanban Board**: Visual project management and feature tracking
- **Analytics & Insights**: Detailed validation scores and confidence metrics
- **Export Capabilities**: Download complete analysis reports
- **Real-time Updates**: Refresh and update analysis as needed

## 🏗️ Architecture

This is a full-stack TypeScript application built with:

### Backend (Encore.dev)
- **Framework**: [Encore.dev](https://encore.dev) - Type-safe backend with built-in infrastructure
- **Database**: PostgreSQL with automated migrations
- **AI Integration**: OpenRouter API for multi-model AI analysis
- **APIs**: RESTful services for idea management and validation

### Frontend (React + Vite)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Animations**: Framer Motion

## 🚀 Quick Start

### Prerequisites

1. **Encore CLI** - Install the Encore development environment:
   - **macOS:** `brew install encoredev/tap/encore`
   - **Linux:** `curl -L https://encore.dev/install.sh | bash`
   - **Windows:** `iwr https://encore.dev/install.ps1 | iex`

2. **Bun** - Fast JavaScript package manager:
   ```bash
   npm install -g bun
   ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ashrith-R-Singamsetty/vibe-monkey-AI.git
   cd vibe-monkey-AI
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

### Development

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the Encore development server:
   ```bash
   encore run
   ```

   The backend will be available at the URL shown in your terminal (typically `http://localhost:4000`).

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies and start the development server:
   ```bash
   bun install
   bun run dev
   ```

   The frontend will be available at `http://localhost:5173`.

#### Generate Frontend Client

To generate the TypeScript client for the frontend:

```bash
cd backend
encore gen client --target leap
```

## 📱 Usage

1. **Create an Idea**: Submit your startup concept with optional context (target audience, timeline, budget)
2. **AI Analysis**: The platform automatically runs comprehensive validation across multiple dimensions
3. **Review Results**: Explore validation scores, technical recommendations, and feature roadmaps
4. **Plan Development**: Use the generated Kanban board to track your development progress
5. **Export Data**: Download complete analysis reports for further use

## 🛠️ API Endpoints

### Ideas Management
- `POST /ideas` - Create and enhance a new startup idea
- `GET /ideas/:id` - Retrieve idea with complete analysis
- `GET /ideas` - List all ideas
- `DELETE /ideas/:id` - Delete an idea

### AI Validation Services
- `POST /validate` - Comprehensive startup idea validation
- `POST /tech-stack` - Technology stack recommendations
- `POST /features` - Feature prioritization and development planning
- `POST /enhance` - AI-powered idea enhancement

## 🚀 Deployment

### Encore Cloud (Recommended)

1. **Login to Encore**:
   ```bash
   encore auth login
   ```

2. **Add Encore remote**:
   ```bash
   git remote add encore encore://vibe-monkey-platform-yigi
   ```

3. **Deploy**:
   ```bash
   git add -A .
   git commit -m "Deploy to Encore Cloud"
   git push encore
   ```

### GitHub Integration

1. Connect your GitHub account in the [Encore Cloud dashboard](https://app.encore.dev/vibe-monkey-platform-yigi/settings/integrations/github)
2. Push to your GitHub repository to automatically trigger deployments
3. Get Preview Environments for each pull request (Pro users)

### Self-Hosting

Use Docker for self-hosting:

```bash
encore build docker
```

See the [self-hosting documentation](https://encore.dev/docs/self-host/docker-build) for detailed instructions.

## 🔧 Configuration

### Environment Variables

The application requires the following environment variables:

```bash
# OpenRouter API Key for AI services
OpenRouterKey=your_openrouter_api_key_here
```

### Database

The application uses PostgreSQL with automatic schema migrations. Database tables are automatically created and managed by Encore.

## 📊 Project Structure

```
vibe-monkey-AI/
├── backend/                 # Encore.dev backend application
│   ├── encore.app          # Encore app configuration
│   ├── idea/               # Idea management services
│   │   ├── create.ts       # Create and enhance ideas
│   │   ├── get.ts          # Retrieve ideas with analysis
│   │   ├── list.ts         # List ideas
│   │   ├── delete.ts       # Delete ideas
│   │   ├── db.ts           # Database configuration
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── migrations/     # Database migrations
│   ├── validation/         # AI validation services
│   │   ├── validate.ts     # Core validation logic
│   │   ├── tech-stack.ts   # Technology recommendations
│   │   ├── features.ts     # Feature planning
│   │   └── enhance.ts      # Idea enhancement
│   └── frontend/           # Frontend client service
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and helpers
│   │   └── client.ts       # API client
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with [Encore.dev](https://encore.dev) for type-safe backend development
- Powered by [OpenRouter](https://openrouter.ai) for multi-model AI capabilities
- UI components from [Radix UI](https://radix-ui.com) and [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/Ashrith-R-Singamsetty/vibe-monkey-AI/issues)
- 📖 **Documentation**: [Encore Docs](https://encore.dev/docs)
- 🎯 **Dashboard**: [Encore Cloud Dashboard](https://app.encore.dev/vibe-monkey-platform-yigi)

---

**Made with ❤️ and 🤖 AI**