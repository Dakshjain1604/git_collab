# DMatch - AI-Powered Resume Analysis Platform

## 🎯 Project Vision
DMatch is a cutting-edge resume analysis platform that leverages agentic AI capabilities to provide comprehensive job-resume matching, intelligent insights, and personalized recommendations. Built with modern technologies and designed for recruiters and job seekers alike.

## 🚀 Live Demo
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **Backend API**: http://localhost:3000

## ✨ Key Features

### 🤖 Advanced AI Analysis
- **Multi-Agent System**: Resume Parser, Job Analyzer, and Research agents working collaboratively
- **Comprehensive Scoring**: 6-dimensional analysis (Skills, Experience, Education, Similarity, Keywords, Overall)
- **Intelligent Parsing**: AI-powered extraction of structured resume data
- **Market Intelligence**: Real-time job market data and company research via web search
- **Personalized Recommendations**: Actionable feedback based on AI analysis and market trends

### 🎨 Modern User Interface
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with smooth animations and transitions
- **Interactive Dashboard**: Real-time statistics and progress tracking
- **Drag-and-Drop Upload**: Intuitive file upload with progress indicators
- **Persistent Sidebar**: Always-visible navigation with collapsible options

### 🔒 Enterprise-Grade Security
- **JWT Authentication**: Secure user management with token-based authentication
- **Data Privacy**: Encrypted data handling and secure file processing
- **User Isolation**: Individual user data and analysis history
- **Input Validation**: Comprehensive validation on all endpoints

### 📊 Analytics & Insights
- **User Dashboard**: Comprehensive metrics and analysis trends
- **History Tracking**: Complete analysis history with detailed reports
- **Performance Metrics**: Average scores, distribution analysis, and progress tracking
- **Export Capabilities**: Download analysis reports and insights

## 📋 Major Changes & Improvements

### 🤖 AI Backend (Agentic AI Enhancement)
- **Current State**: Basic OpenAI API calls for resume analysis
- **Target State**: Agentic AI system with autonomous analysis capabilities
- **Changes**:
  - Implement LangChain/CrewAI for agent orchestration
  - Add multiple AI agents (Parser, Analyzer, Recommender, Interview Coach)
  - Enable tool usage (web search, LinkedIn lookup, job market analysis)
  - Add memory and conversation history
  - Implement chain-of-thought reasoning for complex analysis

### 🔐 Backend (Node.js) Improvements
- **Current State**: Basic Express.js with JWT auth and analysis routes
- **Target State**: Production-ready API with advanced features
- **Changes**:
  - Add rate limiting and request validation
  - Implement proper error handling and logging
  - Add user management (profiles, preferences, history)
  - Create job search integration
  - Add analytics and usage tracking
  - Implement background job processing for heavy AI tasks

### 🎨 Frontend (React) Complete Revamp
- **Current State**: Basic React app with minimal styling
- **Target State**: Modern, animated, professional dashboard
- **Changes**:
  - Complete UI/UX redesign with modern design system
  - Add advanced animations (Framer Motion, GSAP)
  - Implement dark/light theme system
  - Create interactive dashboard with charts and visualizations
  - Add drag-and-drop file upload
  - Build comprehensive profile management
  - Add real-time notifications and progress indicators
  - Implement responsive design for all devices

### 🏗️ Architecture Improvements
- **Microservices Communication**: Better API orchestration
- **Database**: Enhanced MongoDB schemas with indexing
- **Caching**: Redis for session and result caching
- **File Storage**: Cloud storage integration (AWS S3, etc.)
- **Monitoring**: Add logging, metrics, and health checks
- **Security**: Enhanced authentication, input validation, CORS

### 📱 New Features to Add
- **Agentic Analysis Modes**: Different AI agents for different analysis types
- **Interactive Chat**: Chat with AI about resume improvements
- **Job Matching**: Real-time job search and matching
- **Progress Tracking**: Analytics dashboard for user progress
- **Template Generator**: AI-powered resume template suggestions
- **Interview Preparation**: AI mock interviews and feedback
- **Collaboration**: Share analysis results with others

## 🛠️ Implementation Roadmap

### Phase 1: AI Backend Agentic Enhancement
1. Install LangChain and agent frameworks
2. Create multiple AI agents with specific roles
3. Implement tool integrations (web search, job APIs)
4. Add memory and context management
5. Test agent orchestration and decision making

