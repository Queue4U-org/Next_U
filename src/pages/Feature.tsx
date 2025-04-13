import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { motion } from 'framer-motion';

export const Feature = ({ onClose }: { onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detector, setDetector] = useState<handPoseDetection.HandDetector | null>(null);
  const [flickCount, setFlickCount] = useState(0);
  const positionHistory = useRef<{ z: number }[]>([]);
  const lastFlickTime = useRef(0);
  const animationRef = useRef<number>();

  // Initialize hand detection
  useEffect(() => {
    const initHandDetection = async () => {
      try {
        await tf.setBackend('webgl');
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
          modelType: 'full'
        } as const;
        
        const handDetector = await handPoseDetection.createDetector(model, detectorConfig);
        setDetector(handDetector);
        setIsLoading(false);
        
        // Start webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          detectHands();
        }
      } catch (error) {
        console.error('Error initializing hand detection:', error);
        setIsLoading(false);
      }
    };

    initHandDetection();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const detectHands = async () => {
    if (!videoRef.current || !canvasRef.current || !detector) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = async () => {
      try {
        const hands = await detector.estimateHands(video);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (hands.length > 0) {
          const hand = hands[0];
          const indexFinger = hand.keypoints.find(k => k.name === 'index_finger_tip');
          
          if (indexFinger) {
            // Draw finger tip
            ctx.beginPath();
            ctx.arc(indexFinger.x, indexFinger.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            
            // Track position history for flick detection
            const currentTime = Date.now();
            const zPosition = indexFinger.z * 100;
            
            positionHistory.current.push({ z: zPosition });
            if (positionHistory.current.length > 10) {
              positionHistory.current.shift();
            }
            
            // Detect flick gesture
            if (positionHistory.current.length >= 5) {
              const zMovement = positionHistory.current[0].z - positionHistory.current[4].z;
              const flickThreshold = 5;
              
              if (zMovement > flickThreshold && currentTime - lastFlickTime.current > 500) {
                lastFlickTime.current = currentTime;
                setFlickCount(prev => prev + 1);
                
                // Visual feedback for flick
                ctx.fillStyle = '#FF0000';
                ctx.fill();
                
                // Draw flick text
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '24px Arial';
                ctx.fillText('FLICK!', indexFinger.x - 30, indexFinger.y - 20);
              }
            }
            
            // Draw debug info
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial';
            ctx.fillText(`X: ${Math.round(indexFinger.x)}`, 20, 30);
            ctx.fillText(`Y: ${Math.round(indexFinger.y)}`, 20, 60);
            ctx.fillText(`Z: ${indexFinger.z.toFixed(2)}`, 20, 90);
            ctx.fillText(`Flicks: ${flickCount}`, 20, 120);
          }
          
          // Draw hand landmarks
          hand.keypoints.forEach(keypoint => {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF00FF';
            ctx.fill();
          });
        }
      } catch (error) {
        console.error('Error detecting hands:', error);
      }
      
      animationRef.current = requestAnimationFrame(detect);
    };
    
    animationRef.current = requestAnimationFrame(detect);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-navy-900 rounded-lg p-6 border border-teal-500 max-w-4xl w-full relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-teal-400 flex items-center gap-2">
            ✨ Touchless Interaction
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400 mb-4"></div>
            <p>Loading hand detection model...</p>
          </div>
        ) : (
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full rounded-lg border border-navy-700"
              style={{ display: 'block' }}
            />
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            />
            
            <div className="mt-4 bg-navy-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">How to use:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Show your hand to the camera</li>
                <li>Move your index finger to interact</li>
                <li>Perform a quick forward flick to register a flick</li>
              </ul>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-lg">
                  <span className="font-semibold">Flicks detected:</span> {flickCount}
                </div>
                <button 
                  onClick={() => setFlickCount(0)}
                  className="bg-navy-700 hover:bg-navy-600 px-3 py-1 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
