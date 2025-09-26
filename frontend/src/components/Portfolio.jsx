import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Palette, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ModelViewer from './ModelViewer';
import { mockModels, categories } from '../data/mock';

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedModel, setExpandedModel] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter models based on search and category
  const filteredModels = useMemo(() => {
    return mockModels.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleToggleExpand = (modelId) => {
    setExpandedModel(expandedModel === modelId ? null : modelId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Header */}
      <header className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Palette className="text-purple-400 mr-3" size={32} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              3D Portfolio
            </h1>
            <Sparkles className="text-pink-400 ml-3" size={32} />
          </div>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore my collection of 3D models, crafted with precision and creativity. 
            Each piece tells a unique story through interactive visualization.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-400">{mockModels.length}</div>
              <div className="text-sm text-slate-400">Total Models</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-pink-400">{categories.length - 1}</div>
              <div className="text-sm text-slate-400">Categories</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-300">{mockModels.filter(m => m.featured).length}</div>
              <div className="text-sm text-slate-400">Featured</div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search models, tags, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-900/50 border-slate-600 text-white focus:border-purple-500">
                <Filter size={16} className="mr-2 text-slate-400" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-800">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-slate-700 hover:bg-purple-600"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-slate-700 hover:bg-purple-600"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Info */}
      <section className="px-4 mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-slate-400">
              Showing {filteredModels.length} of {mockModels.length} models
            </p>
            {selectedCategory !== 'All' && (
              <Badge 
                variant="outline" 
                className="bg-purple-900/30 border-purple-500/50 text-purple-300"
              >
                {selectedCategory}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <main className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredModels.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 text-lg mb-4">No models found matching your criteria</div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredModels.map((model) => (
                <ModelViewer
                  key={model.id}
                  model={model}
                  isExpanded={expandedModel === model.id}
                  onToggleExpand={() => handleToggleExpand(model.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            3D Portfolio • Built with React Three Fiber • Interactive 3D Models
          </p>
        </div>
      </footer>
    </div>
  );
}