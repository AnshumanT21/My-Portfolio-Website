import React, { useState, useRef, Suspense } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Torus, Octahedron, Icosahedron, MeshDistortMaterial, Outlines } from '@react-three/drei';
import ChromaGrid from './ChromaGrid';
import ScrollReveal from './ScrollReveal';
import TiltedCard from './TiltedCard';
import CanvasParticles from './CanvasParticles';
import DecryptedText from './DecryptedText';
import TrueFocus from './TrueFocus';
import FallingText from './FallingText';

// --- 3D Icons (For Modal) ---

const SpinningIcon = ({ shape = 'torus', color }) => {
  return (
    <div className="w-16 h-16 inline-block align-middle">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <SpinningMesh shape={shape} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
};

const SpinningMesh = ({ shape, color }) => {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.5;
    mesh.current.rotation.y += delta * 0.6;
  });

  const Material = <MeshDistortMaterial color={color} speed={2} distort={0.3} roughness={0.2} />;

  // Special case for Clothing Icon
  if (shape === 'shirt') {
    return (
      <Float speed={4} rotationIntensity={1} floatIntensity={1}>
        <group ref={mesh} scale={1.8}>
          <Text
            fontSize={1.2}
            anchorX="center"
            anchorY="middle"
          >
            👕
          </Text>
        </group>
      </Float>
    );
  }

  if (shape === 'book') {
    return (
      <Float speed={4} rotationIntensity={1} floatIntensity={1}>
        <group ref={mesh} scale={1.8}>
          <Text
            fontSize={1.2}
            anchorX="center"
            anchorY="middle"
          >
            📚
          </Text>
        </group>
      </Float>
    );
  }

  if (shape === 'vault') {
    return (
      <Float speed={4} rotationIntensity={1} floatIntensity={1}>
        <group ref={mesh} scale={1.8}>
          {/* Main Body (Cube) */}
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            {Material}
            <Outlines thickness={0.05} color={color} />
          </mesh>
          
          {/* Handle Wheel (Torus) */}
          <mesh position={[0, 0, 0.55]}>
            <torusGeometry args={[0.25, 0.04, 16, 32]} />
            {Material}
          </mesh>
          
          {/* Handle Center (Cylinder) */}
          <mesh position={[0, 0, 0.55]} rotation={[1.57, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            {Material}
          </mesh>

          {/* Handle Spokes (Thin Boxes) */}
          <mesh position={[0, 0, 0.55]}>
             <boxGeometry args={[0.04, 0.5, 0.04]} />
             {Material}
          </mesh>
          <mesh position={[0, 0, 0.55]} rotation={[0, 0, 1.57]}>
             <boxGeometry args={[0.04, 0.5, 0.04]} />
             {Material}
          </mesh>
        </group>
      </Float>
    );
  }

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={mesh} scale={1.2}>
        {shape === 'torus' && <torusGeometry args={[0.6, 0.2, 16, 32]} />}
        {shape === 'octahedron' && <octahedronGeometry args={[0.8]} />}
        {shape === 'icosahedron' && <icosahedronGeometry args={[0.8, 0]} />}
        {Material}
        <Outlines thickness={0.05} color={color} />
      </mesh>
    </Float>
  );
};

// --- Main Component ---

