const { GoogleGenAI } = require("@google/genai");
const Project = require('../models/Project');
const Blog = require('../models/Blog');

const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
  console.log('✅ Gemini initialized with model: gemini-2.0-flash (using @google/genai)');
} else {
  console.warn('⚠️ GEMINI_API_KEY not set. Using local fallback.');
}

// Fetch portfolio data from DB
const getPortfolioContext = async () => {
  try {
    const projects = await Project.find({ isPublished: true })
      .limit(10)
      .select('title description technologies category');
    const blogs = await Blog.find({ isPublished: true })
      .limit(5)
      .select('title excerpt category');

    const skills = [
      'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JavaScript',
      'REST APIs', 'Git', 'MERN Stack', 'Firebase', 'HTML5', 'CSS3'
    ];

    const projectsText = projects.map(p =>
      `- ${p.title} (${p.category}): ${p.description}. Technologies: ${p.technologies.join(', ')}`
    ).join('\n');

    const blogsText = blogs.map(b =>
      `- ${b.title}: ${b.excerpt}`
    ).join('\n');

    return {
      projects,
      blogs,
      skills,
      text: `
Portfolio Information:
- Name: Muhammad Shoaib
- Role: Full Stack Developer
- Skills: ${skills.join(', ')}
- Projects:\n${projectsText || 'No projects yet.'}
- Blog Posts:\n${blogsText || 'No blog posts yet.'}
      `
    };
  } catch (error) {
    console.error('Error fetching portfolio context:', error);
    return { projects: [], blogs: [], skills: [], text: 'Portfolio data temporarily unavailable.' };
  }
};

// Local fallback replies (unchanged)
const getLocalReply = (message, context) => {
  const msg = message.toLowerCase();
  const { projects = [], skills = [], blogs = [] } = context;

  if (msg.includes('project') || msg.includes('work')) {
    if (!projects.length) return "No projects listed yet. Check back soon!";
    return `I have ${projects.length} project(s): ${projects.map(p => p.title).join(', ')}. Which one would you like to know more about?`;
  }
  if (msg.includes('skill') || msg.includes('tech')) {
    return `My main skills: ${skills.join(', ')}.`;
  }
  if (msg.includes('blog') || msg.includes('article')) {
    if (!blogs.length) return "No blog posts published yet, stay tuned!";
    return `I've written ${blogs.length} post(s): ${blogs.map(b => b.title).join(', ')}.`;
  }
  if (msg.includes('contact') || msg.includes('email')) {
    return "You can reach me through the Contact form on this website.";
  }
  if (msg.includes('about') || msg.includes('who')) {
    return "I'm Muhammad Shoaib, a full-stack developer specializing in React and Node.js.";
  }
  if (msg.includes('hi') || msg.includes('hello')) {
    return "Hello! Ask me about my projects, skills, or blog posts.";
  }
  return "I can tell you about my projects, skills, blog posts, or how to contact me. What would you like to know?";
};

// Main chat controller
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const context = await getPortfolioContext();

    if (ai) {
      const prompt = `
You are a friendly assistant for Muhammad Shoaib's portfolio website.
Use the following information to answer the user's question.
If unrelated to the portfolio, politely redirect.

${context.text}

User: ${message}
Assistant:`;

      try {
        console.log('Sending to Gemini...');
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
        });
        const reply = response.text;
        console.log('Gemini replied successfully.');
        return res.json({ reply });
      } catch (aiError) {
        console.error('Gemini API error:', aiError.message);
        // Fall through to local reply
      }
    }

    // Local fallback
    const reply = getLocalReply(message, context);
    res.json({ reply });

  } catch (error) {
    console.error('Chat controller error:', error);
    res.json({ reply: "I'm having trouble right now. Please try again later." });
  }
};