### Phase 2: Backend API Enhancement
1. Restructure API endpoints for better organization
2. Add comprehensive validation and error handling
3. Implement user preferences and settings
4. Add job search and matching endpoints
5. Create analytics and reporting system

### Phase 3: Frontend Complete Redesign
1. Set up modern design system (Tailwind + custom components)
2. Create new layout with sidebar navigation
3. Build animated dashboard with data visualizations
4. Implement file upload with progress indicators
5. Add theme switching and accessibility features
6. Create interactive analysis results display

### Phase 4: Integration & Testing
1. Connect all services with proper error handling
2. Add comprehensive testing (unit, integration, e2e)
3. Performance optimization and caching
4. Security audit and hardening
5. Documentation and deployment setup

## 🔧 Technical Stack Decisions

### AI Backend
- **Framework**: FastAPI (keep) + LangChain/CrewAI
- **Models**: GPT-4 + specialized models for different tasks
- **Tools**: Web search, LinkedIn scraper, job APIs, PDF processing
- **Memory**: Redis for conversation history

### Backend
- **Framework**: Express.js (keep) + additional middleware
- **Database**: MongoDB (keep) + Redis for caching
- **Auth**: JWT (keep) + refresh tokens + OAuth options
- **Validation**: Joi/Zod for comprehensive validation

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Animations**: Framer Motion + GSAP
- **State**: Zustand for global state management
- **Charts**: Recharts/D3 for data visualization
- **Forms**: React Hook Form with validation

## 📁 Detailed Project Structure

```
git_collab/
├── AI_backend/                    # Python FastAPI Backend
│   ├── main.py                   # FastAPI application entry point
│   ├── pyproject.toml            # Python dependencies and config
│   ├── app/
│   │   ├── __init__.py
│   │   ├── agents/               # AI Agent implementations
│   │   │   ├── resume_parser_agent.py     # Resume parsing agent
│   │   │   ├── resume_analyzer_agent.py   # Job compatibility analysis
│   │   │   └── __init__.py
│   │   ├── tools/                # External tool integrations
│   │   │   ├── web_search_tool.py # Web search capabilities
│   │   │   └── __init__.py
│   │   ├── workflows/            # Agent orchestration workflows
│   │   │   ├── resume_analysis_workflow.py # Main analysis workflow
│   │   │   └── __init__.py
│   │   ├── analyzer.py           # Legacy analysis functions
│   │   ├── parse.py             # Legacy parsing functions
│   │   └── memory/              # Context and conversation memory
│   ├── tests/                   # Unit and integration tests
│   │   ├── test_analyzer.py
│   │   ├── test_main.py
│   │   ├── test_parse.py
│   │   └── conftest.py
│   ├── Uploaded_files/          # Temporary file storage
│   └── .venv/                   # Python virtual environment
├── Backend/                     # Node.js Express Backend
│   ├── index.js                 # Express application entry point
│   ├── package.json             # Node.js dependencies
│   ├── controller/
│   │   ├── analysisController.js # Analysis API endpoints
│   │   ├── UserController.js    # User management endpoints
│   │   └── JobSearchController.js # Job search endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── rateLimiter.js       # Rate limiting middleware
│   ├── model/
│   │   ├── db.js               # MongoDB connection and schemas
│   │   └── User.js             # User model (if separated)
│   ├── routes/
│   │   ├── analysisRoutes.js   # Analysis API routes
│   │   ├── userRoutes.js       # User management routes
│   │   └── jobSearchRoutes.js  # Job search routes
│   ├── tests/                  # Backend tests
│   │   ├── AnalysisController.test.js
│   │   ├── UserController.test.js
│   │   └── setup.js
│   └── .env                    # Environment variables
├── Fe/                         # React Frontend
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── src/
│   │   ├── main.jsx            # React application entry point
│   │   ├── App.jsx             # Main App component
│   │   ├── Components/         # Reusable UI components
│   │   │   ├── NavBar.jsx
│   │   │   ├── Background.jsx
│   │   │   ├── AnimatedContent.jsx
│   │   │   └── ...
│   │   ├── Pages/              # Page components
│   │   │   ├── Auth/           # Authentication pages
│   │   │   │   ├── UserSignin.jsx
│   │   │   │   └── UserSignup.jsx
│   │   │   ├── Dashboard/      # Main dashboard
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Profile/        # User profile pages
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── EditProfile.jsx
│   │   │   └── LoadingPage/    # Landing page
│   │   │       └── LoadingPage.jsx
│   │   ├── Context/            # React context providers
│   │   │   └── ProfileContext.jsx
│   │   ├── assets/             # Static assets (images, icons)
│   │   └── index.css           # Global styles
│   └── public/                 # Public assets
│       └── Reactbits/          # UI component library
├── docker/                     # Docker configurations
│   ├── docker-compose.yml      # Production compose
│   ├── docker-compose.dev.yml  # Development compose
│   ├── Dockerfile.ai-backend   # AI backend container
│   ├── Dockerfile.backend      # Node backend container
│   ├── Dockerfile.frontend     # Frontend container
│   └── nginx.conf              # Nginx configuration
├── docs/                       # Documentation
├── start.sh                    # Startup script
├── stop.sh                     # Shutdown script
├── README.md                   # This file
└── .gitignore                  # Git ignore patterns
```

