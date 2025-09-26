import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html, useProgress } from '@react-three/drei';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Tag, Eye, EyeOff } from 'lucide-react';

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-lg border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading {Math.round(progress)}%</span>
        </div>
      </div>
    </Html>
  );
}

// Fallback box for missing models
function FallbackBox({ model }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#6366f1" 
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  );
}

// Model component with fallback
function Model({ url, model }) {
  try {
    const { scene } = useGLTF(url);
    const meshRef = useRef();
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    });
    
    return (
      <group ref={meshRef}>
        <primitive object={scene.clone()} scale={1.5} />
      </group>
    );
  } catch (error) {
    return <FallbackBox model={model} />;
  }
}

export default function ModelViewer({ model, isExpanded = false, onToggleExpand }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative">
        {/* 3D Canvas */}
        <div 
          className={`relative transition-all duration-500 ${isExpanded ? 'h-96' : 'h-64'} bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.5} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1}
                intensity={1}
                castShadow
              />
              <pointLight 
                position={[-10, -10, -10]} 
                intensity={0.5}
                color="#8b5cf6"
              />
              
              <Model url={model.modelUrl} model={model} />
              
              <Environment preset="studio" />
              <OrbitControls 
                enablePan={false}
                minDistance={3}
                maxDistance={8}
                autoRotate={isHovered}
                autoRotateSpeed={2}
              />
            </Suspense>
          </Canvas>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
        
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                {model.name}
              </h3>
              {model.featured && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {model.description}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-purple-900/30 hover:border-purple-500/50 transition-colors"
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{new Date(model.dateCreated).toLocaleDateString()}</span>
            </div>
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              {model.category}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}