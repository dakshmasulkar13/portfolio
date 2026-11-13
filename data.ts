// ─────────────────────────────────────────────────────────────
//  EDIT ME — placeholders. Leave a value empty ('') and the UI
//  shows it as a clearly-labelled placeholder instead of a dead link.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  email: '', // e.g. 'you@example.com'
  linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
  github: '', // e.g. 'https://github.com/your-handle'
  resume: '', // e.g. '/resume.pdf' (put the file in /public)
}

export const SECTIONS = [
  { id: 'top', label: 'HERO' },
  { id: 'portrait', label: 'PORTRAIT' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'ARSENAL' },
  { id: 'projects', label: 'BUILDS' },
  { id: 'path', label: 'PATH' },
  { id: 'contact', label: 'CONTACT' },
]

export const ABOUT = [
  { tag: '01 — THE BEGINNING', text: "Meet Daksh Masulkar — an ambitious 18-year-old technology enthusiast pursuing a Bachelor of Technology in Artificial Intelligence and Data Science at Ajeenkya D Y Patil University. Young in age, but driven by a mindset that refuses to settle for ordinary. With a growing passion for programming, emerging technologies, and artificial intelligence, Daksh is building the foundation to become an engineer who doesn't simply adapt to the future but actively contributes to creating it." },
  { tag: '02 — THE MINDSET', text: "Curiosity is his starting point, but execution is what defines his ambition. From exploring Python and software development to experimenting with AI-powered applications and digital experiences, Daksh believes that every challenge is an opportunity to learn something extraordinary. He approaches technology with an experimental mindset, embraces the process of learning through mistakes, and constantly looks for ways to turn ideas into meaningful creations." },
  { tag: '03 — THE VISION', text: "His ambition extends beyond earning a degree or securing a job. Daksh wants to develop the technical expertise, creative thinking, and problem-solving abilities required to build impactful technology. With an interest in artificial intelligence, entrepreneurship, and innovation, he is focused on becoming a versatile engineer capable of contributing to ambitious projects and collaborating with people who think beyond limitations. His journey is only beginning, and he intends to make every step count." },
]

export const SKILLS = [
  { name: 'Python', desc: 'Where most of my AI and automation experiments begin.' },
  { name: 'C Programming', desc: 'Learning how computers really work, close to the metal.' },
  { name: 'HTML', desc: 'The structure behind the interfaces I design and build.' },
  { name: 'CSS', desc: 'Layout, motion and visual identity on the web.' },
  { name: 'JavaScript', desc: 'Making interfaces interactive and alive.' },
  { name: 'Git', desc: 'Version-control habits for building in an organised way.' },
  { name: 'GitHub', desc: 'Where projects live, evolve and get shared.' },
  { name: 'AI Tools', desc: 'Exploring AI-powered tools to build and learn faster.' },
  { name: 'Prompt Engineering', desc: 'Learning to communicate clearly with language models.' },
  { name: 'Problem Solving', desc: 'Breaking hard problems into steps worth solving.' },
]

// NOTE: technology tags below are reasonable placeholders — edit to match what you actually use.
export const PROJECTS = [
  {
    n: '01', title: 'AI STUDY ASSISTANT', kind: 'study',
    desc: 'An AI-powered study companion designed to help students understand concepts, organize learning, and improve productivity across Android and Windows.',
    tech: ['Android', 'Windows', 'Python', 'AI APIs'], status: 'IN DEVELOPMENT',
  },
  {
    n: '02', title: 'AI VOICE ASSISTANT', kind: 'voice',
    desc: 'An experimental AI assistant exploring conversational interfaces, voice interactions, and intelligent digital assistance.',
    tech: ['Python', 'Speech', 'LLM'], status: 'EXPERIMENTAL',
  },
  {
    n: '03', title: 'COLLEGE MANAGEMENT PLATFORM', kind: 'college',
    desc: 'A student-focused management platform concept designed around accessibility, organized information, and security-conscious architecture.',
    tech: ['HTML', 'CSS', 'JavaScript'], status: 'CONCEPT',
  },
]

export const PATH_BLOCKS = [
  { k: 'HACKATHONS', note: 'No verified entries yet.' },
  { k: 'TECHNICAL LEARNING', note: 'Reserved for courses & self-study.' },
  { k: 'CERTIFICATIONS', note: 'No verified entries yet.' },
  { k: 'WORKSHOPS', note: 'No verified entries yet.' },
  { k: 'ACHIEVEMENTS', note: 'Only verified achievements will appear here.' },
]
