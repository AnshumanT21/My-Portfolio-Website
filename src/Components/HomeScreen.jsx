import React, { useRef, useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  GraduationCap, 
  Award,
  Code,
  Cpu
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CanvasParticles from './CanvasParticles';
import ScrollReveal from './ScrollReveal';
import DecryptedText from './DecryptedText';

// --- 3D Avatar Component ---
const AvatarModel = () => {
  const { scene } = useGLTF('https://models.readyplayer.me/692e7d86c833cf1a1d62e6c0.glb');
  
  // Scale and position adjusted to show head/shoulders in the circle
  return <primitive object={scene} scale={2.8} position={[0, -2.8, 0]} rotation={[0, 0, 0]} />;
};

// --- Tilted Avatar Component ---
const TiltedAvatar = () => {
  const ref = useRef(null);
  
  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring config for smooth physics
  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  
  // Create springs for rotation based on mouse position
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), springConfig);
  const scale = useSpring(1, springConfig);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    // Calculate mouse position relative to center of the element
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    x.set(offsetX);
    y.set(offsetY);
  }

  function handleMouseEnter() {
    scale.set(1.05); // Slight scale up on hover
  }

  function handleMouseLeave() {
    scale.set(1);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="w-full h-full rounded-full bg-[#421F16] backdrop-blur-xl flex items-center justify-center cursor-pointer"
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d", // Essential for 3D effect
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner content slightly elevated for depth */}
      <motion.span 
        className="text-6xl md:text-8xl"
        style={{ transform: "translateZ(20px)" }}
      >
        👨‍💻
      </motion.span>
    </motion.div>
  );
};