## 🏛️ System Architecture

### Microservices Architecture

DMatch follows a microservices architecture with three main components:

#### 1. AI Backend (Python/FastAPI)
**Purpose**: Handles all AI-powered analysis and processing
**Key Responsibilities**:
- Resume parsing and structuring
- Job compatibility analysis
- Market intelligence gathering
- Agent orchestration and workflow management

**Technology Stack**:
- **Framework**: FastAPI (async Python web framework)
- **AI/ML**: OpenAI GPT-4, LangChain, CrewAI
- **Tools**: Web search, PDF/DOCX processing
- **Deployment**: Uvicorn ASGI server

#### 2. API Backend (Node.js/Express)
**Purpose**: Manages business logic, authentication, and data persistence
**Key Responsibilities**:
- User authentication and authorization
- API request routing and validation
- Database operations and caching
- File upload handling and processing

**Technology Stack**:
- **Framework**: Express.js with middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schema validation

#### 3. Frontend (React/Vite)
**Purpose**: Provides modern, responsive user interface
**Key Responsibilities**:
- User interaction and experience
- Data visualization and analytics
- File upload and progress tracking
- Real-time updates and notifications

**Technology Stack**:
- **Framework**: React 18 with hooks
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS + custom components
- **State Management**: React Context + local state
- **Animations**: Framer Motion

### Data Flow Architecture

```
User Request → Frontend → API Backend → AI Backend → External APIs
                      ↓              ↓              ↓
                JWT Validation → Database → Agent Workflow → Web Search
                      ↓              ↓              ↓
               Response ← Cache ← Analysis ← Market Data
```

### Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  username: String (email, unique),
  password: String (hashed),
  firstname: String,
  lastname: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Analysis History Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  resume_filename: String,
  jd_text_used: String,
  jd_title_used: String,
  overall_score: Number,
  skills_score: Number,
  experience_score: Number,
  education_score: Number,
  matched_keywords: [String],
  missing_keywords: [String],
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  summary_critique: String,
  structured_resume: Object,
  file_id: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/user/signup`
Create a new user account.

**Request Body**:
```json
{
  "username": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here"
}
```

#### POST `/user/signin`
Authenticate user and get JWT token.

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

### Analysis Endpoints

#### POST `/analysis`
Upload resume and job description for AI analysis.

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `resume`: File (PDF/DOCX/TXT)
- `jdText`: String (Job description text)
- `jdTitle`: String (Optional job title)

**Response**:
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "analysis": {
    "id": "analysis_id",
    "overall_score": 85,
    "skills_score": 90,
    "experience_score": 80,
    "education_score": 85,
    "matched_keywords": ["React", "Node.js", "Python"],
    "missing_keywords": ["AWS", "Docker"],
    "strengths": ["Strong technical skills"],
    "weaknesses": ["Limited cloud experience"],
    "recommendations": ["Add AWS certifications"],
    "summary_critique": "Excellent candidate...",
    "structured_resume": {
      "contact_info": {...},
      "experience": [...],
      "education": [...],
      "skills": [...]
    }
  }
}
```

