# MedSpa AI Marketing Platform

A modern, AI-powered marketing platform designed specifically for medical aesthetics clinics. Built with Next.js 15, TypeScript, and cutting-edge UI components to deliver personalized customer experiences and data-driven marketing campaigns.

![MedSpa Platform](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC)

## 🎯 Features

### Core Functionality
- **Customer Management**: Comprehensive customer profiles with lifecycle tracking and loyalty tiers
- **AI-Powered Campaigns**: Intelligent content generation with personalization templates
- **Real-time Analytics**: Advanced dashboard with performance metrics and insights
- **Multi-channel Marketing**: Support for Email and SMS campaigns
- **Campaign Wizard**: Step-by-step campaign creation with AI assistance

### Technical Highlights
- **Modern Stack**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Professional UI**: shadcn/ui components with custom theming
- **Data Visualization**: Interactive charts using Recharts
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Robust Error Handling**: Error boundaries and graceful fallbacks
- **Toast Notifications**: Real-time user feedback system
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd medspa-marketing

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
medspa-marketing/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Dashboard home page
│   │   ├── customers/          # Customer management
│   │   ├── campaigns/          # Campaign management
│   │   ├── analytics/          # Analytics dashboard
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── layout/            # Navigation and layout
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── customers/         # Customer components
│   │   ├── campaigns/         # Campaign components
│   │   ├── analytics/         # Analytics components
│   │   └── providers/         # Context providers
│   ├── lib/                   # Utilities and configurations
│   ├── data/                  # Sample data files
│   └── styles/               # Global styles and polish
├── public/                    # Static assets
└── [config files]            # Various configuration files
```

## 🛣️ Development Milestones

### ✅ Milestone 1: Project Foundation
- [x] Next.js 15 setup with TypeScript and Tailwind CSS
- [x] shadcn/ui component integration
- [x] Purple theme color scheme implementation
- [x] Core TypeScript interfaces and types
- [x] Basic project structure and routing

### ✅ Milestone 2: Navigation Layout
- [x] Responsive sidebar navigation with icons
- [x] Top header with search and user menu
- [x] Mobile navigation with hamburger menu
- [x] Active state highlighting
- [x] Collapsible sidebar functionality

### ✅ Milestone 3: Dashboard Page
- [x] KPI metric cards with trend indicators
- [x] Customer lifecycle pie chart
- [x] Campaign performance line chart
- [x] Activity feed with recent interactions
- [x] Responsive grid layout

### ✅ Milestone 4: Customer Management
- [x] Customer list with advanced filtering
- [x] Search functionality (name, email, phone)
- [x] Customer detail pages with comprehensive profiles
- [x] Purchase history and interaction timeline
- [x] Customer cards with hover effects

### ✅ Milestone 5: Campaign Management
- [x] Campaign list with performance metrics
- [x] Status badges and type indicators
- [x] Campaign detail pages with full analytics
- [x] Content preview with HTML rendering
- [x] Target audience visualization

### ✅ Milestone 6: Campaign Creation Wizard
- [x] Multi-step wizard interface
- [x] Customer selection and filtering
- [x] AI content generation with 5 templates
- [x] Template personalization system
- [x] Campaign preview and scheduling

### ✅ Milestone 7: Analytics Dashboard
- [x] Performance overview with date range selection
- [x] Customer analytics with lifecycle insights
- [x] Campaign analytics with conversion funnels
- [x] Revenue trends and treatment analysis
- [x] Interactive charts and tabbed interface

### ✅ Milestone 8: Polish & Enhancements
- [x] Loading skeleton components
- [x] Error boundary implementation
- [x] Empty state designs with actions
- [x] Toast notification system
- [x] Smooth animations and transitions
- [x] Accessibility improvements
- [x] Production build optimization

## 🧩 Key Components

### Analytics Components
- **PerformanceOverview**: KPI metrics with trend analysis
- **CustomerAnalytics**: Lifecycle and loyalty insights
- **CampaignAnalytics**: Performance trends and ROI
- **RevenueTrends**: Financial analysis and forecasting

### UI Enhancement Components
- **LoadingSkeletons**: Smooth loading states
- **ErrorBoundary**: Graceful error handling
- **EmptyStates**: Contextual empty page designs
- **Transitions**: Smooth animations and effects

### Campaign Features
- **CreateWizard**: Step-by-step campaign builder
- **AITemplates**: 5 personalization templates
- **ContentGeneration**: Dynamic content creation
- **TargetAudience**: Advanced customer segmentation

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#9333ea) - Brand and accent color
- **Success**: Green (#10b981) - Positive actions and metrics
- **Warning**: Amber (#f59e0b) - Caution and attention
- **Error**: Red (#ef4444) - Errors and destructive actions

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Scale**: Responsive typography with consistent hierarchy
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components
- **Cards**: Subtle shadows with hover effects
- **Buttons**: Multiple variants with loading states
- **Forms**: Consistent spacing and validation styles
- **Charts**: Purple theme with interactive tooltips

## 🔧 Technical Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Development Tools
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (configured via ESLint)
- **Type Checking**: TypeScript strict mode
- **Build**: Next.js optimized production builds

## 📊 Analytics Features

### Customer Insights
- Lifecycle stage distribution and trends
- Loyalty tier value analysis
- Treatment preferences and popularity
- Customer acquisition patterns

### Campaign Performance
- Open rates, click rates, and conversions
- Channel comparison (Email vs SMS)
- ROI analysis and revenue attribution
- Conversion funnel visualization

### Revenue Analytics
- Monthly revenue trends and forecasting
- Treatment-based revenue breakdown
- Customer lifetime value by tier
- Performance metrics and KPIs

## 🔐 Data Structure

### Customer Schema
```typescript
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  lifecycleStage: 'New' | 'Active' | 'At-Risk' | 'Dormant'
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  customerValue: number
  // ... additional fields
}
```

### Campaign Schema
```typescript
interface Campaign {
  id: string
  name: string
  type: 'Email' | 'SMS'
  status: 'Active' | 'Scheduled' | 'Completed'
  metrics: {
    sent: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
  // ... additional fields
}
```

## 🚀 Performance Optimizations

- **Static Generation**: Pre-rendered pages for optimal loading
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Analysis**: Optimized chunks for minimal load times
- **Caching**: Efficient data fetching with built-in caching

## 🌟 User Experience Features

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Loading States**: Skeleton components for smooth transitions
- **Error Handling**: Graceful degradation with retry mechanisms
- **Toast Notifications**: Real-time feedback for user actions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Dark Mode Ready**: CSS custom properties for theme switching

## 📈 Future Enhancements

- [ ] Real-time WebSocket notifications
- [ ] Advanced A/B testing framework
- [ ] Customer journey mapping
- [ ] Integration with email/SMS providers
- [ ] Machine learning recommendations
- [ ] Multi-location support
- [ ] Role-based access control
- [ ] Advanced reporting exports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Recharts** for powerful data visualization
- **Framer Motion** for smooth animations
- **Lucide** for comprehensive icon set
- **Next.js** team for the amazing framework

---

Built with ❤️ using modern web technologies for the medical aesthetics industry.

🤖 Generated with [Claude Code](https://claude.ai/code)
