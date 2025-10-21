# Robotics Documentation Platform

A comprehensive Fumadocs-based documentation site for robotics, featuring AI-powered assistance, component comparison tools, and interactive feedback system.

## 🚀 Features

### 📚 Comprehensive Documentation
- **Basic Components**: Motors, batteries, sensors, chargers, microcontrollers
- **Semi-Autonomous**: Control algorithms, PID tuning, wireless systems
- **Autonomous**: Navigation, AI logic, sensor fusion, SLAM
- **Combat Robotics**: Chassis design, weapons systems, power management
- **Industrial**: Robot arms, manipulators, automation systems

### 🤖 AI Assistant (`/ask`)
- Context-aware Q&A powered by Google Gemini
- Searches documentation for relevant context
- Instant answers to robotics questions
- Code examples included in responses

### 🔍 Component Comparison (`/compare`)
- Compare motors, batteries, sensors, ESCs, and microcontrollers
- Side-by-side specification tables
- Filter by component type
- Add/remove components dynamically

### 💬 Feedback System (`/feedback`)
- Star rating system (1-5)
- Text feedback with validation
- Stored locally in browser (no database required)
- Easy to extend with backend integration

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to directory
cd robotics-docs

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

## 🔑 API Configuration

### Gemini API (Optional - for AI Assistant)

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

3. The AI assistant will work automatically once configured

**Note**: Without the API key, the AI assistant will show a configuration message.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Documentation**: Fumadocs
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini 1.5 Flash
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Global layout with navbar & footer
│   ├── page.tsx                # Homepage
│   ├── ask/page.tsx            # AI Assistant page
│   ├── compare/page.tsx        # Component comparison page
│   ├── feedback/page.tsx       # Feedback form page
│   └── docs/                   # Fumadocs routes
│
├── components/
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer component
│   ├── ai-chat.tsx             # AI chatbot UI
│   ├── compare-table.tsx       # Comparison table
│   ├── feedback-form.tsx       # Feedback form
│   └── ui/                     # shadcn components
│
├── lib/
│   ├── gemini.ts               # Gemini API integration
│   ├── compare-data.ts         # Component specifications data
│   └── feedback.ts             # Local feedback storage
│
└── content/
    └── docs/                   # MDX documentation files
        ├── index.mdx
        ├── basics/
        ├── semi-autonomous/
        ├── autonomous/
        ├── combat/
        └── industrial/
```

## 📝 Adding Documentation

1. Create MDX files in `content/docs/`
2. Add frontmatter:

```mdx
---
title: Your Page Title
description: Brief description
---

# Your Page Title

Content goes here...
```

3. Fumadocs automatically generates the sidebar navigation

## 🔧 Customization

### Adding More Components to Compare

Edit `src/lib/compare-data.ts`:

```typescript
export const componentData: Record<ComponentType, ComponentSpec[]> = {
  motor: [
    {
      id: 'unique-id',
      name: 'Component Name',
      type: 'motor',
      manufacturer: 'Manufacturer',
      price: '$XX',
      specs: {
        voltage: '12V',
        // Add more specs...
      },
    },
  ],
  // Add more types...
};
```

### Customizing Colors/Theme

Edit `src/app/global.css` for theme variables.

### Modifying Navigation

Edit `src/components/navbar.tsx` to add/remove links.

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the .next folder
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📊 Component Comparison Data

Currently includes specifications for:
- **Motors**: N20, RS-775, Turnigy SK3, Pololu Micro Metal
- **Batteries**: Various LiPo and Li-ion options
- **Sensors**: Ultrasonic, IMU, LiDAR, Infrared
- **Microcontrollers**: Arduino Uno, ESP32, Raspberry Pi, Teensy
- **ESCs**: Various ratings and features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips

- **Search Docs**: Use the built-in Fumadocs search (Ctrl+K)
- **Dark Mode**: Automatically supported via Fumadocs
- **Mobile Responsive**: All pages work on mobile devices
- **Code Blocks**: MDX supports syntax highlighting
- **Interactive Components**: Embed React components in MDX

## 🐛 Troubleshooting

**AI Assistant not working?**
- Check if `NEXT_PUBLIC_GEMINI_API_KEY` is set in `.env.local`
- Verify API key is valid
- Check browser console for errors

**Feedback not saving?**
- Ensure localStorage is enabled in browser
- Check browser console for errors

**Docs not showing?**
- Run `npm run postinstall` to process MDX files
- Check `content/docs/` directory structure

## 📞 Support

For questions or issues:
- Email: robotics@example.com
- GitHub Issues: [Open an issue](https://github.com/your-repo/issues)
- Discord: [Join our community](#)

---

Built with ❤️ by the Robotics Club using [Fumadocs](https://fumadocs.dev)