#### GET `/analysis/history`
Get user's analysis history.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response**:
```json
{
  "success": true,
  "analyses": [
    {
      "_id": "analysis_id",
      "resume_filename": "resume.pdf",
      "jd_title": "Senior Developer",
      "overall_score": 85,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAnalyses": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET `/analysis/stats`
Get user's analysis statistics.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalAnalyses": 25,
    "averageScore": 78,
    "highestScore": 95,
    "lowestScore": 45,
    "averageSkillsScore": 82,
    "averageExperienceScore": 75,
    "averageEducationScore": 80,
    "analysesThisMonth": 8,
    "analysesThisWeek": 3,
    "scoreDistribution": {
      "excellent": 12,
      "good": 8,
      "average": 4,
      "poor": 1
    }
  }
}
```

## 🤖 AI Agent Architecture

### Agent Roles and Responsibilities

#### 1. Resume Parser Agent
**Purpose**: Extract and structure resume information
**Capabilities**:
- Parse contact information
- Extract work experience with dates and descriptions
- Identify education and certifications
- Extract skills and technologies
- Parse project information

#### 2. Resume Analyzer Agent
**Purpose**: Compare resume against job requirements
**Capabilities**:
- Calculate compatibility scores
- Identify matching and missing keywords
- Generate strengths and weaknesses analysis
- Provide improvement recommendations
- Assess overall job fit

#### 3. Research Agent (Future)
**Purpose**: Gather market intelligence
**Capabilities**:
- Company research and information
- Salary range analysis
- Industry trends and insights
- Competitor analysis
- Job market data

### Agent Workflow

```
Resume Upload → Parser Agent → Structured Data
                                      ↓
Job Description → Analyzer Agent → Compatibility Analysis
                                      ↓
Research Agent → Market Intelligence → Final Recommendations
```

## 🧪 Testing Strategy

### Backend Testing
```bash
cd Backend
npm test                    # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### AI Backend Testing
```bash
cd AI_backend
python -m pytest          # Run all tests
python -m pytest --cov    # Coverage report
```

### Frontend Testing
```bash
cd Fe
npm test                  # Run tests
npm run test:coverage     # Coverage report
```

### Integration Testing
```bash
# Manual integration tests
curl -X POST http://localhost:3000/analysis \
  -H "Authorization: Bearer <token>" \
  -F "resume=@test_resume.pdf" \
  -F "jdText=Job description here"
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run all services
docker-compose -f docker/docker-compose.yml up --build

# Development with hot reload
docker-compose -f docker/docker-compose.dev.yml up
```

### Environment Variables
```bash
# AI Backend
OPENAI_API_KEY=your_openai_key
ENVIRONMENT=production

# API Backend
MONGODB_URL=mongodb://localhost:27017/git_collab
JWT_SECRET=your_super_secret_key
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:3000
```

## 🔧 Development Guidelines

### Code Style

#### Python (AI Backend)
- Follow PEP 8 style guidelines
- Use type hints for function parameters
- Maximum line length: 88 characters (Black formatter)
- Use docstrings for all functions and classes

#### JavaScript/Node.js (Backend)
- Use ESLint and Prettier
- Follow Airbnb JavaScript style guide
- Use async/await for asynchronous operations
- Implement proper error handling

#### React (Frontend)
- Use functional components with hooks
- Follow React best practices
- Implement proper state management
- Use TypeScript for type safety (future)

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Pull request process
# 1. Create PR with description
# 2. Code review and testing
# 3. Merge to main branch
```

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📈 Performance Optimization

### AI Backend Optimizations
- Async processing for non-blocking operations
- Connection pooling for external API calls
- Caching for repeated requests
- Memory-efficient file processing

### API Backend Optimizations
- Database indexing for fast queries
- Redis caching for frequent data
- Rate limiting to prevent abuse
- Compression for API responses

### Frontend Optimizations
- Code splitting and lazy loading
- Image optimization and WebP format
- Bundle analysis and tree shaking
- Service worker for caching

## 🔐 Security Measures

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Secure cookie handling

### Data Protection
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- File upload security

### API Security
- CORS configuration
- Request validation with Zod
- Error message sanitization
- API versioning

## 📊 Monitoring & Logging

