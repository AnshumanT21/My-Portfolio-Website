import React, { useState } from 'react';
import { Send, Github, Linkedin, Twitter } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import CanvasParticles from './CanvasParticles';

const ContactScreen = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // --- 1. CONFIGURATION ---
    const yourEmail = "anshumantyagi20@gmail.com";
    const subject = `Portfolio Contact from ${formData.name}`;
    
    // --- 2. CREATE EMAIL BODY ---
    // %0D%0A creates a line break
    const body = `Name: ${formData.name}%0D%0A` +
                 `Email: ${formData.email}%0D%0A%0D%0A` +
                 `Message:%0D%0A${formData.message}`;

    // --- 3. OPEN EMAIL CLIENT ---
    // Simulating a short delay for the button animation
    setTimeout(() => {
        // UPDATED: window.open with '_blank' attempts to open in a new tab/window
        window.open(`mailto:${yourEmail}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
        
        setSending(false);
        setFormData({ name: '', email: '', message: '' });
        alert("Opening your email client...");
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#421F16] pt-32 pb-20 px-6 flex items-center font-['Love_Ya_Like_A_Sister']">
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

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <ScrollReveal animation="fadeDown" delay={0}>
            <p className="text-[#FFFDD0] font-medium mb-4 tracking-widest uppercase text-sm font-sans">Let's Connect</p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold text-[#FFFDD0] mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={200}>
            <p className="text-[#FFFDD0]/60 text-lg font-sans">
              Have a project in mind? Let's create something amazing together.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="slideUp" delay={300}>
          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            <div className="space-y-6">
              <ScrollReveal animation="fadeLeft" delay={400}>
                <div>
                  <label className="block text-[#FFFDD0]/40 text-sm uppercase tracking-wider mb-3">Name</label>
                  <input
                    type="text"
                    name="name" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#FFFDD0]/20 focus:border-[#FFFDD0] py-4 text-[#FFFDD0] text-xl outline-none transition-colors placeholder:text-[#FFFDD0]/30"
                    placeholder="Your name"
                    required
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fadeRight" delay={500}>
                <div>
                  <label className="block text-[#FFFDD0]/40 text-sm uppercase tracking-wider mb-3">Email</label>
                  <input
                    type="email"
                    name="email" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-[#FFFDD0]/20 focus:border-[#FFFDD0] py-4 text-[#FFFDD0] text-xl outline-none transition-colors placeholder:text-[#FFFDD0]/30"
                    placeholder="youremail@gmail.com"
                    required
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fadeLeft" delay={600}>
                <div>
                  <label className="block text-[#FFFDD0]/40 text-sm uppercase tracking-wider mb-3">Message</label>
                  <textarea
                    name="message" 
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-[#FFFDD0]/20 focus:border-[#FFFDD0] py-4 text-[#FFFDD0] text-xl outline-none transition-colors placeholder:text-[#FFFDD0]/30 resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal animation="fadeUp" delay={700}>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-5 bg-[#FFFDD0] text-[#421F16] rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#FFFDD0]/30 transition-all duration-300 disabled:opacity-50 hover:-translate-y-1"
              >
                {sending ? (
                  <>Opening Mail App...</>
                ) : (
                  <>Send Message <Send className="w-5 h-5" /></>
                )}
              </button>
            </ScrollReveal>
          </form>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={800}>
          <div className="mt-16 flex justify-center gap-6">
            <a 
              href="https://github.com/AnshumanT21" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-[#FFFDD0]/5 rounded-2xl hover:bg-[#FFFDD0]/10 transition-colors group border border-[#FFFDD0]/10 hover:border-[#FFFDD0]/30"
            >
              <Github className="w-6 h-6 text-[#FFFDD0]/60 group-hover:text-[#FFFDD0] transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/anshuman-tyagi-955455315/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-[#FFFDD0]/5 rounded-2xl hover:bg-[#FFFDD0]/10 transition-colors group border border-[#FFFDD0]/10 hover:border-[#FFFDD0]/30"
            >
              <Linkedin className="w-6 h-6 text-[#FFFDD0]/60 group-hover:text-[#FFFDD0] transition-colors" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ContactScreen;