const ProjectsScreen = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: 'Try It On!',
      subtitle: 'Uses AI to create a 3D model from your photo.',
      handle: 'Python • React Native • Supabase',
      image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1763872937/TryItOn_ExhibitLogo_k1fjn1.jpg',
      url: 'https://github.com/AnshumanT21/Try-It-On-',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, rgba(79, 70, 229, 0.3), rgba(0,0,0,0.8))',
      shape: 'shirt', 
      
      category: 'Mobile App',
      description: 'Uses AI to create a 3D model from your photo, letting you virtually try on clothes and view them from every angle.',
      challenge: 'Try It On! was built to solve the challenge of visualizing clothing on real people without needing physical try-ons.',
      approach: 'Using AI-powered 3D reconstruction, a React Native frontend, and a Python/Flask backend, the app generates realistic 3D models from uploaded images.',
      results: 'The result is a reliable, high-quality virtual try-on experience with fast processing, detailed meshes, and clean model previews.',
      technologies: ['Python', 'React Native', 'Cloudinary', 'Supabase', 'TripoSR'],
      year: '2025'
    },
    {
      title: 'Book Santa App',
      subtitle: 'A peer-to-peer platform for donating and discovering books in your community.',
      handle: 'Javascript • React • Firebase',
      image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764705418/unnamed_erc65q.jpg',
      url: 'https://github.com/AnshumanT21/Book-Santa-App',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, rgba(16, 185, 129, 0.3), rgba(0,0,0,0.8))',
      shape: 'book',

      category: 'Mobile App',
      description: 'Built on the belief that every book deserves a reader, Book Santa is a mobile platform that facilitates book donations and exchanges. By connecting donors with recipients, the app promotes literacy, sustainability, and community building—one book at a time.',
      challenge: 'Physical books often collect dust after a single read, while others struggle to afford new reading material. How do we reduce waste while fostering a community of readers who believe books should be shared, not shelved?',
      approach: 'Design a user-friendly mobile platform using React Native and JavaScript that removes friction from book sharing. The app will feature an easy upload flow for donors and an intuitive browsing experience for recipients, making book exchanges as simple as a few swipes.',
      results: 'Developed a complete end-to-end mobile application, gaining hands-on experience with React Native, state management, and cross-platform development. The project proved my ability to transform a social impact idea into a working technical solution.',
      technologies: ['Javascript', 'React Native', 'Firebase'],
      year: '2022'
    },
    {
      title: 'Dev Vault',
      subtitle: 'A mobile workspace for designers and developers to organize, save, and access their creative resources on the go.',
      handle: 'React Native • Tailwind CSS • Google Firebase',
      image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764710966/unnamed_j1ongw.jpg',
      url: 'https://www.devvault.co/',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, rgba(245, 158, 11, 0.3), rgba(0,0,0,0.8))',
      shape: 'vault',

      category: 'Mobile App',
      description: "Dev Vault is a centralized resource management app built for creative professionals who constantly discover inspiration across the web. Whether it's a useful React component, a color palette, a design system, or a helpful article, Dev Vault keeps everything organized and accessible from your pocket—eliminating the chaos of scattered bookmarks and forgotten links.",
      challenge: "Designers and developers bookmark countless resources—code snippets, design inspiration, component libraries, tutorials—but they're scattered across browsers, notes apps, and screenshots. When you need something while working, finding that perfect gradient or animation you saved weeks ago becomes a frustrating treasure hunt. How do we create a centralized, mobile-first solution that makes resource management effortless?",
      approach: 'Build a React Native app with intelligent categorization and tagging systems that allow users to save links, screenshots, and code snippets in organized collections. The focus is on speed—quick capture, fast search, and instant access. Features include automatic metadata extraction from URLs, customizable folders, tags for cross-referencing, and offline access to saved resources.',
      results: 'Created a fully functional mobile app with seamless resource saving, smart categorization, and powerful search capabilities. The project demonstrates proficiency in building productivity tools with complex data organization, while solving a real pain point experienced by creative professionals daily.',
      technologies: ['React Native', 'Tailwind CSS', 'Google Firebase Database'],
      year: '2025',
    },
  ];

  const gridItems = projects.map((p, index) => ({
    ...p,
    id: index,
    onClick: () => setSelectedProject(p)
  }));

  return (
    <div className="min-h-screen bg-[#421F16] relative font-['Love_Ya_Like_A_Sister']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap');
        
        .font-handwritten {
          font-family: 'Love Ya Like A Sister', cursive;
        }

        .tilted-card-overlay {
          width: 100%;
          height: 100%;
        }

        /* CUSTOM SCROLLBAR STYLING */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(66, 31, 22, 0.3); /* Dark brown track */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFFDD0; /* Cream Thumb */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fcf8b5;
        }
      `}</style>

      {/* Background Particles */}
      <div className="absolute inset-0 z-0 opacity-50">
        <CanvasParticles 
          particleColors={['#FFFDD0', '#A7F3D0', '#ffffff']} 
          particleCount={200} 
          moveParticlesOnHover={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="text-center mb-16">
          <ScrollReveal animation="fadeDown" delay={0}>
            <p className="text-[#FFFDD0] font-medium mb-4 tracking-widest uppercase text-sm font-sans">Featured Work</p>
          </ScrollReveal>
          
          {/* True Focus Animation for Title */}
          <div className="mb-6 flex justify-center text-4xl md:text-6xl font-bold text-[#FFFDD0] font-handwritten">
             <TrueFocus 
               sentence="My Projects"
               manualMode={false}
               blurAmount={6}
               borderColor="#FFFDD0"
               glowColor="rgba(255, 253, 208, 0.4)"
               animationDuration={0.8}
               pauseBetweenAnimations={0.5}
             />
          </div>

          <ScrollReveal animation="fadeUp" delay={200}>
            {/* Replaced static paragraph with FallingText animation */}
            <div className="text-[#FFFDD0]/80 text-lg max-w-2xl mx-auto font-sans h-32 relative">
              <FallingText
                text="A curated collection of my best work, showcasing expertise in web development, design systems, and creative technology."
                highlightWords={["web", "development,", "design", "systems,", "creative", "technology."]}
                highlightClass="text-[#FFFDD0] font-bold" 
                trigger="hover"
                backgroundColor="transparent"
                wireframes={false}
                gravity={0.56}
                fontSize="1.125rem"
                mouseConstraintStiffness={0.9}
              />
            </div>
          </ScrollReveal>
        </div>
        
        <ScrollReveal animation="slideUp" delay={300}>
          <ChromaGrid items={gridItems} />
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div   
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#421F16]/95 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl h-[85vh] md:h-[800px]" 
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute -top-12 right-0 md:-right-10 text-[#FFFDD0]/60 hover:text-[#FFFDD0] transition-colors p-2 z-[110]"
              >
                <X size={32} />
              </button>

              <div className="hidden md:block h-full">
                <TiltedCard
                  imageSrc={selectedProject.image}
                  altText={selectedProject.title}
                  captionText={selectedProject.title}
                  containerHeight="100%" 
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%" 
                  rotateAmplitude={5}
                  scaleOnHover={1.0} 
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div 
                      className="w-full h-full overflow-y-auto rounded-[15px] custom-scrollbar pointer-events-auto"
                    >
                      <div className="min-h-full flex flex-col justify-end p-8 md:p-10 bg-gradient-to-t from-[#623f04] via-[#623f04]/95 to-[#421F16]/40">
                        <div className="mt-[400px]">
                          <div className="flex items-center gap-3 mb-4 font-sans">
                            <span className="text-[#FFFDD0] text-xs font-bold uppercase tracking-wider border border-[#FFFDD0]/30 px-2 py-1 rounded bg-[#FFFDD0]/10">
                              {selectedProject.category}
                            </span>
                            <span className="text-[#FFFDD0]/60 text-xs font-bold uppercase tracking-wider">
                              {selectedProject.year}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-6">
                            <SpinningIcon shape={selectedProject.shape} color="#FFFDD0" />
                            <h2 className="text-4xl font-bold text-[#FFFDD0] leading-tight font-handwritten">
                              {selectedProject.title}
                            </h2>
                          </div>
                          
                          {/* Decrypted Subtitle Animation */}
                          <div className="mb-8 font-sans text-sm text-[#FFFDD0]/90">
                            <DecryptedText
                              text={selectedProject.subtitle}
                              speed={50}
                              maxIterations={20}
                              animateOn="view"
                              revealDirection="start"
                              className="leading-relaxed"
                            />
                          </div>
                          
                          <div className="space-y-8 text-sm text-[#FFFDD0]/90 mb-8 font-sans">
                            <div>
                              <h4 className="text-[#FFFDD0] font-bold mb-2 uppercase text-xs tracking-wide">Description</h4>
                              <div className="leading-relaxed text-base">
                                <DecryptedText
                                  text={selectedProject.description}
                                  speed={50}
                                  maxIterations={20}
                                  animateOn="view"
                                  revealDirection="start"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[#FFFDD0] font-bold mb-2 uppercase text-xs tracking-wide">Challenge</h4>
                              <div className="leading-relaxed">
                                <DecryptedText
                                  text={selectedProject.challenge}
                                  speed={50}
                                  maxIterations={20}
                                  animateOn="view"
                                  revealDirection="start"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[#FFFDD0] font-bold mb-2 uppercase text-xs tracking-wide">Approach</h4>
                              <div className="leading-relaxed">
                                <DecryptedText
                                  text={selectedProject.approach}
                                  speed={50}
                                  maxIterations={20}
                                  animateOn="view"
                                  revealDirection="start"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[#FFFDD0] font-bold mb-2 uppercase text-xs tracking-wide">Results</h4>
                              <div className="leading-relaxed">
                                <DecryptedText
                                  text={selectedProject.results}
                                  speed={50}
                                  maxIterations={20}
                                  animateOn="view"
                                  revealDirection="start"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8 font-sans">
                            {selectedProject.technologies?.map((tech, i) => (
                              <span key={i} className="text-xs font-medium text-[#FFFDD0] bg-[#FFFDD0]/10 px-3 py-1.5 rounded-full border border-[#FFFDD0]/20">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {selectedProject.url && selectedProject.url !== '#' && (
                            <motion.a 
                              href={selectedProject.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              // Cream Button with Dark Brown text
                              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg shadow-lg font-sans"
                              style={{ backgroundColor: '#FFFDD0', color: '#421F16' }}
                              onClick={(e) => e.stopPropagation()}
                              whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0px 0px 15px rgba(255, 253, 208, 0.6)",
                                filter: "brightness(1.1)"
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {selectedProject.buttonText || 'View Project'} <ExternalLink size={16} />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Mobile View */}
              <div className="md:hidden bg-[#421F16] rounded-2xl overflow-hidden border border-[#FFFDD0]/20 h-full overflow-y-auto flex flex-col font-sans">
                <div className="h-64 shrink-0 relative">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#421F16] to-transparent" />
                </div>
                
                <div className="p-6 pt-0 grow flex flex-col">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="text-[#FFFDD0] text-xs font-bold uppercase tracking-wider border border-[#FFFDD0]/30 px-2 py-1 rounded bg-[#FFFDD0]/10">
                        {selectedProject.category}
                      </span>
                      <span className="text-[#FFFDD0]/60 text-xs font-bold uppercase tracking-wider">
                        {selectedProject.year}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-[#FFFDD0] mb-6 font-handwritten">{selectedProject.title}</h2>
                    
                    <div className="space-y-6 text-sm text-[#FFFDD0]/90 mb-8">
                      <div>
                        <strong className="text-[#FFFDD0] block text-xs uppercase mb-1">Description</strong>
                        <DecryptedText text={selectedProject.description} animateOn="view" revealDirection="start" />
                      </div>
                      <div>
                        <strong className="text-[#FFFDD0] block text-xs uppercase mb-1">Challenge</strong>
                        <DecryptedText text={selectedProject.challenge} animateOn="view" revealDirection="start" />
                      </div>
                      <div>
                        <strong className="text-[#FFFDD0] block text-xs uppercase mb-1">Approach</strong>
                        <DecryptedText text={selectedProject.approach} animateOn="view" revealDirection="start" />
                      </div>
                      <div>
                        <strong className="text-[#FFFDD0] block text-xs uppercase mb-1">Results</strong>
                        <DecryptedText text={selectedProject.results} animateOn="view" revealDirection="start" />
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProject.technologies?.map((tech, i) => (
                          <span key={i} className="text-xs font-medium text-[#FFFDD0] bg-[#FFFDD0]/10 px-2 py-1 rounded-full border border-[#FFFDD0]/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {selectedProject.url && selectedProject.url !== '#' && (
                        <motion.a 
                          href={selectedProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 font-bold rounded-lg shadow-lg"
                          style={{ backgroundColor: '#FFFDD0', color: '#421F16' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Project <ExternalLink size={16} />
                        </motion.a>
                      )}
                    </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default ProjectsScreen;