### Application Monitoring
- Health check endpoints
- Performance metrics collection
- Error tracking and alerting
- User analytics

### Logging Strategy
- Structured logging with Winston
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation
- Log rotation and retention

## 🎯 Future Roadmap

### Phase 2: Enhanced Backend
- [ ] Redis caching implementation
- [ ] Rate limiting middleware
- [ ] Background job processing
- [ ] API documentation with Swagger
- [ ] User preferences and settings

### Phase 3: Advanced Frontend
- [ ] Real-time notifications
- [ ] Advanced data visualizations
- [ ] Export functionality
- [ ] Theme customization
- [ ] Accessibility improvements

### Phase 4: AI Enhancements
- [ ] Multiple AI model support
- [ ] Conversational AI chat
- [ ] Resume optimization suggestions
- [ ] Interview preparation module
- [ ] Job matching algorithms

### Phase 5: Enterprise Features
- [ ] Multi-tenant architecture
- [ ] Team collaboration
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and quotas
- [ ] White-label solutions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the troubleshooting section above

---

**Built with ❤️ for job seekers and recruiters worldwide**

## 🚀 Getting Started (After Revamp)

1. **Prerequisites**:
   ```bash
   # Install Docker and Docker Compose
   # Set up environment variables
   cp AI_backend/.env.example AI_backend/.env
   cp Backend/.env.example Backend/.env
   ```

2. **Development Setup**:
   ```bash
   # Start all services
   docker-compose -f docker/docker-compose.dev.yml up --build
   ```

3. **Access Points**:
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8000/docs
   - Backend API: http://localhost:3000

4. **Key Features**:
   - Upload resume and get agentic analysis
   - Chat with AI for personalized advice
   - View detailed analytics and recommendations
   - Manage profile and preferences

## 🎨 Design Philosophy

- **Modern & Clean**: Minimalist design with focus on content
- **Interactive & Engaging**: Smooth animations and transitions
- **Accessible**: WCAG compliant with keyboard navigation
- **Responsive**: Perfect experience on all devices
- **Performance**: Optimized loading and smooth interactions

## 🔒 Security Considerations

- Input validation and sanitization
- Rate limiting and abuse prevention
- Secure file upload handling
- JWT token management
- CORS configuration
- Environment variable security

## 📊 Monitoring & Analytics

- User behavior tracking
- Performance metrics
- Error logging and alerting
- Usage analytics
- AI model performance monitoring

---

## ✅ Phase 1 Implementation Complete - Agentic AI Backend

### 🤖 AI Backend Agentic Enhancement - COMPLETED ✅
- **✅ Installed LangChain, CrewAI, and agent frameworks**
- **✅ Created ResumeParserAgent**: Intelligent parsing and structuring of resume data
- **✅ Created ResumeAnalyzerAgent**: Advanced job-description compatibility analysis
- **✅ Created WebSearchTool**: External research capabilities for market intelligence
- **✅ Created ResumeAnalysisWorkflow**: Orchestrates multiple agents for comprehensive analysis
- **✅ Updated main.py**: Integrated agentic workflow into FastAPI endpoints
- **✅ Enhanced Dependencies**: Added all required packages for agent orchestration

### Key Features Implemented:
- **Multi-Agent System**: Parser, Analyzer, and Research agents working together
- **Intelligent Parsing**: AI-powered extraction of structured resume data
- **Advanced Analysis**: Comprehensive scoring across 6 dimensions (skills, experience, education, similarity, keywords, overall)
- **Market Intelligence**: Web search integration for salary data, company info, and skill requirements
- **Enhanced Recommendations**: Market-driven suggestions combined with resume-specific feedback
- **CrewAI Integration**: Ready for advanced multi-agent orchestration

### API Enhancements:
- **Agentic Analysis**: `/analyze-resume` now uses the full agent workflow
- **Structured Output**: Returns parsed resume data, detailed analysis, market intelligence, and recommendations
- **Error Handling**: Robust fallback mechanisms and comprehensive error reporting
- **Async Processing**: Non-blocking AI operations with proper concurrency

---

## 🚀 Current System Capabilities

### AI Backend Features:
- **Resume Parsing**: Extracts contact info, experience, education, skills, projects
- **Job Matching**: 6-dimensional scoring system with detailed feedback
- **Market Research**: Company info, salary ranges, in-demand skills
- **Agent Orchestration**: Multiple AI agents working collaboratively
- **Web Integration**: External data gathering for enhanced analysis