// Added setActivePage prop to enable navigation
const HomeScreen = ({ setActivePage }) => {
  const skills = [
    'Python', 'React Native', 'JavaScript', 'HTML/CSS', 'MATLAB',
    'Firebase', 'Full-Stack Development', '3D Modeling & Visualization',
  ];

  const experiences = [
    {
      type: 'education',
      icon: GraduationCap,
      title: 'B.S. Computer Engineering',
      company: 'University of Massachusetts Amherst',
      period: '2024 - 2028',
      description: 'Computer Engineering undergraduate currently in his sophomore year of studies.',
      achievements: [
        'Member of the prestigious iCons Program',
        "Dean's List all semesters"
      ]
    },
    {
      type: 'work',
      icon: Briefcase,
      title: 'AI & Automation Engineer Intern',
      company: 'Adwiti Technocrats',
      period: 'Summer 2025',
      description: 'Spearheaded the development of AI-driven tools and automated workflows to modernize digital operations and enhance efficiency.',
      achievements: [
        'AI Chatbot Integration: Deployed intelligent assistant for real-time policy analysis',
        'Multilingual Utility: Built paraphrasing tool to standardize insurance claim reports',
        'Automated Parsing: Streamlined workflows via document data extraction'
      ]
    },
    {
      type: 'certification',
      icon: Award,
      title: 'Certified Android and IOS Developer',
      company: 'WhiteHat JR',
      period: '2022',
      description: 'Professional certification for Android and IOS Development.',
      achievements: [
        'Developed cross-platform Android and iOS applications',
        'Built full-featured e-commerce platforms like BookSanta',
        'Integrated backend databases with responsive frontends'
      ]
    },
    {
      type: 'certification',
      icon: Award,
      title: 'Certified Game Developer',
      company: 'WhiteHat JR',
      period: '2020',
      description: 'Professional certification for Game Development with deep UI/UX interface.',
      achievements: [
        'Mastered game logic and physics-based mechanics',
        'Recreated Angry Birds, Flappy Bird, and T-Rex Runner',
        'Designed intuitive UI/UX and game interfaces'
      ]
    }
  ];

  return (
    // Applied the custom font and background color to the main container
    <div className="relative min-h-screen bg-[#421F16] font-['Love_Ya_Like_A_Sister']">
      {/* Import the Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap');
      `}</style>

      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <CanvasParticles
          particleColors={['#FFFDD0', '#F0E68C', '#FFE4B5']} // Creamy Gold particles
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      
      <div className="relative z-10 pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <ScrollReveal animation="fadeDown" delay={0}>
                <p className="text-[#FFFDD0]/80 font-medium mb-4 tracking-widest uppercase text-sm">Welcome to my portfolio</p>
              </ScrollReveal>
              <ScrollReveal animation="fadeUp" delay={100}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">Creative</span>
                  <br />
                  <span className="text-[#FFFDD0]">Developer</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fadeUp" delay={200}>
                <p className="text-[#FFFDD0]/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  Computer Engineering student dedicated to creating impactful software, from corporate automation tools to Try It On!
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fadeUp" delay={300}>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => setActivePage('projects')}
                    className="px-8 py-4 bg-[#FFFDD0] text-[#421F16] rounded-xl font-bold flex items-center gap-2 hover:bg-[#FFFDD0]/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#FFFDD0]/20"
                  >
                    View Projects <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActivePage('contact')}
                    className="px-8 py-4 bg-transparent border border-[#FFFDD0]/30 rounded-xl text-[#FFFDD0] font-medium hover:bg-[#FFFDD0]/10 transition-all duration-300"
                  >
                    Get in Touch
                  </button>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="scale" delay={400} className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFFDD0]/20 to-[#421F16]/20 blur-3xl" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FFFDD0] to-[#421F16] p-1" style={{ perspective: "1000px" }}>
                  <TiltedAvatar />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto mb-32">
          <ScrollReveal animation="blur" delay={0}>
            <div className="bg-[#FFFDD0]/5 backdrop-blur-2xl rounded-3xl border border-[#FFFDD0]/10 p-8 md:p-12 relative">
              <ScrollReveal animation="fadeLeft" delay={100}>
                <h2 className="text-3xl md:text-4xl font-bold text-[#FFFDD0] mb-6 flex items-center gap-3 flex-wrap">
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDD0] to-[#FFE4B5] inline-block pb-1">Anshuman Tyagi</span>
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8">
                <ScrollReveal animation="fadeUp" delay={200}>
                  <div>
                    <p className="text-[#FFFDD0]/70 leading-relaxed mb-4">
                      <DecryptedText
                        text="I build software that bridges the gap between technical complexity and human need. As a scholar in the UMass iCons program, I am constantly challenged to develop integrated solutions for real-world problems—a philosophy that drives my personal development work."
                        speed={100}
                        maxIterations={20}
                        animateOn="view"
                        revealDirection="start"
                      />
                    </p>
                    <p className="text-[#FFFDD0]/70 leading-relaxed mb-4">
                      <DecryptedText
                        text="When I'm not coding, you'll find me exploring new technologies, contributing to open source, or capturing moments through photography. Most recently, this led to the creation of Try It On!, where I leveraged AI to solve the 'fit' problem in online shopping through 3D visualization. I am a curious engineer looking for opportunities to apply my full-stack skills to projects that demand both technical excellence and social impact."
                        speed={100}
                        maxIterations={20}
                        animateOn="view"
                        revealDirection="start"
                      />
                    </p>
                    <p className="text-[#FFFDD0]/70 leading-relaxed">
                      <DecryptedText
                        text="Got an interesting project or idea? I'm always up for a conversation. Whether it's a challenging technical problem, a creative collaboration, or just an innovative concept you want to explore, reach out via email or LinkedIn. Let's build something great together."
                        speed={100}
                        maxIterations={20}
                        animateOn="view"
                        revealDirection="start"
                      />
                    </p>
                  </div>
                </ScrollReveal>
                <ScrollReveal animation="fadeUp" delay={300}>
                  <div className="space-y-4">
                    
                    {/* --- NEW IMAGE INSERTED HERE --- */}
                    <img 
                      src="https://res.cloudinary.com/dwrts9bjq/image/upload/v1764628049/0_djdrnc.jpg" 
                      alt="Anshuman Tyagi" 
                      className="w-full h-auto rounded-2xl border border-[#FFFDD0]/10 object-cover mb-2"
                    />
                    {/* ------------------------------- */}

                    <div className="flex items-center gap-3 text-[#FFFDD0]/80">
                      <MapPin className="w-5 h-5 text-[#FFFDD0]" />
                      <span>Amherst, MA</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#FFFDD0]/80">
                      <Briefcase className="w-5 h-5 text-[#FFFDD0]" />
                      <span>Open to opportunities</span>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <a href="#" className="p-3 bg-[#FFFDD0]/5 rounded-xl hover:bg-[#FFFDD0]/10 transition-colors">
                        <Github className="w-5 h-5 text-[#FFFDD0]" />
                      </a>
                      <a href="#" className="p-3 bg-[#FFFDD0]/5 rounded-xl hover:bg-[#FFFDD0]/10 transition-colors">
                        <Linkedin className="w-5 h-5 text-[#FFFDD0]" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Skills Section */}
        <section className="max-w-4xl mx-auto mb-32">
          <ScrollReveal animation="fadeUp" delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFDD0] mb-10 text-center flex items-center justify-center gap-3">
              <Cpu className="text-violet-400" /> Technical Skills
            </h2>
          </ScrollReveal>
          
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, i) => (
              <ScrollReveal key={i} animation="scale" delay={i * 50}>
                <div className="px-6 py-3 bg-[#FFFDD0]/5 backdrop-blur-xl border border-[#FFFDD0]/10 rounded-full text-[#FFFDD0]/90 hover:bg-[#FFFDD0]/10 hover:border-[#FFFDD0]/50 hover:text-[#FFFDD0] hover:scale-105 transition-all duration-300 cursor-default shadow-lg shadow-black/20">
                  {skill}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="max-w-4xl mx-auto">
          <ScrollReveal animation="fadeUp" delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFDD0] mb-12 text-center">Experience & Education</h2>
          </ScrollReveal>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFFDD0]/50 via-[#FFFDD0]/20 to-transparent" />
            
            {experiences.map((exp, i) => (
              <ScrollReveal 
                key={i} 
                animation={i % 2 === 0 ? 'fadeRight' : 'fadeLeft'} 
                delay={i * 150}
              >
                <div className={`relative flex flex-col md:flex-row gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Card Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                    <div className="bg-[#FFFDD0]/5 backdrop-blur-xl rounded-2xl border border-[#FFFDD0]/10 p-6 hover:border-[#FFFDD0]/50 transition-all duration-300 hover:-translate-y-1">
                      
                      <div className={`flex flex-col gap-2 mb-4 ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                        <div className="flex items-center gap-3 text-violet-400 mb-1">
                          <exp.icon size={20} />
                          <span className="text-sm font-bold tracking-wide uppercase">{exp.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#FFFDD0] leading-tight">{exp.title}</h3>
                        <div className="text-[#FFFDD0]/80 font-medium">{exp.company}</div>
                        <span className="text-sm text-[#FFFDD0]/60 bg-[#FFFDD0]/5 px-3 py-1 rounded-full w-fit">{exp.period}</span>
                      </div>

                      <p className="text-[#FFFDD0]/70 mb-4 leading-relaxed">{exp.description}</p>
                      
                      {exp.achievements && (
                        <ul className={`space-y-2 ${i % 2 === 0 ? 'md:items-end' : ''} flex flex-col`}>
                          {exp.achievements.map((achievement, j) => (
                            <li key={j} className={`text-sm text-[#FFFDD0]/60 flex items-start gap-2 ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFFDD0] shrink-0 opacity-80" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-[#FFFDD0] -translate-x-1/2 ring-4 ring-[#FFFDD0]/20 z-10 shadow-[0_0_15px_rgba(255,253,208,0.5)]" />
                  
                  {/* Spacer for the other side */}
                  <div className="flex-1" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;
