import { motion } from 'framer-motion';
import { Bell, Moon, Volume2, Shield, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const CyberpunkFace = () => {
  const faceRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const [faceSize, setFaceSize] = useState(100);
  const [glowIntensity, setGlowIntensity] = useState(80);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update face size and eye tracking
  useEffect(() => {
    if (!faceRef.current || !leftPupilRef.current || !rightPupilRef.current) return;

    // Update face size
    const baseSize = faceSize;
    faceRef.current.style.width = `${baseSize}px`;
    faceRef.current.style.height = `${baseSize * 1.3}px`;

    // Update eye sizes
    const eyeSize = baseSize * 0.25;
    const eyes = faceRef.current.querySelectorAll('.eye');
    eyes.forEach(eye => {
      (eye as HTMLElement).style.width = `${eyeSize}px`;
      (eye as HTMLElement).style.height = `${eyeSize}px`;
    });

    // Update pupil sizes
    const pupilSize = eyeSize * 0.5;
    leftPupilRef.current.style.width = `${pupilSize}px`;
    leftPupilRef.current.style.height = `${pupilSize}px`;
    rightPupilRef.current.style.width = `${pupilSize}px`;
    rightPupilRef.current.style.height = `${pupilSize}px`;

    // Position elements
    const eyeArea = faceRef.current.querySelector('.eye-area') as HTMLElement;
    const mouthArea = faceRef.current.querySelector('.mouth-area') as HTMLElement;
    if (eyeArea && mouthArea) {
      eyeArea.style.top = `${baseSize * 0.3}px`;
      mouthArea.style.bottom = `${baseSize * 0.2}px`;
      mouthArea.style.width = `${baseSize * 0.5}px`;
    }

    // Update eye tracking
    updateEyeTracking();
  }, [faceSize, mousePosition]);

  // Update glow effects
  useEffect(() => {
    if (!faceRef.current) return;

    const intensity = glowIntensity / 100;
    faceRef.current.style.boxShadow = `
      inset 0 0 ${30 * intensity}px rgba(110, 0, 255, 0.3),
      0 0 ${50 * intensity}px rgba(110, 0, 255, 0.5),
      0 0 ${100 * intensity}px rgba(0, 208, 255, 0.3)`;

    const eyes = faceRef.current.querySelectorAll('.eye');
    eyes.forEach(eye => {
      (eye as HTMLElement).style.boxShadow = `
        inset 0 0 ${20 * intensity}px rgba(110, 0, 255, 0.5),
        0 0 ${30 * intensity}px rgba(110, 0, 255, 0.7)`;
    });

    const pupils = faceRef.current.querySelectorAll('.pupil');
    pupils.forEach(pupil => {
      (pupil as HTMLElement).style.boxShadow = `
        0 0 ${20 * intensity}px #00d0ff,
        inset 0 0 ${10 * intensity}px rgba(0, 208, 255, 0.5)`;
    });
  }, [glowIntensity]);

  const updateEyeTracking = () => {
    if (!leftPupilRef.current || !rightPupilRef.current || !faceRef.current) return;

    const faceRect = faceRef.current.getBoundingClientRect();
    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;

    // Update mouth based on distance
    const dx = mousePosition.x - faceCenterX;
    const dy = mousePosition.y - faceCenterY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), faceRect.width * 0.5);

    if (mouthRef.current) {
      const mouthOpen = Math.min(distance / 100, 0.5);
      mouthRef.current.style.height = `${15 + mouthOpen * 10}%`;
      mouthRef.current.style.borderRadius = `0 0 ${50 - mouthOpen * 20}% ${50 - mouthOpen * 20}% / 0 0 ${100 - mouthOpen * 40}% ${100 - mouthOpen * 40}%`;
    }

    // Update both eyes
    [leftPupilRef.current, rightPupilRef.current].forEach((pupil, index) => {
      const eye = pupil.parentElement;
      if (!eye) return;

      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const eyeDx = mousePosition.x - eyeCenterX;
      const eyeDy = mousePosition.y - eyeCenterY;
      const eyeDistance = Math.min(Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy), eyeRect.width * 0.3);
      const angle = Math.atan2(eyeDy, eyeDx);

      pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * eyeDistance / 2}px), calc(-50% + ${Math.sin(angle) * eyeDistance / 2}px))`;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center mb-8">
      <div className="mb-4 flex gap-4">
        <div className="control-group">
          <label htmlFor="sizeControl" className="text-xs uppercase tracking-wider mb-1">
            Face Size
          </label>
          <input
            type="range"
            id="sizeControl"
            min="50"
            max="200"
            value={faceSize}
            onChange={(e) => setFaceSize(parseInt(e.target.value))}
            className="w-32 h-1 bg-navy-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
          />
        </div>
        <div className="control-group">
          <label htmlFor="glowControl" className="text-xs uppercase tracking-wider mb-1">
            Glow Intensity
          </label>
          <input
            type="range"
            id="glowControl"
            min="0"
            max="100"
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
            className="w-32 h-1 bg-navy-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
          />
        </div>
      </div>

      <div className="face-container">
        <div 
          ref={faceRef}
          className="face bg-[#1a1a2e] border-2 border-[#6e00ff] rounded-[50%_50%_45%_45%_/_60%_60%_40%_40%] relative transition-all"
          style={{
            boxShadow: `
              inset 0 0 30px rgba(110, 0, 255, 0.3),
              0 0 50px rgba(110, 0, 255, 0.5),
              0 0 100px rgba(0, 208, 255, 0.3)`
          }}
        >
          <div className="absolute inset-0 rounded-inherit shadow-[inset_0_0_50px_rgba(0,208,255,0.2)] pointer-events-none" />
          
          <svg className="circuit-lines absolute inset-0 w-full h-full stroke-[rgba(0,208,255,0.2)] stroke-[1px] fill-none pointer-events-none">
            <path d="M20,20 L80,20 L80,80 L20,80 Z" />
            <path d="M30,30 L70,30 L70,70 L30,70 Z" />
            <path d="M40,40 L60,40 L60,60 L40,60 Z" />
            <circle cx="50" cy="50" r="10" />
            <line x1="50" y1="20" x2="50" y2="80" />
            <line x1="20" y1="50" x2="80" y2="50" />
          </svg>
          
          <div className="hud-elements absolute inset-0 pointer-events-none overflow-hidden">
            <div className="hud-line horizontal absolute w-full h-[1px] left-0 bg-[rgba(0,208,255,0.1)]" style={{ top: '30%' }} />
            <div className="hud-line horizontal absolute w-full h-[1px] left-0 bg-[rgba(0,208,255,0.1)]" style={{ top: '70%' }} />
            <div className="hud-line vertical absolute w-[1px] h-full top-0 bg-[rgba(0,208,255,0.1)]" style={{ left: '30%' }} />
            <div className="hud-line vertical absolute w-[1px] h-full top-0 bg-[rgba(0,208,255,0.1)]" style={{ left: '70%' }} />
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff]" style={{ top: '10%', left: '10%' }}>SYNTH-OS v3.2.7</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-right" style={{ top: '10%', right: '10%' }}>STATUS: ACTIVE</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff]" style={{ bottom: '10%', left: '10%' }}>NEURAL INPUT: 87%</div>
            <div className="hud-text absolute text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-right" style={{ bottom: '10%', right: '10%' }}>MOTOR FUNC: 100%</div>
          </div>

          <div className="eye-area absolute w-full h-[30%] flex justify-around" style={{ top: '30%' }}>
            <div 
              className="eye bg-black rounded-full border-2 border-[#6e00ff] overflow-hidden relative"
              style={{
                boxShadow: `
                  inset 0 0 20px rgba(110, 0, 255, 0.5),
                  0 0 30px rgba(110, 0, 255, 0.7)`
              }}
            >
              <div className="eye-inner absolute inset-0 bg-[radial-gradient(circle_at_center,#120030_0%,#000_70%)] rounded-full" />
              <div 
                ref={leftPupilRef}
                className="pupil absolute bg-[radial-gradient(circle_at_30%_30%,#00d0ff_0%,#000_70%)] rounded-full transition-transform"
                style={{
                  boxShadow: `
                    0 0 20px #00d0ff,
                    inset 0 0 10px rgba(0, 208, 255, 0.5)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <div 
                className="eye-grid absolute inset-0 rounded-full"
                style={{
                  background: `
                    linear-gradient(rgba(0, 208, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 208, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />
            </div>
            <div 
              className="eye bg-black rounded-full border-2 border-[#6e00ff] overflow-hidden relative"
              style={{
                boxShadow: `
                  inset 0 0 20px rgba(110, 0, 255, 0.5),
                  0 0 30px rgba(110, 0, 255, 0.7)`
              }}
            >
              <div className="eye-inner absolute inset-0 bg-[radial-gradient(circle_at_center,#120030_0%,#000_70%)] rounded-full" />
              <div 
                ref={rightPupilRef}
                className="pupil absolute bg-[radial-gradient(circle_at_30%_30%,#00d0ff_0%,#000_70%)] rounded-full transition-transform"
                style={{
                  boxShadow: `
                    0 0 20px #00d0ff,
                    inset 0 0 10px rgba(0, 208, 255, 0.5)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <div 
                className="eye-grid absolute inset-0 rounded-full"
                style={{
                  background: `
                    linear-gradient(rgba(0, 208, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 208, 255, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />
            </div>
          </div>

          <div 
            className="mouth-area absolute w-[50%] h-[15%] left-1/2 -translate-x-1/2 flex justify-center"
            style={{ bottom: '20%' }}
          >
            <div 
              ref={mouthRef}
              className="mouth w-full h-[15%] bg-black border-2 border-t-0 border-[#6e00ff] rounded-[0_0_50%_50%_/_0_0_100%_100%] relative overflow-hidden transition-all"
              style={{
                boxShadow: `
                  inset 0 -10px 20px rgba(110, 0, 255, 0.5),
                  0 0 20px rgba(110, 0, 255, 0.5)`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#6e00ff] opacity-30" />
              <div className="teeth absolute inset-0 w-full h-full flex justify-around">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="tooth w-[8%] h-[40%] bg-white rounded-[0_0_3px_3px] shadow-[0_0_5px_#00d0ff]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="status-text text-xs text-[#00d0ff] [text-shadow:0_0_5px_#00d0ff] text-center mt-2">
        SYNTHETIC ENTITY TRACKING: ENABLED | INPUT SOURCE: OPTICAL SENSORS
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  const [settings, setSettings] = useState([
    { icon: Bell, label: 'Notifications', value: true },
    { icon: Moon, label: 'Dark Mode', value: true },
    { icon: Volume2, label: 'Sound Effects', value: true },
    { icon: Shield, label: 'Privacy', value: false },
  ]);

  const toggleSetting = (index: number) => {
    const updatedSettings = [...settings];
    updatedSettings[index].value = !updatedSettings[index].value;
    setSettings(updatedSettings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <CyberpunkFace />
      
      <div className="bg-navy-900 rounded-lg divide-y divide-blue-900">
        {settings.map((setting, index) => (
          <div key={index} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-blue-400" />
              <span>{setting.label}</span>
            </div>
            <button
              onClick={() => toggleSetting(index)}
              className={`w-12 h-6 rounded-full transition-colors ${
                setting.value ? 'bg-blue-600' : 'bg-navy-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  setting.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => console.log('Logging out...')}
        className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </motion.div>
  );
};