### Backend Features:
- **JWT Authentication**: Secure user management
- **Analysis History**: Persistent storage of analysis results
- **API Validation**: Comprehensive input validation and error handling
- **Database Integration**: MongoDB with structured schemas

### Next Steps:
1. **Phase 2**: Backend API enhancements (rate limiting, caching, analytics)
2. **Phase 3**: Complete frontend redesign with animations and modern UI
3. **Phase 4**: Integration, testing, and deployment

The foundation is now set for a world-class resume analysis platform with advanced AI capabilities!

---

## 🚀 Quick Start (One-Command Setup)

### Option 1: Automated Startup (Recommended)
Use the provided scripts for easy startup:

1. **Set Environment Variables**:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

2. **Start Everything with One Command**:
   ```bash
   cd git_collab
   ./start.sh
   ```

   This will:
   - ✅ Check and install dependencies automatically
   - ✅ Start MongoDB
   - ✅ Start AI Backend (port 8000)
   - ✅ Start Backend API (port 3000)
   - ✅ Start Frontend (port 5173)
   - ✅ Show status and provide access URLs

3. **Stop Everything**:
   ```bash
   ./stop.sh
   ```

### Option 2: Manual Startup

1. **Install Dependencies**:
   ```bash
   cd AI_backend && uv sync
   cd ../Backend && npm install
   cd ../Fe && npm install
   ```

2. **Environment Setup**:
   ```bash
   # AI Backend
   echo "OPENAI_API_KEY=your_key_here" > AI_backend/.env

   # Backend
   echo "MONGODB_URL=mongodb://localhost:27017/git_collab" > Backend/.env
   echo "JWT_SECRET=your-super-secret-jwt-key" >> Backend/.env
   ```

3. **Start Services Manually**:
   ```bash
   # Terminal 1: MongoDB
   brew services start mongodb-community

   # Terminal 2: AI Backend
   cd AI_backend && python main.py

   # Terminal 3: Backend API
   cd Backend && npm run dev

   # Terminal 4: Frontend
   cd Fe && npm run dev
   ```

## 🌐 Access Your Application

Once running, access these endpoints:

- **🎨 Frontend (React)**: http://localhost:5173
- **🔧 Backend API**: http://localhost:3000
- **🤖 AI Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs

## 📊 What You'll Get

Your resume analyzer now features:

- **🎯 Agentic AI Analysis**: Multi-agent system with intelligent parsing and analysis
- **📈 6-Dimensional Scoring**: Comprehensive evaluation across skills, experience, education, similarity, keywords, and overall fit
- **🔍 Market Intelligence**: Real-time job market data and company research
- **💡 Smart Recommendations**: Actionable feedback based on AI analysis and market trends
- **⚡ Production Ready**: Async processing, error handling, and robust architecture

## 🛠️ Troubleshooting

### Common Issues:

1. **Port Already in Use**:
   ```bash
   # Kill processes on specific ports
   lsof -ti:8000 | xargs kill -9  # AI Backend
   lsof -ti:3000 | xargs kill -9  # Backend API
   lsof -ti:5173 | xargs kill -9  # Frontend
   ```

2. **MongoDB Issues**:
   ```bash
   # Check MongoDB status
   brew services list | grep mongodb

   # Restart MongoDB
   brew services restart mongodb-community
   ```

3. **Dependency Issues**:
   ```bash
   # Reinstall all dependencies
   cd AI_backend && rm -rf .venv && uv sync
   cd ../Backend && rm -rf node_modules && npm install
   cd ../Fe && rm -rf node_modules && npm install
   ```

4. **Environment Variables**:
   ```bash
   # Check if OPENAI_API_KEY is set
   echo $OPENAI_API_KEY

   # Set it if missing
   export OPENAI_API_KEY="your_key_here"
   ```

## 📝 Available Scripts

- **`./start.sh`**: Start all services with automatic dependency checking
- **`./stop.sh`**: Stop all running services gracefully
- **`./logs/`**: Directory containing service logs (created automatically)

The system now features agentic AI analysis with comprehensive resume-job matching capabilities! 🚀
