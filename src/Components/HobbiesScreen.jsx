import React from 'react';
import ScrollReveal from './ScrollReveal';
import CanvasParticles from './CanvasParticles';

const HobbiesScreen = () => {
  const hobbies = [
    { title: 'Photography', desc: 'Capturing moments and exploring visual storytelling', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764657673/0_o7kvmr.jpg' },
    { title: 'Gaming', desc: 'I like Mastering complex mechanics and crafting unique builds in vast open worlds', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764625697/ghost-of-tsusima-scenery-w0-1280x2120_ltmgap.jpg' },
    { title: 'Travel', desc: 'I love discovering Hidden Alleys and underrated Gems.', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764625925/0_eun24e.jpg' },
    { title: 'Formula 1', desc: 'F1 fan who loves the speed almost as much as the off-track drama.', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764712090/3629a2ebd94fc211c1470a26490270a9_hybwdc.jpg' },
    { title: '3D Printing', desc: 'I design and print miniature 3D figurines as a creative outlet.', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764711928/3d-printed-brush-bots-MRRF-scaled.jpg_wjlewn.webp' },
    { title: 'Football', desc: 'Been Playing Football since I was 9 years old.', img: 'https://www.aljazeera.com/wp-content/uploads/2021/08/2019-12-07T000000Z_879038429_RC2LQD9L67FQ_RTRMADP_3_SOCCER-SPAIN-FCB-RCD-REPORT.jpg?resize=770%2C513&quality=80' },
  ];

  return (
    // Updated Background and Font
    <div className="relative min-h-screen bg-[#421F16] pt-32 pb-20 px-6 font-['Love_Ya_Like_A_Sister']">
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap');
      `}</style>

      {/* Background Particles */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <CanvasParticles
          particleColors={['#FFFDD0', '#F0E68C', '#FFE4B5']} 
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content Container with z-index to sit above particles */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <ScrollReveal animation="fadeDown" delay={0}>
            <p className="text-[#FFFDD0] font-medium mb-4 tracking-widest uppercase text-sm font-sans">Beyond Code</p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold text-[#FFFDD0] mb-6">
              Off the <span className="gradient-text">Clock</span>, on my <span className="gradient-text">Craft</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={200}>
            <p className="text-[#FFFDD0]/60 text-lg max-w-2xl mx-auto font-sans">
              Life outside of development - the passions and interests that keep me inspired and balanced.
            </p>
          </ScrollReveal>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {hobbies.map((hobby, i) => (
            <ScrollReveal 
              key={i} 
              animation={i % 2 === 0 ? 'fadeUp' : 'scale'} 
              delay={i * 100}
            >
              <div className="relative break-inside-avoid group overflow-hidden rounded-3xl border border-[#FFFDD0]/10">
                <img 
                  src={hobby.img} 
                  alt={hobby.title}
                  // Added conditional height class for 'Photography' and '3D Printing'
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${hobby.title === 'Photography', '3D Printng' ? 'h-[600px]' : 'h-auto'}`}
                />
                {/* Updated Gradient Overlay to match Dark Brown theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#421F16]/95 via-[#421F16]/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Updated Card Styling */}
                  <div className="bg-[#FFFDD0]/10 backdrop-blur-2xl rounded-2xl border border-[#FFFDD0]/20 p-5">
                    <h3 className="text-xl font-bold text-[#FFFDD0] mb-2">{hobby.title}</h3>
                    <p className="text-[#FFFDD0]/70 text-sm font-sans">{hobby.desc}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HobbiesScreen;